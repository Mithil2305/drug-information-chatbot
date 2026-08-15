import logging
import torch
from app.core.config import settings

logger = logging.getLogger(__name__)

# Cached model instance
_embedding_model_instance = None

def get_embedding_model():
    """
    Dependency injection helper for Embedding Model.
    Caches model loading to avoid expensive initialization on every request.
    Detects CUDA/GPU environment automatically for optimal hardware utilization.
    """
    global _embedding_model_instance
    if _embedding_model_instance is not None:
        return _embedding_model_instance

    try:
        from sentence_transformers import SentenceTransformer
        # Check if GPU is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Initializing SentenceTransformer model '{settings.EMBEDDING_MODEL}' on device: {device}")
        
        _embedding_model_instance = SentenceTransformer(
            settings.EMBEDDING_MODEL,
            device=device
        )
        logger.info(f"Successfully loaded embedding model: {settings.EMBEDDING_MODEL}")
    except Exception as e:
        logger.error(f"Failed to load sentence-transformers model: {e}. Returning mock embedding model.")
        class MockEmbeddingModel:
            def encode(self, sentences, **kwargs):
                # Return dummy vectors (BGE-M3 produces 1024-dimensional vectors)
                import numpy as np
                if isinstance(sentences, str):
                    return np.zeros(1024, dtype=np.float32).tolist()
                return np.zeros((len(sentences), 1024), dtype=np.float32).tolist()
        _embedding_model_instance = MockEmbeddingModel()

    return _embedding_model_instance
