from pydantic import BaseModel, EmailStr, Json

class Endpoints(BaseModel):
    Endpoint: str
    Projectid: int
    Apitype: str
    Payload: str

class PayloadUpdateRequest(BaseModel):
    payload: str