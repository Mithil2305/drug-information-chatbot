import logging
from typing import List, Any
from app.models.chat import ChatMessage

logger = logging.getLogger(__name__)

class ContextBuilder:
    """
    Handles formatting of chat sessions history and query rewriting.
    Ensures that follow-up questions are interpreted with contextual knowledge
    (such as previously discussed drug names or parameters).
    """

    def build_history_context(self, messages: List[ChatMessage], max_messages: int = 5) -> str:
        """
        Formats the last `max_messages` messages into a structured string context
        for LLM prompts or audit trails.
        """
        if not messages:
            return ""

        formatted_messages = []
        # Take the most recent messages (up to max_messages)
        recent_messages = messages[-max_messages:]
        
        for msg in recent_messages:
            role_label = "User" if msg.role.lower() == "user" else "Assistant"
            formatted_messages.append(f"{role_label}: {msg.content}")

        return "\n".join(formatted_messages)

    def rewrite_query(
        self, 
        query: str, 
        history_messages: List[ChatMessage], 
        llm_client: Any
    ) -> str:
        """
        Interprets follow-up queries by combining them with history and rewriting
        them into standalone queries. If the query does not depend on history,
        it returns the query as-is.
        """
        # Filter history to only include user and assistant messages
        valid_history = [
            msg for msg in history_messages 
            if msg.role.lower() in ("user", "assistant")
        ]

        if not valid_history:
            return query

        history_str = self.build_history_context(valid_history, max_messages=5)

        prompt = (
            "System: You are an expert clinical search assistant. Given the following conversation history and a follow-up query, "
            "determine if the follow-up query depends on the previous context (such as referring to a specific drug name, dosage, or symptom discussed earlier). "
            "If it does, rewrite the query to be a standalone, self-contained search query that includes all necessary context (such as the drug name). "
            "If it is already a standalone question or unrelated to the history, return the query exactly as it is.\n"
            "Do NOT answer the question. Only return the rewritten query.\n\n"
            "Conversation History:\n"
            f"{history_str}\n\n"
            f"Follow-up Query: {query}\n"
            "Standalone Query:"
        )

        try:
            llm_response = llm_client(
                prompt,
                max_tokens=128,
                temperature=0.0
            )

            # Extract the text response
            if isinstance(llm_response, dict):
                rewritten_query = llm_response["choices"][0]["text"].strip()
            else:
                rewritten_query = str(llm_response).strip()

            # Clean potential LLM prefix wrappers
            clean_prefixes = ["standalone query:", "rewritten query:", "query:", "standalone:"]
            for prefix in clean_prefixes:
                if rewritten_query.lower().startswith(prefix):
                    rewritten_query = rewritten_query[len(prefix):].strip()

            logger.info(f"Query rewritten: '{query}' -> '{rewritten_query}'")
            return rewritten_query if rewritten_query else query

        except Exception as e:
            logger.error(f"Failed to rewrite query: {e}. Returning original query.")
            return query

# Singleton instance
context_builder = ContextBuilder()
