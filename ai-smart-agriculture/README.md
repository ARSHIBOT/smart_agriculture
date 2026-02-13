# 🌾 AI-Powered Smart Agriculture Assistant

A complete full-stack web application that helps farmers make data-driven decisions using AI and machine learning. The system provides crop disease detection, soil-based recommendations, and weather-based farming advice - all running completely offline without requiring external API keys.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.109-green.svg)

## ✨ Features

### 🔬 Crop Disease Detection
- Upload crop images for AI-powered disease identification
- Get disease diagnosis with confidence scores
- Receive treatment recommendations and severity assessments
- Simulated computer vision model for demonstration

### 🌱 Soil Analysis & Crop Recommendation
- Input soil parameters (N, P, K, pH, rainfall)
- Machine Learning-based crop recommendations
- Personalized fertilizer advice
- RandomForest classifier trained on synthetic agricultural data

### 🌤️ Weather-Based Farming Advisory
- Location-based weather simulation
- Irrigation recommendations based on weather conditions
- Farming tips for different weather patterns
- **Note**: Weather data is internally simulated (no external API required)

### 📊 Dashboard & Analytics
- Track prediction history
- View comprehensive statistics
- Filter predictions by type
- Monitor usage patterns

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- Mobile-first responsive design

### Backend
- **FastAPI** (Python web framework)
- **SQLAlchemy** ORM with SQLite database
- **Pydantic** for data validation
- **Uvicorn** ASGI server
- CORS enabled for frontend integration

### Machine Learning
- **scikit-learn** for soil recommendation model
- **TensorFlow/Pillow** for image processing
- **NumPy & Pandas** for data manipulation
- All models run locally without external dependencies

## 📁 Project Structure

```
ai-smart-agriculture/
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # Database setup
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Business logic
│   │   └── utils/               # Utility functions
│   ├── ml_models/
│   │   ├── crop_disease_model.py    # Disease detection
│   │   ├── soil_model.py            # Soil recommendation
│   │   └── weather_simulator.py     # Weather simulation
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- npm or yarn

### Method 1: Local Installation

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the application
python run.py
```

The backend will start on `http://localhost:8000`

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Method 2: Docker Installation

```bash
# From project root directory
docker-compose up --build
```

This will start both frontend and backend services:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints

#### Disease Detection
```http
POST /predict/disease
Content-Type: multipart/form-data

file: <image file>
```

#### Soil Recommendation
```http
POST /predict/soil
Content-Type: application/json

{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "ph": 6.5,
  "rainfall": 202.5
}
```

#### Weather Advisory
```http
GET /predict/weather?location=Delhi
```

#### Prediction History
```http
GET /predict/history?prediction_type=disease&limit=50
```

#### Statistics
```http
GET /predict/statistics
```

## 🎯 Usage Guide

### Disease Detection
1. Navigate to "Disease Detection" page
2. Upload a clear image of crop leaves
3. Click "Detect Disease"
4. View results with treatment recommendations

### Soil Analysis
1. Go to "Soil Recommendation" page
2. Enter soil parameters (N, P, K, pH, rainfall)
3. Click "Get Recommendation"
4. Review crop recommendations and fertilizer advice

### Weather Advisory
1. Visit "Weather" page
2. Enter your location or select from popular cities
3. View weather-based irrigation and farming advice

### Dashboard
1. Access "Dashboard" to view:
   - Total prediction statistics
   - Recent prediction history
   - Filter by prediction type

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
DATABASE_URL=sqlite:///./agriculture.db
APP_NAME=AI Smart Agriculture Assistant
DEBUG=True
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration

Edit `frontend/.env.local` (optional):

```env
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## 📊 Machine Learning Models

### Disease Detection Model
- Uses simulated CNN-based detection
- Analyzes image features (color, brightness, patterns)
- Returns disease name, confidence, and treatment
- Supports 10+ common crop diseases

### Soil Recommendation Model
- RandomForest classifier
- Trained on synthetic agricultural data
- Features: N, P, K, pH, rainfall
- Recommends 12 different crops

### Weather Simulator
- Rule-based realistic weather generation
- Seasonal patterns for accurate simulation
- Location-specific base temperatures
- Provides irrigation and farming advice

## 🔐 Security Features

- Input validation using Pydantic
- File upload size limits
- Allowed file type restrictions
- SQL injection prevention via ORM
- CORS configuration
- Environment variable management

## 🚢 Deployment

### Production Build

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Improvements

- [ ] Integration with real weather APIs
- [ ] Advanced deep learning models for disease detection
- [ ] Multi-language support
- [ ] Mobile application (React Native)
- [ ] User authentication and profiles
- [ ] Advanced analytics and reporting
- [ ] Integration with IoT sensors
- [ ] Chatbot for farmer queries
- [ ] Market price predictions
- [ ] Pest detection feature

## 🐛 Known Issues

- Weather data is simulated (not real-time)
- Disease detection uses rule-based simulation
- Limited to 12 crop types in recommendations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Arham Bothra 

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React and Vite for modern frontend development
- scikit-learn for machine learning capabilities
- Tailwind CSS for beautiful styling
- The open-source community

## 📧 Contact

For questions or support, please open an issue or contact:
- Email: support@smartagri.com
- GitHub: [Your GitHub Profile]

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for farmers worldwide**
