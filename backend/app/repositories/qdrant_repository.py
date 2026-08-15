import logging
import uuid
from typing import List, Dict, Any, Optional

from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    TextIndexParams,
    TokenizerType,
    Filter,
    FieldCondition,
    MatchAny,
    MatchValue
)
from app.core.config import settings

logger = logging.getLogger(__name__)


class QdrantRepository:
    """
    Repository for interacting asynchronously with Qdrant Vector Database.
    Implements collection creation, payload indexing, batch upserts, and filtered search.
    """

    def __init__(self, client: Optional[AsyncQdrantClient] = None):
        self._client = client
        self.collection_name = settings.QDRANT_COLLECTION
        self._collection_verified = False

    @property
    def client(self) -> AsyncQdrantClient:
        if self._client is None:
            api_key = getattr(settings, "QDRANT_API_KEY", None)
            self._client = AsyncQdrantClient(
                url=settings.QDRANT_URL,
                api_key=api_key
            )
        return self._client

    async def ensure_collection_exists(self):
        """
        Asynchronously checks if the collection exists, creating it and configuring
        the optimized payload indexes (keyword, full-text) if missing.
        """
        if self._collection_verified:
            return

        try:
            collections = await self.client.get_collections()
            exists = any(c.name == self.collection_name for c in collections.collections)

            if not exists:
                logger.info(f"Creating Qdrant collection: {self.collection_name}")
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=1024,  # Dimension for BGE-M3 embeddings
                        distance=Distance.COSINE
                    )
                )

                # 1. Payload index on document_id for rapid filtering during query time
                await self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name="document_id",
                    field_schema="keyword"
                )

                # 2. Payload text index on chunk_text for full-text keyword retrieval matching
                await self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name="chunk_text",
                    field_schema=TextIndexParams(
                        type="text",
                        tokenizer=TokenizerType.WORD,
                        lowercase=True
                    )
                )
                logger.info("Successfully configured Qdrant collection and indexes.")

            self._collection_verified = True
        except Exception as e:
            logger.error(f"Failed to verify/create Qdrant collection: {e}")

    async def add_chunk(
        self,
        chunk_id: int,
        document_id: str,
        document_name: str,
        page_no: int,
        section: Optional[str],
        chunk_index: int,
        chunk_text: str,
        embedding: List[float]
    ):
        """Index a single document chunk with both text and metadata payload."""
        await self.ensure_collection_exists()

        point = PointStruct(
            id=chunk_id,
            vector=embedding,
            payload={
                "chunk_id": chunk_id,
                "document_id": document_id,
                "document_name": document_name,
                "page_no": page_no,
                "section": section,
                "chunk_index": chunk_index,
                "chunk_text": chunk_text,
                "text": chunk_text  # Added for backwards/alternate schema compatibility
            }
        )

        await self.client.upsert(
            collection_name=self.collection_name,
            points=[point]
        )

    async def add_chunks(self, chunks: List[Dict[str, Any]]):
        """Index a batch of chunks into Qdrant in a single bulk operation."""
        if not chunks:
            return

        await self.ensure_collection_exists()
        points = []

        for chunk in chunks:
            # Fallback to UUID string if chunk_id is not integer or not present
            point_id = chunk.get("chunk_id")
            if point_id is None:
                point_id = str(uuid.uuid4())

            point = PointStruct(
                id=point_id,
                vector=chunk["embedding"],
                payload={
                    "chunk_id": chunk.get("chunk_id"),
                    "document_id": chunk["document_id"],
                    "document_name": chunk.get("document_name"),
                    "page_no": chunk.get("page_no"),
                    "section": chunk.get("section"),
                    "chunk_index": chunk.get("chunk_index"),
                    "chunk_text": chunk["chunk_text"],
                    "text": chunk["chunk_text"]  # Compatibility key
                }
            )
            points.append(point)

        await self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    async def search(
        self,
        query_vector: List[float],
        limit: int = 5,
        document_ids: Optional[List[str]] = None
    ) -> List[Any]:
        """Perform semantic search using vector similarity in Qdrant with optional document filter."""
        await self.ensure_collection_exists()

        query_filter = None
        if document_ids:
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchAny(any=document_ids)
                    )
                ]
            )

        results = await self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            query_filter=query_filter,
            limit=limit
        )

        return results.points

    async def delete_document_chunks(self, document_id: str):
        """Delete all vectors and payload associated with a specific document ID from Qdrant."""
        await self.ensure_collection_exists()
        
        await self.client.delete(
            collection_name=self.collection_name,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(value=document_id)
                    )
                ]
            )
        )


# Singleton instance of repository
qdrant_repository = QdrantRepository()