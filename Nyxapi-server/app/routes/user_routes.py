import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import user_crud
from app.config import get_db
from app.schema.user_schema import UserCreate, UserAuthenticate  # Import the Pydantic models

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/user_routes.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("UserRoutes")

userrouter = APIRouter()

@userrouter.post("/")
async def create_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to create user with email: {user_data.email}")
    try:
        # Extract fields from the Pydantic model
        name = user_data.name
        email = user_data.email
        password = user_data.password

        # Check if user already exists
        existing_user = await user_crud.get_user_by_email(db, email)
        if existing_user:
            logger.warning(f"User with email {email} already exists.")
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create a new user
        user = await user_crud.create_user(db=db, name=name, email=email, password=password)
        logger.info(f"User created successfully with email: {email}")
        return {"msg": "User created", "user": user}
    except HTTPException as e:
        logger.error(f"HTTPException during user creation for email {user_data.email}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during user creation for email {user_data.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@userrouter.post("/{user_id}/verify/")
async def verify_user_email(user_id: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to verify email for UserID: {user_id}")
    try:
        # Verify the user's email
        verified = await user_crud.verify_user_email(db, user_id)
        if not verified:
            logger.warning(f"UserID {user_id} not found for email verification.")
            raise HTTPException(status_code=404, detail="User not found")

        logger.info(f"Email verified successfully for UserID: {user_id}")
        return {"msg": "Email verified"}
    except HTTPException as e:
        logger.error(f"HTTPException during email verification for UserID {user_id}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during email verification for UserID {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@userrouter.post("/authenticate/")
async def authenticate_user(user_data: UserAuthenticate, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received request to authenticate user with email: {user_data.email}")
    try:
        # Extract email and password from the Pydantic model
        email = user_data.email
        password = user_data.password

        # Authenticate the user
        user = await user_crud.authenticate_user(db, email, password)
        if not user:
            logger.warning(f"Authentication failed for email: {email}")
            raise HTTPException(status_code=400, detail="Invalid credentials")

        logger.info(f"User authenticated successfully with email: {email}")
        return {"msg": "User authenticated", "user": user}
    except HTTPException as e:
        logger.error(f"HTTPException during authentication for email {user_data.email}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during authentication for email {user_data.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")
