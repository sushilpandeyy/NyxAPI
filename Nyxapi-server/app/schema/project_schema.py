from pydantic import BaseModel, EmailStr

class Projectcreate(BaseModel):
    title: str
    userid: int

class GetProject(BaseModel):
    userid: int