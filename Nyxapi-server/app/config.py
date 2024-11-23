import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/fastapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("DatabaseSetup")

# Load environment variables from the .env file
load_dotenv()

# Retrieve the database URL from the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.critical("DATABASE_URL is not set in environment variables. Exiting application.")
    raise ValueError("DATABASE_URL is required in environment variables.")

# Create async engine
try:
    logger.info("Creating async engine.")
    engine = create_async_engine(
        DATABASE_URL,
        echo=True  # Echo SQL statements for debugging purposes
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
