"""
SIGNX FastAPI Application
===========================
Main application entry point for the SIGNX AI Indian Sign Language Translator API.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, translator, chatbot, speech, history, users
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup
    logger.info("🤟 SIGNX API starting up...")
    logger.info(f"Model path: {settings.MODEL_PATH}")

    # Attempt to load the ML model (non-blocking if not found)
    try:
        from app.ml.model_adapter import get_model_adapter
        adapter = get_model_adapter()
        if adapter.is_loaded:
            logger.info(f"✅ Model loaded successfully with {len(adapter.get_classes())} classes")
        else:
            logger.warning(
                "⚠️ Model not loaded. The application will run without AI recognition. "
                "See MODEL_STATUS.md for setup instructions."
            )
    except Exception as e:
        logger.warning(f"⚠️ Model initialization skipped: {e}")

    logger.info("🚀 SIGNX API ready")
    yield
    # Shutdown
    logger.info("👋 SIGNX API shutting down...")


app = FastAPI(
    title="SIGNX API",
    description="AI-Powered Indian Sign Language Translator API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    origins = [o.strip() for o in origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(translator.router, prefix="/api", tags=["Translation"])
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])
app.include_router(speech.router, prefix="/api", tags=["Speech"])
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(users.router, prefix="/api", tags=["Users"])


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "name": "SIGNX API",
        "version": "1.0.0",
        "description": "AI-Powered Indian Sign Language Translator",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    try:
        from app.ml.model_adapter import get_model_adapter
        adapter = get_model_adapter()
        model_status = "loaded" if adapter.is_loaded else "not_loaded"
    except Exception:
        model_status = "unavailable"

    return {
        "status": "healthy",
        "model_status": model_status,
        "version": "1.0.0",
    }
