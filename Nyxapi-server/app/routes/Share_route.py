from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.project_schema import Projectcreate, GetProject 
from app.crud.share_crud import add_user_to_shared_crud, get_shared_emails_crud, remove_user_from_shared_crud, get_shared_projects_for_user, get_emails_by_initials
from app.schema.share_schema import AddUserToSharedRequest

shareroute = APIRouter()

@shareroute.get("/")
async def getsharedprojects(userid: int, db: AsyncSession = Depends(get_db)):
    try:
        response = await get_shared_projects_for_user(db=db, userid=userid)
        return {"data": response}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting projects: {str(e)}")

@shareroute.post("/")
async def add_user_to_shared(input: AddUserToSharedRequest, db: AsyncSession = Depends(get_db)):
    try:
        project = await add_user_to_shared_crud(db=db, projectid=input.projectid, user_email=input.email)
        return {"msg": "User added to Shared array", "project_info": project}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating project: {str(e)}")

@shareroute.get("/{projectid}")
async def get_shared_emails(projectid: int, db: AsyncSession = Depends(get_db)):
    try:
        emails = await get_shared_emails_crud(db=db, projectid=projectid)
        return {"emails": emails}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching emails: {str(e)}")

@shareroute.delete("/remove")
async def remove_user_from_shared(projectid: int, user_email: str, db: AsyncSession = Depends(get_db)):
    try:
        project = await remove_user_from_shared_crud(db=db, projectid=projectid, user_email=user_email)
        return {"msg": "User removed from Shared array", "project_info": project}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating project: {str(e)}")

@shareroute.get("/userslist/{init}")
async def get_emails(init: str, db: AsyncSession = Depends(get_db)):
    try:
        users = await get_emails_by_initials(db=db, name_initials=init)
        return {"users": users}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error in getting email list: {str(e)}")
