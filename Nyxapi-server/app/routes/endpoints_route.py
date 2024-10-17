from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.endpoints_schema import Endpoints
from app.crud.endpoints_crud import create_endpoint, get_endpoints

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
