from pydantic import BaseModel, EmailStr

# User creation schema
class UserCreate(BaseModel):
    name: str
    email: EmailStr  # EmailStr ensures the email is valid
    password: str

# User authentication schema
class UserAuthenticate(BaseModel):
    email: EmailStr
    password: str
