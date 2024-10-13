from pydantic import BaseModel, EmailStr

class Projectcreate(BaseModel):
    title: str
    userid: int
    Description: str
    Img: str

class GetProject(BaseModel):
    userid: int

