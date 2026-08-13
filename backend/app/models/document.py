from sqlalchemy import Column, String, DateTime, Boolean, func
from app.db.database import Base


class Document(Base):
    __tablename__ = "documents"

    document_id = Column(String(36), primary_key=True)
    file_name = Column(String(255), nullable=False)
    storage_key = Column(String(512), nullable=False)
    source = Column(String(255))
    version = Column(String(100))
    status = Column(String(50))
    created_at = Column(DateTime, server_default=func.current_timestamp())
    is_active = Column(Boolean, default=True)