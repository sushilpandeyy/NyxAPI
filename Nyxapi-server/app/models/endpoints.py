from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config import Base

class Project(Base):
    __tablename__ = 'endpoints'

    endpointid = Column(Integer, primary_key=True, index=True, default=generate_six_digit_id)
    Endpoint = Column(String, nullable=False)
    projectid = Column(Integer, ForeignKey('project.Projectid'), nullable=False)
    project = relationship('projects', back_populates='projects')
    description = Column(String, nullable=False)
    payload = Column(JSON, nullable=True)  
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())
