"""
Weather Simulator - Generates realistic weather data without external APIs.
"""
import random
import math
from datetime import datetime
from typing import Dict, Tuple


class WeatherSimulator:
    """Simulates realistic weather conditions for agricultural advice."""
    
    # City base temperatures (annual average in Celsius)
    CITY_BASE_TEMPS = {
        "delhi": 25, "mumbai": 27, "bangalore": 24, "chennai": 29,
        "kolkata": 27, "hyderabad": 27, "pune": 25, "jaipur": 26,
        "lucknow": 26, "kanpur": 26, "nagpur": 27, "indore": 25,
        "bhopal": 25, "patna": 26, "ludhiana": 23, "agra": 26,
        "nashik": 25, "vadodara": 28, "rajkot": 27, "default": 26
    }
    
    # Regional humidity patterns
    CITY_HUMIDITY = {
        "mumbai": (70, 90), "chennai": (65, 85), "kolkata": (65, 85),
        "bangalore": (55, 75), "hyderabad": (50, 70), "pune": (50, 70),
        "delhi": (40, 70), "jaipur": (35, 65), "default": (50, 75)
    }
    
    def __init__(self):
        """Initialize weather simulator."""
        random.seed()
    
    def _get_seasonal_adjustment(self) -> float:
        """
        Calculate seasonal temperature adjustment based on current month.
        Returns adjustment in Celsius.
        """
        month = datetime.now().month
        
        # Seasonal pattern for Northern Hemisphere (India)
        seasonal_pattern = {
            1: -3,   # January - Winter
            2: -1,   # February - Late Winter
            3: 2,    # March - Spring
            4: 5,    # April - Late Spring
            5: 7,    # May - Summer
            6: 6,    # June - Monsoon starts
            7: 4,    # July - Monsoon
            8: 3,    # August - Monsoon
            9: 2,    # September - Post-monsoon
            10: 0,   # October - Autumn
            11: -2,  # November - Early Winter
            12: -4   # December - Winter
        }
        
        return seasonal_pattern.get(month, 0)
    
    def _get_rainfall_probability(self) -> Tuple[float, str]:
        """
        Get rainfall probability and prediction based on season.
        Returns (probability, prediction_text).
        """
        month = datetime.now().month
        
        # Monsoon months (June-September)
        if month in [6, 7, 8, 9]:
            probability = random.uniform(0.6, 0.9)
            if probability > 0.8:
                prediction = "Heavy Rain Expected"
            elif probability > 0.65:
                prediction = "Moderate Rain"
            else:
                prediction = "Light Showers"
        
        # Winter months (December-February)
        elif month in [12, 1, 2]:
            probability = random.uniform(0.1, 0.3)
            prediction = "Clear Sky" if probability < 0.2 else "Possible Light Rain"
        
        # Summer months (March-May)
        elif month in [3, 4, 5]:
            probability = random.uniform(0.15, 0.4)
            prediction = "Mostly Dry" if probability < 0.25 else "Scattered Showers"
        
        # Post-monsoon (October-November)
        else:
            probability = random.uniform(0.3, 0.5)
            prediction = "Partly Cloudy" if probability < 0.4 else "Moderate Rain"
        
        return probability, prediction
    
    def _generate_irrigation_advice(self, rain_probability: float, 
                                    temperature: float, humidity: float) -> str:
        """
        Generate irrigation advice based on weather conditions.
        
        Args:
            rain_probability: Probability of rain (0-1)
            temperature: Temperature in Celsius
            humidity: Humidity percentage
            
        Returns:
            Irrigation advice string
        """
        # Heavy rain expected
        if rain_probability > 0.7:
            return "Hold irrigation. Heavy rainfall expected. Ensure proper drainage."
        
        # Moderate rain expected
        elif rain_probability > 0.5:
            return "Reduce irrigation by 50%. Moderate rain expected soon."
        
        # Light rain possibility
        elif rain_probability > 0.3:
            return "Reduce irrigation by 30%. Monitor weather for possible showers."
        
        # Hot and dry conditions
        elif temperature > 35 and humidity < 40:
            return "Increase irrigation by 40%. Hot and dry conditions require more water."
        
        # Hot conditions
        elif temperature > 30 and humidity < 50:
            return "Increase irrigation by 20%. Warm weather increases water demand."
        
        # Moderate humidity
        elif humidity > 70:
            return "Maintain normal irrigation schedule. Good moisture retention expected."
        
        # Normal conditions
        else:
            return "Continue regular irrigation schedule. Weather conditions are favorable."
    
    def _generate_farming_tips(self, temperature: float, rain_prediction: str, 
                               humidity: float) -> str:
        """Generate farming tips based on weather conditions."""
        month = datetime.now().month
        tips = []
        
        # Temperature-based tips
        if temperature > 35:
            tips.append("Apply mulch to protect crops from heat stress.")
        elif temperature < 15:
            tips.append("Protect sensitive crops from cold temperatures.")
        
        # Rain-based tips
        if "Heavy" in rain_prediction:
            tips.append("Postpone fertilizer application. Avoid pesticide spraying.")
        elif "Clear" in rain_prediction or "Dry" in rain_prediction:
            tips.append("Good time for pesticide and fungicide application.")
        
        # Humidity-based tips
        if humidity > 80:
            tips.append("High humidity increases fungal disease risk. Monitor crops closely.")
        elif humidity < 30:
            tips.append("Low humidity may cause stress. Ensure adequate irrigation.")
        
        # Seasonal tips
        if month in [6, 7, 8, 9]:  # Monsoon
            tips.append("Ensure proper drainage to prevent waterlogging.")
        elif month in [3, 4, 5]:  # Summer
            tips.append("Consider shade nets for sensitive crops.")
        elif month in [10, 11]:  # Post-monsoon
            tips.append("Good time for sowing winter crops.")
        
        return " ".join(tips) if tips else "Monitor weather regularly for best results."
    
    def get_weather(self, location: str = "default") -> Dict:
        """
        Generate simulated weather data for a location.
        
        Args:
            location: City name or location identifier
            
        Returns:
            Dictionary with weather information
        """
        location_lower = location.lower()
        
        # Get base temperature for location
        base_temp = self.CITY_BASE_TEMPS.get(location_lower, 
                                              self.CITY_BASE_TEMPS["default"])
        
        # Apply seasonal adjustment
        seasonal_adj = self._get_seasonal_adjustment()
        
        # Add daily variation
        daily_variation = random.uniform(-3, 5)
        
        # Calculate final temperature
        temperature = round(base_temp + seasonal_adj + daily_variation, 1)
        
        # Get humidity range for location
        humidity_range = self.CITY_HUMIDITY.get(location_lower,
                                                self.CITY_HUMIDITY["default"])
        humidity = round(random.uniform(humidity_range[0], humidity_range[1]), 1)
        
        # Get rainfall prediction
        rain_probability, rain_prediction = self._get_rainfall_probability()
        
        # Generate irrigation advice
        irrigation_advice = self._generate_irrigation_advice(
            rain_probability, temperature, humidity
        )
        
        # Generate farming tips
        farming_tips = self._generate_farming_tips(
            temperature, rain_prediction, humidity
        )
        
        return {
            "location": location.title(),
            "temperature": temperature,
            "humidity": humidity,
            "rain_prediction": rain_prediction,
            "rain_probability": round(rain_probability * 100, 1),
            "irrigation_advice": irrigation_advice,
            "farming_tips": farming_tips,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_weekly_forecast(self, location: str = "default") -> list:
        """
        Generate a 7-day weather forecast.
        
        Args:
            location: City name or location identifier
            
        Returns:
            List of daily weather predictions
        """
        forecast = []
        
        for day in range(7):
            # Simulate slight correlation between days
            weather = self.get_weather(location)
            weather["day"] = day + 1
            forecast.append(weather)
        
        return forecast
