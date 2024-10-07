from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.config import Base


class Project(Base):
    __tablename__ = 'projects'

    Projectid = Column(Integer, primary_key=True, index=True, default=generate_six_digit_id)
    Title = Column(String, nullable=False)
    UserID = Column(Integer, ForeignKey('user.id'), nullable=False)
    user = relationship('users', back_populates='projects')
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), onupdate=func.now())