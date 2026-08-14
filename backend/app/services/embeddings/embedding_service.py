import logging
from typing import List
from app.dependencies.embeddings import get_embedding_model

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Service layer wrapping the SentenceTransformer embedding model.
    Loads the model lazily via dependency injection caching to minimize startup overhead.
    """

    def __init__(self):
        self._model = None

    @property
    def model(self):
        if self._model is None:
            self._model = get_embedding_model()
        return self._model

    def create_embedding(self, text: str) -> List[float]:
        """Generate a single 1024-dimensional normalized vector for query text."""
        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )
        if hasattr(embedding, "tolist"):
            return embedding.tolist()
        return embedding

    def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings in optimized batches for document chunks."""
        if not texts:
            return []
            
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=False,
            batch_size=32  # Optimal chunk batching to prevent OOM and maximize hardware throughput
        )
        if hasattr(embeddings, "tolist"):
            return embeddings.tolist()
        return embeddings


# Singleton instance of service
embedding_service = EmbeddingService()