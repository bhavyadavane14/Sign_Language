"""
SIGNX - Auth Schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    preferred_language: Optional[str] = "en"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_language: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    preferred_language: str = "en"
    is_active: bool = True
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None
