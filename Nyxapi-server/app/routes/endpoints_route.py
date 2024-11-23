import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.endpoints_schema import Endpoints, PayloadUpdateRequest
from app.crud.endpoints_crud import create_endpoint, get_endpoints, update_endpoint_payload

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/endpoint_routes.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("EndpointRoutes")

endpointroutes = APIRouter()

@endpointroutes.post("/")
async def createendpoint(endpointdata: Endpoints, db: AsyncSession = Depends(get_db)):
    logger.info("Received request to create a new endpoint.")
    try:
        # Extract data from the Pydantic model
        endpoint_str = endpointdata.Endpoint
        projectid = endpointdata.Projectid
        apitype = endpointdata.Apitype
        payload = endpointdata.Payload
        logger.debug(f"Endpoint Data: Endpoint={endpoint_str}, ProjectID={projectid}, APIType={apitype}, Payload={payload}")

        # Call the create_endpoint function
        endpoint = await create_endpoint(
            db=db,
            endpoint_str=endpoint_str,
            projectid=projectid,
            apitype=apitype,
            payload=payload
        )
        logger.info(f"Endpoint created successfully for ProjectID: {projectid}, Endpoint: {endpoint.Endpoint}")

        return {"msg": "Endpoint created", "endpoint_info": endpoint}
    except HTTPException as e:
        logger.error(f"HTTPException during endpoint creation: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during endpoint creation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@endpointroutes.get("/{projectid}")
async def getendoints(projectid: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to fetch endpoints for ProjectID: {projectid}")
    try:
        # Call the get_endpoints function
        endpoints = await get_endpoints(db=db, Projectid=projectid)
        logger.info(f"Fetched {len(endpoints)} endpoints for ProjectID: {projectid}")

        return {"msg": "Endpoints Data", "Projectid": projectid, "endpoint_info": endpoints}
    except HTTPException as e:
        logger.error(f"HTTPException during fetching endpoints for ProjectID {projectid}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during fetching endpoints for ProjectID {projectid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@endpointroutes.put("/update_payload/{endpoint_id}")
async def update_payload(
    endpoint_id: int,
    request: PayloadUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    logger.info(f"Received request to update payload for EndpointID: {endpoint_id}")
    try:
        logger.debug(f"New payload: {request.payload}")

        # Call the update_endpoint_payload function
        updated_endpoint = await update_endpoint_payload(
            db=db,
            endpoint_id=endpoint_id,
            new_payload=request.payload
        )
        logger.info(f"Successfully updated payload for EndpointID: {endpoint_id}")

        return {
            "msg": "Endpoint payload updated successfully",
            "endpoint_id": endpoint_id,
            "updated_endpoint": updated_endpoint
        }
    except HTTPException as e:
        logger.error(f"HTTPException during payload update for EndpointID {endpoint_id}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during payload update for EndpointID {endpoint_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
