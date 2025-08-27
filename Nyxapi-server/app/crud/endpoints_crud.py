import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.user import Endpoint, Usage, Project    
from app.crud.usage_crud import fetch_projects_quant

# Get logger without configuring - inherit from main.py
logger = logging.getLogger("EndpointService")

# Function to create an endpoint
async def create_endpoint(db: AsyncSession, endpoint_str: str, projectid: int, apitype, payload: str):
    # Convert single string to array for consistency
    if isinstance(apitype, str):
        apitype_array = [apitype]
    else:
        apitype_array = apitype
    
    logger.info(f"🔗 Creating endpoint '{endpoint_str}' ({apitype_array}) for project {projectid}")
    try:
        new_endpoint = Endpoint(Endpoint=endpoint_str, Projectid=projectid, Apitype=apitype_array, Payload=payload)
        db.add(new_endpoint)
        await db.commit()
        await db.refresh(new_endpoint)
        logger.info(f"✅ Endpoint '{new_endpoint.Endpoint}' created with ID {new_endpoint.endpointid}")

        project_query = select(Project.UserID).where(Project.Projectid == projectid)
        result = await db.execute(project_query)
        userid = result.scalar()

        if not userid:
            logger.error(f"Project ID: {projectid} not found or UserID not available.")
            raise HTTPException(status_code=404, detail="Project not found or UserID not available")

        quant = await fetch_projects_quant(db=db, userid=userid)

        if quant:
            quant.Endpoints += 1
            await db.commit()
            await db.refresh(quant)
            logger.info(f"Usage record for UserID {userid} updated successfully.")
        else:
            logger.warning(f"No usage record found for UserID {userid}.")

        return new_endpoint

    except SQLAlchemyError as e:
        await db.rollback()
        logger.error(f"Error creating Endpoint for Project ID {projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error creating Endpoint: {str(e)}")


# Function to fetch endpoints for a given project
async def get_endpoints(db: AsyncSession, Projectid: int):
    logger.info(f"📁 Fetching all endpoints for project {Projectid}")
    try:
        query = select(Endpoint).filter(Endpoint.Projectid == Projectid)
        result = await db.execute(query)

        endpoint_list = result.scalars().all()
        logger.info(f"✅ Retrieved {len(endpoint_list)} endpoints for project {Projectid}")
        return endpoint_list
    except SQLAlchemyError as e:
        logger.error(f"Error fetching endpoints for Project ID {Projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error in getting endpoints: {str(e)}")


# Function to update the payload of an endpoint
async def update_endpoint_payload(db: AsyncSession, endpoint_id: int, new_payload: str):
    logger.info(f"🔄 Updating payload for endpoint ID {endpoint_id}")
    try:
        query = select(Endpoint).where(Endpoint.endpointid == endpoint_id)
        result = await db.execute(query)
        endpoint = result.scalar_one_or_none()

        if endpoint is None:
            logger.error(f"Endpoint with ID {endpoint_id} not found.")
            raise HTTPException(status_code=404, detail="Endpoint not found")

        logger.info(f"Fetched endpoint: {endpoint.Endpoint}. Updating payload to: {new_payload}")

        endpoint.Payload = new_payload
        await db.commit()
        await db.refresh(endpoint)

        logger.info(f"Endpoint ID {endpoint_id} payload updated successfully to: {endpoint.Payload}")
        return endpoint

    except SQLAlchemyError as e:
        await db.rollback()
        logger.error(f"Database error during payload update for Endpoint ID {endpoint_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error updating Endpoint payload: {str(e)}")

# Function to delete an endpoint
async def delete_endpoint(db: AsyncSession, endpoint_id: int, user_id: int):
    logger.info(f"🗑️ Attempting to delete endpoint {endpoint_id} for user {user_id}")
    try:
        # First, verify the endpoint exists and belongs to a project owned by the user
        endpoint_query = select(Endpoint).join(Project).filter(
            Endpoint.endpointid == endpoint_id,
            Project.UserID == user_id
        )
        result = await db.execute(endpoint_query)
        endpoint = result.scalar_one_or_none()

        if endpoint is None:
            logger.error(f"Endpoint {endpoint_id} not found or access denied for user {user_id}")
            raise HTTPException(status_code=404, detail="Endpoint not found or access denied")

        logger.info(f"🗑️ Deleting endpoint: {endpoint.Endpoint} (ID: {endpoint_id})")

        # Delete the endpoint
        await db.delete(endpoint)
        await db.commit()

        # Update usage statistics
        quant = await fetch_projects_quant(db=db, userid=user_id)
        if quant:
            quant.Endpoints = max(0, quant.Endpoints - 1)  # Ensure it doesn't go below 0
            await db.commit()
            await db.refresh(quant)
            logger.info(f"📊 Updated usage statistics for user {user_id}")

        logger.info(f"✅ Successfully deleted endpoint {endpoint_id}: {endpoint.Endpoint}")
        return {
            "message": f"Endpoint '{endpoint.Endpoint}' deleted successfully",
            "deleted_endpoint_id": endpoint_id,
            "endpoint_name": endpoint.Endpoint
        }

    except SQLAlchemyError as e:
        await db.rollback()
        logger.error(f"💥 Database error deleting endpoint {endpoint_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error deleting endpoint: {str(e)}")

# Function to get endpoint by ID with user verification
async def get_endpoint_by_id(db: AsyncSession, endpoint_id: int, user_id: int):
    logger.info(f"📋 Fetching endpoint {endpoint_id} for user {user_id}")
    try:
        query = select(Endpoint).join(Project).filter(
            Endpoint.endpointid == endpoint_id,
            Project.UserID == user_id
        )
        result = await db.execute(query)
        endpoint = result.scalar_one_or_none()
        
        if not endpoint:
            logger.warning(f"Endpoint {endpoint_id} not found for user {user_id}")
            return None
            
        return endpoint
    except SQLAlchemyError as e:
        logger.error(f"💥 Error fetching endpoint {endpoint_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching endpoint: {str(e)}")
