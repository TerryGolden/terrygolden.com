#!/bin/bash

echo "======================================"
echo "   AUTOMATED DEPLOYMENT TO HOSTINGER"
echo "======================================"
echo ""

# Check if config exists
if [ ! -f "ftp-config.json" ]; then
    echo "❌ ERROR: ftp-config.json not found!"
    echo ""
    echo "Please create ftp-config.json with your Hostinger credentials."
    echo "Copy ftp-config.example.json and fill in your details."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building website..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📤 Uploading to Hostinger via FTP..."
echo ""

# Install lftp if not present (for FTP upload)
if ! command -v lftp &> /dev/null; then
    echo "Installing FTP client..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install lftp
    else
        echo "Please install 'lftp' manually: sudo apt-get install lftp"
        exit 1
    fi
fi

# Read config
HOST=$(grep -o '"host": "[^"]*' ftp-config.json | cut -d'"' -f4)
USER=$(grep -o '"user": "[^"]*' ftp-config.json | cut -d'"' -f4)
PASS=$(grep -o '"password": "[^"]*' ftp-config.json | cut -d'"' -f4)
DIR=$(grep -o '"remoteDir": "[^"]*' ftp-config.json | cut -d'"' -f4)

# Upload via FTP
lftp -c "
set ftp:ssl-allow no;
open -u $USER,$PASS $HOST;
mirror -R --delete --verbose dist $DIR;
bye
"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo "Your website is now live on Hostinger!"
else
    echo ""
    echo "❌ Upload failed. Check your FTP credentials."
fi
