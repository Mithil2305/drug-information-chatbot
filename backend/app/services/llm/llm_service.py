import logging
from typing import Optional

from app.core.config import settings
from app.dependencies.llm import get_llm_client

logger = logging.getLogger(__name__)


class LLMService:
    """
    Service that wraps the Qwen LLM client (llama_cpp or mock fallback).
    Enforces generation parameters and a rough input-token budget.
    """

    def __init__(self, client=None):
        self.client = client or get_llm_client()

    def generate(
        self,
        prompt: str,
        max_new_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        stop: Optional[list] = None,
    ) -> str:
        """Send a prompt to the LLM and return the generated text."""
        max_new_tokens = max_new_tokens or settings.LLM_MAX_NEW_TOKENS
        temperature = temperature if temperature is not None else settings.LLM_TEMPERATURE

        # Rough input-token guard: ~4 characters per token.
        max_input_chars = settings.LLM_MAX_INPUT_TOKENS * 4
        if len(prompt) > max_input_chars:
            logger.warning(
                "Prompt too long (%d chars); truncating to ~%d tokens",
                len(prompt),
                settings.LLM_MAX_INPUT_TOKENS,
            )
            prompt = prompt[:max_input_chars]

        try:
            response = self.client(
                prompt,
                max_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                stop=stop,
            )

            if isinstance(response, dict):
                text = response["choices"][0]["text"].strip()
            else:
                text = str(response).strip()

            return text
        except Exception as exc:
            logger.error("LLM generation failed: %s", exc)
            raise
