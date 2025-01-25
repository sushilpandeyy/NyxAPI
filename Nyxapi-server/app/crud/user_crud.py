import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.user import User, Usage
from typing import Dict, Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/fastapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("UserService")

async def create_user(db: AsyncSession, name: str, email: str, password: str) -> Dict:
    try:
        user = User(name=name, email=email, password=password)
        db.add(user)
        await db.commit()
        await db.refresh(user)

        usage = Usage(Userid=user.id, Project=0, Endpoints=0)
        db.add(usage)
        await db.commit()
        await db.refresh(usage)

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
    try:
        stmt = select(User).filter(User.email == email)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user: {str(e)}")

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[Dict]:
    try:
        user = await get_user_by_email(db, email)
        if not user or user.password != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "user": {
                "email": user.email,
                "user_id": user.id,
                "name": user.name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")