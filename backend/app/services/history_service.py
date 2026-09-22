from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.translation import TranslationHistory
from app.schemas.translation import TranslationCreate

async def get_history(db: AsyncSession, user_id: int):
    result = await db.execute(select(TranslationHistory).where(TranslationHistory.user_id == user_id).order_by(TranslationHistory.created_at.desc()))
    return result.scalars().all()

async def save_history(db: AsyncSession, user_id: int, translation: TranslationCreate):
    db_history = TranslationHistory(
        user_id=user_id,
        original_text=translation.original_text,
        translated_text=translation.translated_text
    )
    db.add(db_history)
    await db.commit()
    await db.refresh(db_history)
    return db_history

async def delete_history(db: AsyncSession, user_id: int, history_id: int):
    result = await db.execute(select(TranslationHistory).where(TranslationHistory.id == history_id, TranslationHistory.user_id == user_id))
    history = result.scalars().first()
    if history:
        await db.delete(history)
        await db.commit()
        return True
    return False
