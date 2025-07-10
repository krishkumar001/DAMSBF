#!/bin/bash

# Script to copy CI/CD files to the Dams-Backend repository
# This script will copy all necessary files to set up the CI/CD pipeline

set -e

echo "🚀 Copying CI/CD files to Dams-Backend repository"
echo "=================================================="

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

# Check if backend repository exists
check_backend_repo() {
    if [ ! -d "../Dams-Backend" ]; then
        print_error "Dams-Backend repository not found in parent directory"
        echo "Please clone the repository first:"
        echo "  cd .."
        echo "  git clone https://github.com/Advaita151/Dams-Backend.git"
        echo "  cd Dams-Backend"
        exit 1
    fi
}

# Copy CI/CD files to backend repository
copy_files() {
    print_status "Copying CI/CD files to Dams-Backend repository..."
    
    # Create necessary directories
    mkdir -p ../Dams-Backend/.github/workflows
    
    # Copy workflow files
    cp .github/workflows/backend-ci-cd.yml ../Dams-Backend/.github/workflows/
    print_success "Copied GitHub Actions workflow"
    
    # Copy configuration files
    cp package.json ../Dams-Backend/
    cp jest.config.js ../Dams-Backend/
    cp Dockerfile ../Dams-Backend/
    cp railway.json ../Dams-Backend/
    cp env.example ../Dams-Backend/
    cp README.md ../Dams-Backend/
    cp setup-backend-ci-cd.sh ../Dams-Backend/
    cp DEPLOYMENT_GUIDE.md ../Dams-Backend/
    cp BACKEND_CI_CD_SUMMARY.md ../Dams-Backend/
    
    print_success "Copied all configuration files"
    
    # Make setup script executable
    chmod +x ../Dams-Backend/setup-backend-ci-cd.sh
    print_success "Made setup script executable"
}

# Setup git in backend repository
setup_git() {
    print_status "Setting up git in backend repository..."
    
    cd ../Dams-Backend
    
    # Check if git is initialized
    if [ ! -d ".git" ]; then
        print_error "Git not initialized in Dams-Backend repository"
        echo "Please initialize git first:"
        echo "  git init"
        echo "  git remote add origin https://github.com/Advaita151/Dams-Backend.git"
        exit 1
    fi
    
    # Check if krish/backend branch exists
    if ! git branch | grep -q "krish/backend"; then
        print_status "Creating krish/backend branch..."
        git checkout -b krish/backend
    else
        print_status "Switching to krish/backend branch..."
        git checkout krish/backend
    fi
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        print_warning "No changes to commit"
    else
        print_status "Committing CI/CD files..."
        git commit -m "feat: add comprehensive CI/CD pipeline setup
        
        - Add GitHub Actions workflow for automated testing and deployment
        - Add Jest configuration for testing with coverage
        - Add Docker configuration for containerization
        - Add Railway configuration for deployment
        - Add comprehensive documentation and setup scripts
        - Add environment configuration templates
        - Add security scanning and monitoring setup"
        
        print_success "Committed CI/CD files"
    fi
}

# Push to remote repository
push_to_remote() {
    print_status "Pushing to remote repository..."
    
    # Check if remote exists
    if ! git remote | grep -q "origin"; then
        print_error "No remote origin found"
        echo "Please add remote origin:"
        echo "  git remote add origin https://github.com/Advaita151/Dams-Backend.git"
        exit 1
    fi
    
    # Push to krish/backend branch
    print_status "Pushing to krish/backend branch..."
    git push origin krish/backend --force
    
    print_success "Pushed to remote repository"
}

# Show next steps
show_next_steps() {
    echo ""
    print_success "CI/CD files successfully copied to Dams-Backend repository!"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/Advaita151/Dams-Backend"
    echo "2. Check the krish/backend branch"
    echo "3. Set up GitHub secrets (see DEPLOYMENT_GUIDE.md)"
    echo "4. Create Railway projects (see DEPLOYMENT_GUIDE.md)"
    echo "5. Configure MongoDB Atlas (see DEPLOYMENT_GUIDE.md)"
    echo "6. Push any additional changes to trigger CI/CD"
    echo ""
    echo "For detailed instructions, see:"
    echo "  - DEPLOYMENT_GUIDE.md"
    echo "  - BACKEND_CI_CD_SUMMARY.md"
    echo "  - README.md"
    echo ""
    echo "To run the automated setup script:"
    echo "  cd ../Dams-Backend"
    echo "  ./setup-backend-ci-cd.sh"
}

# Main function
main() {
    print_status "Starting CI/CD file copy process..."
    
    # Check backend repository
    check_backend_repo
    
    # Copy files
    copy_files
    
    # Setup git
    setup_git
    
    # Push to remote
    push_to_remote
    
    # Show next steps
    show_next_steps
}

# Run main function
main "$@" 