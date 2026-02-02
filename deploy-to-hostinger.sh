#!/bin/bash

# Terry Golden Website - Automated Build Script
# Double-click this file to prepare your website for Hostinger upload

echo "================================================"
echo "   TERRY GOLDEN WEBSITE - BUILD SCRIPT"
echo "================================================"
echo ""
echo "Starting automated build process..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "✓ Located project folder"
echo ""

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a few minutes)..."
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ ERROR: Failed to install dependencies"
        echo "Please make sure Node.js is installed on your computer"
        echo ""
        read -p "Press Enter to close..."
        exit 1
    fi
    echo "✓ Dependencies installed successfully"
    echo ""
fi

# Build the website
echo "Building website..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: Build failed"
    echo "Please check the error messages above"
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

echo ""
echo "✓ Website built successfully!"
echo ""
echo "================================================"
echo "   SUCCESS! YOUR WEBSITE IS READY"
echo "================================================"
echo ""
echo "Your website files are in the 'dist' folder"
echo ""
echo "NEXT STEPS:"
echo "1. Open Hostinger File Manager"
echo "2. Go to the 'public_html' folder"
echo "3. Upload ALL files from the 'dist' folder"
echo ""
echo "The 'dist' folder is located at:"
echo "$SCRIPT_DIR/dist"
echo ""
read -p "Press Enter to close..."
