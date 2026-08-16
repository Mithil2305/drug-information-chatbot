import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.db.database import get_db_session
from app.dependencies.auth import get_current_user
from app.models.user import User


@pytest.fixture
def mock_db():
    db = AsyncMock()
    db.add = MagicMock()
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    return db


@pytest.fixture
def client(mock_db):
    async def override_db():
        yield mock_db
    app.dependency_overrides[get_db_session] = override_db
    app.dependency_overrides[get_current_user] = lambda: User(
        user_id="test-user-id", email="test@example.com", hashed_password="x", role="user"
    )
    yield TestClient(app)
    app.dependency_overrides.pop(get_db_session, None)
    app.dependency_overrides.pop(get_current_user, None)


def test_create_session(client, mock_db):
    response = client.post("/api/v1/sessions")
    print("status:", response.status_code)
    print("body:", response.text)
    assert response.status_code == 201
