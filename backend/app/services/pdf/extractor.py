import asyncio
import logging
from typing import List, Optional

import fitz

from app.core.task_manager import task_manager

logger = logging.getLogger(__name__)


async def extract_pdf_pages(
    file_path: str,
    document_id: Optional[str] = None,
    task_id: Optional[str] = None,
) -> List[dict]:
    """Extract page content using PyMuPDF, falling back to PaddleOCR when quality is low.

    Extraction and OCR are offloaded to worker threads page-by-page so that
    cancellation can be checked between pages.
    """
    pages = []
    doc = None
    try:
        await task_manager.raise_if_cancelled(task_id)
        doc = await asyncio.to_thread(fitz.open, file_path)

        from app.services.pdf.quality_checker import QualityChecker
        from app.services.pdf.ocr import OCRService

        quality_checker = QualityChecker()
        ocr_service = OCRService(use_gpu=True)

        for page_no, page in enumerate(doc, start=1):
            await task_manager.raise_if_cancelled(task_id)

            text, images, rect = await asyncio.gather(
                asyncio.to_thread(page.get_text, "text"),
                asyncio.to_thread(page.get_images, full=True),
                asyncio.to_thread(lambda p: p.rect, page),
            )

            text = (text or "").strip()
            image_count = len(images or [])
            page_width = rect.width
            page_height = rect.height

            # Run quality check on PyMuPDF extracted text
            page_record_raw = {
                "text": text,
                "page_width": page_width,
                "page_height": page_height,
            }
            quality_report = quality_checker.check(page_record_raw)
            quality_score = quality_report["quality_score"]
            extraction_method = "pymupdf"

            # Check if fallback OCR is needed
            if quality_report["needs_ocr"]:
                logger.info(
                    "Page %s needs OCR fallback (character count: %s, word count: %s, garble ratio: %s, quality score: %s)",
                    page_no,
                    quality_report["char_count"],
                    quality_report["word_count"],
                    quality_report["garble_ratio"],
                    quality_score,
                )

                # Run OCR fallback in a background thread
                ocr_result = await asyncio.to_thread(
                    ocr_service.ocr_page, page, page_no, document_id
                )

                # If OCR successfully extracted text, update it
                if (
                    ocr_result.get("text") is not None
                    and ocr_result.get("extraction_method") not in ("paddleocr_unavailable", "paddleocr_failed")
                ):
                    text = ocr_result["text"].strip()
                    extraction_method = "paddleocr"

                    # Recompute quality score after OCR
                    ocr_page_record = {
                        "text": text,
                        "page_width": page_width,
                        "page_height": page_height,
                    }
                    new_quality_report = quality_checker.check(ocr_page_record)
                    quality_score = new_quality_report["quality_score"]
                    logger.info("OCR completed for page %s. New quality score: %s", page_no, quality_score)
                else:
                    logger.warning(
                        "OCR fallback failed or was unavailable for page %s (method: %s). Keeping PyMuPDF text.",
                        page_no,
                        ocr_result.get("extraction_method"),
                    )

            pages.append({
                "document_id": document_id,
                "page_no": page_no,
                "text": text,
                "extraction_method": extraction_method,
                "quality_score": quality_score,
                "image_count": image_count,
                "page_width": page_width,
                "page_height": page_height,
            })
    except Exception as exc:
        logger.error("PDF extraction failed for %s: %s", file_path, exc)
        raise
    finally:
        if doc is not None:
            try:
                await asyncio.to_thread(doc.close)
            except Exception:
                pass

    return pages