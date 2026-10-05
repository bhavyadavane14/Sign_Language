import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

# Use DATABASE_URL or fallback to local SQLite for zero-config deployments
db_url = settings.DATABASE_URL
try:
    engine = create_async_engine(db_url, echo=False)
except Exception as e:
    logger.warning(f"Could not initialize primary database engine ({db_url}): {e}. Using SQLite fallback.")
    db_url = "sqlite+aiosqlite:///./signx.db"
    engine = create_async_engine(db_url, echo=False)

SessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
