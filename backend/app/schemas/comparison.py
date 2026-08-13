from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from app.schemas.evidence import Citation

class ComparisonRequest(BaseModel):
    document_ids: List[str] = Field(..., min_items=2, description="List of document IDs to compare (minimum 2)")
    sections: Optional[List[str]] = Field(
        default=["INDICATIONS", "DOSAGE", "WARNINGS", "INTERACTIONS"],
        description="Specific sections to compare"
    )

class ComparisonCell(BaseModel):
    document_id: str
    document_name: str
    content: str = Field(..., description="Extracted section content summary or text")
    citations: List[Citation] = Field(default=[], description="Source citations backing the content")

class ComparisonRow(BaseModel):
    section_name: str = Field(..., description="The name of the section compared (e.g., DOSAGE)")
    cells: Dict[str, ComparisonCell] = Field(
        ...,
        description="Mapping of document_id to comparison cell content"
    )

class ComparisonResponse(BaseModel):
    document_ids: List[str]
    rows: List[ComparisonRow]
