from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import inspect
from app.config import engine, Base
from app.routes.user_routes import userrouter
from app.routes.project_routes import projectroutes
from app.routes.endpoints_route import endpointroutes
from app.routes.Share_route import shareroute

app = FastAPI()

# Enable CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Function to compare and reset the structure if needed
async def reset_db_if_structure_differs(engine: AsyncEngine):
    async with engine.begin() as conn:
        # Run synchronous inspection in an async context
        def check_tables(connection):
            inspector = inspect(connection)
            existing_tables = inspector.get_table_names()
            model_tables = Base.metadata.tables.keys()
            return existing_tables, model_tables

        existing_tables, model_tables = await conn.run_sync(check_tables)

        if set(existing_tables) != set(model_tables):
            # Drop all tables and recreate them if there is a difference
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
            print("Database schema reset successfully.")

# Asynchronous table creation and structure reset during startup
@app.on_event("startup")
async def on_startup():
    await reset_db_if_structure_differs(engine)

# Include user, project, and endpoint routes
app.include_router(userrouter, prefix="/users", tags=["Users"])
app.include_router(projectroutes, prefix="/project", tags=["Project"])
app.include_router(endpointroutes, prefix="/endpoints", tags=["Endpoint"])
app.include_router(shareroute, prefix="/share", tags=["Collaboration"])


# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Hello World"}
