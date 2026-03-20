#!/bin/bash

# MongoDB Setup Script for RoutineWise
# This script provides multiple ways to start MongoDB

echo "🔍 RoutineWise - MongoDB Setup"
echo "================================"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✅ Docker is available"
    echo ""
    echo "Option 1: Start MongoDB using Docker (Recommended)"
    echo "Run this command:"
    echo "  docker run -d --name routinewise-mongo -p 27017:27017 mongo:7"
    echo ""
    echo "This will:"
    echo "  - Download MongoDB image (~500MB - may take a few minutes)"
    echo "  - Start MongoDB container in background"
    echo "  - Expose MongoDB on port 27017"
    echo ""
else
    echo "❌ Docker is not available"
fi

echo ""
echo "Option 2: Install MongoDB locally"
echo ""
echo "Ubuntu/Debian:"
echo "  sudo apt-get update"
echo "  sudo apt-get install -y mongodb"
echo "  sudo systemctl start mongodb"
echo ""
echo "macOS (using Homebrew):"
echo "  brew tap mongodb/brew"
echo "  brew install mongodb-community"
echo "  brew services start mongodb-community"
echo ""
echo "Option 3: Use MongoDB Atlas (Cloud, Free Tier)"
echo ""
echo "1. Go to: https://www.mongodb.com/cloud/atlas"
echo "2. Create free account"
echo "3. Create free cluster (M0)"
echo "4. Click 'Connect' → 'Connect your application'"
echo "5. Get connection string"
echo "6. Update backend/.env with your connection string:"
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/routinewise"
echo ""

# Check if MongoDB is running
echo "Checking if MongoDB is already running..."
if nc -z localhost 27017 2>/dev/null; then
    echo "✅ MongoDB is running on localhost:27017"
    echo ""
    echo "You can now start the backend:"
    echo "  cd backend && npm run dev"
else
    echo "❌ MongoDB is not running"
    echo ""
    echo "Choose one of the options above to start MongoDB"
    echo ""
    echo "Note: The backend will still work without MongoDB,"
    echo "but database features will be unavailable."
fi

echo ""
echo "For more information, see: MONGODB_SETUP.md"
