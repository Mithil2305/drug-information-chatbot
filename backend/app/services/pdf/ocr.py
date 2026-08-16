import logging
from pathlib import Path
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

DEFAULT_DPI = 300


class OCRService:
    """OCR fallback service.  Real PaddleOCR loading is deferred; a stub is
    returned when PaddleOCR is not installed or not configured.
    """

    def __init__(self, use_gpu: bool = False, dpi: int = DEFAULT_DPI):
        self.use_gpu = use_gpu
        self.dpi = dpi
        self._ocr = None
        try:
            from paddleocr import PaddleOCR

            self._ocr = PaddleOCR(
                use_angle_cls=True,
                lang="en",
                use_gpu=use_gpu,
                show_log=False,
            )
            logger.info("PaddleOCR loaded successfully")
        except Exception as exc:
            logger.warning(
                "PaddleOCR not available; OCR fallback will return stub results. %s",
                exc,
            )

    def _render_page(self, page, dpi: Optional[int] = None) -> Any:
        """Render a fitz page to a PIL Image at the requested DPI."""
        if dpi is None:
            dpi = self.dpi
        # fitz matrix: 72 dpi is the PDF base unit.
        mat = page.get_pixmap(dpi=dpi)
        from PIL import Image

        return Image.frombytes("RGB", [mat.width, mat.height], mat.samples)

    def ocr_page(
        self,
        page: Any,
        page_no: int,
        document_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Run OCR on a single fitz page and return text + confidence."""
        if self._ocr is None:
            logger.warning(
                "OCR stub used for document_id=%s page=%s", document_id, page_no
            )
            return {
                "text": None,
                "confidence": None,
                "extraction_method": "paddleocr_unavailable",
            }

        # Real PaddleOCR path — left for later; for now we still stub.
        image = self._render_page(page)
        result = self._ocr.ocr(image, cls=True)
        return self._parse_ocr_result(result)

    def ocr_image(self, image_path: Path) -> Dict[str, Any]:
        """OCR an image file directly."""
        if self._ocr is None:
            return {
                "text": None,
                "confidence": None,
                "extraction_method": "paddleocr_unavailable",
            }
        result = self._ocr.ocr(str(image_path), cls=True)
        return self._parse_ocr_result(result)

    @staticmethod
    def _parse_ocr_result(result) -> Dict[str, Any]:
        """Convert PaddleOCR result into a clean dict."""
        if not result or not result[0]:
            return {
                "text": "",
                "confidence": 0.0,
                "extraction_method": "paddleocr",
            }

        lines = []
        confidences = []
        for line in result[0]:
            if not line:
                continue
            bbox, (text, conf) = line
            lines.append(text)
            confidences.append(conf)

        # Sort by top (y) then left (x) to maintain reading order.
        # This is already roughly returned by PaddleOCR, but the bbox is
        # included for any custom re-ordering.
        text = "\n".join(lines)
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.0

        return {
            "text": text,
            "confidence": round(avg_conf, 4),
            "extraction_method": "paddleocr",
        }
