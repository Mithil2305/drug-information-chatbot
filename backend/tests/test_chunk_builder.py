from app.services.chunking.chunk_builder import build_chunks, split_text


def test_split_text_small():
    text = "Short sentence."
    assert split_text(text, chunk_size=100, chunk_overlap=20) == [text]


def test_split_text_overlap():
    text = "a" * 150
    chunks = split_text(text, chunk_size=100, chunk_overlap=20)
    assert len(chunks) == 2
    assert len(chunks[0]) == 100
    assert len(chunks[1]) == 70


def test_build_chunks_preserves_metadata():
    pages = [
        {
            "document_id": "doc-001",
            "page_no": 1,
            "section_title": "DOSAGE AND ADMINISTRATION",
            "text": "Take 10 mg once daily.",
            "extraction_method": "pymupdf",
            "quality_score": 1.0,
        }
    ]
    chunks = build_chunks(pages, chunk_size=1000, chunk_overlap=200, document_id="doc-001")
    assert len(chunks) == 1
    assert chunks[0]["document_id"] == "doc-001"
    assert chunks[0]["page_no"] == 1
    assert chunks[0]["section_title"] == "DOSAGE AND ADMINISTRATION"
    assert chunks[0]["chunk_index"] == 0
    assert chunks[0]["extraction_method"] == "pymupdf"
    assert chunks[0]["text"] == "Take 10 mg once daily."
    assert chunks[0]["chunk_id"].startswith("doc-001_p1_c0_")
