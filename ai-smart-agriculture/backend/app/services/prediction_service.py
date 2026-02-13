"""
Prediction service handling all ML model predictions.
"""
from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from ml_models.crop_disease_model import CropDiseaseDetector
from ml_models.soil_model import SoilRecommendationModel
from ml_models.weather_simulator import WeatherSimulator
from typing import Dict, Any


class PredictionService:
    """Service for handling predictions and storing results."""
    
    def __init__(self):
        """Initialize prediction service with ML models."""
        self.disease_detector = CropDiseaseDetector()
        self.soil_model = SoilRecommendationModel()
        self.weather_simulator = WeatherSimulator()
    
    def predict_disease(self, image_path: str, db: Session) -> Dict[str, Any]:
        """
        Predict crop disease from image.
        
        Args:
            image_path: Path to uploaded image
            db: Database session
            
        Returns:
            Disease prediction results
        """
        # Get prediction from model
        disease, confidence, treatment, description, severity = \
            self.disease_detector.predict(image_path)
        
        # Prepare result
        result = {
            "disease": disease,
            "confidence": confidence,
            "treatment": treatment,
            "description": description,
            "severity": severity
        }
        
        # Store in database
        prediction = Prediction(
            prediction_type="disease",
            input_data={"image_path": image_path},
            result=result,
            confidence=confidence
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        return result
    
    def predict_soil_recommendation(self, nitrogen: float, phosphorus: float,
                                   potassium: float, ph: float, rainfall: float,
                                   db: Session) -> Dict[str, Any]:
        """
        Predict crop recommendation based on soil parameters.
        
        Args:
            nitrogen: Nitrogen content
            phosphorus: Phosphorus content
            potassium: Potassium content
            ph: Soil pH
            rainfall: Rainfall amount
            db: Database session
            
        Returns:
            Crop recommendation results
        """
        # Get prediction from model
        crop, fertilizer, confidence, tips = self.soil_model.predict(
            nitrogen, phosphorus, potassium, ph, rainfall
        )
        
        # Prepare result
        result = {
            "recommended_crop": crop,
            "fertilizer_advice": fertilizer,
            "confidence": confidence,
            "additional_tips": tips
        }
        
        # Store in database
        input_data = {
            "nitrogen": nitrogen,
            "phosphorus": phosphorus,
            "potassium": potassium,
            "ph": ph,
            "rainfall": rainfall
        }
        
        prediction = Prediction(
            prediction_type="soil",
            input_data=input_data,
            result=result,
            confidence=confidence
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        return result
    
    def get_weather_advisory(self, location: str, db: Session) -> Dict[str, Any]:
        """
        Get weather advisory for a location.
        
        Args:
            location: Location name
            db: Database session
            
        Returns:
            Weather advisory results
        """
        # Get simulated weather data
        weather_data = self.weather_simulator.get_weather(location)
        
        # Prepare result
        result = {
            "location": weather_data["location"],
            "temperature": weather_data["temperature"],
            "humidity": weather_data["humidity"],
            "rain_prediction": weather_data["rain_prediction"],
            "irrigation_advice": weather_data["irrigation_advice"],
            "farming_tips": weather_data["farming_tips"]
        }
        
        # Store in database
        prediction = Prediction(
            prediction_type="weather",
            input_data={"location": location},
            result=result,
            confidence=None  # Weather doesn't have confidence score
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        return result
    
    def get_prediction_history(self, db: Session, prediction_type: str = None,
                               limit: int = 50) -> list:
        """
        Get prediction history from database.
        
        Args:
            db: Database session
            prediction_type: Optional filter by type
            limit: Maximum number of records
            
        Returns:
            List of prediction records
        """
        query = db.query(Prediction)
        
        if prediction_type:
            query = query.filter(Prediction.prediction_type == prediction_type)
        
        predictions = query.order_by(Prediction.created_at.desc()).limit(limit).all()
        
        return predictions
    
    def get_statistics(self, db: Session) -> Dict[str, Any]:
        """
        Get statistics about predictions.
        
        Args:
            db: Database session
            
        Returns:
            Statistics dictionary
        """
        total_predictions = db.query(Prediction).count()
        disease_predictions = db.query(Prediction).filter(
            Prediction.prediction_type == "disease"
        ).count()
        soil_predictions = db.query(Prediction).filter(
            Prediction.prediction_type == "soil"
        ).count()
        weather_predictions = db.query(Prediction).filter(
            Prediction.prediction_type == "weather"
        ).count()
        
        return {
            "total_predictions": total_predictions,
            "disease_predictions": disease_predictions,
            "soil_predictions": soil_predictions,
            "weather_predictions": weather_predictions
        }
