from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.user import Usage 

async def fetch_projects_quant(db: AsyncSession, userid: int):
    try:
        # Create a query to select the Usage for the user
        query = select(Usage).where(Usage.Userid == userid)
        
        # Execute the query
        result = await db.execute(query)
        
        projects_quantity = result.scalars().first()  # Use scalars() to get the first result
        
        if projects_quantity is None:
            raise HTTPException(status_code=404, detail="Project quantity not found")
        
        return projects_quantity
    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail=f"Error fetching project quantity: {str(e)}")