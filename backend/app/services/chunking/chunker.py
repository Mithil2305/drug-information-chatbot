from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document_page import DocumentPage
from app.models.chunk import Chunk


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
    # Get all extracted pages
    result = await db.execute(
        select(DocumentPage)
        .where(DocumentPage.document_id == document_id)
        .order_by(DocumentPage.page_no)
    )

    pages = result.scalars().all()

    if not pages:
        return 0

    # Remove old chunks if document is processed again
    await db.execute(
        delete(Chunk).where(Chunk.document_id == document_id)
    )

    total_chunks = 0

    for page in pages:
        if not page.text_ref:
            continue

        page_chunks = split_text(page.text_ref)

        for index, text in enumerate(page_chunks):
            chunk = Chunk(
                document_id=document_id,
                page_no=page.page_no,
                section=None,
                chunk_index=index,
                text_hash=None,
                chunk_text=text
            )

            db.add(chunk)
            total_chunks += 1

    await db.commit()

    return total_chunks