import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.db.database import Base, engine

# Import all models so Base.metadata knows about every table
from app.models import user, document, chat, chunk, citation, document_page, memory
from sqlalchemy import text


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.ENVIRONMENT != "test":
        # Automatically create the database if it doesn't exist
        try:
            from sqlalchemy.ext.asyncio import create_async_engine as create_temp_engine
            server_url = f"mysql+asyncmy://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/"
            temp_engine = create_temp_engine(server_url)
            async with temp_engine.connect() as conn:
                await conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.MYSQL_DATABASE}"))
                logger.info(f"Database: Ensured database '{settings.MYSQL_DATABASE}' exists.")
            await temp_engine.dispose()
        except Exception as e:
            logger.warning(f"Database auto-creation check failed: {e}")

        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            
            # Dynamic check/migration for memory_enabled column on users table
            try:
                result = await conn.execute(text("SHOW COLUMNS FROM users LIKE 'memory_enabled'"))
                column_exists = result.fetchone() is not None
                if not column_exists:
                    await conn.execute(text("ALTER TABLE users ADD COLUMN memory_enabled BOOLEAN NOT NULL DEFAULT TRUE"))
                    logger.info("Database: Added memory_enabled column to users table.")
                
                # Check for memories_updated column on messages table
                result_up = await conn.execute(text("SHOW COLUMNS FROM messages LIKE 'memories_updated'"))
                if result_up.fetchone() is None:
                    await conn.execute(text("ALTER TABLE messages ADD COLUMN memories_updated TEXT NULL"))
                    logger.info("Database: Added memories_updated column to messages table.")
                
                # Check for memories_used column on messages table
                result_usd = await conn.execute(text("SHOW COLUMNS FROM messages LIKE 'memories_used'"))
                if result_usd.fetchone() is None:
                    await conn.execute(text("ALTER TABLE messages ADD COLUMN memories_used TEXT NULL"))
                    logger.info("Database: Added memories_used column to messages table.")
            except Exception as ex:
                logger.warning(f"Database dynamic migration warning: {ex}")
    yield


# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "development" else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="MediMei: Evidence-First Drug Information Q&A Chatbot Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# Set CORS origins (explicit origins required for credentialed requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
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
