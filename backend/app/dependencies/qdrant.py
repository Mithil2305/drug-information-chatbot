from qdrant_client import AsyncQdrantClient
from app.core.config import settings

# Global cached AsyncQdrantClient instance for connection pooling and efficiency
_qdrant_client_instance = None

async def get_qdrant_client() -> AsyncQdrantClient:
    """
    Dependency injection helper for Qdrant Client.
    Caches the client instance to leverage connection pooling and avoid TCP socket overhead.
    """
    global _qdrant_client_instance
    if _qdrant_client_instance is None:
        # Retrieve QDRANT_API_KEY if present in settings or env
        api_key = getattr(settings, "QDRANT_API_KEY", None)
        _qdrant_client_instance = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=api_key,
            timeout=30.0,
        )
    return _qdrant_client_instance
