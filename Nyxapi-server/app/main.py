import logging
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import inspect
from app.config import engine, Base
from app.routes.user_routes import userrouter
from app.routes.project_routes import projectroutes
from app.routes.endpoints_route import endpointroutes
from app.routes.Share_route import shareroute
from app.routes.websocket import websocketroutes
from app.routes.mock_api_route import mock_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("nyxapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("FastAPIApp")

# Suppress bcrypt warnings
bcrypt_logger = logging.getLogger("passlib.handlers.bcrypt")
bcrypt_logger.setLevel(logging.ERROR)

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
            logger.warning("Database schema reset successfully.")
        else:
            logger.info("Database schema is up to date.")

# Asynchronous table creation and structure reset during startup
@app.on_event("startup")
async def on_startup():
    print("\n" + "="*60)
    print("🚀 NyxAPI Server Starting Up")
    print("="*60)
    logger.info("Application startup initiated.")
    try:
        await reset_db_if_structure_differs(engine)
        logger.info("Database tables created/verified successfully.")
        print("✅ Database connection established and schema verified")
        print("🌟 Server ready to handle requests!")
        print("📍 API Documentation: http://localhost:8000/docs")
        print("="*60 + "\n")
    except Exception as e:
        logger.error(f"Error during startup: {e}", exc_info=True)
        print("❌ Database connection failed - continuing without DB")
        print("="*60 + "\n")

@app.on_event("shutdown")
async def on_shutdown():
    print("\n" + "="*60)
    print("🔻 NyxAPI Server Shutting Down")
    print("="*60)
    logger.info("Application shutdown initiated.")
    print("👋 Goodbye!")
    print("="*60 + "\n")

# Middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    client_ip = request.client.host if request.client else "unknown"
    
    # More detailed request logging
    logger.info(f"📥 {request.method} {request.url} from {client_ip}")
    
    try:
        response = await call_next(request)
        process_time = round((time.time() - start_time) * 1000, 2)
        
        # Colorful status logging
        status_emoji = "✅" if response.status_code < 400 else "❌" if response.status_code >= 500 else "⚠️"
        logger.info(f"📤 {status_emoji} {response.status_code} | {process_time}ms | {request.method} {request.url}")
        
        return response
    except Exception as e:
        process_time = round((time.time() - start_time) * 1000, 2)
        logger.error(f"💥 ERROR | {process_time}ms | {request.method} {request.url} - {e}", exc_info=True)
        raise

# Include user, project, and endpoint routes
app.include_router(userrouter, prefix="/users", tags=["Users"])
app.include_router(projectroutes, prefix="/project", tags=["Project"])
app.include_router(endpointroutes, prefix="/endpoints", tags=["Endpoint"])
app.include_router(shareroute, prefix="/share", tags=["Collaboration"])

# Include websocket routes
app.include_router(websocketroutes, prefix="/ws", tags=["websocket"])

# Include mock API routes (no prefix to catch all subdomain requests)
app.include_router(mock_router, tags=["Mock API"])

# Root endpoint
@app.get("/")
async def read_root():
    logger.info("Root endpoint accessed.")
    return {"message": "Hello World"}
