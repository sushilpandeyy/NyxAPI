from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import Project
from passlib.context import CryptContext
from typing import Optional
from fastapi import HTTPException
import random

def generate_random_six_digit():
    return random.randint(100000, 999999)


async def create_project(db: AsyncSession, title: str, userid: int):
    try: 
        project = Project(Projectid=generate_random_six_digit(), Title=title, UserID=userid )
        db.add(project)
        await db.commit()
        await db.refresh(project)

        return project
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating project: {str(e)}")

async def get_projects(db: AsyncSession, userid: int):
    try:
        query = select(projects).filter(projects.UserID == userid)
        result = await db.execute(query)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error in getting projects: {str(e)}")