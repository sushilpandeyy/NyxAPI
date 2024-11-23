import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.user import User, Usage
from passlib.context import CryptContext
from typing import Optional, Dict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/user_service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("UserService")

# Update the hashing context to use Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hashes a password using Argon2."""
    logger.info("Hashing password.")
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    logger.info("Verifying password.")
    return pwd_context.verify(plain_password, hashed_password)

async def create_user(db: AsyncSession, name: str, email: str, password: str) -> Dict:
    logger.info(f"Attempting to create user with email: {email}")
    try:
        # Hash the password for PostgreSQL
        hashed_password = hash_password(password)
        logger.debug(f"Hashed password for {email}: {hashed_password}")

        # Create user in PostgreSQL
        user = User(name=name, email=email, password=hashed_password)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        logger.info(f"User created successfully with ID: {user.id}")

        # Create an initial usage record
        usage = Usage(Userid=user.id, Project=0, Endpoints=0)
        db.add(usage)
        await db.commit()
        await db.refresh(usage)
        logger.info(f"Usage record created for User ID: {user.id}")

        # Return user data without token
        return {
            "user": {
                "email": user.email,
                "user_id": user.id,
                "name": user.name
            }
        }
    except Exception as e:
        logger.error(f"Error creating user with email {email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    logger.info(f"Fetching user by email: {email}")
    try:
        stmt = select(User).filter(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if user:
            logger.info(f"User found with email: {email}")
        else:
            logger.warning(f"No user found with email: {email}")
        return user
    except Exception as e:
        logger.error(f"Error fetching user by email {email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching user: {str(e)}")

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[Dict]:
    logger.info(f"Authenticating user with email: {email}")
    try:
        # Fetch user from the database
        user = await get_user_by_email(db, email)
        if user is None:
            logger.warning(f"Authentication failed for email {email}: User not found.")
            raise HTTPException(status_code=401, detail="Invalid credentials")

        logger.info(f"Fetched hashed password for user {email}")
        
        # Verify password
        if verify_password(password, user.password):
            logger.info(f"User {email} authenticated successfully.")
            # Return user data directly without token
            return {
                "user": {
                    "email": user.email,
                    "user_id": user.id,
                    "name": user.name
                }
            }
        else:
            logger.warning(f"Authentication failed for email {email}: Invalid credentials.")
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        logger.error(f"Error during authentication for email {email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")
