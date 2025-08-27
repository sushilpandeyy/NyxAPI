import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.endpoints_schema import Endpoints, PayloadUpdateRequest
from app.crud.endpoints_crud import create_endpoint, get_endpoints, update_endpoint_payload, delete_endpoint, get_endpoint_by_id

# Get logger without configuring - inherit from main.py
logger = logging.getLogger("EndpointRoutes")

endpointroutes = APIRouter()

@endpointroutes.post("/")
async def createendpoint(endpointdata: Endpoints, db: AsyncSession = Depends(get_db)):
    logger.info(f"🔗 Creating endpoint '{endpointdata.Endpoint}' for project {endpointdata.Projectid}")
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
        logger.info(f"✅ Endpoint '{endpoint.Endpoint}' created successfully for project {projectid}")

        return {"msg": "Endpoint created", "endpoint_info": endpoint}
    except HTTPException as e:
        logger.error(f"❌ Endpoint creation failed: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"💥 Unexpected error during endpoint creation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@endpointroutes.get("/{projectid}")
async def getendoints(projectid: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"📁 Fetching endpoints for project {projectid}")
    try:
        # Call the get_endpoints function
        endpoints = await get_endpoints(db=db, Projectid=projectid)
        logger.info(f"✅ Found {len(endpoints)} endpoints for project {projectid}")

        return {"msg": "Endpoints Data", "Projectid": projectid, "endpoint_info": endpoints}
    except HTTPException as e:
        logger.error(f"❌ Failed to fetch endpoints for project {projectid}: {e.detail}")
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
    logger.info(f"🔄 Updating payload for endpoint {endpoint_id}")
    try:
        logger.debug(f"New payload: {request.payload}")

        # Call the update_endpoint_payload function
        updated_endpoint = await update_endpoint_payload(
            db=db,
            endpoint_id=endpoint_id,
            new_payload=request.payload
        )
        logger.info(f"✅ Payload updated successfully for endpoint {endpoint_id}")

        return {
            "msg": "Endpoint payload updated successfully",
            "endpoint_id": endpoint_id,
            "updated_endpoint": updated_endpoint
        }
    except HTTPException as e:
        logger.error(f"HTTPException during payload update for EndpointID {endpoint_id}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"💥 Unexpected error during payload update for EndpointID {endpoint_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@endpointroutes.delete("/{endpoint_id}")
async def deleteendpoint(
    endpoint_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    logger.info(f"🗑️ Delete request for endpoint {endpoint_id} from user {user_id}")
    try:
        # Delete the endpoint
        result = await delete_endpoint(db=db, endpoint_id=endpoint_id, user_id=user_id)
        logger.info(f"✅ Successfully deleted endpoint {endpoint_id}")
        return result
    except HTTPException as e:
        logger.error(f"❌ Failed to delete endpoint {endpoint_id}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"💥 Unexpected error deleting endpoint {endpoint_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@endpointroutes.get("/single/{endpoint_id}")
async def getendpointbyid(
    endpoint_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    logger.info(f"📋 Fetching endpoint {endpoint_id} for user {user_id}")
    try:
        endpoint = await get_endpoint_by_id(db=db, endpoint_id=endpoint_id, user_id=user_id)
        if not endpoint:
            logger.warning(f"Endpoint {endpoint_id} not found for user {user_id}")
            raise HTTPException(status_code=404, detail="Endpoint not found")
        
        logger.info(f"✅ Found endpoint: {endpoint.Endpoint}")
        return {"msg": "Endpoint found", "endpoint_info": endpoint}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"💥 Error fetching endpoint {endpoint_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")
