import logging
import re
from dataclasses import dataclass
from typing import Any, Dict

logger = logging.getLogger(__name__)

# Characters we treat as garbled / replacement / control noise.
GARBLE_PATTERN = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f\uFFFD]")


@dataclass
class QualityConfig:
    """Tunable thresholds for extraction quality."""
    min_chars: int = 30
    min_words: int = 5
    max_garble_ratio: float = 0.05


class QualityChecker:
    """Evaluate a PageRecord and decide whether OCR fallback is required."""

    def __init__(self, config: QualityConfig | None = None):
        self.config = config or QualityConfig()

    def check(self, page_record: Dict[str, Any]) -> Dict[str, Any]:
        """Return a quality report for a single PageRecord."""
        text = page_record.get("text", "")
        char_count = len(text)
        word_count = len(text.split())

        width = page_record.get("page_width", 0.0) or 0.0
        height = page_record.get("page_height", 0.0) or 0.0
        area = width * height
        density = char_count / area if area > 0 else 0.0

        garbled_count = len(GARBLE_PATTERN.findall(text))
        garble_ratio = garbled_count / max(char_count, 1)

        needs_ocr = (
            char_count < self.config.min_chars
            or word_count < self.config.min_words
            or garble_ratio > self.config.max_garble_ratio
        )

        quality_score = min(
            1.0,
            (char_count / max(self.config.min_chars, 1)) * (1 - garble_ratio),
        )

        return {
            "needs_ocr": needs_ocr,
            "char_count": char_count,
            "word_count": word_count,
            "density": density,
            "garble_ratio": garble_ratio,
            "quality_score": quality_score,
        }
