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
            pymupdf_text = text  # preserve original for merging

            # Run OCR whenever the page contains images — image text is invisible
            # to PyMuPDF's get_text(). Also run when quality is poor.
            should_ocr = image_count > 0 or quality_report["needs_ocr"]

            if should_ocr:
                reason = "poor quality" if quality_report["needs_ocr"] else "images detected"
                logger.info(
                    "Page %s: running OCR (%s, images=%s, chars=%s, words=%s, "
                    "garble=%.3f, quality=%.2f).",
                    page_no, reason, image_count,
                    quality_report["char_count"],
                    quality_report["word_count"],
                    quality_report["garble_ratio"],
                    quality_score,
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
                        "extraction_method": "ocr_failed",
                    }

                ocr_text = (ocr_result.get("text") or "").strip()
                ocr_method = ocr_result.get("extraction_method", "")
                ocr_ok = ocr_text and ocr_method not in (
                    "paddleocr_unavailable", "paddleocr_failed",
                    "easyocr_failed", "ocr_unavailable", "ocr_failed",
                )

                if ocr_ok:
                    if quality_report["needs_ocr"]:
                        # Quality was bad — OCR replaces PyMuPDF text entirely
                        text = ocr_text
                        extraction_method = ocr_method
                        logger.info(
                            "OCR replaced PyMuPDF text for page %s (method=%s).",
                            page_no, ocr_method,
                        )
                    else:
                        # Quality was acceptable but page has images — merge
                        # Append OCR lines that aren't already in PyMuPDF text
                        pymupdf_lines = set(
                            ln.strip().lower() for ln in pymupdf_text.splitlines() if ln.strip()
                        )
                        new_lines = [
                            ln for ln in ocr_text.splitlines()
                            if ln.strip() and ln.strip().lower() not in pymupdf_lines
                        ]
                        if new_lines:
                            text = pymupdf_text + "\n\n[OCR extracted content]\n" + "\n".join(new_lines)
                            extraction_method = f"pymupdf+{ocr_method}"
                            logger.info(
                                "Merged %d new OCR lines into page %s (method=%s).",
                                len(new_lines), page_no, extraction_method,
                            )
                        else:
                            logger.info(
                                "OCR produced no new content for page %s. Keeping PyMuPDF text.",
                                page_no,
                            )

                    # Recalculate quality with final text
                    final_record = {
                        "text": text,
                        "page_width": page_width,
                        "page_height": page_height,
                    }
                    quality_score = quality_checker.check(final_record)["quality_score"]
                else:
                    logger.warning(
                        "OCR fallback failed/unavailable for page %s (method: %s). Keeping PyMuPDF text.",
                        page_no, ocr_method,
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
