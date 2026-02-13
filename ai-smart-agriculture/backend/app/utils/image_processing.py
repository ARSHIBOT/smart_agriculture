"""
Image processing utilities for crop image handling.
"""
import os
from PIL import Image
from typing import Tuple
import uuid


class ImageProcessor:
    """Handles image upload and preprocessing."""
    
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    TARGET_SIZE = (224, 224)
    
    def __init__(self, upload_dir: str):
        """
        Initialize image processor.
        
        Args:
            upload_dir: Directory to save uploaded images
        """
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
    
    def is_allowed_file(self, filename: str) -> bool:
        """Check if file extension is allowed."""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS
    
    def save_image(self, file_data: bytes, original_filename: str) -> str:
        """
        Save uploaded image with unique filename.
        
        Args:
            file_data: Image file data
            original_filename: Original filename from upload
            
        Returns:
            Path to saved image
            
        Raises:
            ValueError: If file is invalid
        """
        if not self.is_allowed_file(original_filename):
            raise ValueError(f"File type not allowed. Allowed types: {self.ALLOWED_EXTENSIONS}")
        
        if len(file_data) > self.MAX_FILE_SIZE:
            raise ValueError(f"File too large. Maximum size: {self.MAX_FILE_SIZE / (1024*1024)}MB")
        
        # Generate unique filename
        ext = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(self.upload_dir, unique_filename)
        
        # Save file
        with open(filepath, 'wb') as f:
            f.write(file_data)
        
        return filepath
    
    def preprocess_image(self, image_path: str) -> Image.Image:
        """
        Preprocess image for model input.
        
        Args:
            image_path: Path to image file
            
        Returns:
            Preprocessed PIL Image
        """
        try:
            # Open image
            image = Image.open(image_path)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize to target size
            image = image.resize(self.TARGET_SIZE, Image.Resampling.LANCZOS)
            
            return image
            
        except Exception as e:
            raise ValueError(f"Error processing image: {str(e)}")
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """
        Remove old uploaded files.
        
        Args:
            max_age_hours: Maximum age of files to keep
        """
        import time
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        for filename in os.listdir(self.upload_dir):
            filepath = os.path.join(self.upload_dir, filename)
            if os.path.isfile(filepath):
                file_age = current_time - os.path.getmtime(filepath)
                if file_age > max_age_seconds:
                    try:
                        os.remove(filepath)
                    except Exception as e:
                        print(f"Error removing old file {filename}: {e}")
