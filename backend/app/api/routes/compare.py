import logging
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db_session
from app.models.document import Document
from app.schemas.comparison import ComparisonRequest, ComparisonResponse, ComparisonRow, ComparisonCell
from app.schemas.evidence import Citation
from app.dependencies.embeddings import get_embedding_model
from app.dependencies.qdrant import get_qdrant_client

logger = logging.getLogger(__name__)
router = APIRouter(tags=["compare"])

@router.post("", response_model=ComparisonResponse)
async def compare_documents(
    request: ComparisonRequest,
    db: AsyncSession = Depends(get_db_session),
    embedding_model: Any = Depends(get_embedding_model),
    qdrant_client: Any = Depends(get_qdrant_client)
):
    # 1. Validate documents exist
    result = await db.execute(select(Document).filter(Document.document_id.in_(request.document_ids)))
    documents = result.scalars().all()
    doc_map = {doc.document_id: doc for doc in documents}
    
    if len(doc_map) < len(request.document_ids):
        missing = set(request.document_ids) - set(doc_map.keys())
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Some documents were not found: {list(missing)}"
        )

    # 2. Build compare table rows
    rows: List[ComparisonRow] = []
    
    # We compare specified sections
    for section in request.sections:
        cells: Dict[str, ComparisonCell] = {}
        
        for doc_id in request.document_ids:
            doc = doc_map[doc_id]
            
            # TODO: Query Qdrant for semantic match regarding this specific section
            # e.g., Vector query with embedding of: "indications of [drug]" filtered by document_id
            # For now, we simulate extraction / mock data for comparison view
            
            content_text = ""
            citations = []
            
            # Simple simulation content based on typical drug label info
            if section.upper() == "INDICATIONS":
                if "rinvoq" in doc.file_name.lower():
                    content_text = "Treatment of moderately to severely active rheumatoid arthritis, psoriatic arthritis, atopic dermatitis."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=1, section="Indications and Usage"))
                elif "skyrizi" in doc.file_name.lower():
                    content_text = "Treatment of moderate-to-severe plaque psoriasis, active psoriatic arthritis, Crohn's disease."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=1, section="Indications and Usage"))
                else:
                    content_text = f"Approved therapeutic indications as described in {doc.file_name}."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=1, section="Indications"))
            
            elif section.upper() == "DOSAGE":
                if "rinvoq" in doc.file_name.lower():
                    content_text = "15 mg once daily. Dose adjustments apply for specific conditions."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=2, section="Dosage and Administration"))
                elif "skyrizi" in doc.file_name.lower():
                    content_text = "150 mg administered by subcutaneous injection at Week 0, Week 4, and every 12 weeks thereafter."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=2, section="Dosage and Administration"))
                else:
                    content_text = "Recommended dosage regimens as defined in source documentation."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=2, section="Dosage"))
                    
            elif section.upper() == "WARNINGS":
                if "rinvoq" in doc.file_name.lower():
                    content_text = "Boxed warnings for serious infections, malignancy, major adverse cardiovascular events (MACE), thrombosis."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=5, section="Warnings and Precautions"))
                elif "skyrizi" in doc.file_name.lower():
                    content_text = "Hypersensitivity reactions, serious infections, pre-treatment evaluation for tuberculosis."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=4, section="Warnings and Precautions"))
                else:
                    content_text = "Safety alerts, warnings, and precautions."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=3, section="Warnings"))

            else:  # INTERACTIONS / default
                if "rinvoq" in doc.file_name.lower():
                    content_text = "Avoid strong CYP3A4 inhibitors/inducers, monitor immunosuppressants."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=8, section="Drug Interactions"))
                elif "skyrizi" in doc.file_name.lower():
                    content_text = "No clinically significant interactions identified; evaluate live vaccine timing."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=7, section="Drug Interactions"))
                else:
                    content_text = "Drug interaction profile as described in section."
                    citations.append(Citation(document_id=doc_id, document_name=doc.file_name, page=5, section="Interactions"))

            cells[doc_id] = ComparisonCell(
                document_id=doc_id,
                document_name=doc.file_name,
                content=content_text,
                citations=citations
            )
            
        rows.append(ComparisonRow(
            section_name=section.upper(),
            cells=cells
        ))
        
    return ComparisonResponse(
        document_ids=request.document_ids,
        rows=rows
    )
# Simple Any-typing imports helper for fast compilation
from typing import Any
