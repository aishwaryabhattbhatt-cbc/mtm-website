#!/bin/bash

# Hero 9 WebGL Noise Distortion Effect - Quick Start Script
# Run this to get the project up and running

echo "🎨 Hero 9 - WebGL Noise Distortion Effect"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")/hero9-noise-warp"
echo "📁 Working directory: $(pwd)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "   (This may take a minute...)"
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "   → Development server will open at: http://localhost:5174/"
echo "   → Press Ctrl+C to stop the server"
echo ""
echo "📝 What to do next:"
echo "   1. The browser will auto-open when ready"
echo "   2. Use GUI panel (top-right) to adjust effects"
echo "   3. Click '📁 Load Image' or drag images to load them"
echo "   4. Adjust sliders to see real-time distortion updates"
echo ""

# Start development server
npm run dev
