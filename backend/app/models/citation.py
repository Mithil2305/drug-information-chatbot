from sqlalchemy import Column, BigInteger, Integer, String, ForeignKey
from app.db.database import Base


class Citation(Base):
    __tablename__ = "citations"

    citation_id = Column(String(100), primary_key=True)
    message_id = Column(BigInteger, ForeignKey("messages.message_id"), nullable=False)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    chunk_id = Column(String(100), nullable=True)
    document_name = Column(String(255), nullable=True)
    section = Column(String(255), nullable=True)
    page_no = Column(Integer)
