import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.chunking.chunker import split_text, create_chunks
from app.models.document_page import DocumentPage

def test_split_text_empty():
    assert split_text("") == []
    assert split_text("   ") == []

def test_split_text_small():
    text = "This is a short sentence."
    assert split_text(text) == [text]

def test_split_text_large():
    # CHUNK_SIZE = 1000, CHUNK_OVERLAP = 200
    # Text length 1500 characters
    text = "a" * 1500
    chunks = split_text(text)
    
    assert len(chunks) == 2
    assert len(chunks[0]) == 1000
    # Overlap starts at 1000 - 200 = 800.
    # Second chunk text[800:1800] -> length is 700.
    assert len(chunks[1]) == 700

@pytest.mark.asyncio
async def test_create_chunks_no_pages():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = []
    mock_db.execute.return_value = mock_result
    
    count = await create_chunks("doc-uuid-1", mock_db)
    assert count == 0

@pytest.mark.asyncio
async def test_create_chunks_with_pages():
    mock_db = AsyncMock()
    mock_db.add = MagicMock()
    
    # Mocking DocumentPage objects
    page1 = DocumentPage(document_id="doc-uuid-1", page_no=1, text_ref="Page 1 text content.")
    page2 = DocumentPage(document_id="doc-uuid-1", page_no=2, text_ref="Page 2 text content.")
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [page1, page2]
    mock_db.execute.return_value = mock_result
    
    count = await create_chunks("doc-uuid-1", mock_db)
    
    assert count == 2
    # Check that delete was called for old chunks and add was called for new ones
    assert mock_db.execute.call_count == 2  # 1 select, 1 delete
    assert mock_db.add.call_count == 2
    mock_db.commit.assert_called_once()
