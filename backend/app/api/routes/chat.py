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
from app.dependencies.auth import get_current_user
from app.models.user import User

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
    from app.services.chat.conversation import conversation_service
    return await conversation_service.process_message(
        db=db,
        request=request,
        embedding_model=embedding_model,
        qdrant_client=qdrant_client,
        llm_client=llm_client
    )


# =============================================================
# CREATE CHAT SESSION
# =============================================================

@sessions_router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_session(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    new_session = ChatSession(
        user_id=current_user.user_id,
        summary="New Chat"
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    return SessionResponse(
        session_id=str(new_session.session_id),
        started_at=new_session.started_at,
        summary=new_session.summary,
        messages=[]
    )


# =============================================================
# LIST CHAT SESSIONS
# =============================================================

@sessions_router.get("", response_model=List[SessionResponse])
async def list_chat_sessions(
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ChatSession)
        .filter(ChatSession.user_id == current_user.user_id)
        .order_by(ChatSession.started_at.desc())
    )
    sessions = result.scalars().all()
    
    return [
        SessionResponse(
            session_id=str(session.session_id),
            started_at=session.started_at,
            summary=session.summary,
            messages=[
                MessageResponse(
                    message_id=str(msg.message_id),
                    session_id=str(msg.session_id),
                    role=msg.role,
                    content=msg.content,
                    timestamp=msg.created_at,
                    citations=[
                        Citation(
                            document_id=cit.document_id,
                            document_name=cit.document_name or "Unknown Document",
                            page=cit.page_no,
                            section=cit.section,
                            chunk_id=cit.chunk_id
                        )
                        for cit in msg.citations
                    ]
                )
                for msg in session.messages
            ]
        )
        for session in sessions
    ]


# =============================================================
# DELETE CHAT SESSION
# =============================================================

@sessions_router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_session(
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
    await db.delete(session)
    await db.commit()
    return


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
        session_id=str(session.session_id),
        started_at=session.started_at,
        summary=session.summary,
        messages=[
            MessageResponse(
                message_id=str(msg.message_id),
                session_id=str(msg.session_id),
                role=msg.role,
                content=msg.content,
                timestamp=msg.created_at,
                citations=[
                    Citation(
                        document_id=cit.document_id,
                        document_name=cit.document_name or "Unknown Document",
                        page=cit.page_no,
                        section=cit.section,
                        chunk_id=cit.chunk_id
                    )
                    for cit in msg.citations
                ]
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
            message_id=str(msg.message_id),
            session_id=str(msg.session_id),
            role=msg.role,
            content=msg.content,
            timestamp=msg.created_at,
            citations=[
                Citation(
                    document_id=cit.document_id,
                    document_name=cit.document_name or "Unknown Document",
                    page=cit.page_no,
                    section=cit.section,
                    chunk_id=cit.chunk_id
                )
                for cit in msg.citations
            ]
        )
        for msg in session.messages
    ]