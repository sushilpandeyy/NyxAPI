from fastapi import FastAPI
from app.config import engine, Base

app = FastAPI()

# Asynchronous table creation during the startup event
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # Asynchronous table creation
        await conn.run_sync(Base.metadata.create_all)

# Example root route
@app.get("/")
async def read_root():
    return {"message": "Hello World"}
