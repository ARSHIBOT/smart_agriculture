"""
Soil-based Crop Recommendation Model.
Uses RandomForest classifier trained on synthetic agricultural data.
"""
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from typing import Tuple, Dict


class SoilRecommendationModel:
    """Soil-based crop recommendation using Random Forest."""
    
    # Crop database with optimal conditions
    CROP_INFO = {
        "rice": {
            "fertilizer": "Apply urea (46% N) at 120 kg/ha. Add DAP for phosphorus.",
            "tips": "Maintain flooded conditions. Optimal pH 5.5-7.0."
        },
        "wheat": {
            "fertilizer": "Apply NPK (120:60:40 kg/ha). Use DAP and MOP.",
            "tips": "Well-drained soil. Optimal pH 6.0-7.5."
        },
        "maize": {
            "fertilizer": "Apply NPK (150:75:50 kg/ha). Side-dress nitrogen.",
            "tips": "Requires good drainage. Optimal pH 5.8-7.0."
        },
        "cotton": {
            "fertilizer": "Apply NPK (120:60:60 kg/ha). Extra potassium needed.",
            "tips": "Deep soil preferred. Optimal pH 6.0-7.5."
        },
        "sugarcane": {
            "fertilizer": "Apply NPK (150:60:60 kg/ha). High potassium requirement.",
            "tips": "Needs irrigation. Optimal pH 6.0-7.5."
        },
        "jute": {
            "fertilizer": "Apply NPK (60:30:30 kg/ha). Organic matter beneficial.",
            "tips": "Alluvial soil best. Optimal pH 6.0-7.0."
        },
        "pulses": {
            "fertilizer": "Apply phosphorus and potassium. Low nitrogen needed.",
            "tips": "Nitrogen-fixing crop. Optimal pH 6.0-7.5."
        },
        "groundnut": {
            "fertilizer": "Apply gypsum for calcium. NPK (20:40:40 kg/ha).",
            "tips": "Well-drained sandy loam. Optimal pH 6.0-6.5."
        },
        "soybean": {
            "fertilizer": "Apply NPK (30:60:40 kg/ha). Requires molybdenum.",
            "tips": "Good drainage essential. Optimal pH 6.0-7.0."
        },
        "potato": {
            "fertilizer": "Apply NPK (180:80:100 kg/ha). High potassium need.",
            "tips": "Loose, well-drained soil. Optimal pH 5.0-6.0."
        },
        "tomato": {
            "fertilizer": "Apply NPK (120:80:80 kg/ha). Balanced nutrition.",
            "tips": "Well-drained loamy soil. Optimal pH 6.0-7.0."
        },
        "onion": {
            "fertilizer": "Apply NPK (100:50:50 kg/ha). Requires sulfur.",
            "tips": "Sandy loam preferred. Optimal pH 6.0-7.0."
        }
    }
    
    def __init__(self):
        """Initialize the model."""
        self.model = None
        self.crop_labels = list(self.CROP_INFO.keys())
        self.model_path = os.path.join(os.path.dirname(__file__), "soil_model.pkl")
        self._load_or_train_model()
    
    def _generate_synthetic_data(self, n_samples: int = 2000) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generate synthetic training data for crop recommendation.
        
        Args:
            n_samples: Number of samples to generate
            
        Returns:
            Tuple of (features, labels)
        """
        np.random.seed(42)
        
        # Define optimal ranges for each crop
        crop_ranges = {
            "rice": {"N": (80, 100), "P": (40, 50), "K": (40, 50), "pH": (5.5, 7.0), "rain": (200, 300)},
            "wheat": {"N": (100, 120), "P": (50, 70), "K": (30, 50), "pH": (6.0, 7.5), "rain": (50, 100)},
            "maize": {"N": (70, 90), "P": (40, 60), "K": (30, 50), "pH": (5.8, 7.0), "rain": (80, 150)},
            "cotton": {"N": (100, 130), "P": (40, 60), "K": (50, 70), "pH": (6.0, 7.5), "rain": (60, 120)},
            "sugarcane": {"N": (120, 150), "P": (50, 70), "K": (50, 80), "pH": (6.0, 7.5), "rain": (150, 250)},
            "jute": {"N": (50, 70), "P": (25, 40), "K": (25, 40), "pH": (6.0, 7.0), "rain": (150, 250)},
            "pulses": {"N": (20, 40), "P": (50, 70), "K": (30, 50), "pH": (6.0, 7.5), "rain": (60, 100)},
            "groundnut": {"N": (15, 30), "P": (35, 50), "K": (35, 50), "pH": (6.0, 6.5), "rain": (50, 100)},
            "soybean": {"N": (25, 40), "P": (55, 75), "K": (35, 50), "pH": (6.0, 7.0), "rain": (70, 130)},
            "potato": {"N": (150, 180), "P": (70, 90), "K": (80, 110), "pH": (5.0, 6.0), "rain": (80, 150)},
            "tomato": {"N": (100, 130), "P": (70, 90), "K": (70, 90), "pH": (6.0, 7.0), "rain": (60, 120)},
            "onion": {"N": (90, 110), "P": (45, 60), "K": (45, 60), "pH": (6.0, 7.0), "rain": (40, 80)}
        }
        
        features = []
        labels = []
        
        samples_per_crop = n_samples // len(crop_ranges)
        
        for crop, ranges in crop_ranges.items():
            for _ in range(samples_per_crop):
                # Generate sample within optimal range with some noise
                n = np.random.uniform(ranges["N"][0], ranges["N"][1])
                p = np.random.uniform(ranges["P"][0], ranges["P"][1])
                k = np.random.uniform(ranges["K"][0], ranges["K"][1])
                ph = np.random.uniform(ranges["pH"][0], ranges["pH"][1])
                rain = np.random.uniform(ranges["rain"][0], ranges["rain"][1])
                
                # Add some noise to create variation
                n += np.random.normal(0, 5)
                p += np.random.normal(0, 3)
                k += np.random.normal(0, 3)
                ph += np.random.normal(0, 0.2)
                rain += np.random.normal(0, 10)
                
                features.append([n, p, k, ph, rain])
                labels.append(crop)
        
        return np.array(features), np.array(labels)
    
    def _train_model(self):
        """Train the Random Forest model on synthetic data."""
        print("Training soil recommendation model...")
        
        # Generate synthetic data
        X, y = self._generate_synthetic_data(2000)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"Training accuracy: {train_score:.3f}")
        print(f"Testing accuracy: {test_score:.3f}")
        
        # Save model
        with open(self.model_path, "wb") as f:
            pickle.dump(self.model, f)
        
        print(f"Model saved to {self.model_path}")
    
    def _load_or_train_model(self):
        """Load existing model or train a new one."""
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, "rb") as f:
                    self.model = pickle.load(f)
                print("Soil model loaded successfully")
            except Exception as e:
                print(f"Error loading model: {e}")
                self._train_model()
        else:
            self._train_model()
    
    def predict(self, nitrogen: float, phosphorus: float, potassium: float, 
                ph: float, rainfall: float) -> Tuple[str, str, float]:
        """
        Predict recommended crop based on soil parameters.
        
        Args:
            nitrogen: Nitrogen content (0-200)
            phosphorus: Phosphorus content (0-200)
            potassium: Potassium content (0-200)
            ph: Soil pH (0-14)
            rainfall: Rainfall in mm (0-500)
            
        Returns:
            Tuple of (crop_name, fertilizer_advice, confidence)
        """
        if self.model is None:
            self._load_or_train_model()
        
        # Prepare input
        features = np.array([[nitrogen, phosphorus, potassium, ph, rainfall]])
        
        # Predict
        crop = self.model.predict(features)[0]
        
        # Get probability for confidence score
        probabilities = self.model.predict_proba(features)[0]
        max_prob_idx = np.argmax(probabilities)
        confidence = probabilities[max_prob_idx]
        
        # Get crop information
        crop_data = self.CROP_INFO.get(crop, {
            "fertilizer": "Consult local agricultural expert for fertilizer recommendations.",
            "tips": "Ensure proper soil testing before planting."
        })
        
        return (
            crop.title(),
            crop_data["fertilizer"],
            round(confidence, 2),
            crop_data["tips"]
        )
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from the trained model."""
        if self.model is None:
            return {}
        
        features = ["Nitrogen", "Phosphorus", "Potassium", "pH", "Rainfall"]
        importances = self.model.feature_importances_
        
        return {feature: round(importance, 3) 
                for feature, importance in zip(features, importances)}
