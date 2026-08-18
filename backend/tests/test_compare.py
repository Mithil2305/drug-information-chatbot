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

    from unittest.mock import AsyncMock
    original_generate_async = comparison_service.llm_service.generate_async
    comparison_service.llm_service.generate_async = AsyncMock(
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
        comparison_service.llm_service.generate_async = original_generate_async
        comparison_service.search_service.search = original_search
        comparison_service.batch_size = original_batch_size


def test_parse_batch_answer_formats():
    from app.services.comparison.comparison_service import ComparisonService

    # 1. Hyphen-separated format (expected behaviour)
    ans1 = (
        "DRUG1: Rinvoq is indicated for rheumatoid arthritis. [S1]\n"
        "DRUG2: Humira is indicated for Crohn's disease. [S2]\n"
        "---\n"
        "DRUG1: Rinvoq warnings include serious infections. [S3]\n"
        "DRUG2: Humira warnings include tuberculosis. [S4]"
    )
    res1 = ComparisonService._parse_batch_answer(ans1, 2)
    assert len(res1) == 2
    assert "arthritis" in res1[0][0]
    assert "Crohn's" in res1[0][1]
    assert "serious infections" in res1[1][0]
    assert "tuberculosis" in res1[1][1]

    # 2. Section-labeled format (no hyphens)
    ans2 = (
        "Section 1: Indications\n"
        "DRUG1: Rinvoq is indicated for rheumatoid arthritis. [S1]\n"
        "DRUG2: Humira is indicated for Crohn's disease. [S2]\n"
        "\n"
        "Section 2: Warnings\n"
        "DRUG1: Rinvoq warnings include serious infections. [S3]\n"
        "DRUG2: Humira warnings include tuberculosis. [S4]"
    )
    res2 = ComparisonService._parse_batch_answer(ans2, 2)
    assert len(res2) == 2
    assert "arthritis" in res2[0][0]
    assert "Crohn's" in res2[0][1]
    assert "serious infections" in res2[1][0]
    assert "tuberculosis" in res2[1][1]

    # 3. Single-section format (batch size = 1)
    ans3 = (
        "DRUG1: Rinvoq is indicated for rheumatoid arthritis. [S1]\n"
        "DRUG2: Humira is indicated for Crohn's disease. [S2]"
    )
    res3 = ComparisonService._parse_batch_answer(ans3, 1)
    assert len(res3) == 1
    assert "arthritis" in res3[0][0]
    assert "Crohn's" in res3[0][1]

    # 4. Fallback/mismatched format (should use granular lookahead)
    ans4 = (
        "Section 1: Indications\n"
        "DRUG1: Rinvoq is indicated for rheumatoid arthritis. [S1]\n"
        "DRUG2: Humira is indicated for Crohn's disease. [S2]\n"
        "Random text or weird lines here\n"
        "Section 2: Warnings\n"
        "DRUG1: Rinvoq warnings include serious infections. [S3]\n"
        "DRUG2: Humira warnings include tuberculosis. [S4]"
    )
    res4 = ComparisonService._parse_batch_answer(ans4, 2)
    assert len(res4) == 2
    assert "arthritis" in res4[0][0]
    assert "Crohn's" in res4[0][1]
    assert "serious infections" in res4[1][0]
    assert "tuberculosis" in res4[1][1]

    # 5. Missing one drug in one of the sections
    ans5 = (
        "Section 1: Indications\n"
        "DRUG1: Rinvoq is indicated for rheumatoid arthritis. [S1]\n"
        "DRUG2: Not available in source document.\n"
        "\n"
        "Section 2: Warnings\n"
        "DRUG1: Not available in source document.\n"
        "DRUG2: Humira warnings include tuberculosis. [S4]"
    )
    res5 = ComparisonService._parse_batch_answer(ans5, 2)
    assert len(res5) == 2
    assert "arthritis" in res5[0][0]
    assert "not available" in res5[0][1].lower()
    assert "not available" in res5[1][0].lower()
    assert "tuberculosis" in res5[1][1]


