from pydantic import BaseModel


class Citation(BaseModel):
    document_id: str
    document_name: str
    page: int
    section: str | None = None
    chunk_id: str