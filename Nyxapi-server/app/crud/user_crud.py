from sqlalchemy.future import select  # Add this import
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
        # Check if the user already exists
        stmt = select(User).filter(User.email == email)
        result = await db.execute(stmt)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists.")

        # Hash the password for PostgreSQL
        hashed_password = hash_password(password)

        # Create new user in PostgreSQL
        new_user = User(name=name, email=email, password=hashed_password)
        db.add(new_user)
        await db.commit()

        # Refresh to ensure the new_user object is populated with the ID
        await db.refresh(new_user)

        # Ensure the user object is not a dict and has an ID
        if not hasattr(new_user, 'id') or new_user.id is None:
            raise HTTPException(status_code=500, detail="User creation failed. No ID returned.")

        # Generate a token after user creation
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_user.email}, expires_delta=access_token_expires
        )

        # Return token along with user data
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": new_user.email,
                "user_id": new_user.id,
                "name": new_user.name
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