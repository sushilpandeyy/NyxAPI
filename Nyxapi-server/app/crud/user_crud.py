import logging
import hashlib
import base64
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.user import User, Usage, Project, Endpoint
from typing import Dict, Optional
from passlib.context import CryptContext

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("nyxapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("UserService")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def generate_avatar_url(email: str) -> str:
    """Generate a consistent colored avatar based on email."""
    # Use email hash to generate consistent colors
    email_hash = hashlib.md5(email.encode()).hexdigest()
    
    # Generate colors from hash
    color1 = "#" + email_hash[:6]
    color2 = "#" + email_hash[6:12]
    
    # Adjust brightness to ensure readability
    def adjust_color(hex_color):
        r = int(hex_color[1:3], 16)
        g = int(hex_color[3:5], 16)
        b = int(hex_color[5:7], 16)
        
        brightness = (r * 299 + g * 587 + b * 114) / 1000
        if brightness < 100:  # Too dark, lighten it
            r = min(255, r + 100)
            g = min(255, g + 100)
            b = min(255, b + 100)
        elif brightness > 200:  # Too light, darken it
            r = max(0, r - 100)
            g = max(0, g - 100)
            b = max(0, b - 100)
        
        return f"#{r:02x}{g:02x}{b:02x}"
    
    bg_color = adjust_color(color1)
    text_color = adjust_color(color2)
    
    # Get initials from email
    if "@" in email:
        local_part = email.split("@")[0]
        letters = ''.join(c for c in local_part if c.isalpha())
        if len(letters) >= 2:
            initials = letters[:2].upper()
        elif len(letters) == 1:
            initials = letters[0].upper() * 2
        else:
            initials = "U"
    else:
        initials = "U"
    
    # Create SVG avatar
    svg_content = f'''<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="{bg_color}"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
              text-anchor="middle" dominant-baseline="central" fill="{text_color}">
            {initials}
        </text>
    </svg>'''.strip()
    
    # Create data URL
    svg_b64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{svg_b64}"

async def create_user(db: AsyncSession, name: str, email: str, password: str) -> Dict:
    try:
        # Hash password and generate avatar
        hashed_password = hash_password(password)
        avatar_url = generate_avatar_url(email)
        
        user = User(
            name=name, 
            email=email, 
            password=hashed_password,
            avatar_url=avatar_url,
            email_verified=True  # Auto-verify for simplicity
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        usage = Usage(Userid=user.id, Project=0, Endpoints=0)
        db.add(usage)
        await db.commit()
        await db.refresh(usage)

        return {
            "user": {
                "email": user.email,
                "user_id": user.id,
                "name": user.name,
                "avatar_url": user.avatar_url,
                "email_verified": user.email_verified
            }
        }
    except Exception as e:
        logger.error(f"Error creating user with email {email}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    try:
        stmt = select(User).filter(User.email == email)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user: {str(e)}")

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[Dict]:
    try:
        user = await get_user_by_email(db, email)
        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Generate avatar if not exists
        avatar_url = user.avatar_url
        if not avatar_url:
            avatar_url = generate_avatar_url(email)
            user.avatar_url = avatar_url
            await db.commit()

        return {
            "user": {
                "email": user.email,
                "user_id": user.id,
                "name": user.name,
                "avatar_url": avatar_url,
                "email_verified": user.email_verified
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")

async def verify_user_email(db: AsyncSession, user_id: int) -> bool:
    """Verify user email by user ID."""
    try:
        stmt = select(User).filter(User.id == user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            return False
            
        user.email_verified = True
        await db.commit()
        logger.info(f"Email verified for user ID: {user_id}")
        return True
        
    except Exception as e:
        logger.error(f"Error verifying email for user ID {user_id}: {str(e)}", exc_info=True)
        return False

# Function to completely delete a user account and all associated data
async def delete_user_account(db: AsyncSession, user_id: int, email: str, password: str):
    logger.info(f"🗑️ Attempting to delete user account for user {user_id} ({email})")
    try:
        # First authenticate the user to ensure they have permission
        user = await get_user_by_email(db, email)
        if not user or not verify_password(password, user.password):
            logger.warning(f"Authentication failed for account deletion: {email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if user.id != user_id:
            logger.warning(f"User ID mismatch for account deletion: {email}")
            raise HTTPException(status_code=403, detail="Access denied")

        # Count all associated data before deletion for logging
        projects_query = select(Project).filter(Project.UserID == user_id)
        projects_result = await db.execute(projects_query)
        projects = projects_result.scalars().all()
        project_count = len(projects)

        total_endpoints = 0
        # Delete all endpoints associated with user's projects
        for project in projects:
            endpoints_query = select(Endpoint).filter(Endpoint.Projectid == project.Projectid)
            endpoints_result = await db.execute(endpoints_query)
            endpoints = endpoints_result.scalars().all()
            endpoint_count = len(endpoints)
            total_endpoints += endpoint_count
            
            # Delete all endpoints for this project
            for endpoint in endpoints:
                await db.delete(endpoint)
            
            logger.info(f"🗑️ Deleted {endpoint_count} endpoints for project {project.Projectid}")

        # Delete all projects
        for project in projects:
            await db.delete(project)
        logger.info(f"🗑️ Deleted {project_count} projects for user {user_id}")

        # Delete usage records
        usage_query = select(Usage).filter(Usage.Userid == user_id)
        usage_result = await db.execute(usage_query)
        usage_records = usage_result.scalars().all()
        for usage in usage_records:
            await db.delete(usage)
        logger.info(f"🗑️ Deleted {len(usage_records)} usage records for user {user_id}")

        # Finally, delete the user account
        await db.delete(user)
        await db.commit()

        logger.info(f"✅ Successfully deleted user account {email} with {project_count} projects and {total_endpoints} endpoints")
        
        return {
            "message": f"Account '{email}' and all associated data deleted successfully",
            "deleted_user_id": user_id,
            "deleted_projects": project_count,
            "deleted_endpoints": total_endpoints,
            "deleted_usage_records": len(usage_records)
        }

    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"💥 Error deleting user account {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error deleting account: {str(e)}")

# Function to get user by ID
async def get_user_by_id(db: AsyncSession, user_id: int):
    logger.info(f"📋 Fetching user by ID: {user_id}")
    try:
        stmt = select(User).filter(User.id == user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            logger.warning(f"User {user_id} not found")
            return None
            
        return user
    except Exception as e:
        logger.error(f"💥 Error fetching user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")