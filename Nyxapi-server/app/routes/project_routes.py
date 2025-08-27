import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.project_schema import Projectcreate, GetProject
from app.crud.project_crud import create_project, get_projects, delete_project, get_project_by_id

# Get logger without configuring - inherit from main.py
logger = logging.getLogger("ProjectRoutes")

projectroutes = APIRouter()

@projectroutes.post("/")
async def createproject(projectdata: Projectcreate, db: AsyncSession = Depends(get_db)):
    logger.info(f"📁 Creating new project for user: {projectdata.userid}")
    try:
        # Extract data from the Pydantic model
        title = projectdata.title
        userid = projectdata.userid
        Description = projectdata.Description
        Img = projectdata.Img

        # Call the create_project function
        project = await create_project(db=db, title=title, userid=userid, Description=Description, Img=Img)
        logger.info(f"✅ Project '{title}' created successfully for UserID: {userid}")

        return {"msg": "Project created", "project_info": project}
    except Exception as e:
        logger.error(f"💥 Error creating project for UserID {projectdata.userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@projectroutes.get("/")
async def getproject(userid: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"📋 Fetching projects for UserID: {userid}")
    try:
        # Call the get_projects function
        projects = await get_projects(db=db, userid=userid)
        logger.info(f"✅ Found {len(projects)} projects for UserID: {userid}")

        return {"User": userid, "Projects": projects}
    except Exception as e:
        logger.error(f"💥 Error fetching projects for UserID {userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@projectroutes.delete("/{project_id}")
async def deleteproject(project_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"🗑️ Delete request for project {project_id} from user {user_id}")
    try:
        # Delete the project and associated endpoints
        result = await delete_project(db=db, project_id=project_id, user_id=user_id)
        logger.info(f"✅ Successfully deleted project {project_id}")
        return result
    except HTTPException as e:
        logger.error(f"❌ Failed to delete project {project_id}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"💥 Unexpected error deleting project {project_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@projectroutes.get("/{project_id}")
async def getprojectbyid(project_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"📋 Fetching project {project_id} for user {user_id}")
    try:
        project = await get_project_by_id(db=db, project_id=project_id, user_id=user_id)
        if not project:
            logger.warning(f"Project {project_id} not found for user {user_id}")
            raise HTTPException(status_code=404, detail="Project not found")
        
        logger.info(f"✅ Found project: {project.Title}")
        return {"msg": "Project found", "project_info": project}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"💥 Error fetching project {project_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")
