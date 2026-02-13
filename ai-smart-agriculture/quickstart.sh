#!/bin/bash

echo "========================================="
echo "AI-Powered Smart Agriculture Assistant"
echo "Quick Start Script"
echo "========================================="
echo ""

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✓ Docker and Docker Compose found"
    echo ""
    echo "Choose installation method:"
    echo "1. Docker (Recommended - Easy Setup)"
    echo "2. Local Installation (Python + Node.js required)"
    echo ""
    read -p "Enter your choice (1 or 2): " choice
    
    if [ "$choice" = "1" ]; then
        echo ""
        echo "Starting with Docker..."
        docker-compose up --build
    else
        echo ""
        echo "Please follow the manual installation steps in README.md"
    fi
else
    echo "Docker not found. Installing locally..."
    echo ""
    
    # Check Python
    if command -v python3 &> /dev/null; then
        echo "✓ Python found: $(python3 --version)"
    else
        echo "✗ Python 3.11+ is required but not installed"
        exit 1
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        echo "✓ Node.js found: $(node --version)"
    else
        echo "✗ Node.js 20+ is required but not installed"
        exit 1
    fi
    
    echo ""
    echo "Setting up backend..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env
    
    echo ""
    echo "Backend setup complete!"
    echo "Run 'python run.py' from the backend directory to start the server"
    
    echo ""
    echo "Setting up frontend..."
    cd ../frontend
    npm install
    
    echo ""
    echo "Frontend setup complete!"
    echo "Run 'npm run dev' from the frontend directory to start the app"
    
    echo ""
    echo "========================================="
    echo "Setup Complete!"
    echo "========================================="
    echo "Backend will be available at: http://localhost:8000"
    echo "Frontend will be available at: http://localhost:5173"
    echo "API Documentation: http://localhost:8000/docs"
fi
