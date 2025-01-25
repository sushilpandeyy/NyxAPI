import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy import inspect
from app.config import engine, Base
from app.routes.user_routes import userrouter
from app.routes.project_routes import projectroutes
from app.routes.endpoints_route import endpointroutes
from app.routes.Share_route import shareroute 
from app.routes.websocket import websocketroutes

app = FastAPI()

app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials=True, 
   allow_methods=["*"],
   allow_headers=["*"],
)

async def reset_db_if_structure_differs(engine: AsyncEngine):
   async with engine.begin() as conn:
       def check_tables(connection):
           inspector = inspect(connection)
           return inspector.get_table_names(), Base.metadata.tables.keys()

       existing_tables, model_tables = await conn.run_sync(check_tables)
       
       if set(existing_tables) != set(model_tables):
           await conn.run_sync(Base.metadata.drop_all)
           await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def on_startup():
   await reset_db_if_structure_differs(engine)

app.include_router(userrouter, prefix="/users", tags=["Users"])
app.include_router(projectroutes, prefix="/project", tags=["Project"])
app.include_router(endpointroutes, prefix="/endpoints", tags=["Endpoint"])
app.include_router(shareroute, prefix="/share", tags=["Collaboration"])
app.include_router(websocketroutes, prefix="/ws", tags=["websocket"])

@app.get("/")
async def read_root():
   return {"message": "Hello World"}

if __name__ == "__main__":
   import uvicorn
   port = int(os.environ.get("PORT", 10000))
   uvicorn.run("app.main:app", host="0.0.0.0", port=port)