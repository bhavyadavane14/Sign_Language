"""
SIGNX API - User Routes
=========================
User profile management endpoints.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.schemas.auth import UserResponse, UserUpdate
from app.models.user import User
from app.core.database import get_db
from app.core.security import get_current_user_id

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Users"])


@router.get("/users/me", response_model=UserResponse)
async def read_user_me(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Get the current authenticated user's profile."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Update the current authenticated user's profile."""
    try:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user_update.full_name is not None:
            user.full_name = user_update.full_name
        if user_update.preferred_language is not None:
            user.preferred_language = user_update.preferred_language

        await db.commit()
        await db.refresh(user)
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User update error: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update profile")
