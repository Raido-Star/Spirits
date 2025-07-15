#!/bin/bash

# NexusForge AI Platform Startup Script
# This script will help you get the platform running quickly

echo "🚀 Welcome to NexusForge AI Platform!"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js to version 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the client
echo "🔨 Building client application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Client built successfully"
else
    echo "❌ Failed to build client"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now start the platform:"
echo ""
echo "   Development mode (recommended):"
echo "   npm run dev"
echo ""
echo "   Production mode:"
echo "   npm start"
echo ""
echo "   The platform will be available at:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:5000"
echo ""
echo "   Demo credentials:"
echo "   - Email: demo@nexusforge.ai"
echo "   - Password: demo123"
echo ""
echo "📚 For more information, check the README.md file"
echo "🔧 Edit .env file to configure your environment"