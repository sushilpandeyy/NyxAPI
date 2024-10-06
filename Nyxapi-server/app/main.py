from fastapi import FastAPI
from app.config import engine, Base
from app.routes.user_routes import userrouter

app = FastAPI()

# Asynchronous table creation during the startup event
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(userrouter, prefix="/users", tags=["Users"])

@app.get("/")
async def read_root():
    return {"message": "Hello World"}
