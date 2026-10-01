"""
SIGNX API - History Routes
============================
Translation history CRUD endpoints.
"""

import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.schemas.translation import TranslationResponse, TranslationCreate
from app.models.translation import Translation
from app.core.database import get_db
from app.core.security import get_current_user_id

logger = logging.getLogger(__name__)
router = APIRouter(tags=["History"])


@router.get("/history", response_model=List[TranslationResponse])
async def read_history(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
    limit: int = 50,
    offset: int = 0,
):
    """Get translation history for the current user."""
    try:
        result = await db.execute(
            select(Translation)
            .where(Translation.user_id == user_id)
            .order_by(desc(Translation.created_at))
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()
    except Exception as e:
        logger.error(f"History read error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")


@router.post("/history", response_model=TranslationResponse, status_code=status.HTTP_201_CREATED)
async def create_history(
    translation: TranslationCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Save a translation to history."""
    try:
        db_translation = Translation(
            user_id=user_id,
            recognized_sign=translation.recognized_sign,
            translated_text=translation.translated_text,
            source_language=translation.source_language,
            target_language=translation.target_language,
            confidence=translation.confidence,
        )
        db.add(db_translation)
        await db.commit()
        await db.refresh(db_translation)
        return db_translation
    except Exception as e:
        logger.error(f"History create error: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save history")


@router.delete("/history/{id}")
async def remove_history(
    id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Delete a history entry (only the owner can delete)."""
    try:
        result = await db.execute(
            select(Translation).where(
                Translation.id == id,
                Translation.user_id == user_id,
            )
        )
        record = result.scalars().first()
        if not record:
            raise HTTPException(status_code=404, detail="History entry not found")

        await db.delete(record)
        await db.commit()
        return {"status": "deleted", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"History delete error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete history")
