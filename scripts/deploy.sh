#!/bin/bash

# DAMS Deployment Script
# This script handles deployment of the DAMS application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_status "All dependencies are installed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    # Install dependencies
    npm ci
    
    # Run linting
    npm run lint
    
    # Build the application
    npm run build
    
    print_status "Frontend built successfully"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    
    cd backend
    
    # Install dependencies
    npm ci
    
    # Run linting
    npm run lint
    
    # Run tests
    npm test
    
    cd ..
    
    print_status "Backend built successfully"
}

# Deploy to GitHub Pages
deploy_frontend() {
    print_status "Deploying frontend to GitHub Pages..."
    
    # Deploy using gh-pages
    npm run deploy
    
    print_status "Frontend deployed successfully"
}

# Deploy backend to Railway/Render
deploy_backend() {
    print_status "Deploying backend..."
    
    # Check if Railway CLI is installed
    if command -v railway &> /dev/null; then
        print_status "Deploying to Railway..."
        cd backend
        railway up
        cd ..
    else
        print_warning "Railway CLI not found. Please deploy manually or install Railway CLI."
        print_status "You can deploy to Railway by:"
        echo "1. Install Railway CLI: npm install -g @railway/cli"
        echo "2. Login: railway login"
        echo "3. Deploy: cd backend && railway up"
    fi
}

# Main deployment function
main() {
    print_status "Starting DAMS deployment..."
    
    # Check dependencies
    check_dependencies
    
    # Build applications
    build_frontend
    build_backend
    
    # Deploy applications
    deploy_frontend
    deploy_backend
    
    print_status "Deployment completed successfully!"
}

# Run main function
main "$@" 