import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.db.database import get_db_session
from app.models.citation import Citation as CitationModel

@pytest.fixture
def mock_db():
    db = AsyncMock()
    db.add = MagicMock()
    return db

@pytest.fixture
def client(mock_db):
    async def override_get_db():
        yield mock_db
    app.dependency_overrides[get_db_session] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.pop(get_db_session, None)

def test_get_citation_success(client, mock_db):
    # Setup mock citation record
    mock_citation = CitationModel(
        citation_id="cit-uuid-1",
        message_id=42,
        document_id="doc-uuid-1",
        chunk_id="chunk-uuid-1",
        document_name="Aspirin_PI.pdf",
        section="Dosage",
        page_no=3
    )
    
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_citation
    mock_db.execute.return_value = mock_result
    
    response = client.get("/api/v1/citations/cit-uuid-1")
    
    assert response.status_code == 200
    data = response.json()
    assert data["document_id"] == "doc-uuid-1"
    assert data["document_name"] == "Aspirin_PI.pdf"
    assert data["page"] == 3
    assert data["section"] == "Dosage"
    assert data["chunk_id"] == "chunk-uuid-1"

def test_get_citation_not_found(client, mock_db):
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_db.execute.return_value = mock_result
    
    response = client.get("/api/v1/citations/invalid-id")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Citation not found."
