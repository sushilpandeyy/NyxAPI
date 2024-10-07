from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    Title: str
    UserID: int

class ProjectCreate(ProjectBase):
    Title: str
    UserID: int

class ProjectUpdate(ProjectBase):
    Title: Optional[str] = None

class Project(BaseModel):
    Projectid: int
    Title: str
    UserID: int
    created: datetime
    updated: Optional[datetime] = None

    class Config:
        orm_mode = True
