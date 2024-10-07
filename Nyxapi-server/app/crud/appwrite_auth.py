import os
from appwrite.client import Client
from appwrite.services.account import Account
from appwrite.services.users import Users
from fastapi import HTTPException
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Appwrite client
client = Client()
client.set_endpoint(os.getenv('APPWRITE_ENDPOINT'))  # Your Appwrite endpoint
client.set_project(os.getenv('APPWRITE_PROJECT_ID'))  # Your project ID
client.set_key(os.getenv('APPWRITE_API_KEY'))  # Your API key

# Appwrite services
users_service = Users(client)  # Server-side user management
account_service = Account(client)  # Client-side user session management

# Register a new user using the Users service
async def appwrite_register_user(email: str, password: str, name: str):
    try:
        user = users_service.create(
            user_id='unique()',  # Automatically generate a unique user ID
            email=email,
            password=password,
            name=name
        )
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")


# Send email verification using the Account service
async def appwrite_send_verification_email():
    try:
        result = account_service.create_verification(
            url=os.getenv('APPWRITE_VERIFICATION_URL')  # The URL the user clicks to verify their email
        )
        return {"message": "Verification email sent"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error sending verification email: {str(e)}")


# Log in a user and create a session
async def appwrite_login_user(email: str, password: str):
    try:
        session = account_service.create_session(
            email=email,
            password=password
        )
        return session  # Return session information if login is successful
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")


# Get the logged-in user's account details (after login)
async def appwrite_get_current_user():
    try:
        user = account_service.get()  # Get the logged-in user's information
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Unable to retrieve user details: {str(e)}")


# Log out the current user (delete session)
async def appwrite_logout_user():
    try:
        result = account_service.delete_session('current')  # Logout current session
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Logout failed: {str(e)}")
