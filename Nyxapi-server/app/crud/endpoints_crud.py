import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.user import Endpoint, Usage, Project    
from app.crud.usage_crud import fetch_projects_quant

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/endpoint_service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("EndpointService")

# Function to create an endpoint
async def create_endpoint(db: AsyncSession, endpoint_str: str, projectid: int, apitype: str, payload: str):
    logger.info(f"Creating endpoint for Project ID: {projectid}")
    try:
        new_endpoint = Endpoint(Endpoint=endpoint_str, Projectid=projectid, Apitype={"G", "P"}, Payload=payload)
        db.add(new_endpoint)
        await db.commit()
        await db.refresh(new_endpoint)
        logger.info(f"Endpoint {new_endpoint.Endpoint} created successfully.")

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
    logger.info(f"Fetching endpoints for Project ID: {Projectid}")
    try:
        query = select(Endpoint).filter(Endpoint.Projectid == Projectid)
        result = await db.execute(query)

        endpoint_list = result.scalars().all()
        logger.info(f"Fetched {len(endpoint_list)} endpoints for Project ID: {Projectid}")
        return endpoint_list
    except SQLAlchemyError as e:
        logger.error(f"Error fetching endpoints for Project ID {Projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error in getting endpoints: {str(e)}")


# Function to update the payload of an endpoint
async def update_endpoint_payload(db: AsyncSession, endpoint_id: int, new_payload: str):
    logger.info(f"Attempting to update payload for Endpoint ID: {endpoint_id}")
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
