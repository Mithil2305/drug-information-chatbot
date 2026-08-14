from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db_session
from app.core.security import verify_access_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db_session)
) -> User:
    """Dependency to retrieve the currently authenticated user from access token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_access_token(token)
    if payload is None or payload.sub is None:
        raise credentials_exception
        
    result = await db.execute(select(User).filter(User.user_id == payload.sub))
    user = result.scalar_one_or_none()
    
    if user is None:
        # Fallback to query by email in case subject was stored as email
        result = await db.execute(select(User).filter(User.email == payload.sub))
        user = result.scalar_one_or_none()
        
    if user is None:
        raise credentials_exception
        
    return user
