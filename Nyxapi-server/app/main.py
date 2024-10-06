# app/main.py
from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from app.config import engine, Base

# Initialize the FastAPI app
app = FastAPI()

# Include the user router
app.include_router(user_router)

# Create database tables
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
