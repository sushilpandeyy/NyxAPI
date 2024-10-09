from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import Endpoint   
from fastapi import HTTPException
from pydantic import Json

async def create_endpoint(db: AsyncSession, endpoint_str: str, projectid: int, apitype: str, payload: str):
    try:
        # Create a new Endpoint instance
        new_endpoint = Endpoint(Endpoint=endpoint_str, Projectid=projectid, Apitype=apitype, Payload=payload)
        db.add(new_endpoint)  # Add it to the session
        await db.commit()  # Commit the transaction
        await db.refresh(new_endpoint)  # Refresh the instance to get updated data

        return new_endpoint  # Return the created endpoint
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating Endpoint: {str(e)}")

async def get_endpoints(db: AsyncSession, Projectid: int):
    try:
        query = select(Endpoint).filter(Endpoint.Projectid == Projectid)  # Corrected to use the 'Project' model
        result = await db.execute(query)

        endpoint_list = result.scalars().all()
        return endpoint_list
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error in getting endpoints: {str(e)}")

