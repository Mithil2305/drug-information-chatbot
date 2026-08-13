import logging
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db_session
from app.models.chat import ChatSession, ChatMessage
from app.models.citation import Citation as CitationModel
from app.models.document import Document
from app.schemas.chat import ChatRequest, ChatResponse, SessionResponse, MessageResponse
from app.schemas.evidence import Citation
from app.dependencies.embeddings import get_embedding_model
from app.dependencies.qdrant import get_qdrant_client
from app.dependencies.llm import get_llm_client

try:
    from app.config import settings
except ImportError:
    from app.core.config import settings


logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])
sessions_router = APIRouter(tags=["sessions"])


async def mock_evidence_retrieval(
    query: str,
    document_ids: List[str],
    db: AsyncSession
) -> List[Dict[str, Any]]:

    retrieved = []

    result = await db.execute(
        select(Document).filter(
            Document.document_id.in_(document_ids)
        )
    )

    docs = result.scalars().all()

    doc_map = {
        doc.document_id: doc.file_name
        for doc in docs
    }

    for doc_id, doc_name in doc_map.items():

        if "rinvoq" in doc_name.lower():

            if "dosage" in query.lower() or "dose" in query.lower():

                retrieved.append({
                    "chunk_id": "chunk-rinvoq-dosage",
                    "document_id": doc_id,
                    "document_name": doc_name,
                    "page_no": 12,
                    "section": "Dosage and Administration",
                    "text": "The recommended dosage of RINVOQ is 15 mg once daily for moderate to severe rheumatoid arthritis.",
                    "score": 0.89
                })

            elif "warning" in query.lower() or "adverse" in query.lower():

                retrieved.append({
                    "chunk_id": "chunk-rinvoq-warning",
                    "document_id": doc_id,
                    "document_name": doc_name,
                    "page_no": 18,
                    "section": "Warnings and Precautions",
                    "text": "RINVOQ has boxed warnings for serious infections, mortality, malignancy, major adverse cardiovascular events (MACE), and thrombosis.",
                    "score": 0.92
                })

    return retrieved


@router.post("", response_model=ChatResponse)
async def post_chat_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db_session),
    embedding_model: Any = Depends(get_embedding_model),
    qdrant_client: Any = Depends(get_qdrant_client),
    llm_client: Any = Depends(get_llm_client)
):

    # ---------------------------------------------------------
    # 1. Get existing session
    # ---------------------------------------------------------

    if not request.session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="session_id is required."
        )

    try:
        session_id = int(request.session_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="session_id must be a valid number."
        )

    result = await db.execute(
        select(ChatSession).filter(
            ChatSession.session_id == session_id
        )
    )

    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found."
        )

    # ---------------------------------------------------------
    # 2. Retrieve evidence from Qdrant
    # ---------------------------------------------------------

    evidence_chunks = []

    try:

        query_vector = embedding_model.encode(request.message)

        from qdrant_client.http import models as qmodels

        search_result = await qdrant_client.search(
            collection_name=settings.QDRANT_COLLECTION,
            query_vector=query_vector,
            limit=settings.TOP_K,
            query_filter=qmodels.Filter(
                must=[
                    qmodels.FieldCondition(
                        key="document_id",
                        match=qmodels.MatchAny(
                            any=request.document_ids
                        )
                    )
                ]
            )
        )

        for point in search_result:

            if point.score >= settings.MIN_RELEVANCE_SCORE:

                evidence_chunks.append({
                    "chunk_id": point.payload.get(
                        "chunk_id",
                        str(point.id)
                    ),
                    "document_id": point.payload.get(
                        "document_id"
                    ),
                    "document_name": point.payload.get(
                        "document_name"
                    ),
                    "page_no": point.payload.get(
                        "page_no"
                    ),
                    "section": point.payload.get(
                        "section"
                    ),
                    "text": point.payload.get(
                        "text"
                    ),
                    "score": point.score
                })

    except Exception as e:

        logger.warning(
            f"Qdrant query failed: {e}. "
            "Using mock retrieval."
        )

        evidence_chunks = await mock_evidence_retrieval(
            request.message,
            request.document_ids,
            db
        )

    # ---------------------------------------------------------
    # 3. Safe abstention
    # ---------------------------------------------------------

    if not evidence_chunks:

        abstaining_answer = (
            "I couldn't find sufficient information "
            "in the provided document. I don't want to guess."
        )

        user_msg = ChatMessage(
            session_id=session_id,
            role="user",
            content=request.message
        )

        assistant_msg = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=abstaining_answer
        )

        db.add(user_msg)
        db.add(assistant_msg)

        await db.commit()

        await db.refresh(assistant_msg)

        return ChatResponse(
            message_id=str(assistant_msg.message_id),
session_id=str(session_id),
            answer=abstaining_answer,
            grounded=False,
            evidence_count=0,
            citations=[]
        )

    # ---------------------------------------------------------
    # 4. Build grounded prompt
    # ---------------------------------------------------------

    context_str = "\n\n".join(
        [
            f"Document: {chunk['document_name']} "
            f"(Page {chunk['page_no']}, "
            f"Section: {chunk['section']})\n"
            f"Text: {chunk['text']}"
            for chunk in evidence_chunks
        ]
    )

    prompt = (
        "System: You are LabelProof, a clinical assistant. "
        "Answer the question using ONLY the provided evidence. "
        "Do not use external knowledge or guess. "
        "If the answer is not in the text, abstain.\n\n"
        f"Evidence:\n{context_str}\n\n"
        f"Question: {request.message}\n"
        "Answer:"
    )

    # ---------------------------------------------------------
    # 5. Call LLM
    # ---------------------------------------------------------

    try:

        llm_response = llm_client(
            prompt,
            max_tokens=512
        )

        if isinstance(llm_response, dict):

            answer_text = (
                llm_response["choices"][0]["text"]
                .strip()
            )

        else:

            answer_text = str(
                llm_response
            ).strip()

    except Exception as e:

        logger.error(
            f"LLM call failed: {e}"
        )

        answer_text = (
            "[Error calling generation engine. "
            "Try again later.]"
        )

    # ---------------------------------------------------------
    # 6. Build citations
    # ---------------------------------------------------------

    citations = []

    for chunk in evidence_chunks:

        citations.append(
            Citation(
                document_id=chunk["document_id"],
                document_name=chunk["document_name"],
                page=chunk["page_no"],
                section=chunk["section"],
                chunk_id=chunk["chunk_id"]
            )
        )

    # ---------------------------------------------------------
    # 7. Save user message
    # ---------------------------------------------------------

    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        content=request.message
    )

    # ---------------------------------------------------------
    # 8. Save assistant message
    # ---------------------------------------------------------

    assistant_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=answer_text
    )

    db.add(user_msg)
    db.add(assistant_msg)

    await db.flush()

    # ---------------------------------------------------------
    # 9. Save citations
    # ---------------------------------------------------------

    for cit in citations:

        db.add(
            CitationModel(
                citation_id=str(cit.chunk_id),
                message_id=assistant_msg.message_id,
                document_id=cit.document_id,
                document_name=cit.document_name,
                page_no=cit.page,
                chunk_id=cit.chunk_id,
                section=cit.section
            )
        )

    await db.commit()

    await db.refresh(assistant_msg)

    # ---------------------------------------------------------
    # 10. Return response
    # ---------------------------------------------------------

    return ChatResponse(
        message_id=str(assistant_msg.message_id),
        session_id=str(session_id),
        answer=answer_text,
        grounded=True,
        evidence_count=len(evidence_chunks),
        citations=citations
    )


# =============================================================
# GET CHAT SESSION
# =============================================================

@sessions_router.get(
    "/{session_id}",
    response_model=SessionResponse
)
async def get_chat_session(
    session_id: int,
    db: AsyncSession = Depends(get_db_session)
):

    result = await db.execute(
        select(ChatSession).filter(
            ChatSession.session_id == session_id
        )
    )

    session = result.scalar_one_or_none()

    if not session:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found."
        )

    return SessionResponse(
        session_id=session.session_id,
        started_at=session.started_at,
        summary=session.summary,
        messages=[
            MessageResponse(
                message_id=msg.message_id,
                session_id=msg.session_id,
                role=msg.role,
                content=msg.content,
                timestamp=msg.created_at
            )
            for msg in session.messages
        ]
    )


# =============================================================
# GET SESSION MESSAGES
# =============================================================

@sessions_router.get(
    "/{session_id}/messages",
    response_model=List[MessageResponse]
)
async def get_session_messages(
    session_id: int,
    db: AsyncSession = Depends(get_db_session)
):

    result = await db.execute(
        select(ChatSession).filter(
            ChatSession.session_id == session_id
        )
    )

    session = result.scalar_one_or_none()

    if not session:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found."
        )

    return [
        MessageResponse(
            message_id=msg.message_id,
            session_id=msg.session_id,
            role=msg.role,
            content=msg.content,
            timestamp=msg.created_at
        )
        for msg in session.messages
    ]