import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db_session
from app.schemas.comparison import ComparisonRequest, ComparisonResult
from app.services.comparison.comparison_service import ComparisonInputError, ComparisonService

logger = logging.getLogger(__name__)
router = APIRouter(tags=["compare"])
comparison_service = ComparisonService()


@router.post("", response_model=ComparisonResult)
async def compare_documents(
    request: ComparisonRequest,
    db: AsyncSession = Depends(get_db_session),
):
    try:
        return await comparison_service.compare(request, db)
    except ComparisonInputError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail=exc.message,
        )
    except Exception as exc:
        logger.error("Comparison failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Comparison failed.",
        )

