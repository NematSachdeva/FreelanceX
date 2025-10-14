#!/bin/bash

echo "🔍 FreelanceX Project Verification"
echo "=================================="

# Check project structure
echo "📁 Checking project structure..."

if [ -d "backend" ] && [ -d "frontend" ]; then
    echo "✅ Project structure is correct"
else
    echo "❌ Project structure is incorrect"
    exit 1
fi

# Check backend files
echo "📁 Checking backend files..."
if [ -f "backend/server.js" ] && [ -f "backend/package.json" ]; then
    echo "✅ Backend files are present"
else
    echo "❌ Backend files are missing"
    exit 1
fi

# Check frontend files
echo "📁 Checking frontend files..."
if [ -f "frontend/package.json" ] && [ -d "frontend/app" ]; then
    echo "✅ Frontend files are present"
else
    echo "❌ Frontend files are missing"
    exit 1
fi

# Check environment files
echo "🔧 Checking environment configuration..."
if [ -f "backend/.env" ] || [ -f "backend/.env.example" ]; then
    echo "✅ Backend environment configuration found"
else
    echo "⚠️  Backend .env file not found - you'll need to create one"
fi

if [ -f "frontend/.env.local" ]; then
    echo "✅ Frontend environment configuration found"
else
    echo "⚠️  Frontend .env.local file not found"
fi

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Backend dependencies not installed - run: npm run install:backend"
fi

if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies not installed - run: npm run install:frontend"
fi

# Test backend health (if running)
echo "🏥 Testing backend health..."
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running and healthy"
else
    echo "⚠️  Backend is not running - start with: npm run dev:backend"
fi

# Test frontend (if running)
echo "🌐 Testing frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "⚠️  Frontend is not running - start with: npm run dev:frontend"
fi

echo ""
echo "🎯 Verification complete!"
echo ""
echo "To start the project:"
echo "1. npm run install:all  (if dependencies not installed)"
echo "2. npm run init-db      (to initialize database)"
echo "3. npm run dev          (to start both servers)"