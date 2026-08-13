from sqlalchemy import Column, BigInteger, Integer, String, ForeignKey
from app.db.database import Base


class Citation(Base):
    __tablename__ = "citations"

    citation_id = Column(BigInteger, primary_key=True, autoincrement=True)
    message_id = Column(BigInteger, ForeignKey("messages.message_id"), nullable=False)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    chunk_id = Column(BigInteger, ForeignKey("chunks.chunk_id"), nullable=False)
    page_no = Column(Integer)