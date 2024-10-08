from pydantic import BaseModel, EmailStr

class Projectcreate(BaseModel):
    title: str
    userid: int
    description: str

class GetProject(BaseModel):
    userid: int