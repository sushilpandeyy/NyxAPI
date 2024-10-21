from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.user import User, Usage
from passlib.context import CryptContext
from typing import Optional, Dict

# Update the hashing context to use Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hashes a password using Argon2."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    print(f"Plain password: {plain_password}, Hashed password: {hashed_password}")
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

        usage = Usage(Userid=user.id, Project=0, Endpoints=0)
        db.add(usage)
        await db.commit()
        await db.refresh(usage)

        # Return user data without token
        return {
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

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[Dict]:
    try:
        # Fetch user from the database
        user = await get_user_by_email(db, email)
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        print(f"Fetched hashed password for user {user.email}: {user.password}")
        
        # Verify password
        if verify_password(password, user.password):
            # Return user data directly without token
            return {
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
