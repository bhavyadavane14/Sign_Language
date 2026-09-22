"""
SIGNX API - Chatbot Routes
============================
AI Assistant endpoints powered by Gemini API.
API key loaded from environment variables — never exposed to frontend.
"""

import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.chatbot_service import chatbot_service

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Chatbot"])


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    response: str
    sources: list = []
    grounded: bool = False


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the SIGNX AI Assistant.
    
    The assistant helps with ISL learning, communication assistance,
    translation questions, and app guidance.
    
    When search grounding is available, sources will be included.
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Convert history to dict format
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]

        result = await chatbot_service.get_response(
            message=request.message,
            conversation_history=history,
        )

        return ChatResponse(
            response=result.get("response", "No response generated"),
            sources=result.get("sources", []),
            grounded=result.get("grounded", False),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Chat service unavailable")


@router.get("/chat/status")
async def chat_status():
    """Check if the chatbot is configured and available."""
    return chatbot_service.get_status()
