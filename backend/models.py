from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from database import Base

class Task(Base):

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
    DateTime(timezone=True),
    server_default=func.now(),
    onupdate=func.now()
)