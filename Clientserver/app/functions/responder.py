import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.end import Endpoint 

async def get_response(db: AsyncSession, endpoint: str, projid: int):
    print("printing")
    print(projid)
    print(endpoint)
    stmt = select(Endpoint).where(
        Endpoint.Projectid == projid,
        Endpoint.Endpoint == endpoint
    )

    result = await db.execute(stmt)
    
    endpoint_record = result.scalar_one_or_none()
    print("endpoint")
    print(endpoint_record)
    if endpoint_record:
        # Parse the payload from string to JSON
        payload = json.loads(endpoint_record.Payload)
        return payload
    else:
        return {"error": "No matching record found for the given projectid and endpoint"}
