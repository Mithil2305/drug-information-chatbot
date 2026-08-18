try:
    import torch
except ImportError:
    pass

import logging
import os
from pathlib import Path
from typing import Any, Dict, Optional

# Disable MKLDNN CPU execution flags to prevent PIR oneDNN incompatibilities
os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT"] = "0"

logger = logging.getLogger(__name__)

DEFAULT_DPI = 300

_ocr_service_instance: Optional["OCRService"] = None


def get_ocr_service(use_gpu: bool = False, dpi: int = DEFAULT_DPI) -> "OCRService":
    """Return a cached OCRService singleton so the OCR model is loaded once."""
    global _ocr_service_instance
    if _ocr_service_instance is None:
        _ocr_service_instance = OCRService(use_gpu=use_gpu, dpi=dpi)
    return _ocr_service_instance


class OCRService:
    """OCR fallback service.

    Initialization priority:
      1. PaddleOCR (if paddlepaddle + paddleocr are importable)
      2. EasyOCR  (if easyocr is importable — uses PyTorch)
      3. Stub     (returns None text so callers keep PyMuPDF output)
    """

    # Which engine is active: "paddleocr" | "easyocr" | None
    _engine: Optional[str] = None

    def __init__(self, use_gpu: bool = False, dpi: int = DEFAULT_DPI):
        self.use_gpu = use_gpu
        self.dpi = dpi
        self._ocr = None       # PaddleOCR instance
        self._easyocr = None   # EasyOCR Reader instance
        self._engine = None

        # --- Attempt 1: PaddleOCR ---
        try:
            import paddle
            from paddleocr import PaddleOCR

            has_gpu = paddle.device.is_compiled_with_cuda()
            device_str = "gpu" if (use_gpu and has_gpu) else "cpu"

            try:
                # PaddleOCR 3.x style initialization
                self._ocr = PaddleOCR(
                    lang="en",
                    device=device_str,
                )
                self._engine = "paddleocr"
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
                self._engine = "paddleocr"
                logger.info("PaddleOCR legacy initialized successfully")
        except Exception as paddle_exc:
            logger.warning(
                "PaddleOCR not available: %s. Trying EasyOCR fallback.",
                paddle_exc,
            )

            # --- Attempt 2: EasyOCR ---
            try:
                import easyocr

                gpu_available = use_gpu and torch.cuda.is_available()
                self._easyocr = easyocr.Reader(
                    ["en"],
                    gpu=gpu_available,
                    verbose=False,
                )
                self._engine = "easyocr"
                logger.info(
                    "EasyOCR initialized successfully (gpu=%s)", gpu_available
                )
            except Exception as easy_exc:
                logger.warning(
                    "EasyOCR also not available: %s. OCR fallback will return stub results.",
                    easy_exc,
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
        if self._engine is None:
            logger.warning(
                "OCR stub used for document_id=%s page=%s", document_id, page_no
            )
            return {
                "text": None,
                "confidence": None,
                "extraction_method": "ocr_unavailable",
            }

        try:
            import numpy as np

            image = self._render_page(page)
            image_np = np.array(image)

            if self._engine == "paddleocr":
                return self._run_paddleocr(image_np)
            else:
                return self._run_easyocr(image_np)
        except Exception as exc:
            logger.warning("OCR failed on page %s: %s", page_no, exc)
            return {
                "text": None,
                "confidence": None,
                "extraction_method": f"{self._engine}_failed",
            }

    def ocr_image(self, image_path: Path) -> Dict[str, Any]:
        """OCR an image file directly."""
        if self._engine is None:
            return {
                "text": None,
                "confidence": None,
                "extraction_method": "ocr_unavailable",
            }

        try:
            if self._engine == "paddleocr":
                return self._run_paddleocr_path(str(image_path))
            else:
                return self._run_easyocr_path(str(image_path))
        except Exception as exc:
            logger.warning("OCR failed on image %s: %s", image_path, exc)
            return {
                "text": None,
                "confidence": None,
                "extraction_method": f"{self._engine}_failed",
            }

    # ------------------------------------------------------------------
    # PaddleOCR runners
    # ------------------------------------------------------------------
    def _run_paddleocr(self, image_np) -> Dict[str, Any]:
        if hasattr(self._ocr, "predict"):
            result = self._ocr.predict(image_np)
        else:
            result = self._ocr.ocr(image_np, cls=True, max_side_limit=5000)
        return self._parse_paddle_result(list(result) if result is not None else [])

    def _run_paddleocr_path(self, path: str) -> Dict[str, Any]:
        if hasattr(self._ocr, "predict"):
            result = self._ocr.predict(path)
        else:
            result = self._ocr.ocr(path, cls=True, max_side_limit=5000)
        return self._parse_paddle_result(list(result) if result is not None else [])

    # ------------------------------------------------------------------
    # EasyOCR runners
    # ------------------------------------------------------------------
    def _run_easyocr(self, image_np) -> Dict[str, Any]:
        results = self._easyocr.readtext(image_np)
        return self._parse_easyocr_result(results)

    def _run_easyocr_path(self, path: str) -> Dict[str, Any]:
        results = self._easyocr.readtext(path)
        return self._parse_easyocr_result(results)

    # ------------------------------------------------------------------
    # Result parsers
    # ------------------------------------------------------------------
    @staticmethod
    def _parse_easyocr_result(results) -> Dict[str, Any]:
        """Convert EasyOCR results [(bbox, text, confidence), ...] into a clean dict."""
        if not results:
            return {
                "text": "",
                "confidence": 0.0,
                "extraction_method": "easyocr",
            }

        lines = []
        confidences = []
        for bbox, text, conf in results:
            lines.append(text)
            confidences.append(conf)

        combined_text = "\n".join(lines)
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
        return {
            "text": combined_text,
            "confidence": round(avg_conf, 4),
            "extraction_method": "easyocr",
        }

    @staticmethod
    def _parse_paddle_result(result) -> Dict[str, Any]:
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
