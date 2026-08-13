from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.evidence import Citation

class ChatRequest(BaseModel):
    session_id: Optional[str] = Field(None, description="Active session ID, if continuing a conversation")
    document_ids: List[str] = Field(..., min_items=1, description="List of document IDs to restrict retrieval to")
    message: str = Field(..., min_length=1, description="User question or follow-up query")

class ChatResponse(BaseModel):
    message_id: str = Field(..., description="Unique message identifier")
    session_id: str = Field(..., description="Chat session identifier")
    answer: str = Field(..., description="Answer text grounded in retrieved evidence")
    grounded: bool = Field(True, description="Whether the answer is verified against retrieved evidence")
    evidence_count: int = Field(0, description="Number of evidence chunks retrieved and used")
    citations: List[Citation] = Field(default=[], description="List of verified citations referencing exact pages")

class MessageResponse(BaseModel):
    message_id: str
    session_id: str
    role: str = Field(..., description="Role: user, assistant, system")
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    session_id: str
    started_at: datetime
    summary: Optional[str] = None
    messages: Optional[List[MessageResponse]] = None

    class Config:
        from_attributes = True
