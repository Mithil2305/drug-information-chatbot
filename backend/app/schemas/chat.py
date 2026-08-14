from datetime import datetime
from typing import List
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    document_ids: List[str] = []


class ChatResponse(BaseModel):
    message_id: str
    session_id: str
    answer: str
    grounded: bool
    evidence_count: int
    citations: list


class MessageResponse(BaseModel):
    message_id: str
    session_id: str
    role: str
    content: str
    timestamp: datetime


class SessionResponse(BaseModel):
    session_id: str
    started_at: datetime
    summary: str | None = None
    messages: List[MessageResponse] = []
