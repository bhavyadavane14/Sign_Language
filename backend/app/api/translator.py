"""
SIGNX API - Translator Routes
===============================
Endpoints for sign language translation and model information.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.ml.inference import get_inference_engine

logger = logging.getLogger(__name__)
router = APIRouter(tags=["translator"])


class FrameRequest(BaseModel):
    """Request body for single frame translation."""
    frame: str  # Base64-encoded image
    session_id: Optional[str] = None


class SessionResetRequest(BaseModel):
    """Request body for session reset."""
    session_id: Optional[str] = None


@router.post("/translate/frame")
async def translate_frame(request: FrameRequest):
    """
    Translate a single camera frame.
    
    Receives a base64-encoded image, runs the full inference pipeline,
    and returns the prediction result.
    """
    try:
        if not request.frame:
            raise HTTPException(status_code=400, detail="No frame data provided")

        engine = get_inference_engine()
        result = engine.process_frame(request.frame)
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail="Translation processing failed")


@router.post("/translate/session/reset")
async def reset_session(request: SessionResetRequest):
    """Reset the translation session (clear sentence builder)."""
    try:
        engine = get_inference_engine()
        result = engine.reset_session()
        return result
    except Exception as e:
        logger.error(f"Session reset error: {e}")
        raise HTTPException(status_code=500, detail="Session reset failed")


@router.get("/translate/status")
async def get_translation_status():
    """Get the current translation engine status."""
    try:
        engine = get_inference_engine()
        return engine.get_status()
    except Exception as e:
        logger.error(f"Status error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get status")


@router.get("/model/info")
async def get_model_info():
    """
    Get model information for the Model Information page.
    
    Returns actual model details — does NOT invent accuracy claims.
    """
    try:
        engine = get_inference_engine()
        model_info = engine.model_adapter.get_model_info()
        return {
            "success": True,
            **model_info,
        }
    except Exception as e:
        logger.error(f"Model info error: {e}")
        return {
            "success": False,
            "model_status": "unavailable",
            "error": "Could not retrieve model information",
        }


@router.get("/isl/resources")
async def get_isl_resources():
    """
    Get ISL learning resources and references.
    
    Returns links to official ISL resources (ISLRTC).
    Does NOT redistribute protected content.
    """
    return {
        "resources": [
            {
                "name": "Indian Sign Language Research and Training Centre (ISLRTC)",
                "url": "https://islrtc.nic.in/",
                "type": "official",
                "description": "Government of India's official ISL resource center",
            },
            {
                "name": "ISL Dictionary",
                "url": "https://islrtc.nic.in/indian-sign-language-dictionary",
                "type": "dictionary",
                "description": "Official ISL dictionary by ISLRTC",
            },
            {
                "name": "ISLRTC Learning Materials",
                "url": "https://islrtc.nic.in/learning-material",
                "type": "learning",
                "description": "Educational materials for learning ISL",
            },
        ],
        "model_vocabulary": {
            "description": "Signs currently supported by the SIGNX AI model",
            "note": "The AI model currently supports ISL alphabet (A-Z) and digits (0-9). The complete ISL vocabulary is much larger.",
            "supported_classes": 36,
            "categories": {
                "alphabet": "A-Z (26 signs)",
                "digits": "0-9 (10 signs)",
            },
        },
    }
