"""
Pydantic schemas package for request/response validation.
"""
from app.schemas.prediction import (
    SoilInput,
    DiseaseResponse,
    SoilResponse,
    WeatherResponse,
    PredictionHistory
)

__all__ = [
    "SoilInput",
    "DiseaseResponse",
    "SoilResponse",
    "WeatherResponse",
    "PredictionHistory"
]
