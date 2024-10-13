from pydantic import BaseModel, EmailStr 
from typing import List



class AddUserToSharedRequest(BaseModel):
    projectid: int
    email: str

class SharedEmailsResponse(BaseModel):
    emails: List[str]