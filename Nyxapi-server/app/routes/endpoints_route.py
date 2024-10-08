from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.schema.endpoints_schema import Endpoints
from app.crud.endpoints_crud import create_endpoint

endpointroutes = APIRouter()

@endpointroutes.post("/")
async def createendpoint(endpointdata: Endpoints,  db: AsyncSession = Depends(get_db)):
    Endpoint = endpointdata.Endpoint
    Projectid = endpointdata.Projectid
    Apitype = endpointdata.Apitype
    Payload = endpointdata.Payload
    endpoint = await create_endpoint(db=db, Endpoint=Endpoint, Projectid=Projectid, Apitype=Apitype,Payload=Payload)
    return {"msg": "Endpoint created", "endpoint_info": endpoint}