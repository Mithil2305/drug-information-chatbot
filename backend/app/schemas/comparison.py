from pydantic import BaseModel
from typing import List, Dict
from app.schemas.evidence import Citation


class ComparisonRequest(BaseModel):
    document_ids: List[str]
    sections: List[str]


class ComparisonCell(BaseModel):
    document_id: str
    document_name: str
    content: str
    citations: List[Citation]


class ComparisonRow(BaseModel):
    section_name: str
    cells: Dict[str, ComparisonCell]


class ComparisonResponse(BaseModel):
    document_ids: List[str]
    rows: List[ComparisonRow]
