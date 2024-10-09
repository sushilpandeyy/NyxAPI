from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.end import Endpoint 

# Define the function to search for projectid and endpoint in the endpoints table
async def get_response(db: AsyncSession, endpoint: str, projid: int):
    # Build a SQLAlchemy query to search for matching projectid and endpoint
    print("printing")
    print(projid)
    print(endpoint)
    stmt = select(Endpoint).where(
        Endpoint.Projectid == projid,
        Endpoint.Endpoint == endpoint
    )

    # Execute the query asynchronously
    result = await db.execute(stmt)
    
    # Fetch the first matching result
    endpoint_record = result.scalar_one_or_none()
    print("endpoint")
    print(endpoint_record)
    if endpoint_record:
        # Return the matched record details
        return {"projectid": projid, "endpoint": endpoint, "data": endpoint_record}
    else:
        # Return a message if no matching record is found
        return {"error": "No matching record found for the given projectid and endpoint"}
