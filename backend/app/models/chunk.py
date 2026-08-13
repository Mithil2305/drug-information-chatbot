from sqlalchemy import Column, BigInteger, String, Integer, Text, ForeignKey
from app.db.database import Base


class Chunk(Base):
    __tablename__ = "chunks"

    chunk_id = Column(BigInteger, primary_key=True, autoincrement=True)

    document_id = Column(
        String(36),
        ForeignKey("documents.document_id"),
        nullable=False
    )

    page_no = Column(Integer)
    section = Column(String(255))
    chunk_index = Column(Integer)
    text_hash = Column(String(64))
    chunk_text = Column(Text)