"""
Prediction database model for storing prediction history.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Prediction(Base):
    """Model for storing prediction records."""
    
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    prediction_type = Column(String, nullable=False, index=True)  # disease, soil, weather
    input_data = Column(JSON, nullable=True)  # Store input parameters
    result = Column(JSON, nullable=False)  # Store prediction results
    confidence = Column(Float, nullable=True)  # Confidence score if applicable
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Prediction(id={self.id}, type={self.prediction_type})>"
