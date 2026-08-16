import hashlib
import logging
import uuid
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200


def split_text(
    text: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> List[str]:
    """Split a string into fixed-size overlapping chunks."""
    text = text.strip()
    if not text:
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start = end - chunk_overlap

    return chunks


def _build_chunk_id(
    document_id: Optional[str],
    page_no: int,
    chunk_index: int,
) -> str:
    """Create a deterministic, traceable chunk id."""
    if document_id:
        base = f"{document_id}_p{page_no}_c{chunk_index}"
    else:
        base = f"p{page_no}_c{chunk_index}"
    # Append a short hash to guarantee uniqueness if the pipeline is re-run.
    short_hash = hashlib.md5(base.encode("utf-8")).hexdigest()[:8]
    return f"{base}_{short_hash}"


def build_chunks(
    pages: List[Dict[str, Any]],
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
    document_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Build retrieval-ready chunks from cleaned page records."""
    chunks = []
    chunk_index = 0

    for page in pages:
        text = page.get("text", "")
        if not text:
            continue

        page_chunks = split_text(text, chunk_size, chunk_overlap)

        for chunk_text in page_chunks:
            chunks.append({
                "chunk_id": _build_chunk_id(
                    document_id or page.get("document_id"), page.get("page_no", 0), chunk_index
                ),
                "document_id": document_id or page.get("document_id"),
                "page_no": page.get("page_no"),
                "section_title": page.get("section_title"),
                "chunk_index": chunk_index,
                "text": chunk_text,
                "extraction_method": page.get("extraction_method", "pymupdf"),
                "ocr_confidence": page.get("ocr_confidence"),
                "quality_score": page.get("quality_score"),
                "document_version": page.get("document_version"),
            })
            chunk_index += 1

    logger.info("Built %d chunks for document %s", len(chunks), document_id or page.get("document_id"))
    return chunks
