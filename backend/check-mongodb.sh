#!/bin/bash

# MongoDB Connection Checker for RoutineWise

echo "🔍 Checking MongoDB connection..."

# Try to connect to MongoDB
mongosh --eval "db.adminCommand('ping')" --quiet 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ MongoDB is running and accepting connections"
    exit 0
else
    echo "❌ MongoDB is not running or not accessible"
    echo ""
    echo "To start MongoDB:"
    echo "  • If installed locally: sudo systemctl start mongodb"
    echo "  • Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo "  • Or use MongoDB Atlas (free tier available)"
    echo ""
    echo "Note: The backend server will still start without MongoDB,"
    echo "but database features will be unavailable."
    exit 1
fi
