from pydantic import BaseModel, Field
from typing import Optional

class EvidenceChunk(BaseModel):
    chunk_id: str = Field(..., description="Unique identifier for the text chunk")
    document_id: str = Field(..., description="ID of the source document")
    document_name: str = Field(..., description="Name of the source document file")
    page_no: int = Field(..., description="Page number of the chunk in the PDF (1-indexed)")
    section: Optional[str] = Field(None, description="Document section header containing the text")
    text: str = Field(..., description="The textual content of the chunk")
    score: Optional[float] = Field(None, description="Similarity score from semantic retrieval")

class Citation(BaseModel):
    document_id: str = Field(..., description="ID of the cited document")
    document_name: str = Field(..., description="Name of the cited document file")
    page: int = Field(..., description="Exact page number of the citation")
    section: Optional[str] = Field(None, description="Section of the citation")
    chunk_id: Optional[str] = Field(None, description="Optional referenced chunk ID")
