from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.db.database import Base

class Citation(Base):
    __tablename__ = "citations"

    citation_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String(36), ForeignKey("chat_messages.message_id", ondelete="CASCADE"), nullable=False)
    document_id = Column(String(36), nullable=False)
    document_name = Column(String(255), nullable=True)
    page_no = Column(Integer, nullable=False)
    chunk_id = Column(String(100), nullable=True)
    section = Column(String(255), nullable=True)

    message = relationship("ChatMessage", back_populates="citations")
