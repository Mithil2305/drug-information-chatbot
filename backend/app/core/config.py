from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "LabelProof"
    ENVIRONMENT: str = "development"

    # MySQL Database Settings
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str = "labelproof"
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""

    # Qdrant Vector DB Settings
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "drug_documents"

    # Cloudflare R2 Settings
    R2_ENDPOINT_URL: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_NAME: Optional[str] = None

    # ML & LLM Settings
    EMBEDDING_MODEL: str = "BAAI/bge-m3"
    LLM_MODEL: str = "Qwen/Qwen3.5-4B"
    LLM_MODEL_PATH: Optional[str] = "data/models/llm/qwen-3.5-4B-Q4_K_M.gguf"

    # RAG Settings
    TOP_K: int = 8
    MIN_RELEVANCE_SCORE: float = 0.35
    MAX_UPLOAD_SIZE_MB: int = 50

    # Pydantic Settings Config
    model_config = SettingsConfigDict(
        env_file="backend/.env" if hasattr(SettingsConfigDict, "env_file") else ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
