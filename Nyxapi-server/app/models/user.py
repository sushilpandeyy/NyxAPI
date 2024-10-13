from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    email_verified = Column(Boolean, default=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to the Project table
    projects = relationship('Project', back_populates='user')


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Projectid = Column(Integer, unique=True, nullable=False)
    Title = Column(String, nullable=False)
    UserID = Column(Integer, ForeignKey('users.id'), nullable=False)
    created = Column(DateTime, default=func.now(), nullable=False)
    Description = Column(String)
    Img = Column(String)
    Shared = Column(ARRAY(Integer), nullable=True) 

    # Relationship to the User table
    user = relationship('User', back_populates='projects')

    # Relationship with Endpoints
    endpoints = relationship('Endpoint', back_populates='project')  # Backpopulates to Endpoint.project


class Endpoint(Base):
    __tablename__ = 'endpoints'

    endpointid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Endpoint = Column(String, nullable=False)
    Projectid = Column(Integer, ForeignKey('projects.Projectid'), nullable=False)
    Working = Column(Boolean, default=True)
    Locked = Column(Integer, nullable=True)
    project = relationship('Project', back_populates='endpoints')  

    Apitype = Column(ARRAY(String), nullable=True)   
    Payload = Column(String, nullable=True) 

    Created = Column(DateTime(timezone=True), server_default=func.now())
    Updated = Column(DateTime(timezone=True), onupdate=func.now())
