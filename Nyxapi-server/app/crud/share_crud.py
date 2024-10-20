from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import Project, User  # Use the correct model name
from fastapi import HTTPException
import random
from sqlalchemy import text
from sqlalchemy.orm import selectinload

async def add_user_to_shared_crud(db: AsyncSession, projectid: int, user_email: str):
    # Fetch the user by email
    user_result = await db.execute(select(User).where(User.email == user_email))
    user = user_result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=404, detail="User with this email not found")

    userid = user.id  # Assuming the User model has an 'id' field

    # Fetch the project by projectid
    project_result = await db.execute(select(Project).where(Project.Projectid == projectid))
    project = project_result.scalar_one_or_none()
 
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if the userid is already in the Shared array
    if project.Shared and userid in project.Shared:
        raise HTTPException(status_code=400, detail="User ID already exists in Shared array")

    # Add userid to the Shared array and keep existing elements
    if project.Shared is None:
        project.Shared = [userid]  # Initialize Shared if it's None
    else:
        project.Shared = project.Shared + [userid]  # Append userid to the existing array

    # Commit the changes
    await db.commit()
    await db.refresh(project)

    return project

async def get_shared_emails_crud(db: AsyncSession, projectid: int):
    # Fetch the project by projectid
    project_result = await db.execute(select(Project).where(Project.Projectid == projectid))
    project = project_result.scalar_one_or_none()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    if not project.Shared or len(project.Shared) == 0:
        return []  # Return empty array if Shared array is empty

    # Fetch the email addresses for the user IDs in the Shared array
    user_result = await db.execute(select(User.email).where(User.id.in_(project.Shared)))
    emails = [row[0] for row in user_result.fetchall()]  # Extract the emails from the result

    return emails

async def remove_user_from_shared_crud(db: AsyncSession, projectid: int, user_email: str):
    # Fetch the user by email
    user_result = await db.execute(select(User).where(User.email == user_email))
    user = user_result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=404, detail="User with this email not found")

    userid = user.id  # Get the user's ID

    # Fetch the project by projectid
    project_result = await db.execute(select(Project).where(Project.Projectid == projectid))
    project = project_result.scalar_one_or_none()

    if project.UserID == userid:
        raise HTTPException(status_code=206, detail="Owner of Project")

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if the userid is in the Shared array
    if project.Shared and userid in project.Shared:
        project.Shared.remove(userid)  # Remove the userid from the Shared array

        # Prepare the updated Shared array
        updated_shared = project.Shared

        # Perform a direct update query to update the Shared column in the database
        await db.execute(
            text("""
                UPDATE projects
                SET "Shared" = :updated_shared
                WHERE "Projectid" = :projectid
            """),
            {"updated_shared": updated_shared, "projectid": projectid}
        )

        # Commit the changes
        await db.commit()

        # Optionally refresh the project to get updated info
        await db.refresh(project)
        return project

    raise HTTPException(status_code=400, detail="User ID not found in Shared array")

async def get_shared_projects_for_user(db: AsyncSession, userid: int):
    # Query to get projects where userid is in Shared and not the owner
    result = await db.execute(
        select(Project).where(
            (Project.Shared.any(userid)) & (Project.UserID != userid)  # Ensure user is not owner
        ).options(selectinload(Project.user))  # Optionally load related user data
    )

    projects = result.scalars().all()  # Fetch all matching projects

    if not projects:
        raise HTTPException(status_code=404, detail="No projects found shared with this user.")

    return projects

async def get_emails_by_initials(db: AsyncSession, name_initials: str):
    # Ensure the input initials are in lowercase for consistent matching
    initials = name_initials.lower()

    # Query users whose name starts with the provided initials (case-insensitive)
    user_result = await db.execute(
        select(User.email).where(User.name.ilike(f'{initials}%'))
    )

    # Extract the emails from the result using scalars()
    email_list = user_result.scalars().all()

    return email_list
