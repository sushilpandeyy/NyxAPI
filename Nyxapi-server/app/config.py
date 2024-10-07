from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Retrieve the database URL from the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# Create async engine without SSL configuration
engine = create_async_engine(
    DATABASE_URL,
    echo=True  # Echo SQL statements for debugging purposes
)

# Configure the sessionmaker for creating async database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession  # Use AsyncSession for async support
)

# Create a base class for ORM models
Base = declarative_base()

# Dependency to provide a database session for FastAPI routes or other async tasks
async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()  # Ensure session is closed after use
