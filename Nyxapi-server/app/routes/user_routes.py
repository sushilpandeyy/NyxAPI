from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud import user_crud
from app.config import get_db

router = APIRouter()

@router.post("/users/")
async def create_user(name: str, email: str, password: str, db: Session = Depends(get_db)):
    existing_user = user_crud.get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = user_crud.create_user(db=db, name=name, email=email, password=password)
    return {"msg": "User created", "user_id": user.id}

@router.post("/users/{user_id}/verify/")
async def verify_user_email(user_id: int, db: Session = Depends(get_db)):
    verified = user_crud.verify_user_email(db, user_id)
    if not verified:
        raise HTTPException(status_code=404, detail="User not found")
    return {"msg": "Email verified"}

@router.post("/users/authenticate/")
async def authenticate_user(email: str, password: str, db: Session = Depends(get_db)):
    user = user_crud.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"msg": "User authenticated", "user_id": user.id}