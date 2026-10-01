"""
SIGNX API - Speech Routes
===========================
Text-to-Speech and Speech-to-Text endpoints.
"""

import logging
import base64
import io
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Speech"])


class TTSRequest(BaseModel):
    text: str
    language: str = "en"
    slow: bool = False


class STTRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "en-IN"


@router.post("/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech audio.
    
    Returns base64-encoded MP3 audio.
    For browser-based TTS, the frontend uses the Web Speech API directly.
    This endpoint provides server-side TTS using gTTS as a fallback.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        from gtts import gTTS

        # Map language codes to gTTS language codes
        lang_map = {
            "en": "en",
            "hi": "hi",
            "mr": "mr",
            "bn": "bn",
            "gu": "gu",
            "ta": "ta",
            "te": "te",
            "kn": "kn",
            "ml": "ml",
            "pa": "pa",
        }

        lang = lang_map.get(request.language, "en")
        tts = gTTS(text=request.text, lang=lang, slow=request.slow)

        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)

        audio_b64 = base64.b64encode(audio_buffer.read()).decode("utf-8")

        return {
            "audio_base64": audio_b64,
            "format": "mp3",
            "language": lang,
            "text_length": len(request.text),
        }

    except ImportError:
        logger.warning("gTTS not installed, using browser TTS fallback")
        return {
            "audio_base64": None,
            "format": None,
            "language": request.language,
            "fallback": "browser",
            "message": "Server-side TTS not available. Use browser Web Speech API.",
        }
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail="Text-to-speech conversion failed")


@router.post("/speech-to-text")
async def speech_to_text(request: STTRequest):
    """
    Convert speech audio to text.
    
    Note: For real-time STT, the frontend uses the Web Speech API directly.
    This endpoint is a placeholder for server-side STT integration.
    """
    if not request.audio_base64:
        raise HTTPException(status_code=400, detail="Audio data required")

    return {
        "text": "",
        "language": request.language,
        "message": "Server-side STT requires additional setup. Use browser Web Speech API for real-time recognition.",
        "fallback": "browser",
    }
