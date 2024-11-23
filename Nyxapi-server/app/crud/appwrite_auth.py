import logging
import os
from appwrite.client import Client
from appwrite.services.account import Account
from appwrite.services.users import Users
from fastapi import HTTPException
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/fastapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("AppwriteIntegration")

# Load environment variables from .env file
load_dotenv()

# Initialize Appwrite client
client = Client()
try:
    client.set_endpoint(os.getenv('APPWRITE_ENDPOINT'))  # Your Appwrite endpoint
    client.set_project(os.getenv('APPWRITE_PROJECT_ID'))  # Your project ID
    client.set_key(os.getenv('APPWRITE_API_KEY'))  # Your API key
    logger.info("Appwrite client initialized successfully.")
except Exception as e:
    logger.critical(f"Failed to initialize Appwrite client: {e}", exc_info=True)
    raise

# Appwrite services
users_service = Users(client)  # Server-side user management
account_service = Account(client)  # Client-side user session management

# Register a new user using the Users service
async def appwrite_register_user(email: str, password: str, name: str):
    logger.info(f"Attempting to register user: {email}, Name: {name}")
    try:
        user = users_service.create(
            user_id='unique()',  # Automatically generate a unique user ID
            email=email,
            password=password,
            name=name
        )
        logger.info(f"User registered successfully: {user['$id']}")
        return user
    except Exception as e:
        logger.error(f"Registration failed for email: {email}, Error: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

# Send email verification using the Account service
async def appwrite_send_verification_email():
    logger.info("Attempting to send email verification.")
    try:
        result = account_service.create_verification(
            url=os.getenv('APPWRITE_VERIFICATION_URL')  # The URL the user clicks to verify their email
        )
        logger.info("Verification email sent successfully.")
        return {"message": "Verification email sent"}
    except Exception as e:
        logger.error(f"Error sending verification email: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error sending verification email: {str(e)}")

# Log in a user and create a session
async def appwrite_login_user(email: str, password: str):
    logger.info(f"Attempting login for user: {email}")
    try:
        session = account_service.create_session(
            email=email,
            password=password
        )
        logger.info(f"User logged in successfully: {session['$id']}")
        return session  # Return session information if login is successful
    except Exception as e:
        logger.error(f"Login failed for email: {email}, Error: {e}", exc_info=True)
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")

# Get the logged-in user's account details (after login)
async def appwrite_get_current_user():
    logger.info("Fetching current user details.")
    try:
        user = account_service.get()  # Get the logged-in user's information
        logger.info(f"User details retrieved successfully: {user['$id']}")
        return user
    except Exception as e:
        logger.error(f"Unable to retrieve user details, Error: {e}", exc_info=True)
        raise HTTPException(status_code=401, detail=f"Unable to retrieve user details: {str(e)}")

# Log out the current user (delete session)
async def appwrite_logout_user():
    logger.info("Attempting to logout current user.")
    try:
        result = account_service.delete_session('current')  # Logout current session
        logger.info("User logged out successfully.")
        return {"message": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Logout failed, Error: {e}", exc_info=True)
        raise HTTPException(status_code=401, detail=f"Logout failed: {str(e)}")
