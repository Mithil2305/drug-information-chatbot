import logging
import os
from pathlib import Path
from typing import Any, Dict, Optional

# Disable MKLDNN CPU execution flags to prevent PIR oneDNN incompatibilities
os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT"] = "0"

logger = logging.getLogger(__name__)

DEFAULT_DPI = 300


class OCRService:
    """OCR fallback service. Real PaddleOCR loading is deferred; a stub is
    returned when PaddleOCR is not installed or not configured.
    """

    def __init__(self, use_gpu: bool = False, dpi: int = DEFAULT_DPI):
        self.use_gpu = use_gpu
        self.dpi = dpi
        self._ocr = None
        try:
            import paddle
            from paddleocr import PaddleOCR

            # Determine available device based on CUDA compilation availability
            has_gpu = paddle.device.is_compiled_with_cuda()
            device_str = "gpu" if (use_gpu and has_gpu) else "cpu"

            try:
                # Try PaddleOCR 3.x style initialization with the 'device' argument
                self._ocr = PaddleOCR(
                    lang="en",
                    device=device_str,
                )
                logger.info("PaddleOCR 3.x initialized successfully with device=%s", device_str)
            except Exception as inner_exc:
                logger.debug("PaddleOCR 3.x initialization failed: %s. Trying legacy style.", inner_exc)
                # Fallback to legacy argument style
                self._ocr = PaddleOCR(
                    use_angle_cls=True,
                    lang="en",
                    use_gpu=use_gpu and has_gpu,
                    show_log=False,
                )
                logger.info("PaddleOCR legacy initialized successfully")
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

        try:
            import numpy as np

            image = self._render_page(page)
            image_np = np.array(image)

            # Call prediction depending on the API available
            if hasattr(self._ocr, "predict"):
                result = self._ocr.predict(image_np)
            else:
                result = self._ocr.ocr(image_np, cls=True)

            return self._parse_ocr_result(list(result) if result is not None else [])
        except Exception as exc:
            logger.warning("OCR failed on page %s: %s", page_no, exc)
            return {
                "text": None,
                "confidence": None,
                "extraction_method": "paddleocr_failed",
            }

    def ocr_image(self, image_path: Path) -> Dict[str, Any]:
        """OCR an image file directly."""
        if self._ocr is None:
            return {
                "text": None,
                "confidence": None,
                "extraction_method": "paddleocr_unavailable",
            }

        try:
            if hasattr(self._ocr, "predict"):
                result = self._ocr.predict(str(image_path))
            else:
                result = self._ocr.ocr(str(image_path), cls=True)

            return self._parse_ocr_result(list(result) if result is not None else [])
        except Exception as exc:
            logger.warning("OCR failed on image %s: %s", image_path, exc)
            return {
                "text": None,
                "confidence": None,
                "extraction_method": "paddleocr_failed",
            }

    @staticmethod
    def _parse_ocr_result(result) -> Dict[str, Any]:
        """Convert PaddleOCR result into a clean dict."""
        if not result:
            return {
                "text": "",
                "confidence": 0.0,
                "extraction_method": "paddleocr",
            }

        # PaddleOCR 3.x (paddlex-based) returns a list of dictionaries
        if isinstance(result, list) and len(result) > 0 and isinstance(result[0], dict):
            lines = result[0].get("rec_texts", [])
            confidences = result[0].get("rec_scores", [])
            text = "\n".join(lines)
            avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
            return {
                "text": text,
                "confidence": round(avg_conf, 4),
                "extraction_method": "paddleocr",
            }

        # Legacy PaddleOCR format [[[bbox, (text, confidence)], ...]]
        try:
            if not result[0]:
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
                if isinstance(line, (list, tuple)) and len(line) == 2:
                    bbox, text_tuple = line
                    if isinstance(text_tuple, (list, tuple)) and len(text_tuple) == 2:
                        text, conf = text_tuple
                        lines.append(text)
                        confidences.append(conf)
            text = "\n".join(lines)
            avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
            return {
                "text": text,
                "confidence": round(avg_conf, 4),
                "extraction_method": "paddleocr",
            }
        except Exception as exc:
            logger.error("Failed to parse legacy OCR result structure: %s", exc)
            return {
                "text": "",
                "confidence": 0.0,
                "extraction_method": "paddleocr",
            }

