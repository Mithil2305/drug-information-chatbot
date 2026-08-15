import logging
import re
from typing import List, Optional

logger = logging.getLogger(__name__)

DEFAULT_HEADINGS = [
    "INDICATIONS AND USAGE",
    "DOSAGE AND ADMINISTRATION",
    "CONTRAINDICATIONS",
    "WARNINGS AND PRECAUTIONS",
    "ADVERSE REACTIONS",
    "DRUG INTERACTIONS",
    "USE IN SPECIFIC POPULATIONS",
    "OVERDOSAGE",
    "DESCRIPTION",
    "CLINICAL PHARMACOLOGY",
    "PREGNANCY",
    "PEDIATRIC USE",
    "GERIATRIC USE",
    "HOW SUPPLIED",
    "STORAGE AND HANDLING",
    "PATIENT COUNSELING INFORMATION",
]


class SectionDetector:
    """Detect FDA-style drug-label section headings in page text."""

    def __init__(self, headings: Optional[List[str]] = None):
        self.headings = headings or DEFAULT_HEADINGS
        self._patterns = {
            h: re.compile(r"\b" + re.escape(h) + r"\b", re.IGNORECASE)
            for h in self.headings
        }

    def detect(self, text: str, current_section: Optional[str] = None) -> Optional[str]:
        """Return the first heading found in the text, or current_section."""
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            for heading, pattern in self._patterns.items():
                if pattern.search(line):
                    return heading
        return current_section

    def detect_all(self, text: str) -> List[str]:
        """Return all unique headings found in the text in order of appearance."""
        found = []
        seen = set()
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            for heading, pattern in self._patterns.items():
                if pattern.search(line) and heading not in seen:
                    found.append(heading)
                    seen.add(heading)
        return found
