import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class GroundingValidator:
    """
    Determines whether a generated answer is sufficiently grounded in the
    retrieved evidence and the citations it contains.
    """

    def __init__(self, min_citations: int = 1):
        self.min_citations = min_citations

    def validate(
        self,
        answer: str,
        citations: List[Dict[str, Any]],
        evidence_count: int,
    ) -> Dict[str, Any]:
        if not evidence_count:
            return {"grounded": False, "reason": "no_retrieved_evidence"}

        # Explicit abstention is a valid, grounded response (it follows the rule).
        if self._is_abstention(answer):
            return {"grounded": True, "reason": "explicit_abstention"}

        if len(citations) < self.min_citations:
            return {"grounded": False, "reason": "insufficient_citations"}

        return {"grounded": True, "reason": "citations_present"}

    @staticmethod
    def _is_abstention(answer: str) -> bool:
        if not answer:
            return False
        return "I don't know based on the provided documents" in answer
