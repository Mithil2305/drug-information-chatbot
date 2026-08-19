import pytest
import io
import os
from datetime import datetime
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch
from app.main import app
from app.db.database import get_db_session
from app.models.document import Document
from app.api.routes.documents import simulate_processing_task, UPLOAD_DIR

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

def test_upload_document_invalid_extension(client):
    files = {"file": ("test.txt", io.BytesIO(b"dummy text"), "text/plain")}
    response = client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 400
    assert "Only PDF, DOCX, DOC, and image files" in response.json()["detail"]

def test_upload_document_success(client, mock_db):
    files = {"file": ("test.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf content"), "application/pdf")}
    
    # Mock OS write and DB commits
    with patch("builtins.open", MagicMock()), \
         patch("os.path.exists", return_value=True):
        mock_db.commit = AsyncMock()
        
        async def mock_refresh(obj):
            obj.is_active = True
            obj.created_at = datetime.utcnow()
        mock_db.refresh.side_effect = mock_refresh
        
        response = client.post("/api/v1/documents/upload", files=files)
        assert response.status_code == 201
        data = response.json()
        assert data["document"]["file_name"] == "test.pdf"
        assert data["document"]["status"] == "uploaded"
        assert data["document"]["is_active"] is True
        assert data["document"]["file_size"] == 26
        assert data["document"]["page_count"] == 0

def test_list_documents_success(client, mock_db):
    doc1 = Document(
        document_id="doc-1",
        file_name="Rinvoq.pdf",
        storage_key="key1",
        source="Rinvoq",
        version="1.0",
        status="completed",
        is_active=True,
        created_at=datetime.utcnow()
    )
    doc2 = Document(
        document_id="doc-2",
        file_name="Skyrizi.pdf",
        storage_key="key2",
        source="Skyrizi",
        version="1.0",
        status="processing",
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [doc1, doc2]
    mock_db.execute.return_value = mock_result
    
    response = client.get("/api/v1/documents")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["document_id"] == "doc-1"
    assert data[1]["document_id"] == "doc-2"

def test_get_document_success(client, mock_db):
    doc = Document(
        document_id="doc-1",
        file_name="Rinvoq.pdf",
        storage_key="key1",
        source="Rinvoq",
        version="1.0",
        status="completed",
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = doc
    mock_db.execute.return_value = mock_result
    
    response = client.get("/api/v1/documents/doc-1")
    assert response.status_code == 200
    assert response.json()["document_id"] == "doc-1"

def test_get_document_not_found(client, mock_db):
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_db.execute.return_value = mock_result
    
    response = client.get("/api/v1/documents/invalid-id")
    assert response.status_code == 404

def test_process_document_success(client, mock_db):
    doc = Document(
        document_id="doc-1",
        file_name="Rinvoq.pdf",
        storage_key="key1",
        source="Rinvoq",
        version="1.0",
        status="completed",
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = doc
    mock_db.execute.return_value = mock_result
    
    response = client.post("/api/v1/documents/doc-1/process")
    assert response.status_code == 200
    assert response.json()["document_id"] == "doc-1"

def test_process_document_not_found(client, mock_db):
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_db.execute.return_value = mock_result
    
    response = client.post("/api/v1/documents/invalid-id/process")
    assert response.status_code == 404

# =====================================================================
# BACKGROUND TASK TESTS
# =====================================================================

@pytest.mark.asyncio
async def test_simulate_processing_task_success():
    doc = Document(
        document_id="doc-1",
        file_name="Rinvoq.pdf",
        status="uploaded",
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    mock_db = AsyncMock()
    mock_db.add = MagicMock()
    
    # Mocking DB execution results
    mock_result_doc = MagicMock()
    mock_result_doc.scalar_one_or_none.return_value = doc
    
    mock_result_pages = MagicMock()
    mock_result_pages.scalars.return_value.all.return_value = []
    
    # Set up db.execute returns
    mock_db.execute.side_effect = [mock_result_doc, mock_result_pages, mock_result_doc]
    
    # Session factory mock
    async def mock_db_session_factory():
        yield mock_db
        
    with patch("os.path.exists", return_value=True), \
         patch("app.api.routes.documents.extract_pdf_pages", return_value=[{"page_no": 1, "extraction_method": "fitz", "quality_score": 1.0, "text": "Page text"}]), \
         patch("app.api.routes.documents.create_chunks", return_value=5):
         
        await simulate_processing_task("doc-1", mock_db_session_factory)
        
    assert doc.status == "completed"
