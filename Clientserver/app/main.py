from fastapi import FastAPI, Request, Depends, HTTPException
from app.config import get_db
from app.functions.responder import get_response
from urllib.parse import urlparse
from sqlalchemy.orm import Session

app = FastAPI()

def get_subdomain(url: str) -> str:
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

@app.get("/")
async def read_root():
    return {"message": "Hello Sir!!"}

@app.get("/{full_path:path}")
async def fetch_data(full_path: str, request: Request, db: Session = Depends(get_db)):
    # Extract subdomain from the request URL
    projectid_str = get_subdomain(str(request.url))
    
    # Attempt to convert projectid to an integer
    try:
        projectid = int(projectid_str)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Subdomain '{projectid_str}' cannot be converted to an integer.")
    
    
    res = await get_response(db=db, endpoint=full_path, projid=projectid)
    
    return {"msg": res}