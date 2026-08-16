import logging
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.dependencies.embeddings import (
    get_embedding_dimension,
    get_embedding_model,
    get_embedding_model_info,
)

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Service layer wrapping the BGE-M3 SentenceTransformer embedding model.
    Loads the model lazily and provides a clean interface for chunks and queries.
    """

    def __init__(self, batch_size: int = None):
        self._model = None
        self._batch_size = batch_size or settings.EMBEDDING_BATCH_SIZE

    @property
    def model(self):
        if self._model is None:
            self._model = get_embedding_model()
        return self._model

    @property
    def vector_size(self) -> int:
        """Return the actual model dimension."""
        return get_embedding_dimension()

    @property
    def model_info(self) -> Dict[str, Any]:
        """Return model name, device and dimension."""
        return get_embedding_model_info()

    @staticmethod
    def _sanitize_text(text: str) -> str:
        """Remove leading/trailing whitespace and control artifacts."""
        return text.strip().replace("\x00", "")

    @staticmethod
    def _filter_texts(texts: List[str]) -> List[int]:
        """Return the indices of non-empty, non-whitespace-only texts."""
        return [i for i, t in enumerate(texts) if t and t.strip()]

    def embed_query(self, query: str) -> List[float]:
        """Generate a single normalized embedding for a user query."""
        query = self._sanitize_text(query)
        if not query:
            raise ValueError("Query text is empty or whitespace-only.")

        embedding = self.model.encode(query, normalize_embeddings=True)
        if hasattr(embedding, "tolist"):
            return embedding.tolist()
        return embedding

    def embed_texts(self, texts: List[str]) -> List[Optional[List[float]]]:
        """
        Generate embeddings for a list of chunk texts.
        Returns a list aligned with the input: empty/whitespace items become None.
        """
        if not texts:
            return []

        valid_indices = self._filter_texts(texts)
        if not valid_indices:
            return [None] * len(texts)

        valid_texts = [self._sanitize_text(texts[i]) for i in valid_indices]

        try:
            embeddings = self.model.encode(
                valid_texts,
                normalize_embeddings=True,
                show_progress_bar=False,
                batch_size=self._batch_size,
            )
            if hasattr(embeddings, "tolist"):
                embeddings = embeddings.tolist()
        except Exception as exc:
            logger.error("Batch embedding failed: %s", exc)
            raise

        results: List[Optional[List[float]]] = [None] * len(texts)
        for idx, emb in zip(valid_indices, embeddings):
            results[idx] = emb
        return results

    # Backwards-compatible aliases used by the chunker
    def create_embedding(self, text: str) -> List[float]:
        return self.embed_query(text)

    def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Backwards-compatible batch embedding that skips None entries."""
        return [e for e in self.embed_texts(texts) if e is not None]


# Singleton instance of service
embedding_service = EmbeddingService()