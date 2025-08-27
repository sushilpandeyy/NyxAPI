import logging
import json
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from urllib.parse import urlparse
from app.config import get_db
from app.models.user import Endpoint
from sqlalchemy.exc import SQLAlchemyError

# Configure logging
logger = logging.getLogger("MockAPIRoute")

mock_router = APIRouter()

# Define placeholders for special characters
DOUBLE_QUOTE_PLACEHOLDER = "[[DQ]]"
COLON_PLACEHOLDER = "[[COLON]]"
COMMA_PLACEHOLDER = "[[COMMA]]"

def replace_special_characters(text: str) -> str:
    """Replace special characters with placeholders."""
    text = text.replace('"', DOUBLE_QUOTE_PLACEHOLDER)
    text = text.replace(':', COLON_PLACEHOLDER)
    text = text.replace(',', COMMA_PLACEHOLDER)
    return text

def restore_special_characters(text: str) -> str:
    """Restore special characters from placeholders."""
    text = text.replace(DOUBLE_QUOTE_PLACEHOLDER, '"')
    text = text.replace(COLON_PLACEHOLDER, ':')
    text = text.replace(COMMA_PLACEHOLDER, ',')
    return text

def get_subdomain(url: str) -> str:
    """Extract project ID from subdomain."""
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname
    
    if hostname:
        parts = hostname.split('.')
        # Check if it's a localhost or 127.0.0.1 domain
        if hostname.endswith(".localhost") or hostname.endswith("127.0.0.1"):
            if len(parts) == 2:
                return parts[0]  # Return the part before ".localhost" or ".127.0.0.1" as subdomain
            else:
                return "No subdomain found"
        elif len(parts) > 2:
            subdomain = '.'.join(parts[:-2])
            return subdomain
        else:
            return "No subdomain found"
    return "Invalid URL"

async def save_data(db: AsyncSession, projid: int, endpoint: str, payload: dict):
    """Save endpoint data to database."""
    try:
        # Convert payload to JSON string and replace special characters
        payload_str = json.dumps(payload)
        payload_str_with_placeholders = replace_special_characters(payload_str)

        # Create a new Endpoint record
        new_endpoint = Endpoint(Projectid=projid, Endpoint=endpoint, Payload=payload_str_with_placeholders)
        db.add(new_endpoint)
        await db.commit()
        logger.info(f"Saved new endpoint: {endpoint} for project {projid}")
    except SQLAlchemyError as e:
        logger.error(f"Database error during saving: {e}")
        await db.rollback()

def includes_item(array, item):
    """Check if item is in array."""
    return item in array if array else False

async def get_response(db: AsyncSession, endpoint: str, projid: int, method: str):
    """Get mock API response for endpoint."""
    try:
        logger.info(f"Retrieving endpoint data for project {projid}, endpoint: {endpoint}, method: {method}")

        # Construct the SQLAlchemy query
        stmt = select(Endpoint).where(
            Endpoint.Projectid == projid,
            Endpoint.Endpoint == endpoint
        )

        # Execute the query
        result = await db.execute(stmt)
        endpoint_record = result.scalar_one_or_none()

        if not endpoint_record:
            logger.warning(f"No endpoint found for project {projid}, endpoint: {endpoint}")
            return {"error": "Endpoint not found"}

        # Check if the HTTP method is allowed for this endpoint
        if endpoint_record.Apitype and not includes_item(endpoint_record.Apitype, method):
            logger.warning(f"Method {method} not allowed for endpoint {endpoint}")
            return {"error": "Method not allowed for this endpoint"}

        # Check if endpoint is working
        if not endpoint_record.Working:
            logger.warning(f"Endpoint {endpoint} is disabled")
            return {"error": "Endpoint is currently disabled"}

        if endpoint_record.Payload:
            # Restore Payload from placeholders to valid JSON
            payload_with_placeholders = endpoint_record.Payload
            restored_payload = restore_special_characters(payload_with_placeholders)
            
            try:
                return json.loads(restored_payload)
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in payload: {e}")
                return {"error": "Invalid payload format"}
        else:
            return {"message": "Endpoint found but no payload configured"}
            
    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        return {"error": "Database error occurred"}
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {"error": "An unexpected error occurred"}

@mock_router.get("/api/{full_path:path}")
async def mock_get_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle GET requests for mock API endpoints."""
    # Extract subdomain from the request URL
    projectid_str = get_subdomain(str(request.url))
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="GET")
    logger.info(f"GET response for {full_path}: {response}")
    return response

@mock_router.post("/api/{full_path:path}")
async def mock_post_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle POST requests for mock API endpoints."""
    # Extract subdomain from the request URL
    projectid_str = get_subdomain(str(request.url))
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="POST")
    logger.info(f"POST response for {full_path}: {response}")
    return response

@mock_router.put("/api/{full_path:path}")
async def mock_put_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle PUT requests for mock API endpoints."""
    # Extract subdomain from the request URL
    projectid_str = get_subdomain(str(request.url))
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="PUT")
    logger.info(f"PUT response for {full_path}: {response}")
    return response

@mock_router.delete("/api/{full_path:path}")
async def mock_delete_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle DELETE requests for mock API endpoints."""
    # Extract subdomain from the request URL
    projectid_str = get_subdomain(str(request.url))
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="DELETE")
    logger.info(f"DELETE response for {full_path}: {response}")
    return response

@mock_router.patch("/api/{full_path:path}")
async def mock_patch_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle PATCH requests for mock API endpoints."""
    # Extract subdomain from the request URL
    projectid_str = get_subdomain(str(request.url))
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="PATCH")
    logger.info(f"PATCH response for {full_path}: {response}")
    return response

# Direct path handlers (without /api/ prefix) for subdomain-based requests
@mock_router.get("/{full_path:path}")
async def mock_direct_get_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle GET requests for direct mock API endpoints (without /api/ prefix)."""
    # Only handle subdomain-based requests, skip non-subdomain requests
    projectid_str = get_subdomain(str(request.url))
    
    # Skip if no valid subdomain is found (to avoid conflicts with main routes)
    if projectid_str in ["No subdomain found", "Invalid URL"]:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="GET")
    logger.info(f"Direct GET response for {full_path}: {response}")
    return response

@mock_router.post("/{full_path:path}")
async def mock_direct_post_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle POST requests for direct mock API endpoints (without /api/ prefix)."""
    # Only handle subdomain-based requests, skip non-subdomain requests
    projectid_str = get_subdomain(str(request.url))
    
    # Skip if no valid subdomain is found (to avoid conflicts with main routes)
    if projectid_str in ["No subdomain found", "Invalid URL"]:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="POST")
    logger.info(f"Direct POST response for {full_path}: {response}")
    return response

@mock_router.put("/{full_path:path}")
async def mock_direct_put_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle PUT requests for direct mock API endpoints (without /api/ prefix)."""
    # Only handle subdomain-based requests, skip non-subdomain requests
    projectid_str = get_subdomain(str(request.url))
    
    # Skip if no valid subdomain is found (to avoid conflicts with main routes)
    if projectid_str in ["No subdomain found", "Invalid URL"]:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="PUT")
    logger.info(f"Direct PUT response for {full_path}: {response}")
    return response

@mock_router.delete("/{full_path:path}")
async def mock_direct_delete_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle DELETE requests for direct mock API endpoints (without /api/ prefix)."""
    # Only handle subdomain-based requests, skip non-subdomain requests
    projectid_str = get_subdomain(str(request.url))
    
    # Skip if no valid subdomain is found (to avoid conflicts with main routes)
    if projectid_str in ["No subdomain found", "Invalid URL"]:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="DELETE")
    logger.info(f"Direct DELETE response for {full_path}: {response}")
    return response

@mock_router.patch("/{full_path:path}")
async def mock_direct_patch_endpoint(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    """Handle PATCH requests for direct mock API endpoints (without /api/ prefix)."""
    # Only handle subdomain-based requests, skip non-subdomain requests
    projectid_str = get_subdomain(str(request.url))
    
    # Skip if no valid subdomain is found (to avoid conflicts with main routes)
    if projectid_str in ["No subdomain found", "Invalid URL"]:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        logger.error(f"Invalid project ID from subdomain: {projectid_str}")
        raise HTTPException(status_code=400, detail=f"Invalid project ID: {projectid_str}")
    
    response = await get_response(db=db, endpoint=full_path, projid=projectid, method="PATCH")
    logger.info(f"Direct PATCH response for {full_path}: {response}")
    return response