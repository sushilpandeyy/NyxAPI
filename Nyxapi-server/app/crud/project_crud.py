import logging
import random
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from app.models.user import Project, User, Usage  # Use the correct model name
from fastapi import HTTPException
from app.crud.usage_crud import fetch_projects_quant

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/project_service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ProjectService")

# Helper function to generate a random 6-digit number
def generate_random_six_digit():
    random_number = random.randint(100000, 999999)
    logger.info(f"Generated random 6-digit Project ID: {random_number}")
    return random_number

# Function to create a new project
async def create_project(db: AsyncSession, title: str, userid: int, Description: str, Img: str):
    logger.info(f"Attempting to create project for UserID: {userid} with title: {title}")
    try:
        # Create a new Project instance
        project = Project(
            Projectid=generate_random_six_digit(),  # Generate a random Project ID
            Title=title,
            UserID=userid,
            Description=Description,
            Img=Img
        )
        db.add(project)  # Add the project to the session
        await db.commit()  # Commit the transaction
        await db.refresh(project)  # Refresh the project instance with the latest data
        logger.info(f"Project {project.Projectid} created successfully for UserID: {userid}.")

        # Fetch current usage for the given userid
        quant = await fetch_projects_quant(db=db, userid=userid)

        if quant:  # If a usage record exists, update it
            quant.Project += 1  # Increment the Project count
            await db.commit()
            await db.refresh(quant)
            logger.info(f"Usage record updated successfully for UserID: {userid}. New project count: {quant.Project}.")
        else:  # If no usage record exists, handle accordingly
            logger.warning(f"No usage record found for UserID: {userid}.")
            raise HTTPException(status_code=404, detail="No usage record found for the given user")

        return project  # Return the created project
    except SQLAlchemyError as e:
        await db.rollback()  # Rollback the transaction in case of error
        logger.error(f"Error creating project for UserID {userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error creating project: {str(e)}")

# Function to get all projects for a specific user
async def get_projects(db: AsyncSession, userid: int):
    logger.info(f"Fetching all projects for UserID: {userid}")
    try:
        # Query to select all projects where the UserID matches the given user id
        query = select(Project).filter(Project.UserID == userid)
        result = await db.execute(query)

        # Fetch all the results as a list of project instances
        projects_list = result.scalars().all()
        logger.info(f"Fetched {len(projects_list)} projects for UserID: {userid}.")
        return projects_list
    except SQLAlchemyError as e:
        logger.error(f"Error fetching projects for UserID {userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error in getting projects: {str(e)}")
