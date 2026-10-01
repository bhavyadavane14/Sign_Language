"""
SIGNX Chatbot Service
=======================
Integrates Google Gemini API with search grounding for the AI Assistant.
Never exposes the API key — loaded from environment variables only.
"""

import logging
from typing import Optional, List, Dict, Any

from app.core.config import settings

logger = logging.getLogger(__name__)


class ChatbotService:
    """
    SIGNX AI Assistant powered by Google Gemini.
    
    Features:
    - General ISL learning assistance
    - Communication help
    - Translation questions
    - App guidance
    - Google Search grounding when available
    """

    SYSTEM_INSTRUCTION = """You are SIGNX AI Assistant, a helpful and knowledgeable assistant 
for the SIGNX Indian Sign Language Translator application. You help users with:
- Learning Indian Sign Language (ISL)
- Understanding how the SIGNX translation system works
- Communication assistance for deaf/hard-of-hearing users
- Answering questions about ISL alphabet, numbers, and common signs
- Providing information about accessibility and deaf culture in India
- Guiding users through the SIGNX application features

Always be respectful, inclusive, and use clear, simple language.
When discussing ISL, note that Indian Sign Language is distinct from ASL (American Sign Language).
The SIGNX model currently recognizes ISL alphabet (A-Z) and digits (0-9).
Refer users to ISLRTC (Indian Sign Language Research and Training Centre) for official resources.
"""

    def __init__(self):
        self.model = None
        self.is_configured = False
        self._initialize()

    def _initialize(self):
        """Initialize the Gemini client if API key is available."""
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set. Chatbot will return a setup message.")
            return

        try:
            import google.generativeai as genai

            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=self.SYSTEM_INSTRUCTION,
            )
            self.is_configured = True
            logger.info("Gemini AI chatbot initialized successfully")
        except ImportError:
            logger.error("google-generativeai package not installed")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}")

    async def get_response(
        self,
        message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:
        """
        Get a response from the Gemini AI assistant.
        
        Args:
            message: User's message
            conversation_history: Optional list of prior messages
            
        Returns:
            Dictionary with response text, sources, and metadata
        """
        if not self.is_configured or self.model is None:
            return {
                "response": (
                    "The AI Assistant is not configured yet. "
                    "Please set the GEMINI_API_KEY in your .env file. "
                    "You can get an API key from Google AI Studio (https://aistudio.google.com/)."
                ),
                "sources": [],
                "grounded": False,
            }

        try:
            import google.generativeai as genai

            # Build conversation context
            contents = []
            if conversation_history:
                for msg in conversation_history[-10:]:  # Last 10 messages for context
                    role = "user" if msg.get("role") == "user" else "model"
                    contents.append({"role": role, "parts": [msg.get("content", "")]})

            contents.append({"role": "user", "parts": [message]})

            # Try with search grounding first
            response = None
            sources = []
            grounded = False

            try:
                # Attempt search-grounded response
                grounding_tool = genai.Tool(
                    google_search=genai.GoogleSearch()
                )
                response = self.model.generate_content(
                    contents,
                    tools=[grounding_tool],
                )
                grounded = True

                # Extract grounding sources if available
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'grounding_metadata') and candidate.grounding_metadata:
                        metadata = candidate.grounding_metadata
                        if hasattr(metadata, 'grounding_chunks'):
                            for chunk in metadata.grounding_chunks:
                                if hasattr(chunk, 'web') and chunk.web:
                                    sources.append({
                                        "title": getattr(chunk.web, 'title', 'Source'),
                                        "url": getattr(chunk.web, 'uri', ''),
                                    })
            except Exception as grounding_error:
                logger.debug(f"Search grounding not available: {grounding_error}")
                # Fall back to non-grounded response
                response = self.model.generate_content(contents)
                grounded = False

            if response and response.text:
                return {
                    "response": response.text,
                    "sources": sources,
                    "grounded": grounded,
                }
            else:
                return {
                    "response": "I couldn't generate a response. Please try rephrasing your question.",
                    "sources": [],
                    "grounded": False,
                }

        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return {
                "response": "I'm having trouble connecting to the AI service. Please try again later.",
                "sources": [],
                "grounded": False,
                "error": True,
            }

    def get_status(self) -> Dict[str, Any]:
        """Return chatbot configuration status."""
        return {
            "configured": self.is_configured,
            "model": "gemini-1.5-flash" if self.is_configured else None,
            "features": ["ISL learning", "communication help", "translation questions", "app guidance"],
        }


chatbot_service = ChatbotService()
