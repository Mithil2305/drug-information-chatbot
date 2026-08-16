import logging
from typing import Any, Dict, List, Tuple

logger = logging.getLogger(__name__)


class EvidenceContextBuilder:
    """Converts Part 2 retrieval results into a citation-tagged evidence context."""

    def build(self, results: List[Dict[str, Any]]) -> Tuple[str, Dict[str, Dict[str, Any]]]:
        """
        Return:
          - context_str: a string with each source labeled [S1], [S2], etc.
          - citation_map: maps "S1" back to the full retrieval result.
        """
        if not results:
            return "", {}

        # Highest relevance first, then de-duplicate by chunk_id.
        sorted_results = sorted(results, key=lambda x: x.get("score", 0.0), reverse=True)

        seen_ids = set()
        unique_results = []
        for r in sorted_results:
            cid = r.get("chunk_id")
            if not cid or cid in seen_ids:
                continue
            seen_ids.add(cid)
            unique_results.append(r)

        context_parts = []
        citation_map: Dict[str, Dict[str, Any]] = {}

        for i, r in enumerate(unique_results, start=1):
            citation_id = f"S{i}"
            citation_map[citation_id] = r

            doc_name = r.get("document_name") or r.get("document_id") or "Unknown Document"
            page = r.get("page_no") or "?"
            section = r.get("section_title") or r.get("section") or "Unknown"
            text = r.get("text") or r.get("chunk_text") or ""

            header = f"[{citation_id}] {doc_name} — Page {page} — {section}"
            context_parts.append(f"{header}\n{text}")

        return "\n\n".join(context_parts), citation_map
