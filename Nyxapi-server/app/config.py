from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Retrieve the database URL from the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True  # Echo SQL statements for debugging purposes
)

# Configure the sessionmaker for creating async database sessions
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,  # Use AsyncSession for async support
    expire_on_commit=False  # Prevents loading the instance again from the database after commit
)

# Create a base class for ORM models
Base = declarative_base()

# Dependency to provide a database session for FastAPI routes or other async tasks
async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session  # Yielding the session for use in a route
        # No need for session.close() here; it's handled by async with context manager
