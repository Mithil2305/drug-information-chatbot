import pytest
from unittest.mock import MagicMock, patch
from app.services.pdf.extractor import extract_pdf_pages


def _make_mock_page(text):
    page = MagicMock()
    page.get_text.return_value = text
    page.get_images.return_value = []
    page.rect = MagicMock(width=612.0, height=792.0)
    return page


@pytest.mark.asyncio
async def test_extract_pdf_pages_without_document_id():
    mock_page_1 = _make_mock_page("This is page 1 content that is long enough to pass quality checker without OCR.")
    mock_page_2 = _make_mock_page("This is page 2 content that is also long enough to pass quality checker.")

    mock_doc = MagicMock()
    mock_doc.__iter__.return_value = iter([mock_page_1, mock_page_2])

    with patch("fitz.open") as mock_open:
        mock_open.return_value = mock_doc

        pages = await extract_pdf_pages("fake_path.pdf")

        mock_open.assert_called_once_with("fake_path.pdf")
        mock_doc.close.assert_called_once()

        assert len(pages) == 2
        assert pages[0] == {
            "document_id": None,
            "page_no": 1,
            "text": "This is page 1 content that is long enough to pass quality checker without OCR.",
            "extraction_method": "pymupdf",
            "quality_score": 1.0,
            "image_count": 0,
            "page_width": 612.0,
            "page_height": 792.0,
        }
        assert pages[1] == {
            "document_id": None,
            "page_no": 2,
            "text": "This is page 2 content that is also long enough to pass quality checker.",
            "extraction_method": "pymupdf",
            "quality_score": 1.0,
            "image_count": 0,
            "page_width": 612.0,
            "page_height": 792.0,
        }


@pytest.mark.asyncio
async def test_extract_pdf_pages_with_document_id():
    mock_page = _make_mock_page("This is page one text that is long enough to pass the check.")

    mock_doc = MagicMock()
    mock_doc.__iter__.return_value = iter([mock_page])

    with patch("fitz.open") as mock_open:
        mock_open.return_value = mock_doc

        pages = await extract_pdf_pages("fake_path.pdf", document_id="doc-001")

        assert len(pages) == 1
        assert pages[0]["document_id"] == "doc-001"
        assert pages[0]["page_no"] == 1
        assert pages[0]["text"] == "This is page one text that is long enough to pass the check."
        assert pages[0]["extraction_method"] == "pymupdf"
        assert pages[0]["quality_score"] == 1.0


@pytest.mark.asyncio
async def test_extract_pdf_pages_with_ocr_fallback():
    mock_page = _make_mock_page("")

    mock_doc = MagicMock()
    mock_doc.__iter__.return_value = iter([mock_page])

    with patch("fitz.open") as mock_open, \
         patch("app.services.pdf.ocr.OCRService.ocr_page") as mock_ocr_page:

        mock_open.return_value = mock_doc
        mock_ocr_page.return_value = {
            "text": "Extracted OCR text that is long enough to pass.",
            "confidence": 0.95,
            "extraction_method": "paddleocr",
        }

        pages = await extract_pdf_pages("fake_path.pdf", document_id="doc-001")

        assert len(pages) == 1
        assert pages[0]["document_id"] == "doc-001"
        assert pages[0]["page_no"] == 1
        assert pages[0]["text"] == "Extracted OCR text that is long enough to pass."
        assert pages[0]["extraction_method"] == "paddleocr"
        assert pages[0]["quality_score"] == 1.0
        mock_ocr_page.assert_called_once_with(mock_page, 1, "doc-001")

