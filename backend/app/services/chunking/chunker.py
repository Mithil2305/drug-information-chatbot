import logging
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document_page import DocumentPage
from app.models.chunk import Chunk
from app.models.document import Document
from app.services.embeddings.embedding_service import embedding_service
from app.repositories.qdrant_repository import qdrant_repository

logger = logging.getLogger(__name__)

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


def split_text(text):
    text = text.strip()

    if not text:
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(text):
            break

        start = end - CHUNK_OVERLAP

    return chunks


async def create_chunks(
    document_id: str,
    db: AsyncSession
):
    """
    Chunk document page text, save chunks to MySQL, generate embeddings,
    and bulk index them into Qdrant vector database.
    """
    # 1. Fetch the Document record to get metadata (e.g. file_name)
    doc_result = await db.execute(
        select(Document).where(Document.document_id == document_id)
    )
    doc = doc_result.scalar_one_or_none()
    if not doc:
        logger.error(f"Document {document_id} not found in database.")
        return 0

    # 2. Get all extracted pages
    result = await db.execute(
        select(DocumentPage)
        .where(DocumentPage.document_id == document_id)
        .order_by(DocumentPage.page_no)
    )
    pages = result.scalars().all()

    if not pages:
        logger.warning(f"No pages found for document {document_id}.")
        return 0

    # 3. Clean up existing chunks in MySQL and Qdrant if reprocessing
    await db.execute(
        delete(Chunk).where(Chunk.document_id == document_id)
    )
    await qdrant_repository.delete_document_chunks(document_id)
    await db.flush()

    # 4. Perform text chunking on each page
    total_chunks = 0
    for page in pages:
        if not page.text_ref:
            continue

        page_chunks = split_text(page.text_ref)

        for index, text in enumerate(page_chunks):
            chunk = Chunk(
                document_id=document_id,
                page_no=page.page_no,
                section=None,  # Section detection will update this if applicable
                chunk_index=total_chunks,  # Unique sequential index across document
                text_hash=None,
                chunk_text=text
            )
            db.add(chunk)
            total_chunks += 1

    # Commit chunks to MySQL to generate auto-incrementing chunk_ids
    await db.commit()

    if total_chunks == 0:
        return 0

    # 5. Retrieve committed chunks from MySQL to get populated chunk_ids
    chunks_result = await db.execute(
        select(Chunk)
        .where(Chunk.document_id == document_id)
        .order_by(Chunk.chunk_index)
    )
    db_chunks = chunks_result.scalars().all()

    # 6. Batch embed all chunk texts for utmost efficiency
    logger.info(f"Generating embeddings for {len(db_chunks)} chunks of document: {doc.file_name}")
    chunk_texts = [c.chunk_text for c in db_chunks]
    embeddings = embedding_service.create_embeddings(chunk_texts)

    # 7. Index chunks in Qdrant Vector DB
    logger.info(f"Indexing {len(db_chunks)} chunks in Qdrant for document: {doc.file_name}")

    # Make sure Qdrant collection is created with the real model dimension.
    qdrant_repository.set_vector_size(embedding_service.vector_size)

    qdrant_chunks = []
    for chunk, emb in zip(db_chunks, embeddings):
        qdrant_chunks.append({
            "chunk_id": chunk.chunk_id,  # BigInteger MySQL primary key serves as Qdrant ID
            "document_id": document_id,
            "document_name": doc.file_name,
            "page_no": chunk.page_no,
            "section": chunk.section,
            "chunk_index": chunk.chunk_index,
            "chunk_text": chunk.chunk_text,
            "embedding": emb
        })

    await qdrant_repository.add_chunks(qdrant_chunks)
    logger.info(f"Successfully chunked and indexed {total_chunks} chunks for document: {doc.file_name}")

    return total_chunks