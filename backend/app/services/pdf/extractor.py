import logging
from typing import List, Optional

import fitz

logger = logging.getLogger(__name__)


def extract_pdf_pages(
    file_path: str,
    document_id: Optional[str] = None,
) -> List[dict]:
    """Extract one PageRecord-style dict per page using PyMuPDF."""
    pages = []
    doc = None
    try:
        doc = fitz.open(file_path)
        for page_no, page in enumerate(doc, start=1):
            text = page.get_text("text").strip()
            image_count = len(page.get_images(full=True))
            page_width = page.rect.width
            page_height = page.rect.height

            pages.append({
                "document_id": document_id,
                "page_no": page_no,
                "text": text,
                "extraction_method": "pymupdf",
                "image_count": image_count,
                "page_width": page_width,
                "page_height": page_height,
            })
    except Exception as exc:
        logger.error("PDF extraction failed for %s: %s", file_path, exc)
        raise
    finally:
        if doc is not None:
            doc.close()

    return pages