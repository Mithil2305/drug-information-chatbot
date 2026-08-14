import pytest
from unittest.mock import MagicMock, AsyncMock
from app.repositories.qdrant_repository import qdrant_repository

@pytest.mark.asyncio
async def test_qdrant_repository_init():
    # Setup mock for get_collections to return no collections
    mock_collections = MagicMock()
    mock_collections.collections = []
    
    # Configure mock client behavior
    qdrant_repository.client.get_collections = AsyncMock(return_value=mock_collections)
    qdrant_repository.client.create_collection = AsyncMock()
    qdrant_repository.client.create_payload_index = AsyncMock()
    
    # Trigger collection check/creation
    await qdrant_repository.ensure_collection_exists()
    
    qdrant_repository.client.get_collections.assert_called_once()
    qdrant_repository.client.create_collection.assert_called_once()


@pytest.mark.asyncio
async def test_add_chunk():
    # Reset call history on mock client
    qdrant_repository.client.reset_mock()
    qdrant_repository.client.upsert = AsyncMock()
    
    await qdrant_repository.add_chunk(
        chunk_id=1,
        document_id="doc-123",
        document_name="TestDoc.pdf",
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
    assert point.payload["text"] == "Test chunk text"
    assert point.vector == [0.1] * 1024


@pytest.mark.asyncio
async def test_add_chunks():
    qdrant_repository.client.reset_mock()
    qdrant_repository.client.upsert = AsyncMock()
    
    chunks = [
        {
            "chunk_id": 1,
            "document_id": "doc-123",
            "document_name": "TestDoc.pdf",
            "page_no": 5,
            "section": "Dosage",
            "chunk_index": 0,
            "chunk_text": "Chunk 1",
            "embedding": [0.1] * 1024
        },
        {
            "chunk_id": 2,
            "document_id": "doc-123",
            "document_name": "TestDoc.pdf",
            "page_no": 6,
            "section": "Warnings",
            "chunk_index": 1,
            "chunk_text": "Chunk 2",
            "embedding": [0.2] * 1024
        }
    ]
    
    await qdrant_repository.add_chunks(chunks)
    
    qdrant_repository.client.upsert.assert_called_once()
    args, kwargs = qdrant_repository.client.upsert.call_args
    assert len(kwargs["points"]) == 2
    assert kwargs["points"][0].payload["chunk_text"] == "Chunk 1"
    assert kwargs["points"][1].payload["chunk_text"] == "Chunk 2"


@pytest.mark.asyncio
async def test_search():
    qdrant_repository.client.reset_mock()
    
    # Setup query_points mock response
    mock_point = MagicMock()
    mock_point.id = "point-uuid-1"
    mock_point.payload = {"chunk_id": "chunk-rinvoq-dosage", "text": "Result text"}
    mock_point.score = 0.95
    
    mock_results = MagicMock()
    mock_results.points = [mock_point]
    qdrant_repository.client.query_points = AsyncMock(return_value=mock_results)
    
    results = await qdrant_repository.search(query_vector=[0.1] * 1024, limit=3)
    
    qdrant_repository.client.query_points.assert_called_once()
    args, kwargs = qdrant_repository.client.query_points.call_args
    assert kwargs["collection_name"] == qdrant_repository.collection_name
    assert kwargs["query"] == [0.1] * 1024
    assert kwargs["limit"] == 3
    assert len(results) == 1
    assert results[0].payload["chunk_id"] == "chunk-rinvoq-dosage"
