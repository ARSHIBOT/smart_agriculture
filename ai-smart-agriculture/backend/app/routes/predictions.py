"""
API routes for prediction endpoints.
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.prediction import (
    SoilInput, DiseaseResponse, SoilResponse, 
    WeatherResponse, PredictionHistory
)
from app.services.prediction_service import PredictionService
from app.utils.image_processing import ImageProcessor
from app.config import settings
from typing import List

router = APIRouter(prefix="/predict", tags=["predictions"])

# Initialize services
prediction_service = PredictionService()
image_processor = ImageProcessor(settings.UPLOAD_DIR)


@router.post("/disease", response_model=DiseaseResponse)
async def predict_disease(
    file: UploadFile = File(..., description="Crop image for disease detection"),
    db: Session = Depends(get_db)
):
    """
    Predict crop disease from uploaded image.
    
    - **file**: Image file of crop leaves or plant
    - Returns disease name, confidence, treatment, and description
    """
    try:
        # Validate file type
        if not image_processor.is_allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {image_processor.ALLOWED_EXTENSIONS}"
            )
        
        # Read and save image
        file_data = await file.read()
        image_path = image_processor.save_image(file_data, file.filename)
        
        # Get prediction
        result = prediction_service.predict_disease(image_path, db)
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/soil", response_model=SoilResponse)
async def predict_soil_recommendation(
    soil_data: SoilInput,
    db: Session = Depends(get_db)
):
    """
    Get crop recommendation based on soil parameters.
    
    - **nitrogen**: Nitrogen content (0-200)
    - **phosphorus**: Phosphorus content (0-200)
    - **potassium**: Potassium content (0-200)
    - **ph**: Soil pH level (0-14)
    - **rainfall**: Rainfall in mm (0-500)
    
    Returns recommended crop and fertilizer advice.
    """
    try:
        result = prediction_service.predict_soil_recommendation(
            nitrogen=soil_data.nitrogen,
            phosphorus=soil_data.phosphorus,
            potassium=soil_data.potassium,
            ph=soil_data.ph,
            rainfall=soil_data.rainfall,
            db=db
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/weather", response_model=WeatherResponse)
async def get_weather_advisory(
    location: str = Query("Delhi", description="City or location name"),
    db: Session = Depends(get_db)
):
    """
    Get weather advisory and irrigation recommendations.
    
    - **location**: City or location name
    
    Returns simulated weather data with farming advice.
    Note: Weather data is internally simulated for demonstration.
    """
    try:
        result = prediction_service.get_weather_advisory(location, db)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather fetch failed: {str(e)}")


@router.get("/history", response_model=List[PredictionHistory])
async def get_prediction_history(
    prediction_type: str = Query(None, description="Filter by type: disease, soil, weather"),
    limit: int = Query(50, ge=1, le=100, description="Maximum records to return"),
    db: Session = Depends(get_db)
):
    """
    Get prediction history.
    
    - **prediction_type**: Optional filter (disease, soil, weather)
    - **limit**: Maximum number of records (1-100)
    
    Returns list of past predictions.
    """
    try:
        if prediction_type and prediction_type not in ["disease", "soil", "weather"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid prediction type. Use: disease, soil, or weather"
            )
        
        history = prediction_service.get_prediction_history(db, prediction_type, limit)
        return history
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


@router.get("/statistics")
async def get_statistics(db: Session = Depends(get_db)):
    """
    Get statistics about predictions.
    
    Returns counts of different prediction types.
    """
    try:
        stats = prediction_service.get_statistics(db)
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")
