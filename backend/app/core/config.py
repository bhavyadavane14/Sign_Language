"""
SIGNX Configuration
====================
Application settings loaded from environment variables.
All secrets must be set via .env file — never committed to source control.
"""

from pydantic_settings import BaseSettings
from typing import Union, List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/signx"

    # JWT Authentication
    JWT_SECRET: str = "supersecretkey_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Gemini AI
    GEMINI_API_KEY: str = ""

    # ML Model
    MODEL_PATH: str = "model/weights/signx_model.h5"

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173"

    # Application
    APP_NAME: str = "SIGNX"
    DEBUG: bool = False

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore",
    }


settings = Settings()
