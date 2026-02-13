# 📘 Complete Setup Guide

This guide provides detailed step-by-step instructions for setting up the AI-Powered Smart Agriculture Assistant.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Manual Installation](#manual-installation)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Option 1: Docker (Recommended)
- Docker Desktop 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB free disk space

**Download Docker:**
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: Follow official Docker installation for your distribution

### Option 2: Local Installation
- **Python 3.11 or higher**
  - Download: https://www.python.org/downloads/
  - Verify: `python --version` or `python3 --version`

- **Node.js 20 or higher**
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **Git** (optional, for cloning)
  - Download: https://git-scm.com/downloads

---

## Quick Start (Docker)

### Step 1: Navigate to Project Directory
```bash
cd ai-smart-agriculture
```

### Step 2: Start Services
```bash
docker-compose up --build
```

This command will:
- Build both frontend and backend containers
- Install all dependencies automatically
- Start the application

### Step 3: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Stop Services
Press `Ctrl+C` or run:
```bash
docker-compose down
```

---

## Manual Installation

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Create Virtual Environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- FastAPI and Uvicorn (web framework)
- SQLAlchemy (database ORM)
- scikit-learn, pandas, numpy (ML libraries)
- Pillow (image processing)
- And other required packages

#### Step 4: Setup Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Optional: Edit .env if needed
# Default settings work fine for local development
```

#### Step 5: Start Backend Server
```bash
python run.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Keep this terminal open!** The backend must be running for the frontend to work.

---

### Frontend Setup

#### Step 1: Open New Terminal

Open a **new terminal window** (keep backend running in the first one)

#### Step 2: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 3: Install Dependencies
```bash
npm install
```

This will install:
- React and React Router
- Tailwind CSS
- Axios (API client)
- Vite (build tool)
- And other required packages

This may take a few minutes.

#### Step 4: Start Development Server
```bash
npm run dev
```

You should see:
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### Step 5: Access the Application

Open your browser and go to: **http://localhost:5173**

---

## Verification

### Check Backend is Running

1. Open: http://localhost:8000
   - You should see a JSON response with API info

2. Open: http://localhost:8000/docs
   - You should see Swagger API documentation

3. Test health endpoint:
   ```bash
   curl http://localhost:8000/health
   ```
   Expected response: `{"status":"healthy","version":"1.0.0"}`

### Check Frontend is Running

1. Open: http://localhost:5173
   - You should see the home page with "Smart Agriculture Assistant"

2. Navigate through pages:
   - Click "Disease Detection"
   - Click "Soil Advice"
   - Click "Weather"
   - Click "Dashboard"

### Test the Features

#### Disease Detection
1. Go to Disease Detection page
2. Click upload area
3. Select any image from your computer
4. Click "Detect Disease"
5. You should see prediction results

#### Soil Recommendation
1. Go to Soil Recommendation page
2. Fill in sample values:
   - Nitrogen: 90
   - Phosphorus: 42
   - Potassium: 43
   - pH: 6.5
   - Rainfall: 200
3. Click "Get Recommendation"
4. You should see crop recommendation

#### Weather Advisory
1. Go to Weather page
2. Enter "Delhi" or click a city
3. Click "Get Advisory"
4. You should see weather info and farming tips

---

## Troubleshooting

### Backend Issues

#### "Port 8000 already in use"
Another application is using port 8000.

**Solution 1:** Stop the other application

**Solution 2:** Change the port
```bash
# Edit backend/.env
PORT=8001

# Then in frontend/vite.config.js, update proxy target to http://localhost:8001
```

#### "Module not found" error
Dependencies not installed properly.

**Solution:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

#### Database errors
Database file might be corrupted.

**Solution:**
```bash
cd backend
rm agriculture.db  # Delete old database
python run.py      # Will create fresh database
```

---

### Frontend Issues

#### "npm: command not found"
Node.js is not installed or not in PATH.

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Verify: `node --version`

#### "Port 5173 already in use"
Another Vite dev server is running.

**Solution:**
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <process_id> /F

# On macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

#### Blank page or errors in browser
Backend might not be running.

**Solution:**
1. Verify backend is running at http://localhost:8000
2. Check browser console for errors (F12)
3. Clear browser cache and reload

#### CORS errors
Backend CORS settings need adjustment.

**Solution:**
```bash
# Edit backend/.env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Restart backend server
```

---

### Docker Issues

#### "docker: command not found"
Docker is not installed.

**Solution:**
Install Docker Desktop from https://www.docker.com/products/docker-desktop

#### "Cannot connect to Docker daemon"
Docker service is not running.

**Solution:**
- Windows/Mac: Start Docker Desktop application
- Linux: `sudo systemctl start docker`

#### Build errors
Cached layers might be causing issues.

**Solution:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### Port conflicts
Ports 8000 or 5173 are already in use.

**Solution:**
```bash
# Edit docker-compose.yml
# Change port mappings:
# For backend: "8001:8000"
# For frontend: "5174:5173"
```

---

## Additional Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=sqlite:///./agriculture.db
APP_NAME=AI Smart Agriculture Assistant
APP_VERSION=1.0.0
DEBUG=True
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
MODEL_PATH=./ml_models/
UPLOAD_DIR=./uploads/
```

#### Frontend (.env.local) - Optional
```env
VITE_API_URL=http://localhost:8000
```

---

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in backend/.env
2. Build frontend: `npm run build`
3. Use production ASGI server (Uvicorn with workers)
4. Set up proper database (PostgreSQL instead of SQLite)
5. Configure proper CORS origins
6. Set up HTTPS/SSL certificates
7. Use environment variables for secrets

---

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md
2. Review error messages carefully
3. Search for similar issues on GitHub
4. Open a new issue with:
   - Your operating system
   - Error messages
   - Steps to reproduce

---

## Next Steps

Once everything is running:

1. Explore all features
2. Upload test images for disease detection
3. Try different soil parameters
4. Check various locations for weather
5. View your prediction history in the dashboard

**Enjoy using the Smart Agriculture Assistant! 🌾**
