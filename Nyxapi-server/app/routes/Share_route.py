import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.project_schema import Projectcreate, GetProject
from app.crud.share_crud import (
    add_user_to_shared_crud,
    get_shared_emails_crud,
    remove_user_from_shared_crud,
    get_shared_projects_for_user,
    get_emails_by_initials
)
from app.schema.share_schema import AddUserToSharedRequest

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/fastapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ShareRoutes")

shareroute = APIRouter()

@shareroute.get("/")
async def getsharedprojects(userid: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to fetch shared projects for UserID: {userid}")
    try:
        response = await get_shared_projects_for_user(db=db, userid=userid)
        logger.info(f"Fetched {len(response)} shared projects for UserID: {userid}")
        return {"data": response}
    except HTTPException as e:
        logger.error(f"HTTPException while fetching shared projects for UserID {userid}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error while fetching shared projects for UserID {userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error getting projects: {str(e)}")

@shareroute.post("/")
async def add_user_to_shared(input: AddUserToSharedRequest, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to add user '{input.email}' to ProjectID: {input.projectid}")
    try:
        project = await add_user_to_shared_crud(db=db, projectid=input.projectid, user_email=input.email)
        logger.info(f"User '{input.email}' added to Shared array for ProjectID: {input.projectid}")
        return {"msg": "User added to Shared array", "project_info": project}
    except HTTPException as e:
        logger.error(f"HTTPException while adding user to Shared array for ProjectID {input.projectid}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error while adding user to Shared array for ProjectID {input.projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error updating project: {str(e)}")

@shareroute.get("/{projectid}")
async def get_shared_emails(projectid: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to fetch shared emails for ProjectID: {projectid}")
    try:
        emails = await get_shared_emails_crud(db=db, projectid=projectid)
        logger.info(f"Fetched {len(emails)} emails for ProjectID: {projectid}")
        return {"emails": emails}
    except HTTPException as e:
        logger.error(f"HTTPException while fetching shared emails for ProjectID {projectid}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error while fetching shared emails for ProjectID {projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching emails: {str(e)}")

@shareroute.delete("/remove")
async def remove_user_from_shared(projectid: int, user_email: str, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to remove user '{user_email}' from ProjectID: {projectid}")
    try:
        project = await remove_user_from_shared_crud(db=db, projectid=projectid, user_email=user_email)
        logger.info(f"User '{user_email}' removed from Shared array for ProjectID: {projectid}")
        return {"msg": "User removed from Shared array", "project_info": project}
    except HTTPException as e:
        logger.error(f"HTTPException while removing user from Shared array for ProjectID {projectid}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error while removing user from Shared array for ProjectID {projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error updating project: {str(e)}")

@shareroute.get("/userslist/{init}")
async def get_emails(init: str, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to fetch users by initials '{init}'")
    try:
        users = await get_emails_by_initials(db=db, name_initials=init)
        logger.info(f"Fetched {len(users)} users matching initials '{init}'")
        return {"users": users}
    except HTTPException as e:
        logger.error(f"HTTPException while fetching users by initials '{init}': {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error while fetching users by initials '{init}': {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error in getting email list: {str(e)}")
