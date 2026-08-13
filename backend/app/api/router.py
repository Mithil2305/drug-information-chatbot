from fastapi import APIRouter
from app.api.routes import documents, chat, compare, citations

api_router = APIRouter()

# Register documents endpoints
api_router.include_router(documents.router, prefix="/documents")

# Register chat endpoints
api_router.include_router(chat.router, prefix="/chat")

# Register chat sessions endpoints
api_router.include_router(chat.sessions_router, prefix="/sessions")

# Register citations endpoints
api_router.include_router(citations.router, prefix="/citations")

# Register drug comparison endpoints
api_router.include_router(compare.router, prefix="/compare")
