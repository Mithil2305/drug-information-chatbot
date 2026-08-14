import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.db.database import get_db_session
from app.models.document import Document

@pytest.fixture
def mock_db():
    db = AsyncMock()
    db.add = MagicMock()
    return db

@pytest.fixture
def client(mock_db):
    async def override_db():
        yield mock_db
    app.dependency_overrides[get_db_session] = override_db
    yield TestClient(app)
    app.dependency_overrides.pop(get_db_session, None)

def test_compare_documents_missing(client, mock_db):
    doc = Document(document_id="doc-1", file_name="Rinvoq.pdf")
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [doc]
    mock_db.execute.return_value = mock_result
    
    payload = {
        "document_ids": ["doc-1", "doc-2"],
        "sections": ["INDICATIONS", "DOSAGE"]
    }
    
    response = client.post("/api/v1/compare", json=payload)
    
    assert response.status_code == 404
    assert "Some documents were not found" in response.json()["detail"]

def test_compare_documents_success(client, mock_db):
    doc1 = Document(document_id="doc-1", file_name="Rinvoq.pdf")
    doc2 = Document(document_id="doc-2", file_name="Skyrizi.pdf")
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [doc1, doc2]
    mock_db.execute.return_value = mock_result
    
    payload = {
        "document_ids": ["doc-1", "doc-2"],
        "sections": ["INDICATIONS", "DOSAGE"]
    }
    
    response = client.post("/api/v1/compare", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["document_ids"] == ["doc-1", "doc-2"]
    assert len(data["rows"]) == 2
    
    # Verify first row: INDICATIONS
    row1 = data["rows"][0]
    assert row1["section_name"] == "INDICATIONS"
    assert "doc-1" in row1["cells"]
    assert "Treatment of moderately to severely active" in row1["cells"]["doc-1"]["content"]
    assert "doc-2" in row1["cells"]
    assert "Treatment of moderate-to-severe" in row1["cells"]["doc-2"]["content"]
