from pydantic import BaseModel


class Citation(BaseModel):
    citation_id: str | None = None
    document_id: str
    document_name: str
    page: int
    section: str | None = None
    chunk_id: str
    text: str | None = None
    score: float | None = None
