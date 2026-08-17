import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.db.database import get_db_session
from app.models.document import Document
from app.api.routes.compare import comparison_service


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


def _setup_docs(mock_db):
    doc1 = Document(
        document_id="doc-1",
        file_name="Rinvoq.pdf",
        source="Rinvoq",
        status="completed",
    )
    doc2 = Document(
        document_id="doc-2",
        file_name="Skyrizi.pdf",
        source="Skyrizi",
        status="completed",
    )

    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [doc1, doc2]
    mock_result.scalar.return_value = 10
    mock_db.execute.return_value = mock_result
    return doc1, doc2


def test_compare_documents_missing(client, mock_db):
    doc = Document(
        document_id="doc-1",
        file_name="Rinvoq.pdf",
        source="Rinvoq",
        status="completed",
    )

    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [doc]
    mock_db.execute.return_value = mock_result

    response = client.post(
        "/api/v1/compare",
        json={"drug1Id": "doc-1", "drug2Id": "doc-2"},
    )

    assert response.status_code == 404
    assert "Document not found" in response.json()["detail"]


def test_compare_documents_same(client, mock_db):
    _setup_docs(mock_db)

    response = client.post(
        "/api/v1/compare",
        json={"drug1Id": "doc-1", "drug2Id": "doc-1"},
    )

    assert response.status_code == 400
    assert "same" in response.json()["detail"].lower()


def test_compare_documents_not_ready(client, mock_db):
    doc = Document(
        document_id="doc-1",
        file_name="Rinvoq.pdf",
        source="Rinvoq",
        status="processing",
    )

    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [doc]
    mock_db.execute.return_value = mock_result

    response = client.post(
        "/api/v1/compare",
        json={"drug1Id": "doc-1", "drug2Id": "doc-1"},
    )

    assert response.status_code == 400


def test_compare_documents_success(client, mock_db):
    _setup_docs(mock_db)

    original_batch_size = comparison_service.batch_size
    comparison_service.batch_size = 1

    original_generate = comparison_service.llm_service.generate
    comparison_service.llm_service.generate = MagicMock(
        return_value=(
            "DRUG1: Treatment of moderately to severely active rheumatoid arthritis. [S1]\n"
            "DRUG2: Treatment of moderate-to-severe plaque psoriasis. [S1]"
        )
    )

    original_search = comparison_service.search_service.search
    comparison_service.search_service.search = AsyncMock(
        return_value=[
            {
                "chunk_id": "chunk-rinvoq-dosage",
                "score": 0.95,
                "document_id": "doc-1",
                "document_name": "Rinvoq.pdf",
                "page_no": 12,
                "section_title": "Indications",
                "text": "Treatment of moderately to severely active rheumatoid arthritis.",
            },
            {
                "chunk_id": "chunk-skyrizi-dosage",
                "score": 0.94,
                "document_id": "doc-2",
                "document_name": "Skyrizi.pdf",
                "page_no": 7,
                "section_title": "Indications",
                "text": "Treatment of moderate-to-severe plaque psoriasis.",
            },
        ]
    )

    try:
        response = client.post(
            "/api/v1/compare",
            json={"drug1Id": "doc-1", "drug2Id": "doc-2"},
        )

        assert response.status_code == 200
        data = response.json()

        assert data["drug1"]["id"] == "doc-1"
        assert data["drug2"]["id"] == "doc-2"
        assert data["drug1"]["pageCount"] == 10
        assert len(data["attributes"]) == 13
        assert data["summary"]["totalAttributes"] == 13
        assert data["summary"]["unavailableCount"] == 0
        assert data["summary"]["bothUnavailableCount"] == 0

        first_attr = data["attributes"][0]
        assert first_attr["key"] == "indications"
        assert "rheumatoid" in first_attr["drug1"]["content"].lower()
        assert "psoriasis" in first_attr["drug2"]["content"].lower()
    finally:
        comparison_service.llm_service.generate = original_generate
        comparison_service.search_service.search = original_search
        comparison_service.batch_size = original_batch_size

