from sqlalchemy import Column, String, DateTime
from datetime import datetime
import uuid
from app.db.database import Base

class Document(Base):
    __tablename__ = "documents"

    document_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    file_name = Column(String(255), nullable=False)
    storage_key = Column(String(512), nullable=False)
    source = Column(String(255), nullable=True)
    version = Column(String(50), nullable=True, default="1.0")
    status = Column(String(50), nullable=False, default="uploaded")  # uploaded, processing, completed, failed, inactive
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)
