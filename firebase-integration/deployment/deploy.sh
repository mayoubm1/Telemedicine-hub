#!/bin/bash

# Telemedicine Hub Firebase Deployment Script
# This script deploys the complete telemedicine platform to Firebase

set -e

echo "🚀 Starting Telemedicine Hub Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "You are not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    print_error "firebase.json not found. Please run this script from the firebase-integration directory."
    exit 1
fi

print_status "Checking environment configuration..."

# Check for required environment variables
if [ -z "$OPENAI_API_KEY" ]; then
    print_warning "OPENAI_API_KEY not set. AI features may not work properly."
    read -p "Do you want to set it now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your OpenAI API Key: " OPENAI_API_KEY
        firebase functions:config:set openai.api_key="$OPENAI_API_KEY"
        print_success "OpenAI API Key configured"
    fi
fi

print_status "Installing Firebase Functions dependencies..."
cd functions
npm install
cd ..

print_status "Building frontend applications..."

# Check if build files exist
if [ ! -d "hosting/wellness-portal" ] || [ ! -d "hosting/assist-portal" ]; then
    print_error "Frontend build files not found. Please build the frontend applications first."
    print_status "Run the following commands from the project root:"
    echo "cd frontend/wellness-portal && npm run build"
    echo "cd frontend/assist-portal && npm run build"
    echo "Then copy the dist files to hosting directories"
    exit 1
fi

print_status "Validating Firebase configuration..."
firebase use --add

print_status "Setting up Firestore security rules..."
firebase deploy --only firestore:rules

print_status "Deploying Firebase Functions..."
firebase deploy --only functions

print_status "Deploying to Firebase Hosting..."
firebase deploy --only hosting

print_status "Setting up scheduled functions..."
# Enable required APIs
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudbuild.googleapis.com

print_success "🎉 Deployment completed successfully!"

echo ""
echo "📋 Deployment Summary:"
echo "====================="
echo "✅ Firebase Functions deployed"
echo "✅ Frontend portals deployed to hosting"
echo "✅ Firestore security rules updated"
echo "✅ Scheduled functions configured"
echo ""

# Get the hosting URL
HOSTING_URL=$(firebase hosting:channel:list | grep -o 'https://[^[:space:]]*' | head -1)
if [ -n "$HOSTING_URL" ]; then
    echo "🌐 Your telemedicine platform is now live at:"
    echo "   Patient Portal: $HOSTING_URL/tawas-now/telemedicine/wellness"
    echo "   Doctor Portal:  $HOSTING_URL/tawas-now/telemedicine/assist"
else
    echo "🌐 Your telemedicine platform is now live!"
    echo "   Check your Firebase console for the hosting URL"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Configure your custom domain (if needed)"
echo "2. Set up monitoring and alerts"
echo "3. Test all features thoroughly"
echo "4. Configure backup and recovery procedures"
echo ""

print_status "Deployment completed! 🚀"

