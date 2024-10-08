from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.project_schema import Projectcreate, GetProject 
from app.crud.project_crud import create_project, get_projects

projectroutes = APIRouter()

@projectroutes.post("/")
async def createproject(projectdata: Projectcreate,  db: AsyncSession = Depends(get_db)):
    title= projectdata.title
    userid=projectdata.userid

    project = await create_project(db=db, title=title, userid=userid)
    return {"msg": "Project created", "project_info": project}

@projectroutes.get("/")
async def getproject(userid: int, db: AsyncSession = Depends(get_db)):
    projects= get_projects(db=db, userid=userid)
    
    return {"User": userid , "Projects": projects}