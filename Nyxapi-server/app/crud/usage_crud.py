import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.user import Usage 

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/usage_service.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("UsageService")

async def fetch_projects_quant(db: AsyncSession, userid: int):
    logger.info(f"Fetching project quantity for UserID: {userid}")
    try:
        # Create a query to select the Usage for the user
        query = select(Usage).where(Usage.Userid == userid)
        logger.debug(f"Query: {query}")

        # Execute the query
        result = await db.execute(query)
        logger.info(f"Query executed successfully for UserID: {userid}")

        projects_quantity = result.scalars().first()  # Use scalars() to get the first result

        if projects_quantity is None:
            logger.warning(f"No project quantity found for UserID: {userid}")
            raise HTTPException(status_code=404, detail="Project quantity not found")

        logger.info(f"Fetched project quantity for UserID {userid}: {projects_quantity}")
        return projects_quantity
    except SQLAlchemyError as e:
        logger.error(f"Database error while fetching project quantity for UserID {userid}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error fetching project quantity: {str(e)}")
