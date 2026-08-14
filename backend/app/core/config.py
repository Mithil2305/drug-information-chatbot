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

    # JWT Settings
    JWT_SECRET_KEY: str = "supersecretkeychangeinproduction1234567890"  # Fallback secret
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Pydantic Settings Config
    model_config = SettingsConfigDict(
        env_file="backend/.env" if hasattr(SettingsConfigDict, "env_file") else ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
