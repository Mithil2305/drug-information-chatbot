import os
import uuid
import logging
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    BackgroundTasks,
    status
)
from fastapi.responses import FileResponse

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db_session

from app.models.document import Document
from app.models.document_page import DocumentPage

from app.schemas.document import (
    DocumentUploadResponse,
    DocumentResponse,
    DocumentProcessResponse,
    DocumentUpdate,
    DocumentStatusResponse,
)

from app.services.pdf.extractor import extract_pdf_pages
from app.services.chunking.chunker import create_chunks

from app.core.config import settings


logger = logging.getLogger(__name__)

router = APIRouter(tags=["documents"])


# =====================================================
# UPLOAD DIRECTORY
# =====================================================

UPLOAD_DIR = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.dirname(__file__)
            )
        )
    ),
    "data",
    "uploads"
)

os.makedirs(UPLOAD_DIR, exist_ok=True)


# =====================================================
# BACKGROUND PROCESSING
# =====================================================

async def simulate_processing_task(
    document_id: str,
    db_session_factory
):
    """
    Process document:

    PDF
      ↓
    Extract pages
      ↓
    Save document_pages
      ↓
    Create chunks
      ↓
    Mark document completed
    """

    logger.info(
        f"Starting background processing for document: {document_id}"
    )

    async for db in db_session_factory():

        try:

            # -----------------------------------------
            # 1. Find document
            # -----------------------------------------

            result = await db.execute(
                select(Document).filter(
                    Document.document_id == document_id
                )
            )

            doc = result.scalar_one_or_none()

            if not doc:
                logger.error(
                    f"Document {document_id} not found in DB."
                )
                return


            # -----------------------------------------
            # 2. Update status
            # -----------------------------------------

            doc.status = "processing"

            await db.commit()


            # -----------------------------------------
            # 3. Find uploaded PDF
            # -----------------------------------------

            file_path = os.path.join(
                UPLOAD_DIR,
                f"{document_id}_{doc.file_name}"
            )

            logger.info(
                f"Reading PDF from: {file_path}"
            )

            if not os.path.exists(file_path):

                raise FileNotFoundError(
                    f"PDF file not found: {file_path}"
                )


            # -----------------------------------------
            # 4. Extract PDF pages
            # -----------------------------------------

            pages = extract_pdf_pages(file_path)

            if not pages:

                raise ValueError(
                    "No pages were extracted from the PDF."
                )

            logger.info(
                f"Extracted {len(pages)} pages."
            )


            # -----------------------------------------
            # 5. Remove old page records
            # -----------------------------------------

            old_pages_result = await db.execute(
                select(DocumentPage).filter(
                    DocumentPage.document_id == document_id
                )
            )

            old_pages = old_pages_result.scalars().all()

            for old_page in old_pages:

                await db.delete(old_page)

            await db.flush()


            # -----------------------------------------
            # 6. Save extracted pages
            # -----------------------------------------

            for page in pages:

                document_page = DocumentPage(
                    document_id=document_id,
                    page_no=page["page_no"],
                    extraction_method=page["extraction_method"],
                    quality_score=page.get("quality_score", 1.0),
                    text_ref=page["text"]
                )

                db.add(document_page)

            await db.commit()


            logger.info(
                f"Saved {len(pages)} document pages "
                f"for document {document_id}"
            )


            # -----------------------------------------
            # 7. Create chunks
            # -----------------------------------------

            chunk_count = await create_chunks(
                document_id,
                db
            )

            logger.info(
                f"Created {chunk_count} chunks "
                f"for document {document_id}"
            )


            # -----------------------------------------
            # 8. Mark document completed
            # -----------------------------------------

            doc.status = "completed"

            await db.commit()

            logger.info(
                f"Completed processing for document: "
                f"{document_id}"
            )


        except Exception as e:

            logger.error(
                f"Error processing document "
                f"{document_id}: {str(e)}"
            )


            # -----------------------------------------
            # Mark document as failed
            # -----------------------------------------

            try:

                await db.rollback()

                result = await db.execute(
                    select(Document).filter(
                        Document.document_id == document_id
                    )
                )

                doc = result.scalar_one_or_none()

                if doc:

                    doc.status = "failed"

                    await db.commit()

            except Exception:

                await db.rollback()


        break


# =====================================================
# UPLOAD DOCUMENT
# =====================================================

@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED
)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    source: str = None,
    version: str = "1.0",
    db: AsyncSession = Depends(get_db_session)
):

    # -----------------------------------------
    # 1. Validate file format
    # -----------------------------------------

    allowed_extensions = (".pdf", ".docx", ".doc")
    if not file.filename.lower().endswith(allowed_extensions):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF, DOCX, and DOC files are supported."
        )


    # -----------------------------------------
    # 2. Create document ID
    # -----------------------------------------

    doc_id = str(uuid.uuid4())

    storage_key = (
        f"documents/{doc_id}_{file.filename}"
    )

    local_path = os.path.join(
        UPLOAD_DIR,
        f"{doc_id}_{file.filename}"
    )


    # -----------------------------------------
    # 3. Save PDF
    # -----------------------------------------

    try:

        content = await file.read()

        file_size_mb = (
            len(content) / (1024 * 1024)
        )


        if file_size_mb > settings.MAX_UPLOAD_SIZE_MB:

            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    f"File exceeds maximum allowed size of "
                    f"{settings.MAX_UPLOAD_SIZE_MB}MB."
                )
            )


        with open(local_path, "wb") as f:

            f.write(content)


        logger.info(
            f"Saved PDF to: {local_path}"
        )


        # -----------------------------------------
        # Cloudflare R2
        # -----------------------------------------

        if settings.R2_ENDPOINT_URL:

            logger.info(
                f"Uploading {file.filename} "
                f"to Cloudflare R2: {storage_key}"
            )


    except HTTPException:

        raise


    except Exception as e:

        logger.error(
            f"Failed to write file: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file content: {str(e)}"
        )


    # -----------------------------------------
    # 4. Save document record
    # -----------------------------------------

    new_doc = Document(
        document_id=doc_id,
        file_name=file.filename,
        storage_key=storage_key,
        source=(
            source
            or file.filename.rsplit(".", 1)[0]
        ),
        version=version,
        status="uploaded"
    )

    db.add(new_doc)

    await db.commit()

    await db.refresh(new_doc)

    new_doc.file_size = len(content)
    new_doc.page_count = 0

    # -----------------------------------------
    # 5. Start processing
    # -----------------------------------------

    background_tasks.add_task(
        simulate_processing_task,
        doc_id,
        get_db_session
    )


    # -----------------------------------------
    # 6. Return response
    # -----------------------------------------

    return DocumentUploadResponse(
        document=DocumentResponse.model_validate(new_doc),
        message=(
            "Document uploaded successfully. "
            "Processing started in background."
        )
    )


# =====================================================
# LIST DOCUMENTS
# =====================================================

@router.get(
    "",
    response_model=List[DocumentResponse]
)
async def list_documents(
    db: AsyncSession = Depends(get_db_session)
):

    result = await db.execute(
        select(Document)
    )

    documents = result.scalars().all()

    from sqlalchemy import func
    page_counts_result = await db.execute(
        select(DocumentPage.document_id, func.count(DocumentPage.page_no))
        .group_by(DocumentPage.document_id)
    )
    page_counts = {doc_id: count for doc_id, count in page_counts_result.all()}

    for doc in documents:
        doc.page_count = page_counts.get(doc.document_id, 0)
        file_path = os.path.join(UPLOAD_DIR, f"{doc.document_id}_{doc.file_name}")
        doc.file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0

    return [
        DocumentResponse.model_validate(doc)
        for doc in documents
    ]


# =====================================================
# GET SINGLE DOCUMENT
# =====================================================

@router.get(
    "/{document_id}",
    response_model=DocumentResponse
)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db_session)
):

    result = await db.execute(
        select(Document).filter(
            Document.document_id == document_id
        )
    )

    doc = result.scalar_one_or_none()

    if not doc:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    from sqlalchemy import func
    page_count_result = await db.execute(
        select(func.count(DocumentPage.page_no))
        .where(DocumentPage.document_id == document_id)
    )
    doc.page_count = page_count_result.scalar() or 0
    file_path = os.path.join(UPLOAD_DIR, f"{doc.document_id}_{doc.file_name}")
    doc.file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0

    return DocumentResponse.model_validate(doc)


# =====================================================
# PROCESS / REPROCESS DOCUMENT
# =====================================================

@router.post(
    "/{document_id}/process",
    response_model=DocumentProcessResponse
)
async def process_document(
    document_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db_session)
):

    # -----------------------------------------
    # 1. Find document
    # -----------------------------------------

    result = await db.execute(
        select(Document).filter(
            Document.document_id == document_id
        )
    )

    doc = result.scalar_one_or_none()

    if not doc:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )


    # -----------------------------------------
    # 2. Reset status
    # -----------------------------------------

    doc.status = "uploaded"

    await db.commit()

    await db.refresh(doc)


    # -----------------------------------------
    # 3. Start processing
    # -----------------------------------------

    background_tasks.add_task(
        simulate_processing_task,
        document_id,
        get_db_session
    )


    # -----------------------------------------
    # 4. Return response
    # -----------------------------------------

    return DocumentProcessResponse(
        document_id=document_id,
        job_id=str(uuid.uuid4()),
        stage="extraction",
        status="uploaded",
        message="Document reprocessing pipeline triggered."
    )


# =====================================================
# DELETE DOCUMENT
# =====================================================

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_db_session)
):
    # 1. Find document
    result = await db.execute(
        select(Document).filter(
            Document.document_id == document_id
        )
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    # 2. Delete related records
    from app.models.chunk import Chunk
    from app.models.citation import Citation
    from app.models.document_page import DocumentPage
    from app.repositories.qdrant_repository import qdrant_repository

    # Delete chunks from Qdrant vector database
    try:
        await qdrant_repository.delete_document_chunks(document_id)
    except Exception as e:
        logger.error(f"Failed to delete Qdrant chunks for document {document_id}: {e}")

    await db.execute(
        delete(Chunk).where(Chunk.document_id == document_id)
    )
    await db.execute(
        delete(DocumentPage).where(DocumentPage.document_id == document_id)
    )
    await db.execute(
        delete(Citation).where(Citation.document_id == document_id)
    )

    # 3. Delete document
    await db.delete(doc)
    await db.commit()
    return


# =====================================================
# UPDATE DOCUMENT METADATA
# =====================================================

@router.patch(
    "/{document_id}",
    response_model=DocumentResponse
)
async def update_document(
    document_id: str,
    update: DocumentUpdate,
    db: AsyncSession = Depends(get_db_session)
):
    result = await db.execute(
        select(Document).filter(Document.document_id == document_id)
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    if update.source is not None:
        doc.source = update.source
    if update.version is not None:
        doc.version = update.version
    if update.file_name is not None:
        doc.file_name = update.file_name

    await db.commit()
    await db.refresh(doc)

    from sqlalchemy import func
    page_count_result = await db.execute(
        select(func.count(DocumentPage.page_no))
        .where(DocumentPage.document_id == document_id)
    )
    doc.page_count = page_count_result.scalar() or 0
    file_path = os.path.join(UPLOAD_DIR, f"{doc.document_id}_{doc.file_name}")
    doc.file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0

    return DocumentResponse.model_validate(doc)


# =====================================================
# GET DOCUMENT STATUS
# =====================================================

@router.get(
    "/{document_id}/status",
    response_model=DocumentStatusResponse
)
async def get_document_status(
    document_id: str,
    db: AsyncSession = Depends(get_db_session)
):
    result = await db.execute(
        select(Document).filter(Document.document_id == document_id)
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    return DocumentStatusResponse(
        document_id=doc.document_id,
        status=doc.status,
        stage=doc.status,
        message=f"Document is currently {doc.status}."
    )


# =====================================================
# VIEW / DOWNLOAD PDF
# =====================================================

@router.get("/{document_id}/view")
async def view_document(
    document_id: str,
    db: AsyncSession = Depends(get_db_session)
):
    result = await db.execute(
        select(Document).filter(Document.document_id == document_id)
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        f"{document_id}_{doc.file_name}"
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF file not found on disk."
        )

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=doc.file_name
    )