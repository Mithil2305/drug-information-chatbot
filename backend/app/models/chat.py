from sqlalchemy import Column, BigInteger, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class ChatSession(Base):
    __tablename__ = "sessions"

    session_id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id"), nullable=False)
    started_at = Column(DateTime, server_default=func.current_timestamp())
    summary = Column(Text)

    # Establish relationship to messages
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "messages"

    message_id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(BigInteger, ForeignKey("sessions.session_id"), nullable=False)
    role = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.current_timestamp())

    # Inverse relationship to session
    session = relationship("ChatSession", back_populates="messages")