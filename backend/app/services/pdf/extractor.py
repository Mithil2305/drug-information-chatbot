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
    """Extract one PageRecord-style dict per page using PyMuPDF.

    Extraction is offloaded to worker threads page-by-page so that
    cancellation can be checked between pages.
    """
    pages = []
    doc = None
    try:
        await task_manager.raise_if_cancelled(task_id)
        doc = await asyncio.to_thread(fitz.open, file_path)

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
            try:
                await asyncio.to_thread(doc.close)
            except Exception:
                pass

    return pages