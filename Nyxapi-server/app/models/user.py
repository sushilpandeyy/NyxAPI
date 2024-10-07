from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.config import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    email_verified = Column(Boolean, default=False)
    created = Column(DateTime(timezone=True), server_default=func.now())  # Ensure this is defined
    updated = Column(DateTime(timezone=True), onupdate=func.now())         # Ensure this is defined
