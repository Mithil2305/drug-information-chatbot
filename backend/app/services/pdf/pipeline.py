import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.services.chunking.chunk_builder import build_chunks
from app.services.pdf.cleaner import clean_text
from app.services.pdf.extractor import extract_pdf_pages
from app.services.pdf.ocr import OCRService
from app.services.pdf.quality_checker import QualityChecker, QualityConfig
from app.services.pdf.section_detector import SectionDetector

logger = logging.getLogger(__name__)


def process_pdf(
    file_path: str,
    document_id: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    quality_config: Optional[QualityConfig] = None,
) -> Dict[str, Any]:
    """Run the complete Part 1 ingestion pipeline on a PDF.

    Returns a dict with:
      - success: bool
      - document_id: str
      - pages: list of cleaned page records
      - chunks: list of retrieval-ready chunks
      - errors: list of {page_no, error_code, error} objects
    """
    if not Path(file_path).is_file():
        raise FileNotFoundError(f"PDF not found: {file_path}")

    quality = QualityChecker(quality_config)
    ocr = OCRService()
    section = SectionDetector()

    try:
        raw_pages = extract_pdf_pages(file_path, document_id)
    except Exception as exc:
        logger.error("Failed to extract PDF %s: %s", file_path, exc)
        return {
            "success": False,
            "error_code": "PDF_EXTRACTION_FAILED",
            "error": str(exc),
            "document_id": document_id,
            "pages": [],
            "chunks": [],
            "errors": [],
        }

    errors: List[Dict[str, Any]] = []
    processed_pages: List[Dict[str, Any]] = []
    current_section: Optional[str] = None

    for page in raw_pages:
        try:
            quality_report = quality.check(page)
            page.update(quality_report)

            text = page["text"]
            method = page["extraction_method"]
            ocr_confidence: Optional[float] = None

            if quality_report["needs_ocr"]:
                ocr_result = ocr.ocr_page(
                    page=None,
                    page_no=page["page_no"],
                    document_id=document_id,
                )
                if ocr_result.get("text") is not None:
                    text = ocr_result["text"]
                    method = ocr_result["extraction_method"]
                    ocr_confidence = ocr_result.get("confidence")
                else:
                    # OCR unavailable: do not silently succeed.
                    errors.append({
                        "page_no": page["page_no"],
                        "error_code": "OCR_FAILED",
                        "error": "OCR fallback not available",
                    })

            cleaned = clean_text(text)
            current_section = section.detect(cleaned, current_section)
            if current_section is None:
                current_section = "Unknown"

            processed_pages.append({
                "document_id": document_id,
                "page_no": page["page_no"],
                "text": cleaned,
                "extraction_method": method,
                "image_count": page["image_count"],
                "page_width": page["page_width"],
                "page_height": page["page_height"],
                "section_title": current_section,
                "quality_score": quality_report["quality_score"],
                "ocr_confidence": ocr_confidence,
            })
        except Exception as exc:
            logger.error(
                "Error processing page %s of %s: %s",
                page.get("page_no"),
                file_path,
                exc,
            )
            errors.append({
                "page_no": page.get("page_no"),
                "error_code": "PAGE_PROCESSING_FAILED",
                "error": str(exc),
            })

    chunks = build_chunks(processed_pages, chunk_size, chunk_overlap, document_id)

    return {
        "success": len(errors) == 0 and len(processed_pages) > 0,
        "document_id": document_id,
        "pages": processed_pages,
        "chunks": chunks,
        "errors": errors,
    }
