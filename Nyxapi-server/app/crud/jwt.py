import logging
import os
from jose import JWTError, jwt
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/var/log/fastapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("JWTService")

# Environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    logger.critical("SECRET_KEY is not set in environment variables. Exiting application.")
    raise ValueError("SECRET_KEY is required in environment variables.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Function to create an access token
def create_access_token(data: dict, expires_delta: timedelta = None):
    logger.info("Creating access token.")
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})

        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        logger.info(f"Access token created successfully. Expires at: {expire}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}", exc_info=True)
        raise

# Function to verify an access token
def verify_access_token(token: str):
    logger.info("Verifying access token.")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info("Access token verified successfully.")
        return payload
    except JWTError as e:
        logger.warning("Failed to verify access token: Invalid or expired token.", exc_info=True)
        return None
    except Exception as e:
        logger.error(f"Unexpected error during token verification: {str(e)}", exc_info=True)
        raise
