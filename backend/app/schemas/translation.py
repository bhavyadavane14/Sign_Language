"""
SIGNX - Translation Schemas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TranslationCreate(BaseModel):
    recognized_sign: Optional[str] = None
    translated_text: Optional[str] = None
    source_language: str = "isl"
    target_language: str = "en"
    confidence: Optional[float] = None


class TranslationResponse(BaseModel):
    id: int
    user_id: int
    recognized_sign: Optional[str] = None
    translated_text: Optional[str] = None
    source_language: str = "isl"
    target_language: str = "en"
    confidence: Optional[float] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class FrameRequest(BaseModel):
    frame: str  # Base64 encoded image
    session_id: Optional[str] = None
