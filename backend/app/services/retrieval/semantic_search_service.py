import logging
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.repositories.qdrant_repository import qdrant_repository
from app.services.embeddings.embedding_service import embedding_service

logger = logging.getLogger(__name__)


class SemanticSearchService:
    """
    Service that embeds a user query and retrieves the most relevant
    chunk evidence from Qdrant using cosine similarity.
    """

    def __init__(self, embedding_svc=None, qdrant_repo=None):
        self.embedding_service = embedding_svc or embedding_service
        self.qdrant_repository = qdrant_repo or qdrant_repository

    async def search(
        self,
        query: str,
        top_k: int = None,
        document_ids: Optional[List[str]] = None,
        section: Optional[str] = None,
        version: Optional[str] = None,
        score_threshold: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform semantic search and return a list of RetrievalResult-like dicts.
        """
        if not query or not query.strip():
            raise ValueError("Search query cannot be empty.")

        top_k = top_k or settings.TOP_K
        if score_threshold is None:
            score_threshold = settings.MIN_RELEVANCE_SCORE

        # 1. Embed the query with the same model used for chunks.
        query_vector = self.embedding_service.embed_query(query)

        # 2. Search Qdrant with optional metadata filters.
        points = await self.qdrant_repository.search(
            query_vector=query_vector,
            limit=top_k,
            document_ids=document_ids,
            section=section,
            version=version,
            score_threshold=score_threshold,
        )

        # 3. Map points into a stable result shape for Part 3.
        results = []
        for point in points:
            payload = point.payload or {}
            results.append({
                "chunk_id": payload.get("chunk_id", str(point.id)),
                "score": float(point.score),
                "document_id": payload.get("document_id"),
                "document_name": payload.get("document_name"),
                "page_no": payload.get("page_no"),
                "section_title": payload.get("section") or payload.get("section_title"),
                "chunk_index": payload.get("chunk_index"),
                "extraction_method": payload.get("extraction_method"),
                "version": payload.get("version"),
                "text_hash": payload.get("text_hash"),
                "text": payload.get("text") or payload.get("chunk_text"),
            })

        logger.info(
            "Semantic search: query='%s...' top_k=%s filters=%s returned=%s",
            query[:40],
            top_k,
            {"document_ids": document_ids, "section": section, "version": version},
            len(results),
        )

        return results
