import asyncio
import logging
from typing import Callable, List, Optional

import fitz

from app.core.task_manager import task_manager

logger = logging.getLogger(__name__)

OCR_TIMEOUT_SECONDS = 120


async def extract_pdf_pages(
    file_path: str,
    document_id: Optional[str] = None,
    task_id: Optional[str] = None,
    on_progress: Optional[Callable[[int, int, str], None]] = None,
) -> List[dict]:
    """Extract page content using PyMuPDF, falling back to PaddleOCR when quality is low.

    Extraction and OCR are offloaded to worker threads page-by-page so that
    cancellation can be checked between pages.

    Args:
        on_progress: Optional callback(current_page, total_pages, stage_label)
                     called after each page is processed.
    """
    pages = []
    doc = None
    try:
        await task_manager.raise_if_cancelled(task_id)
        doc = await asyncio.to_thread(fitz.open, file_path)
        total_pages = len(doc)

        from app.services.pdf.quality_checker import QualityChecker
        from app.services.pdf.ocr import get_ocr_service

        quality_checker = QualityChecker()
        ocr_service = get_ocr_service(use_gpu=True)

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

            # Always try PyMuPDF text extraction first (first preference)
            page_record_raw = {
                "text": text,
                "page_width": page_width,
                "page_height": page_height,
            }
            quality_report = quality_checker.check(page_record_raw)
            quality_score = quality_report["quality_score"]
            extraction_method = "pymupdf"

            # Check if we need OCR fallback, and only perform OCR if images are detected
            if quality_report["needs_ocr"]:
                if image_count > 0:
                    logger.info(
                        "Page %s needs OCR fallback (character count: %s, word count: %s, garble ratio: %s, quality score: %s) "
                        "and contains %s images. Running PaddleOCR fallback.",
                        page_no,
                        quality_report["char_count"],
                        quality_report["word_count"],
                        quality_report["garble_ratio"],
                        quality_score,
                        image_count,
                    )

                    try:
                        ocr_result = await asyncio.wait_for(
                            asyncio.to_thread(
                                ocr_service.ocr_page, page, page_no, document_id
                            ),
                            timeout=OCR_TIMEOUT_SECONDS,
                        )
                    except asyncio.TimeoutError:
                        logger.warning(
                            "OCR timed out after %ss for page %s. Keeping PyMuPDF text.",
                            OCR_TIMEOUT_SECONDS,
                            page_no,
                        )
                        ocr_result = {
                            "text": None,
                            "confidence": None,
                            "extraction_method": "paddleocr_failed",
                        }

                    if (
                        ocr_result.get("text") is not None
                        and ocr_result.get("extraction_method") not in ("paddleocr_unavailable", "paddleocr_failed")
                    ):
                        text = ocr_result["text"].strip()
                        extraction_method = "paddleocr"

                        ocr_page_record = {
                            "text": text,
                            "page_width": page_width,
                            "page_height": page_height,
                        }
                        new_quality_report = quality_checker.check(ocr_page_record)
                        quality_score = new_quality_report["quality_score"]
                        logger.info("OCR completed for page %s after poor quality check. New quality score: %s", page_no, quality_score)
                    else:
                        logger.warning(
                            "OCR fallback failed or was unavailable for page %s (method: %s). Keeping PyMuPDF text.",
                            page_no,
                            ocr_result.get("extraction_method"),
                        )
                else:
                    logger.info(
                        "Page %s has poor quality (character count: %s, word count: %s, garble ratio: %s, quality score: %s), "
                        "but no images were detected. Skipping OCR fallback and keeping PyMuPDF text.",
                        page_no,
                        quality_report["char_count"],
                        quality_report["word_count"],
                        quality_report["garble_ratio"],
                        quality_score,
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

            if on_progress:
                on_progress(page_no, total_pages, "extracting")

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
