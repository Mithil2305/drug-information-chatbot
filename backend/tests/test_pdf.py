from unittest.mock import MagicMock, patch
from app.services.pdf.extractor import extract_pdf_pages


def _make_mock_page(text):
    page = MagicMock()
    page.get_text.return_value = text
    page.get_images.return_value = []
    page.rect = MagicMock(width=612.0, height=792.0)
    return page


def test_extract_pdf_pages_without_document_id():
    mock_page_1 = _make_mock_page("  This is page 1 content  ")
    mock_page_2 = _make_mock_page("This is page 2 content")

    mock_doc = MagicMock()
    mock_doc.__iter__.return_value = iter([mock_page_1, mock_page_2])

    with patch("fitz.open") as mock_open:
        mock_open.return_value = mock_doc

        pages = extract_pdf_pages("fake_path.pdf")

        mock_open.assert_called_once_with("fake_path.pdf")
        mock_doc.close.assert_called_once()

        assert len(pages) == 2
        assert pages[0] == {
            "document_id": None,
            "page_no": 1,
            "text": "This is page 1 content",
            "extraction_method": "pymupdf",
            "image_count": 0,
            "page_width": 612.0,
            "page_height": 792.0,
        }
        assert pages[1] == {
            "document_id": None,
            "page_no": 2,
            "text": "This is page 2 content",
            "extraction_method": "pymupdf",
            "image_count": 0,
            "page_width": 612.0,
            "page_height": 792.0,
        }


def test_extract_pdf_pages_with_document_id():
    mock_page = _make_mock_page("Page one")

    mock_doc = MagicMock()
    mock_doc.__iter__.return_value = iter([mock_page])

    with patch("fitz.open") as mock_open:
        mock_open.return_value = mock_doc

        pages = extract_pdf_pages("fake_path.pdf", document_id="doc-001")

        assert len(pages) == 1
        assert pages[0]["document_id"] == "doc-001"
        assert pages[0]["page_no"] == 1
        assert pages[0]["text"] == "Page one"
        assert pages[0]["extraction_method"] == "pymupdf"
