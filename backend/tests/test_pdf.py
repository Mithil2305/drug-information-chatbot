from unittest.mock import MagicMock, patch
from app.services.pdf.extractor import extract_pdf_pages

def test_extract_pdf_pages():
    # Mock fitz page objects
    mock_page_1 = MagicMock()
    mock_page_1.get_text.return_value = "  This is page 1 content  "
    
    mock_page_2 = MagicMock()
    mock_page_2.get_text.return_value = "This is page 2 content"
    
    mock_doc = MagicMock()
    mock_doc.__iter__.return_value = iter([mock_page_1, mock_page_2])
    
    with patch("fitz.open") as mock_open:
        mock_open.return_value = mock_doc
        
        pages = extract_pdf_pages("fake_path.pdf")
        
        mock_open.assert_called_once_with("fake_path.pdf")
        mock_doc.close.assert_called_once()
        
        assert len(pages) == 2
        assert pages[0] == {
            "page_no": 1,
            "text": "This is page 1 content",
            "extraction_method": "pymupdf",
            "quality_score": 1.0
        }
        assert pages[1] == {
            "page_no": 2,
            "text": "This is page 2 content",
            "extraction_method": "pymupdf",
            "quality_score": 1.0
        }
