import fitz
import os
import tempfile

from app.services.pdf.pipeline import process_pdf


import pytest


def _create_test_pdf() -> str:
    doc = fitz.open()
    p1 = doc.new_page()
    p1.insert_text((72, 72), "DOSAGE AND ADMINISTRATION", fontsize=12)
    p1.insert_text((72, 100), "The recommended dose is 10 mg once daily.", fontsize=12)
    p2 = doc.new_page()
    p2.insert_text((72, 72), "CONTRAINDICATIONS", fontsize=12)
    p2.insert_text((72, 100), "Do not use in patients with hypersensitivity.", fontsize=12)
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    doc.save(path)
    doc.close()
    return path


@pytest.mark.asyncio
async def test_pipeline_end_to_end():
    path = _create_test_pdf()
    try:
        result = await process_pdf(path, "doc-001")
        assert result["success"] is True
        assert result["document_id"] == "doc-001"
        assert len(result["pages"]) == 2
        assert len(result["chunks"]) == 2

        # Page-level metadata
        for page in result["pages"]:
            assert page["document_id"] == "doc-001"
            assert page["page_no"] in (1, 2)
            assert page["extraction_method"] == "pymupdf"

        # Chunk-level metadata
        for chunk in result["chunks"]:
            assert chunk["document_id"] == "doc-001"
            assert chunk["page_no"] in (1, 2)
            assert chunk["section_title"] is not None
            assert chunk["chunk_id"]
            assert chunk["chunk_index"] is not None
            assert chunk["extraction_method"]
            assert "10 mg" in chunk["text"] or "hypersensitivity" in chunk["text"]
    finally:
        os.unlink(path)
