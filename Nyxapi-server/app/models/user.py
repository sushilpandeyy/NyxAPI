from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
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
    
    projects = relationship('Project', back_populates='user')


class Project(Base):
    __tablename__ = 'projects'

    Projectid = Column(Integer, primary_key=True, index=True)  # SQLAlchemy will auto-increment primary keys
    Title = Column(String, nullable=False)
    UserID = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='projects')
    created = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)  # Ensure timestamp is set
    updated = Column(DateTime(timezone=True), onupdate=func.now())
