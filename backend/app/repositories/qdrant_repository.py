import os
import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)


class QdrantRepository:

    def __init__(self):

        qdrant_url = os.getenv(
            "QDRANT_URL",
            "http://localhost:6333"
        )

        qdrant_api_key = os.getenv(
            "QDRANT_API_KEY",
            None
        )

        self.collection_name = os.getenv(
            "QDRANT_COLLECTION",
            "drug_documents"
        )

        if qdrant_api_key:
            self.client = QdrantClient(
                url=qdrant_url,
                api_key=qdrant_api_key
            )
        else:
            self.client = QdrantClient(
                url=qdrant_url
            )

        self.create_collection()

    def create_collection(self):

        collections = self.client.get_collections()

        exists = False

        for collection in collections.collections:
            if collection.name == self.collection_name:
                exists = True
                break

        if not exists:

            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=1024,
                    distance=Distance.COSINE
                )
            )

    def add_chunk(
        self,
        chunk_id,
        document_id,
        page_no,
        section,
        chunk_index,
        chunk_text,
        embedding
    ):

        point_id = str(uuid.uuid4())

        point = PointStruct(
            id=point_id,
            vector=embedding,
            payload={
                "chunk_id": chunk_id,
                "document_id": document_id,
                "page_no": page_no,
                "section": section,
                "chunk_index": chunk_index,
                "chunk_text": chunk_text
            }
        )

        self.client.upsert(
            collection_name=self.collection_name,
            points=[point]
        )

    def add_chunks(self, chunks):

        points = []

        for chunk in chunks:

            point_id = str(uuid.uuid4())

            point = PointStruct(
                id=point_id,
                vector=chunk["embedding"],
                payload={
                    "chunk_id": chunk["chunk_id"],
                    "document_id": chunk["document_id"],
                    "page_no": chunk["page_no"],
                    "section": chunk["section"],
                    "chunk_index": chunk["chunk_index"],
                    "chunk_text": chunk["chunk_text"]
                }
            )

            points.append(point)

        if points:

            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )

    def search(
        self,
        query_vector,
        limit=5
    ):

        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=limit
        )

        return results.points


qdrant_repository = QdrantRepository()