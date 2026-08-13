import os
import uuid
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db_session
from app.models.document import Document
from app.schemas.document import (
    DocumentUploadResponse,
    DocumentResponse,
    DocumentProcessResponse
)
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(tags=["documents"])

# Ensure local upload directory exists as a fallback
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def simulate_processing_task(document_id: str, db_session_factory):
    """
    Simulated background task to process document extraction, quality check,
    OCR fallback, chunking, embedding, and indexing.
    """
    logger.info(f"Starting background processing for document: {document_id}")
    
    # We open a separate session since this runs as a background task
    async for db in db_session_factory():
        try:
            # 1. Update status to processing
            result = await db.execute(select(Document).filter(Document.document_id == document_id))
            doc = result.scalar_one_or_none()
            if not doc:
                logger.error(f"Document {document_id} not found in DB.")
                return

            doc.status = "processing"
            await db.commit()
            
            # TODO: Integrate PyMuPDF / PaddleOCR extraction and Qdrant indexing
            # 2. Simulate success
            doc.status = "completed"
            await db.commit()
            logger.info(f"Completed background processing for document: {document_id}")
        except Exception as e:
            logger.error(f"Error processing document {document_id}: {str(e)}")
            try:
                result = await db.execute(select(Document).filter(Document.document_id == document_id))
                doc = result.scalar_one_or_none()
                if doc:
                    doc.status = "failed"
                    await db.commit()
            except Exception:
                pass
        break

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    source: str = None,
    version: str = "1.0",
    db: AsyncSession = Depends(get_db_session)
):
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are supported."
        )

    # Validate size (read header content-length if present, or limit manually during read)
    file_size_mb = 0
    # Create unique storage key
    doc_id = str(uuid.uuid4())
    storage_key = f"documents/{doc_id}_{file.filename}"
    local_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")

    # Save file content (either to local disk or simulated R2)
    try:
        content = await file.read()
        file_size_mb = len(content) / (1024 * 1024)
        if file_size_mb > settings.MAX_UPLOAD_SIZE_MB:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )
        
        with open(local_path, "wb") as f:
            f.write(content)
            
        # TODO: Upload to Cloudflare R2 if configured
        if settings.R2_ENDPOINT_URL:
            logger.info(f"Uploading {file.filename} to Cloudflare R2: {storage_key}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to write file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file content: {str(e)}"
        )

    # Save record in database
    new_doc = Document(
        document_id=doc_id,
        file_name=file.filename,
        storage_key=storage_key,
        source=source or file.filename.rsplit(".", 1)[0],
        version=version,
        status="uploaded"
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)

    # Trigger background ingestion process
    background_tasks.add_task(simulate_processing_task, doc_id, get_db_session)

    return DocumentUploadResponse(
        document=DocumentResponse.model_validate(new_doc),
        message="Document uploaded successfully. Processing started in background."
    )

@router.get("", response_model=List[DocumentResponse])
async def list_documents(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(Document))
    documents = result.scalars().all()
    return [DocumentResponse.model_validate(doc) for doc in documents]

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(Document).filter(Document.document_id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )
    return DocumentResponse.model_validate(doc)

@router.post("/{document_id}/process", response_model=DocumentProcessResponse)
async def process_document(
    document_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db_session)
):
    result = await db.execute(select(Document).filter(Document.document_id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    # Force reset status
    doc.status = "uploaded"
    await db.commit()
    await db.refresh(doc)

    # Re-trigger background process
    background_tasks.add_task(simulate_processing_task, document_id, get_db_session)

    return DocumentProcessResponse(
        document_id=document_id,
        job_id=str(uuid.uuid4()),
        stage="extraction",
        status="uploaded",
        message="Document reprocessing pipeline triggered."
    )
