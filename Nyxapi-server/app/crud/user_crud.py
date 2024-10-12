from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.user import User
from passlib.context import CryptContext
from typing import Optional, Dict
from app.crud.jwt import create_access_token
from datetime import timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expiration time

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def create_user(db: AsyncSession, name: str, email: str, password: str) -> Dict:
    try:
        # Hash the password for PostgreSQL
        hashed_password = hash_password(password)

        # Create user in PostgreSQL
        user = User(name=name, email=email, password=hashed_password)
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Generate a token after user creation
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        # Return token along with user data
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": user.email,
                "user_id": user.id,
                "name": user.name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    stmt = select(User).filter(User.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def verify_user_email(db: AsyncSession, user_id: int) -> bool:
    stmt = select(User).filter(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if user:
        user.email_verified = True
        await db.commit()
        return True
    return False

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[Dict]:
    try:
        # Fetch user from the database
        user = await get_user_by_email(db, email)
        
        # Verify password
        if user and verify_password(password, user.password):
            # Create a token for the user
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.email}, expires_delta=access_token_expires
            )
            
            # Return token along with user data
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "email": user.email,
                    "user_id": user.id,
                    "name": user.name
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")