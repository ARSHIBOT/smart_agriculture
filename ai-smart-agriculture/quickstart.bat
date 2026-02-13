@echo off
echo =========================================
echo AI-Powered Smart Agriculture Assistant
echo Quick Start Script for Windows
echo =========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% == 0 (
    docker-compose --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Docker and Docker Compose found
        echo.
        echo Choose installation method:
        echo 1. Docker (Recommended - Easy Setup^)
        echo 2. Local Installation (Python + Node.js required^)
        echo.
        set /p choice="Enter your choice (1 or 2): "
        
        if "%choice%"=="1" (
            echo.
            echo Starting with Docker...
            docker-compose up --build
        ) else (
            echo.
            echo Please follow the manual installation steps in README.md
            pause
        )
    )
) else (
    echo Docker not found. Checking for local dependencies...
    echo.
    
    REM Check Python
    python --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Python found
    ) else (
        echo Python 3.11+ is required but not installed
        echo Please install Python from https://www.python.org/
        pause
        exit /b 1
    )
    
    REM Check Node.js
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Node.js found
    ) else (
        echo Node.js 20+ is required but not installed
        echo Please install Node.js from https://nodejs.org/
        pause
        exit /b 1
    )
    
    echo.
    echo Setting up backend...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    copy .env.example .env
    
    echo.
    echo Backend setup complete!
    echo To start backend: cd backend, activate venv, then run: python run.py
    
    echo.
    echo Setting up frontend...
    cd ..\frontend
    call npm install
    
    echo.
    echo Frontend setup complete!
    echo To start frontend: cd frontend, then run: npm run dev
    
    echo.
    echo =========================================
    echo Setup Complete!
    echo =========================================
    echo Backend will be available at: http://localhost:8000
    echo Frontend will be available at: http://localhost:5173
    echo API Documentation: http://localhost:8000/docs
    pause
)
