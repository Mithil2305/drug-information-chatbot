import logging
import os
from typing import Generator
from app.core.config import settings

logger = logging.getLogger(__name__)

# Cached model instance
_llm_instance = None

def get_llm_client():
    """
    Dependency injection helper for Qwen LLM Client.
    Caches model loading to avoid expensive initialization on every request.
    """
    global _llm_instance
    if _llm_instance is not None:
        return _llm_instance

    # Check if the gguf file exists
    model_path = settings.LLM_MODEL_PATH
    if not model_path or not os.path.exists(model_path):
        logger.warning(
            f"LLM model file not found at {model_path}. "
            "Falling back to Mock LLM Client for local development/testing."
        )
        class MockLLMClient:
            def __call__(self, prompt, **kwargs):
                return {
                    "choices": [
                        {
                            "text": f"[Mock Qwen Answer] Grounded answer stub for: {prompt[:50]}..."
                        }
                    ]
                }
        _llm_instance = MockLLMClient()
        return _llm_instance

    try:
        from llama_cpp import Llama
        _llm_instance = Llama(
            model_path=model_path,
            n_ctx=4096,
            n_gpu_layers=-1  # Use GPU if available
        )
        logger.info("Successfully loaded Qwen LLM from local GGUF file.")
    except Exception as e:
        logger.error(f"Failed to load Llama model: {e}. Returning mock LLM client.")
        class MockLLMClient:
            def __call__(self, prompt, **kwargs):
                return {
                    "choices": [
                        {
                            "text": f"[Mock LLM Error Fallback] Error: {str(e)}"
                        }
                    ]
                }
        _llm_instance = MockLLMClient()

    return _llm_instance
