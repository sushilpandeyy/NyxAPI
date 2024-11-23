import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text
from sqlalchemy.orm import selectinload
from app.models.user import Project, User  # Use the correct model name
from fastapi import HTTPException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/fastapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("SharedProjectService")

# Add user to shared array
async def add_user_to_shared_crud(db: AsyncSession, projectid: int, user_email: str):
    logger.info(f"Attempting to add user with email '{user_email}' to Project ID: {projectid}")
    try:
        # Fetch the user by email
        user_result = await db.execute(select(User).where(User.email == user_email))
        user = user_result.scalar_one_or_none()

        if user is None:
            logger.warning(f"User with email '{user_email}' not found.")
            raise HTTPException(status_code=404, detail="User with this email not found")

        userid = user.id  # Assuming the User model has an 'id' field

        # Fetch the project by projectid
        project_result = await db.execute(select(Project).where(Project.Projectid == projectid))
        project = project_result.scalar_one_or_none()

        if project is None:
            logger.warning(f"Project with ID {projectid} not found.")
            raise HTTPException(status_code=404, detail="Project not found")

        # Check if the userid is already in the Shared array
        if project.Shared and userid in project.Shared:
            logger.info(f"User ID {userid} already exists in Shared array for Project ID: {projectid}")
            raise HTTPException(status_code=400, detail="User ID already exists in Shared array")

        # Add userid to the Shared array and keep existing elements
        if project.Shared is None:
            project.Shared = [userid]
        else:
            project.Shared = project.Shared + [userid]

        # Commit the changes
        await db.commit()
        await db.refresh(project)
        logger.info(f"User ID {userid} added to Shared array for Project ID: {projectid}")

        return project
    except Exception as e:
        logger.error(f"Error adding user to Shared array for Project ID {projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error adding user to Shared array: {str(e)}")


# Get shared emails for a project
async def get_shared_emails_crud(db: AsyncSession, projectid: int):
    logger.info(f"Fetching shared emails for Project ID: {projectid}")
    try:
        # Fetch the project by projectid
        project_result = await db.execute(select(Project).where(Project.Projectid == projectid))
        project = project_result.scalar_one_or_none()

        if project is None:
            logger.warning(f"Project with ID {projectid} not found.")
            raise HTTPException(status_code=404, detail="Project not found")

        if not project.Shared or len(project.Shared) == 0:
            logger.info(f"No shared users for Project ID: {projectid}")
            return []

        # Fetch the email addresses for the user IDs in the Shared array
        user_result = await db.execute(select(User.email).where(User.id.in_(project.Shared)))
        emails = [row[0] for row in user_result.fetchall()]
        logger.info(f"Fetched {len(emails)} shared emails for Project ID: {projectid}")

        return emails
    except Exception as e:
        logger.error(f"Error fetching shared emails for Project ID {projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching shared emails: {str(e)}")


# Remove user from shared array
async def remove_user_from_shared_crud(db: AsyncSession, projectid: int, user_email: str):
    logger.info(f"Attempting to remove user with email '{user_email}' from Project ID: {projectid}")
    try:
        # Fetch the user by email
        user_result = await db.execute(select(User).where(User.email == user_email))
        user = user_result.scalar_one_or_none()

        if user is None:
            logger.warning(f"User with email '{user_email}' not found.")
            raise HTTPException(status_code=404, detail="User with this email not found")

        userid = user.id

        # Fetch the project by projectid
        project_result = await db.execute(select(Project).where(Project.Projectid == projectid))
        project = project_result.scalar_one_or_none()

        if project is None:
            logger.warning(f"Project with ID {projectid} not found.")
            raise HTTPException(status_code=404, detail="Project not found")

        if project.UserID == userid:
            logger.warning(f"Cannot remove owner of Project ID: {projectid} from Shared array.")
            raise HTTPException(status_code=206, detail="Owner of Project")

        # Check if the userid is in the Shared array
        if project.Shared and userid in project.Shared:
            project.Shared.remove(userid)

            # Perform a direct update query to update the Shared column in the database
            await db.execute(
                text("""
                    UPDATE projects
                    SET "Shared" = :updated_shared
                    WHERE "Projectid" = :projectid
                """),
                {"updated_shared": project.Shared, "projectid": projectid}
            )

            # Commit the changes
            await db.commit()
            await db.refresh(project)
            logger.info(f"User ID {userid} removed from Shared array for Project ID: {projectid}")

            return project

        logger.info(f"User ID {userid} not found in Shared array for Project ID: {projectid}")
        raise HTTPException(status_code=400, detail="User ID not found in Shared array")
    except Exception as e:
        logger.error(f"Error removing user from Shared array for Project ID {projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error removing user from Shared array: {str(e)}")


# Get shared projects for a user
async def get_shared_projects_for_user(db: AsyncSession, userid: int):
    logger.info(f"Fetching shared projects for User ID: {userid}")
    try:
        # Query to get projects where userid is in Shared and not the owner
        result = await db.execute(
            select(Project).where(
                (Project.Shared.any(userid)) & (Project.UserID != userid)
            ).options(selectinload(Project.user))
        )

        projects = result.scalars().all()

        if not projects:
            logger.info(f"No projects found shared with User ID: {userid}")
            raise HTTPException(status_code=404, detail="No projects found shared with this user.")

        logger.info(f"Fetched {len(projects)} shared projects for User ID: {userid}")
        return projects
    except Exception as e:
        logger.error(f"Error fetching shared projects for User ID {userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching shared projects: {str(e)}")


# Get emails by initials
async def get_emails_by_initials(db: AsyncSession, name_initials: str):
    logger.info(f"Fetching emails for users with name initials '{name_initials}'")
    try:
        initials = name_initials.lower()

        # Query users whose name starts with the provided initials
        user_result = await db.execute(
            select(User.email).where(User.name.ilike(f'{initials}%'))
        )

        email_list = user_result.scalars().all()
        logger.info(f"Fetched {len(email_list)} emails matching initials '{name_initials}'")
        return email_list
    except Exception as e:
        logger.error(f"Error fetching emails for initials '{name_initials}': {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching emails: {str(e)}")
