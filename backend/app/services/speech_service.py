"""
SIGNX - Speech Service
========================
Text-to-Speech and Speech-to-Text service layer.
"""

import logging
import base64
import io
from typing import Optional

logger = logging.getLogger(__name__)


class SpeechService:
    """
    Speech processing service.
    
    Uses gTTS for server-side TTS.
    Browser Web Speech API is preferred for real-time STT.
    """

    SUPPORTED_LANGUAGES = {
        "en": "English",
        "hi": "Hindi",
        "mr": "Marathi",
        "bn": "Bengali",
        "gu": "Gujarati",
        "ta": "Tamil",
        "te": "Telugu",
        "kn": "Kannada",
        "ml": "Malayalam",
        "pa": "Punjabi",
    }

    async def text_to_speech(self, text: str, language: str = "en") -> Optional[str]:
        """Convert text to speech and return base64-encoded audio."""
        if not text.strip():
            return None

        try:
            from gtts import gTTS

            lang = language if language in self.SUPPORTED_LANGUAGES else "en"
            tts = gTTS(text=text, lang=lang)

            buffer = io.BytesIO()
            tts.write_to_fp(buffer)
            buffer.seek(0)

            return base64.b64encode(buffer.read()).decode("utf-8")
        except ImportError:
            logger.warning("gTTS not installed")
            return None
        except Exception as e:
            logger.error(f"TTS error: {e}")
            return None

    async def speech_to_text(self, audio_base64: str) -> Optional[str]:
        """
        Convert audio to text (server-side).
        Note: For real-time STT, use the browser Web Speech API.
        """
        logger.info("Server-side STT called — use browser Web Speech API for real-time")
        return None

    def get_supported_languages(self):
        """Return supported languages for TTS."""
        return self.SUPPORTED_LANGUAGES


speech_service = SpeechService()
