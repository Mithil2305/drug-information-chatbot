import pytest
from unittest.mock import MagicMock
from app.repositories.qdrant_repository import qdrant_repository

def test_qdrant_repository_init():
    # Verify that the repository has a mocked client and get_collections/create_collection were called
    assert isinstance(qdrant_repository.client, MagicMock)
    qdrant_repository.client.get_collections.assert_called()
    qdrant_repository.client.create_collection.assert_called()

def test_add_chunk():
    qdrant_repository.client.reset_mock()
    
    qdrant_repository.add_chunk(
        chunk_id=1,
        document_id="doc-123",
        page_no=5,
        section="Dosage",
        chunk_index=0,
        chunk_text="Test chunk text",
        embedding=[0.1] * 1024
    )
    
    qdrant_repository.client.upsert.assert_called_once()
    args, kwargs = qdrant_repository.client.upsert.call_args
    assert kwargs["collection_name"] == qdrant_repository.collection_name
    assert len(kwargs["points"]) == 1
    point = kwargs["points"][0]
    assert point.payload["chunk_id"] == 1
    assert point.payload["document_id"] == "doc-123"
    assert point.payload["page_no"] == 5
    assert point.payload["section"] == "Dosage"
    assert point.payload["chunk_text"] == "Test chunk text"
    assert point.vector == [0.1] * 1024

def test_add_chunks():
    qdrant_repository.client.reset_mock()
    
    chunks = [
        {
            "chunk_id": 1,
            "document_id": "doc-123",
            "page_no": 5,
            "section": "Dosage",
            "chunk_index": 0,
            "chunk_text": "Chunk 1",
            "embedding": [0.1] * 1024
        },
        {
            "chunk_id": 2,
            "document_id": "doc-123",
            "page_no": 6,
            "section": "Warnings",
            "chunk_index": 1,
            "chunk_text": "Chunk 2",
            "embedding": [0.2] * 1024
        }
    ]
    
    qdrant_repository.add_chunks(chunks)
    
    qdrant_repository.client.upsert.assert_called_once()
    args, kwargs = qdrant_repository.client.upsert.call_args
    assert len(kwargs["points"]) == 2
    assert kwargs["points"][0].payload["chunk_text"] == "Chunk 1"
    assert kwargs["points"][1].payload["chunk_text"] == "Chunk 2"

def test_search():
    qdrant_repository.client.reset_mock()
    
    # Setup query_points mock response
    mock_point = MagicMock()
    mock_point.id = "point-uuid-1"
    mock_point.payload = {"chunk_id": "chunk-rinvoq-dosage", "text": "Result text"}
    mock_point.score = 0.95
    
    mock_results = MagicMock()
    mock_results.points = [mock_point]
    qdrant_repository.client.query_points.return_value = mock_results
    
    results = qdrant_repository.search(query_vector=[0.1] * 1024, limit=3)
    
    qdrant_repository.client.query_points.assert_called_once_with(
        collection_name=qdrant_repository.collection_name,
        query=[0.1] * 1024,
        limit=3
    )
    assert len(results) == 1
    assert results[0].payload["chunk_id"] == "chunk-rinvoq-dosage"
