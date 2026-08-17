from sqlalchemy import Column, BigInteger, String, Integer, Float, Text, ForeignKey
from app.db.database import Base

class DocumentPage(Base):
    __tablename__ = "document_pages"

    document_page_id = Column(BigInteger, primary_key=True, autoincrement=True)
    document_id = Column(
        String(36),
        ForeignKey("documents.document_id"),
        nullable=False
    )
    page_no = Column(Integer, nullable=False)
    extraction_method = Column(String(50))
    quality_score = Column(Float)
    text_ref = Column(Text)
