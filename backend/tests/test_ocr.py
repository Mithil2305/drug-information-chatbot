from app.services.pdf.ocr import OCRService


def test_ocr_stub_returns_unavailable():
    ocr = OCRService()
    result = ocr.ocr_page(None, page_no=1, document_id="doc-001")
    assert result["text"] is None
    assert result["confidence"] is None
    assert result["extraction_method"] == "paddleocr_unavailable"
