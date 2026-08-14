import asyncio
from typing import List, Dict, Any, Optional
from app.services.retrieval.semantic_search import semantic_search
from app.services.retrieval.keyword_search import keyword_search


async def hybrid_search(
    query: str,
    document_ids: List[str],
    limit: int = 5,
    rrf_k: int = 60
) -> List[Dict[str, Any]]:
    """
    Perform hybrid search combining semantic (vector similarity) and keyword (lexical matching)
    retrieval layers. Scores are fused using Reciprocal Rank Fusion (RRF).
    """
    # 1. Fetch semantic and keyword candidate lists in parallel to minimize latency
    semantic_task = semantic_search(query, document_ids, limit=limit * 2)
    keyword_task = keyword_search(query, document_ids, limit=limit * 2)

    semantic_results, keyword_results = await asyncio.gather(
        semantic_task,
        keyword_task
    )

    # 2. Apply Reciprocal Rank Fusion algorithm
    rrf_scores = {}
    doc_map = {}  # Maps chunk_id to its full payload dictionary

    # Process semantic retrieval results
    for rank, doc in enumerate(semantic_results, start=1):
        chunk_id = doc["chunk_id"]
        doc_map[chunk_id] = doc
        rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0.0) + (1.0 / (rrf_k + rank))

    # Process keyword retrieval results
    for rank, doc in enumerate(keyword_results, start=1):
        chunk_id = doc["chunk_id"]
        doc_map[chunk_id] = doc
        rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0.0) + (1.0 / (rrf_k + rank))

    # 3. Sort by RRF score descending
    sorted_chunk_ids = sorted(
        rrf_scores.keys(),
        key=lambda chunk: rrf_scores[chunk],
        reverse=True
    )

    # 4. Construct final ranked output
    final_results = []
    for chunk_id in sorted_chunk_ids[:limit]:
        doc = doc_map[chunk_id].copy()
        # Include both standard and fused scores for validation/observability
        doc["rrf_score"] = rrf_scores[chunk_id]
        final_results.append(doc)

    return final_results
