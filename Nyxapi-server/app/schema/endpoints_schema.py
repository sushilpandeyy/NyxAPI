from pydantic import BaseModel, EmailStr, Json
from typing import List, Union

class Endpoints(BaseModel):
    Endpoint: str
    Projectid: int
    Apitype: Union[str, List[str]]  # Support both single string and array
    Payload: str

class PayloadUpdateRequest(BaseModel):
    payload: str

class EndpointResponse(BaseModel):
    endpointid: int
    Endpoint: str
    Projectid: int
    Apitype: List[str]
    Payload: str
    Working: bool = True
    Created: str
    Updated: str