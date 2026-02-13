"""
Crop Disease Detection Model using simulated predictions.
This module simulates a lightweight CNN model for disease detection.
"""
import random
import numpy as np
from PIL import Image
from typing import Tuple, Dict


class CropDiseaseDetector:
    """Simulated crop disease detection model."""
    
    # Common crop diseases with their characteristics
    DISEASES = {
        "healthy": {
            "treatment": "No treatment needed. Continue regular maintenance.",
            "description": "Plant appears healthy with no visible disease symptoms.",
            "severity": "None"
        },
        "early_blight": {
            "treatment": "Apply copper-based fungicide. Remove affected leaves. Improve air circulation.",
            "description": "Fungal disease causing dark spots with concentric rings on older leaves.",
            "severity": "Moderate"
        },
        "late_blight": {
            "treatment": "Apply chlorothalonil fungicide immediately. Remove infected plants if severe.",
            "description": "Serious fungal disease causing water-soaked lesions on leaves and stems.",
            "severity": "High"
        },
        "leaf_spot": {
            "treatment": "Apply organic neem oil spray. Remove infected leaves. Avoid overhead watering.",
            "description": "Bacterial or fungal spots on leaves, often circular with yellow halos.",
            "severity": "Low to Moderate"
        },
        "powdery_mildew": {
            "treatment": "Apply sulfur or potassium bicarbonate spray. Increase sunlight exposure.",
            "description": "White powdery coating on leaves caused by fungal infection.",
            "severity": "Moderate"
        },
        "bacterial_wilt": {
            "treatment": "Remove and destroy infected plants. Rotate crops. Improve drainage.",
            "description": "Bacterial infection causing rapid wilting and plant death.",
            "severity": "High"
        },
        "mosaic_virus": {
            "treatment": "No cure available. Remove infected plants. Control aphid vectors.",
            "description": "Viral disease causing mottled yellow and green patterns on leaves.",
            "severity": "High"
        },
        "rust": {
            "treatment": "Apply appropriate fungicide. Remove infected leaves. Improve air flow.",
            "description": "Fungal disease causing orange or brown pustules on leaves.",
            "severity": "Moderate"
        },
        "anthracnose": {
            "treatment": "Apply copper fungicide. Practice crop rotation. Remove plant debris.",
            "description": "Fungal disease causing dark sunken lesions on fruits and leaves.",
            "severity": "Moderate to High"
        },
        "septoria_leaf_spot": {
            "treatment": "Apply fungicide containing chlorothalonil. Mulch around plants.",
            "description": "Fungal disease with small circular spots with gray centers.",
            "severity": "Moderate"
        }
    }
    
    def __init__(self):
        """Initialize the disease detector."""
        self.model_loaded = True
        random.seed()
    
    def _analyze_image_features(self, image: Image.Image) -> Dict:
        """
        Analyze basic image features to influence prediction.
        This simulates feature extraction from a CNN model.
        """
        # Convert to numpy array
        img_array = np.array(image.resize((224, 224)))
        
        # Calculate basic statistics that might correlate with disease
        mean_brightness = np.mean(img_array)
        std_brightness = np.std(img_array)
        
        # Analyze color channels if RGB
        if len(img_array.shape) == 3 and img_array.shape[2] == 3:
            green_intensity = np.mean(img_array[:, :, 1])
            red_intensity = np.mean(img_array[:, :, 0])
            blue_intensity = np.mean(img_array[:, :, 2])
            
            # Calculate color ratios
            green_ratio = green_intensity / (mean_brightness + 1)
            brown_score = (red_intensity + green_intensity / 2) / (green_intensity + blue_intensity + 1)
        else:
            green_ratio = 0.5
            brown_score = 0.5
        
        return {
            "brightness": mean_brightness,
            "std": std_brightness,
            "green_ratio": green_ratio,
            "brown_score": brown_score
        }
    
    def predict(self, image_path: str) -> Tuple[str, float, str, str, str]:
        """
        Predict disease from image.
        
        Args:
            image_path: Path to the crop image
            
        Returns:
            Tuple of (disease_name, confidence, treatment, description, severity)
        """
        try:
            # Load and analyze image
            image = Image.open(image_path)
            features = self._analyze_image_features(image)
            
            # Use image features to influence prediction (simulated ML behavior)
            if features["green_ratio"] > 0.6 and features["std"] < 50:
                # High green ratio and low variance suggests healthy plant
                disease_weights = {
                    "healthy": 0.7,
                    "early_blight": 0.1,
                    "leaf_spot": 0.1,
                    "powdery_mildew": 0.05,
                    "rust": 0.05
                }
            elif features["brown_score"] > 0.7:
                # High brown score suggests blight or wilting
                disease_weights = {
                    "late_blight": 0.4,
                    "early_blight": 0.3,
                    "bacterial_wilt": 0.2,
                    "anthracnose": 0.1
                }
            elif features["brightness"] < 80:
                # Dark image might indicate severe disease
                disease_weights = {
                    "late_blight": 0.3,
                    "bacterial_wilt": 0.25,
                    "anthracnose": 0.2,
                    "mosaic_virus": 0.15,
                    "rust": 0.1
                }
            else:
                # General distribution for moderate symptoms
                disease_weights = {
                    "leaf_spot": 0.25,
                    "early_blight": 0.2,
                    "powdery_mildew": 0.15,
                    "rust": 0.15,
                    "septoria_leaf_spot": 0.1,
                    "healthy": 0.1,
                    "anthracnose": 0.05
                }
            
            # Select disease based on weights
            diseases = list(disease_weights.keys())
            weights = list(disease_weights.values())
            predicted_disease = random.choices(diseases, weights=weights)[0]
            
            # Generate confidence score (higher for clear cases)
            base_confidence = disease_weights[predicted_disease]
            confidence = min(0.95, base_confidence + random.uniform(0.05, 0.20))
            
            # Get disease information
            disease_info = self.DISEASES[predicted_disease]
            
            return (
                predicted_disease.replace("_", " ").title(),
                round(confidence, 2),
                disease_info["treatment"],
                disease_info["description"],
                disease_info["severity"]
            )
            
        except Exception as e:
            # Fallback prediction if image processing fails
            return (
                "Unable to Detect",
                0.0,
                "Please upload a clearer image of the crop leaves.",
                f"Image processing error: {str(e)}",
                "Unknown"
            )
    
    def get_disease_info(self, disease_name: str) -> Dict:
        """Get detailed information about a specific disease."""
        disease_key = disease_name.lower().replace(" ", "_")
        return self.DISEASES.get(disease_key, {
            "treatment": "Consult agricultural expert",
            "description": "Unknown disease",
            "severity": "Unknown"
        })
