import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import user_crud
from app.crud.user_crud import delete_user_account, get_user_by_id
from app.config import get_db
from app.schema.user_schema import UserCreate, UserAuthenticate, UserDelete  # Import the Pydantic models

# Configure logging - no need to reconfigure, inherit from main
logger = logging.getLogger("UserRoutes")

userrouter = APIRouter()

@userrouter.post("/")
async def create_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    logger.info(f"👤 Creating new user: {user_data.email}")
    try:
        # Extract fields from the Pydantic model
        name = user_data.name
        email = user_data.email
        password = user_data.password

        # Check if user already exists
        existing_user = await user_crud.get_user_by_email(db, email)
        if existing_user:
            logger.warning(f"⚠️ User registration failed - email already exists: {email}")
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create a new user
        user = await user_crud.create_user(db=db, name=name, email=email, password=password)
        logger.info(f"✅ User created successfully: {email}")
        return {"msg": "User created", "user": user}
    except HTTPException as e:
        logger.error(f"❌ User creation failed for {user_data.email}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"💥 Unexpected error during user creation for {user_data.email}: {str(e)}", exc_info=True)
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
    logger.info(f"🔐 Authentication attempt: {user_data.email}")
    try:
        # Extract email and password from the Pydantic model
        email = user_data.email
        password = user_data.password

        # Authenticate the user
        user = await user_crud.authenticate_user(db, email, password)
        if not user:
            logger.warning(f"🚫 Authentication failed - invalid credentials: {email}")
            raise HTTPException(status_code=400, detail="Invalid credentials")

        logger.info(f"✅ User authenticated successfully: {email}")
        return {"msg": "User authenticated", "user": user}
    except HTTPException as e:
        logger.error(f"❌ Authentication failed for {user_data.email}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"💥 Unexpected authentication error for {user_data.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@userrouter.delete("/{user_id}")
async def deleteuser(user_id: int, user_data: UserDelete, db: AsyncSession = Depends(get_db)):
    logger.info(f"🗑️ Account deletion request for user {user_id} ({user_data.email})")
    try:
        # Validate confirmation text
        if user_data.confirmation.upper() != "DELETE":
            logger.warning(f"Invalid confirmation text for account deletion: {user_data.email}")
            raise HTTPException(status_code=400, detail="Invalid confirmation. Please type 'DELETE' to confirm.")
        
        # Delete the user account and all associated data
        result = await delete_user_account(
            db=db, 
            user_id=user_id, 
            email=user_data.email, 
            password=user_data.password
        )
        
        logger.info(f"✅ Successfully deleted user account {user_data.email}")
        return result
        
    except HTTPException as e:
        logger.error(f"❌ Failed to delete user account {user_data.email}: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"💥 Unexpected error deleting user account {user_data.email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")


@userrouter.get("/{user_id}")
async def getuserbyid(user_id: int, db: AsyncSession = Depends(get_db)):
    logger.info(f"📋 Fetching user {user_id}")
    try:
        user = await get_user_by_id(db=db, user_id=user_id)
        if not user:
            logger.warning(f"User {user_id} not found")
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"✅ Found user: {user.email}")
        # Don't return sensitive information
        return {
            "msg": "User found", 
            "user_info": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "email_verified": user.email_verified,
                "created": user.created,
                "account_type": user.accounttype,
                "avatar_url": user.avatar_url
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"💥 Error fetching user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Server error")
