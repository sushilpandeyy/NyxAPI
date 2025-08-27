import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Get logger without configuring - inherit from main.py
logger = logging.getLogger("DatabaseSetup")

# Suppress SQLAlchemy echo logging to console to avoid duplication
sqlalchemy_logger = logging.getLogger('sqlalchemy.engine')
sqlalchemy_logger.setLevel(logging.WARNING)  # Only show warnings and errors

# Load environment variables from the .env file
load_dotenv()

# Retrieve the database URL from the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.critical("DATABASE_URL is not set in environment variables. Exiting application.")
    raise ValueError("DATABASE_URL is required in environment variables.")

# Convert standard postgresql:// URL to asyncpg format for async engine
async_database_url = DATABASE_URL
if DATABASE_URL.startswith("postgresql://"):
    async_database_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    # Remove all SSL-related parameters and add ssl=false to test without SSL
    import re
    async_database_url = re.sub(r'[?&](ssl|sslmode|sslcert|sslkey|sslrootcert|channel_binding)=[^&]*', '', async_database_url)
    # Clean up any remaining empty query parameters
    async_database_url = re.sub(r'[?&]+$', '', async_database_url)
    async_database_url = re.sub(r'[?]&', '?', async_database_url)
    # Add ssl=require for proper asyncpg SSL configuration
    if '?' in async_database_url:
        async_database_url += '&ssl=require'
    else:
        async_database_url += '?ssl=require'
    logger.info(f"Converted database URL for async engine: {async_database_url[:50]}...")

# Create async engine
try:
    logger.info("Creating async engine.")
    engine = create_async_engine(
        async_database_url,
        echo=False,  # Disable echo to prevent duplicate logging
        pool_pre_ping=True,  # Enable connection health checks
        pool_recycle=300  # Recycle connections every 5 minutes
    )
    logger.info("Async engine created successfully.")
except Exception as e:
    logger.critical(f"Failed to create async engine: {e}", exc_info=True)
    raise

# Configure the sessionmaker for creating async database sessions
try:
    logger.info("Configuring sessionmaker for async database sessions.")
    SessionLocal = sessionmaker(
        bind=engine,
        class_=AsyncSession,  # Use AsyncSession for async support
        expire_on_commit=False  # Prevents loading the instance again from the database after commit
    )
    logger.info("Sessionmaker configured successfully.")
except Exception as e:
    logger.error(f"Failed to configure sessionmaker: {e}", exc_info=True)
    raise

# Create a base class for ORM models
try:
    logger.info("Creating ORM Base class.")
    Base = declarative_base()
    logger.info("ORM Base class created successfully.")
except Exception as e:
    logger.error(f"Failed to create ORM Base class: {e}", exc_info=True)
    raise

# Dependency to provide a database session for FastAPI routes or other async tasks
async def get_db() -> AsyncSession:
    logger.info("Acquiring a new database session.")
    async with SessionLocal() as session:
        try:
            yield session  # Yielding the session for use in a route
            logger.info("Database session yielded successfully.")
        except Exception as e:
            logger.error(f"Error during session operation: {e}", exc_info=True)
            raise
        finally:
            logger.info("Releasing database session.")
