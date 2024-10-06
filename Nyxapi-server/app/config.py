import ssl
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

 
DATABASE_URL = "postgresql+asyncpg://nyxdb_owner:4yqLIN0VJcTY@ep-young-surf-a1edx31m.ap-southeast-1.aws.neon.tech/nyxdb"

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"ssl": ssl_context}  
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession   
)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
