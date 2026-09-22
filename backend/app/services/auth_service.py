"""
SIGNX - Auth Service
=====================
Authentication business logic.
"""

import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token

logger = logging.getLogger(__name__)


async def register_user(db: AsyncSession, user_in: UserCreate):
    """Register a new user with hashed password."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise ValueError("An account with this email already exists")

    # Create user with hashed password
    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        preferred_language=user_in.preferred_language or "en",
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    logger.info(f"New user registered: {user_in.email}")
    return db_user


async def authenticate_user(db: AsyncSession, user_in: UserLogin):
    """Authenticate user and return JWT token with user data."""
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()

    if not user or not verify_password(user_in.password, user.hashed_password):
        return None

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "preferred_language": user.preferred_language,
            "is_active": user.is_active,
            "created_at": user.created_at,
        },
    }
