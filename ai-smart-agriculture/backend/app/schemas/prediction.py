"""
Pydantic schemas for prediction endpoints.
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, Any, Dict
from datetime import datetime


class SoilInput(BaseModel):
    """Input schema for soil recommendation."""
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content (0-200)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content (0-200)")
    potassium: float = Field(..., ge=0, le=200, description="Potassium content (0-200)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH (0-14)")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm (0-500)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "nitrogen": 90,
                "phosphorus": 42,
                "potassium": 43,
                "ph": 6.5,
                "rainfall": 202.5
            }
        }


class DiseaseResponse(BaseModel):
    """Response schema for disease prediction."""
    disease: str
    confidence: float
    treatment: str
    description: Optional[str] = None
    severity: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "disease": "Leaf Blight",
                "confidence": 0.91,
                "treatment": "Apply recommended fungicide",
                "description": "Common fungal disease affecting leaves",
                "severity": "Moderate"
            }
        }


class SoilResponse(BaseModel):
    """Response schema for soil recommendation."""
    recommended_crop: str
    fertilizer_advice: str
    confidence: Optional[float] = None
    additional_tips: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "recommended_crop": "Rice",
                "fertilizer_advice": "Add urea for nitrogen boost",
                "confidence": 0.85,
                "additional_tips": "Maintain soil moisture levels"
            }
        }


class WeatherResponse(BaseModel):
    """Response schema for weather advisory."""
    location: str
    temperature: float
    humidity: float
    rain_prediction: str
    irrigation_advice: str
    farming_tips: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "location": "New Delhi",
                "temperature": 30,
                "humidity": 65,
                "rain_prediction": "Moderate",
                "irrigation_advice": "Reduce irrigation by 30%",
                "farming_tips": "Good day for pesticide application"
            }
        }


class PredictionHistory(BaseModel):
    """Schema for prediction history."""
    id: int
    prediction_type: str
    result: Dict[str, Any]
    confidence: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
