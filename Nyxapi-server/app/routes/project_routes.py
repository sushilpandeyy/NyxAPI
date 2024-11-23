import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.project_schema import Projectcreate, GetProject
from app.crud.project_crud import create_project, get_projects

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/project_routes.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ProjectRoutes")

projectroutes = APIRouter()

@projectroutes.post("/")
async def createproject(projectdata: Projectcreate, db: AsyncSession = Depends(get_db)):
    logger.info("Received request to create a new project.")
    try:
        # Extract data from the Pydantic model
        logger.debug(f"Project Data: {projectdata}")
        title = projectdata.title
        userid = projectdata.userid
        Description = projectdata.Description
        Img = projectdata.Img

        # Call the create_project function
        project = await create_project(db=db, title=title, userid=userid, Description=Description, Img=Img)
        logger.info(f"Project created successfully for UserID: {userid}, Title: {title}")

        return {"msg": "Project created", "project_info": project}
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@projectroutes.get("/")
async def getproject(userid: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to fetch projects for UserID: {userid}")
    try:
        # Call the get_projects function
        projects = await get_projects(db=db, userid=userid)
        logger.info(f"Fetched {len(projects)} projects for UserID: {userid}")

        return {"User": userid, "Projects": projects}
    except Exception as e:
        logger.error(f"Error fetching projects for UserID {userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")
