from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import Endpoint, Usage, Project    
from app.crud.usage_crud import fetch_projects_quant
from fastapi import HTTPException
from pydantic import Json
from termcolor import cprint

async def create_endpoint(db: AsyncSession, endpoint_str: str, projectid: int, apitype: str, payload: str):
    try:
        cprint(f"Creating endpoint for Project ID: {projectid}", 'cyan')

        new_endpoint = Endpoint(Endpoint=endpoint_str, Projectid=projectid, Apitype=apitype, Payload=payload)
        db.add(new_endpoint)
        await db.commit()
        await db.refresh(new_endpoint)

        cprint(f"Endpoint {new_endpoint.Endpoint} created successfully!", 'green')

        project_query = select(Project.UserID).where(Project.Projectid == projectid)
        result = await db.execute(project_query)
        userid = result.scalar()

        if not userid:
            cprint(f"Project ID: {projectid} not found or UserID not available", 'red')
            raise HTTPException(status_code=404, detail="Project not found or UserID not available")

        quant = await fetch_projects_quant(db=db, userid=userid)

        if quant:
            quant.Endpoints += 1
            await db.commit()
            await db.refresh(quant)
            cprint(f"Usage record for UserID {userid} updated successfully!", 'green')
        else:
            cprint(f"No usage record found for UserID {userid}", 'yellow')

        return new_endpoint

    except SQLAlchemyError as e:
        await db.rollback()
        cprint(f"Error creating Endpoint: {str(e)}", 'red')
        raise HTTPException(status_code=400, detail=f"Error creating Endpoint: {str(e)}")


async def get_endpoints(db: AsyncSession, Projectid: int):
    try:
        query = select(Endpoint).filter(Endpoint.Projectid == Projectid)  # Corrected to use the 'Project' model
        result = await db.execute(query)

        endpoint_list = result.scalars().all()
        return endpoint_list
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error in getting endpoints: {str(e)}")

async def update_endpoint_payload(db: AsyncSession, endpoint_id: int, new_payload: str):
    """
    Updates the payload of an existing endpoint by endpoint ID.
    
    Args:
        db (AsyncSession): Database session.
        endpoint_id (int): ID of the endpoint to update.
        new_payload (str): The new payload to set for the endpoint.
    
    Returns:
        Endpoint: The updated endpoint object.
    """
    try:
        # Fetch the endpoint by ID
        query = select(Endpoint).where(Endpoint.id == endpoint_id)
        result = await db.execute(query)
        endpoint = result.scalar_one_or_none()
        
        # Check if the endpoint exists
        if endpoint is None:
            cprint(f"Endpoint with ID {endpoint_id} not found", 'red')
            raise HTTPException(status_code=404, detail="Endpoint not found")

        # Update the payload
        endpoint.Payload = new_payload
        await db.commit()
        await db.refresh(endpoint)

        cprint(f"Endpoint {endpoint_id} payload updated successfully!", 'green')
        
        return endpoint

    except SQLAlchemyError as e:
        await db.rollback()
        cprint(f"Error updating Endpoint payload: {str(e)}", 'red')
        raise HTTPException(status_code=400, detail=f"Error updating Endpoint payload: {str(e)}")