from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
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

    # Relationship with Project
    projects = relationship('Project', back_populates='user')


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Primary key
    Projectid = Column(Integer, unique=True, nullable=False)  # 6-digit project ID
    Title = Column(String, nullable=False)
    UserID = Column(Integer, ForeignKey('users.id'), nullable=False)
    created = Column(DateTime, default=func.now(), nullable=False)

    # Relationship to the User table
    user = relationship('User', back_populates='projects')

    # Relationship with Endpoints
    endpoints = relationship('Endpoint', back_populates='project')


class Endpoint(Base):
    __tablename__ = 'endpoints'

    endpointid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Endpoint = Column(String, nullable=False)
    projectid = Column(Integer, ForeignKey('projects.Projectid'), nullable=False)
    
    # Relationship to Project
    project = relationship('Project', back_populates='endpoints')
    
    description = Column(String, nullable=False)
    payload = Column(JSON, nullable=True)  
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())