from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import user_crud
from app.config import get_db
from app.schema.user_schema import UserCreate, UserAuthenticate  # Import the Pydantic models

userrouter = APIRouter()

@userrouter.post("/")
async def create_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Extract fields from the Pydantic model
    name = user_data.name
    email = user_data.email
    password = user_data.password
    
    # Ensure you await asynchronous functions
    existing_user = await user_crud.get_user_by_email(db, email)
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Await the asynchronous create_user function
    user = await user_crud.create_user(db=db, name=name, email=email, password=password)
    return {"msg": "User created", "user_id": user.id}

@userrouter.post("/{user_id}/verify/")
async def verify_user_email(user_id: int, db: AsyncSession = Depends(get_db)):
    # Await the asynchronous function
    verified = await user_crud.verify_user_email(db, user_id)
    
    if not verified:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"msg": "Email verified"}

@userrouter.post("/authenticate/")
async def authenticate_user(user_data: UserAuthenticate, db: AsyncSession = Depends(get_db)):
    # Extract email and password from the Pydantic model
    email = user_data.email
    password = user_data.password
    
    # Await the asynchronous authenticate_user function
    user = await user_crud.authenticate_user(db, email, password)
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {"msg": "User authenticated", "user_id": user.id}
