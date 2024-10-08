from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from passlib.context import CryptContext
from typing import Optional
from fastapi import HTTPException
#from app.crud.appwrite_auth import appwrite_register_user, appwrite_send_verification_email, appwrite_login_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def create_user(db: AsyncSession, name: str, email: str, password: str) -> User:
    try:
        # Create user in Appwrite
        #appwrite_user = await appwrite_register_user(email=email, password=password, name=name)

        # Hash the password for PostgreSQL
        hashed_password = hash_password(password)

        # Create user in PostgreSQL
        user = User(name=name, email=email, password=hashed_password)
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Send email verification in Appwrite
        #await appwrite_send_verification_email(user_id=appwrite_user['$id'])

        return user
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


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    try:
        # Authenticate user via Appwrite
        #session = await appwrite_login_user(email=email, password=password)

        # Retrieve user from PostgreSQL
        user = await get_user_by_email(db, email)
        if user and verify_password(password, user.password):
            return {"msg": "User authenticated"}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")
