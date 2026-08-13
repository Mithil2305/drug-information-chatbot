import logging
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "development" else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="LabelProof: Evidence-First Drug Information Q&A Chatbot Backend",
    version="1.0.0"
)

# Set CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["system"])
async def health_check():
    """Health check endpoint to verify backend operational status."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT
    }

# Include all aggregated API v1 routes
app.include_router(api_router, prefix="/api/v1")
