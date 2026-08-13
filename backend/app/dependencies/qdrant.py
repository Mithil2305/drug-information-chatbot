from qdrant_client import AsyncQdrantClient
from app.core.config import settings
from typing import AsyncGenerator

async def get_qdrant_client() -> AsyncGenerator[AsyncQdrantClient, None]:
    """Dependency injection helper for Qdrant Client."""
    client = AsyncQdrantClient(url=settings.QDRANT_URL)
    try:
        yield client
    finally:
        await client.close()
