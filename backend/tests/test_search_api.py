import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_post_search(client):
    fake_result = [
        {
            "chunk_id": "c1",
            "score": 0.91,
            "document_id": "doc-001",
            "document_name": "drug.pdf",
            "page_no": 7,
            "section_title": "DOSAGE AND ADMINISTRATION",
            "text": "Take 10 mg once daily.",
        }
    ]

    with patch(
        "app.api.routes.search._search_service.search",
        new=AsyncMock(return_value=fake_result),
    ):
        response = client.post(
            "/api/v1/search/",
            json={
                "query": "What is the recommended dosage?",
                "top_k": 5,
                "document_ids": ["doc-001"],
                "section": "DOSAGE AND ADMINISTRATION",
                "score_threshold": 0.35,
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "What is the recommended dosage?"
    assert len(data["results"]) == 1
    assert data["results"][0]["chunk_id"] == "c1"
    assert data["results"][0]["score"] == pytest.approx(0.91)
    assert data["results"][0]["section_title"] == "DOSAGE AND ADMINISTRATION"
