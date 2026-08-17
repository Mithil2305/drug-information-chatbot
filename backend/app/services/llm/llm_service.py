import asyncio
import logging
from typing import Optional

from app.core.config import settings
from app.core.task_manager import task_manager, TaskCancelledError
from app.dependencies.llm import get_llm_client

logger = logging.getLogger(__name__)


class LLMService:
    """
    Service that wraps the Qwen LLM client (llama_cpp or mock fallback).
    Enforces generation parameters and a rough input-token budget.
    """

    def __init__(self, client=None):
        self.client = client or get_llm_client()

    def _build_prompt_and_kwargs(
        self,
        prompt: str,
        max_new_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        stop: Optional[list] = None,
    ):
        """Truncate the prompt and build the generation kwargs dict."""
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

        gen_kwargs = {}
        if max_new_tokens is not None:
            gen_kwargs["max_tokens"] = max_new_tokens
        if temperature is not None:
            gen_kwargs["temperature"] = temperature
        if top_p is not None:
            gen_kwargs["top_p"] = top_p
        if stop is not None:
            gen_kwargs["stop"] = stop

        return prompt, gen_kwargs

    @staticmethod
    def _extract_text(response) -> str:
        if isinstance(response, dict):
            text = response["choices"][0]["text"].strip()
        else:
            text = str(response).strip()

        if "</think>" in text:
            text = text.split("</think>")[-1].strip()
        elif "<think>" in text:
            text = text.split("<think>")[0].strip()

        return text

    @staticmethod
    def _token_text(token) -> str:
        if isinstance(token, dict):
            choices = token.get("choices") or []
            return (choices[0].get("text", "") if choices else "")

        if hasattr(token, "choices") and token.choices:
            return getattr(token.choices[0], "text", "") or ""

        return str(token)

    async def generate_async(
        self,
        prompt: str,
        task_id: Optional[str] = None,
        max_new_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        stop: Optional[list] = None,
    ) -> str:
        """Send a prompt to the LLM and return the generated text.

        If task_id is provided, the generation is checked for cancellation
        between tokens (when the underlying model supports streaming).
        """
        prompt, gen_kwargs = self._build_prompt_and_kwargs(
            prompt, max_new_tokens, temperature, top_p, stop
        )

        await task_manager.raise_if_cancelled(task_id)

        # Try streaming first so we can stop quickly on cancellation.
        try:
            response = await asyncio.to_thread(self.client, prompt, stream=True, **gen_kwargs)

            # If the client returned a generator/iterator, stream token-by-token.
            if (
                not isinstance(response, dict)
                and hasattr(response, "__next__")
            ):
                text_parts = []
                try:
                    while True:
                        await task_manager.raise_if_cancelled(task_id)
                        token = await asyncio.to_thread(next, response)
                        text_parts.append(self._token_text(token))
                except StopIteration:
                    pass
                return "".join(text_parts)
        except (TypeError, ValueError, AttributeError) as exc:
            logger.debug("LLM streaming not supported by client: %s", exc)

        # Non-streaming fallback. We can only check cancellation before/after.
        await task_manager.raise_if_cancelled(task_id)
        response = await asyncio.to_thread(self.client, prompt, **gen_kwargs)
        await task_manager.raise_if_cancelled(task_id)
        return self._extract_text(response)

    def generate(
        self,
        prompt: str,
        max_new_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        stop: Optional[list] = None,
    ) -> str:
        """Synchronous wrapper for backwards compatibility."""
        prompt, gen_kwargs = self._build_prompt_and_kwargs(
            prompt, max_new_tokens, temperature, top_p, stop
        )

        try:
            response = self.client(prompt, **gen_kwargs)
            return self._extract_text(response)
        except Exception as exc:
            logger.error("LLM generation failed: %s", exc)
            raise
