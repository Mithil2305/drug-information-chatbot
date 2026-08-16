import pytest
from datetime import datetime
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import HTTPException
from app.services.chat.query_router import QueryRouter
from app.services.chat.context_builder import ContextBuilder
from app.services.chat.conversation import ConversationService
from app.models.chat import ChatSession, ChatMessage
from app.models.document import Document
from app.schemas.chat import ChatRequest
from app.schemas.evidence import Citation


# =====================================================================
# QUERY ROUTER TESTS
# =====================================================================

def test_query_router_classification():
    router = QueryRouter()
    
    # Test dosage keywords
    assert router.route_query("What is the dose for arthritis?") == "dosage"
    assert router.route_query("dosing frequency of Rinvoq") == "dosage"
    
    # Test warnings keywords
    assert router.route_query("any boxed warning or serious risk?") == "warnings"
    
    # Test storage
    assert router.route_query("how should I store the drug at room temperature?") == "storage"
    
    # Test pregnancy
    assert router.route_query("is it safe for pregnant or breastfeeding women?") == "pregnancy"
    
    # Test comparison
    assert router.route_query("compare Rinvoq vs Skyrizi") == "comparison"
    
    # Test unsupported default
    assert router.route_query("hello, how are you?") == "unsupported"


def test_query_router_boosting():
    router = QueryRouter()
    
    # Sample retrieved chunks
    chunks = [
        {"chunk_id": "c1", "section": "Dosage and Administration", "score": 0.8},
        {"chunk_id": "c2", "section": "Warnings and Precautions", "score": 0.9},
        {"chunk_id": "c3", "section": "Description", "score": 0.5}
    ]
    
    # Boosting for dosage category should boost c1
    boosted = router.boost_sections(chunks, "dosage", boost_factor=1.2)
    
    c1_boosted = next(c for c in boosted if c["chunk_id"] == "c1")
    c2_boosted = next(c for c in boosted if c["chunk_id"] == "c2")
    
    # c1 score should be boosted (0.8 * 1.2 = 0.96)
    assert c1_boosted["score"] == pytest.approx(0.96)
    assert c1_boosted["boosted"] is True
    
    # c2 score should remain same (no change)
    assert c2_boosted["score"] == 0.9
    assert c2_boosted["boosted"] is False
    
    # Order should change because c1's score (0.96) is now higher than c2's (0.9)
    assert boosted[0]["chunk_id"] == "c1"


# =====================================================================
# CONTEXT BUILDER TESTS
# =====================================================================

def test_context_builder_build_history():
    builder = ContextBuilder()
    
    messages = [
        ChatMessage(role="user", content="Hi"),
        ChatMessage(role="assistant", content="Hello, how can I help?"),
        ChatMessage(role="user", content="What is Rinvoq?")
    ]
    
    history_str = builder.build_history_context(messages, max_messages=2)
    expected = "Assistant: Hello, how can I help?\nUser: What is Rinvoq?"
    assert history_str == expected


def test_context_builder_rewrite_query():
    builder = ContextBuilder()
    
    # Mock LLM Client
    mock_llm = MagicMock()
    mock_llm.return_value = {
        "choices": [{"text": "Standalone query: What is the dosage of Rinvoq for elderly patients?"}]
    }
    
    history = [
        ChatMessage(role="user", content="What is the dosage of Rinvoq?"),
        ChatMessage(role="assistant", content="The dosage of Rinvoq is 15 mg once daily.")
    ]
    
    rewritten = builder.rewrite_query("What about elderly patients?", history, mock_llm)
    
    # Check that LLM was called and context-rewriting clean-up stripped "Standalone query:" prefix
    assert rewritten == "What is the dosage of Rinvoq for elderly patients?"
    mock_llm.assert_called_once()


# =====================================================================
# CONVERSATION SERVICE TESTS
# =====================================================================

@pytest.mark.asyncio
@patch("app.services.chat.conversation.hybrid_search")
@patch("app.services.chat.conversation.safety_validator.validate_safety")
@patch("app.services.chat.conversation.evidence_validator.validate_evidence")
@patch("app.services.chat.conversation.claim_validator.validate_claims")
@patch("app.services.chat.conversation.citation_validator.validate_and_build_citations")
async def test_conversation_service_process_message_success(
    mock_validate_citations,
    mock_validate_claims,
    mock_validate_evidence,
    mock_validate_safety,
    mock_hybrid_search,
):
    service = ConversationService()
    
    # Mock parameters
    db = AsyncMock()
    embedding_model = MagicMock()
    qdrant_client = MagicMock()
    
    mock_llm = MagicMock()
    mock_llm.return_value = {
        "choices": [{"text": "The recommended dosage of Rinvoq is 15 mg once daily."}]
    }

    # Mock Session and messages
    session = ChatSession(session_id=1, user_id="u123", summary="Test session")
    session.messages = []
    
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = session
    db.execute.return_value = mock_result
    
    # Mock Hybrid Search
    mock_hybrid_search.return_value = [
        {
            "chunk_id": "chunk-123",
            "document_id": "doc-abc",
            "document_name": "Rinvoq.pdf",
            "page_no": 12,
            "section": "Dosage and Administration",
            "text": "The recommended dosage of Rinvoq is 15 mg once daily.",
            "score": 0.85
        }
    ]
    
    # Mock ProofChain Validators
    mock_validate_safety.return_value = {
        "safe": True,
        "cleaned_answer": "The recommended dosage of Rinvoq is 15 mg once daily.",
        "warnings": [],
        "safety_flags": {}
    }
    
    mock_validate_evidence.return_value = {
        "grounded": True,
        "claims": [],
        "unsupported_count": 0
    }
    
    mock_validate_claims.return_value = {
        "valid": True,
        "failed_checks": []
    }
    
    mock_validate_citations.return_value = (
        "The recommended dosage of Rinvoq is 15 mg once daily. [1]",
        [
            Citation(
                document_id="doc-abc",
                document_name="Rinvoq.pdf",
                page=12,
                section="Dosage and Administration",
                chunk_id="chunk-123"
            )
        ]
    )
    
    # Run
    request = ChatRequest(
        message="What is the dosage of Rinvoq?",
        session_id="1",
        document_ids=["doc-abc"]
    )
    
    response = await service.process_message(
        db=db,
        request=request,
        embedding_model=embedding_model,
        qdrant_client=qdrant_client,
        llm_client=mock_llm
    )
    
    # Asserts
    assert response.session_id == "1"
    assert "15 mg once daily" in response.answer
    assert response.grounded is True
    assert response.evidence_count == 1
    assert len(response.citations) == 1
    assert response.citations[0].chunk_id == "chunk-123"
    
    # Check db operations
    db.add.assert_called()
    db.commit.assert_called()
