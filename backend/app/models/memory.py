from datetime import datetime
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.database import Base


class UserMemory(Base):
    __tablename__ = "user_memories"

    memory_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        if "memory_id" not in kwargs:
            kwargs["memory_id"] = str(uuid.uuid4())
        super().__init__(**kwargs)
