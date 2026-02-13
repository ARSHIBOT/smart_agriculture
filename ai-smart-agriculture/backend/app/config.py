"""
Configuration settings for the Smart Agriculture Assistant.
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = "sqlite:///./agriculture.db"
    
    # Application
    APP_NAME: str = "AI Smart Agriculture Assistant"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # ML Models
    MODEL_PATH: str = "./ml_models/"
    UPLOAD_DIR: str = "./uploads/"
    
    # Create upload directory if it doesn't exist
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
