from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.endpoints_schema import Endpoints, PayloadUpdateRequest
from app.crud.endpoints_crud import create_endpoint, get_endpoints, update_endpoint_payload

endpointroutes = APIRouter()

@endpointroutes.post("/")
async def createendpoint(endpointdata: Endpoints, db: AsyncSession = Depends(get_db)):
    # Extract data from the Pydantic model
    endpoint_str = endpointdata.Endpoint  # Changed to 'endpoint_str' to match the function signature
    projectid = endpointdata.Projectid
    apitype = endpointdata.Apitype
    payload = endpointdata.Payload
    
    # Call the create_endpoint function
    endpoint = await create_endpoint(db=db, endpoint_str=endpoint_str, projectid=projectid, apitype=apitype, payload=payload)
    
    return {"msg": "Endpoint created", "endpoint_info": endpoint}

@endpointroutes.get("/{projectid}")
async def getendoints(projectid: int, db: AsyncSession = Depends(get_db)):
    endpoints= await get_endpoints(db=db, Projectid=projectid)
    return {"msg": "Endpoints Data", "Projectid": projectid,"endpoint_info": endpoints}

@endpointroutes.put("/update_payload/{endpoint_id}")
async def update_payload(
    endpoint_id: int,
    request: PayloadUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        print(f"Received request to update payload for endpoint ID {endpoint_id}")
        print(f"New payload: {request.payload}")
        
        updated_endpoint = await update_endpoint_payload(db=db, endpoint_id=endpoint_id, new_payload=request.payload)
        
        print(f"Successfully updated payload for endpoint ID {endpoint_id}")
        return {
            "msg": "Endpoint payload updated successfully",
            "endpoint_id": endpoint_id,
            "updated_endpoint": updated_endpoint
        }
    except HTTPException as e:
        print(f"HTTPException raised: {e.detail}")
        raise e
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

