#!/bin/bash

# DAMS CI/CD Setup Script
# This script helps you set up the complete CI/CD pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local default="$2"
    local required="$3"
    
    if [ "$required" = "true" ]; then
        while true; do
            read -p "$prompt: " input
            if [ -n "$input" ]; then
                echo "$input"
                break
            else
                print_error "This field is required!"
            fi
        done
    else
        read -p "$prompt [$default]: " input
        echo "${input:-$default}"
    fi
}

# Function to validate URL
validate_url() {
    local url="$1"
    if [[ $url =~ ^https?:// ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate email
validate_email() {
    local email="$1"
    if [[ $email =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

print_header "DAMS CI/CD Pipeline Setup"
echo "This script will help you set up the complete CI/CD pipeline for your DAMS project."
echo ""

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists git; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "All prerequisites are installed!"

# Get project information
print_header "Project Information"

GITHUB_USERNAME=$(prompt_input "Enter your GitHub username" "" "true")
REPO_NAME=$(prompt_input "Enter your repository name" "DAMSBF" "true")
BRANCH_NAME=$(prompt_input "Enter your main branch name" "main" "false")

# Validate repository URL
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME"
print_status "Repository URL: $REPO_URL"

# Check if repository exists
if ! curl -s -o /dev/null -w "%{http_code}" "https://github.com/$GITHUB_USERNAME/$REPO_NAME" | grep -q "200"; then
    print_warning "Repository $REPO_URL might not exist or be private."
    print_warning "Make sure the repository exists and you have access to it."
fi

# Railway setup
print_header "Railway Setup"

print_status "Setting up Railway deployment..."
print_warning "You'll need to create Railway accounts and get tokens."

RAILWAY_STAGING_TOKEN=$(prompt_input "Enter Railway token for staging" "" "true")
RAILWAY_PRODUCTION_TOKEN=$(prompt_input "Enter Railway token for production" "" "true")

# MongoDB setup
print_header "MongoDB Atlas Setup"

print_status "Setting up MongoDB Atlas databases..."

MONGODB_STAGING_URI=$(prompt_input "Enter MongoDB URI for staging" "mongodb+srv://username:password@cluster.mongodb.net/dams-staging" "true")
MONGODB_PRODUCTION_URI=$(prompt_input "Enter MongoDB URI for production" "mongodb+srv://username:password@cluster.mongodb.net/dams-production" "true")

# Validate MongoDB URIs
if ! echo "$MONGODB_STAGING_URI" | grep -q "mongodb+srv://"; then
    print_error "Invalid MongoDB staging URI format!"
    exit 1
fi

if ! echo "$MONGODB_PRODUCTION_URI" | grep -q "mongodb+srv://"; then
    print_error "Invalid MongoDB production URI format!"
    exit 1
fi

# Redis setup (optional)
print_header "Redis Setup (Optional)"

USE_REDIS=$(prompt_input "Do you want to use Redis? (y/n)" "n" "false")

if [ "$USE_REDIS" = "y" ] || [ "$USE_REDIS" = "Y" ]; then
    REDIS_STAGING_URL=$(prompt_input "Enter Redis URL for staging" "redis://localhost:6379" "false")
    REDIS_PRODUCTION_URL=$(prompt_input "Enter Redis URL for production" "redis://localhost:6379" "false")
else
    REDIS_STAGING_URL=""
    REDIS_PRODUCTION_URL=""
fi

# JWT Secrets
print_header "Security Setup"

JWT_SECRET_STAGING=$(prompt_input "Enter JWT secret for staging" "$(openssl rand -base64 32)" "true")
JWT_SECRET_PRODUCTION=$(prompt_input "Enter JWT secret for production" "$(openssl rand -base64 32)" "true")

# Frontend URLs
print_header "Frontend URLs"

STAGING_FRONTEND_URL="https://$GITHUB_USERNAME.github.io/$REPO_NAME/staging"
PRODUCTION_FRONTEND_URL="https://$GITHUB_USERNAME.github.io/$REPO_NAME"

print_status "Staging frontend URL: $STAGING_FRONTEND_URL"
print_status "Production frontend URL: $PRODUCTION_FRONTEND_URL"

# Backend URLs (will be provided by Railway)
print_header "Backend URLs"

print_warning "Backend URLs will be provided by Railway after deployment."
print_warning "You'll need to update these in GitHub Secrets after the first deployment."

STAGING_BACKEND_URL=$(prompt_input "Enter staging backend URL (leave empty for now)" "" "false")
PRODUCTION_BACKEND_URL=$(prompt_input "Enter production backend URL (leave empty for now)" "" "false")

# Slack notifications (optional)
print_header "Slack Notifications (Optional)"

USE_SLACK=$(prompt_input "Do you want to set up Slack notifications? (y/n)" "n" "false")

if [ "$USE_SLACK" = "y" ] || [ "$USE_SLACK" = "Y" ]; then
    SLACK_WEBHOOK_URL=$(prompt_input "Enter Slack webhook URL" "" "true")
    
    if ! validate_url "$SLACK_WEBHOOK_URL"; then
        print_error "Invalid Slack webhook URL!"
        exit 1
    fi
else
    SLACK_WEBHOOK_URL=""
fi

# Custom domain (optional)
print_header "Custom Domain (Optional)"

USE_CUSTOM_DOMAIN=$(prompt_input "Do you want to use a custom domain? (y/n)" "n" "false")

if [ "$USE_CUSTOM_DOMAIN" = "y" ] || [ "$USE_CUSTOM_DOMAIN" = "Y" ]; then
    CUSTOM_DOMAIN=$(prompt_input "Enter custom domain" "" "true")
    
    if ! validate_url "https://$CUSTOM_DOMAIN"; then
        print_error "Invalid domain format!"
        exit 1
    fi
else
    CUSTOM_DOMAIN=""
fi

# Generate secrets file
print_header "Generating Configuration"

SECRETS_FILE=".env.secrets"
cat > "$SECRETS_FILE" << EOF
# DAMS CI/CD Secrets Configuration
# Add these secrets to your GitHub repository

# Railway Tokens
RAILWAY_TOKEN_STAGING=$RAILWAY_STAGING_TOKEN
RAILWAY_TOKEN_PRODUCTION=$RAILWAY_PRODUCTION_TOKEN

# MongoDB URIs
MONGODB_URI_STAGING=$MONGODB_STAGING_URI
MONGODB_URI_PRODUCTION=$MONGODB_PRODUCTION_URI

# Redis URLs
REDIS_URL_STAGING=$REDIS_STAGING_URL
REDIS_URL_PRODUCTION=$REDIS_PRODUCTION_URL

# JWT Secrets
JWT_SECRET_STAGING=$JWT_SECRET_STAGING
JWT_SECRET_PRODUCTION=$JWT_SECRET_PRODUCTION

# Frontend URLs
STAGING_FRONTEND_URL=$STAGING_FRONTEND_URL
PRODUCTION_FRONTEND_URL=$PRODUCTION_FRONTEND_URL

# Backend URLs (update after deployment)
STAGING_BACKEND_URL=$STAGING_BACKEND_URL
PRODUCTION_BACKEND_URL=$PRODUCTION_BACKEND_URL

# Slack Notifications
SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL

# Custom Domain
CUSTOM_DOMAIN=$CUSTOM_DOMAIN
EOF

print_status "Configuration saved to $SECRETS_FILE"

# Create setup instructions
SETUP_INSTRUCTIONS="CI_CD_SETUP_INSTRUCTIONS.md"
cat > "$SETUP_INSTRUCTIONS" << EOF
# DAMS CI/CD Setup Instructions

## 1. GitHub Repository Setup

1. Go to your GitHub repository: $REPO_URL
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets from the \`.env.secrets\` file:

### Required Secrets:
- \`RAILWAY_TOKEN_STAGING\`
- \`RAILWAY_TOKEN_PRODUCTION\`
- \`MONGODB_URI_STAGING\`
- \`MONGODB_URI_PRODUCTION\`
- \`JWT_SECRET_STAGING\`
- \`JWT_SECRET_PRODUCTION\`
- \`STAGING_FRONTEND_URL\`
- \`PRODUCTION_FRONTEND_URL\`

### Optional Secrets:
- \`REDIS_URL_STAGING\`
- \`REDIS_URL_PRODUCTION\`
- \`SLACK_WEBHOOK_URL\`
- \`CUSTOM_DOMAIN\`

## 2. Railway Setup

1. Create Railway account at https://railway.app
2. Create two projects:
   - \`dams-backend-staging\`
   - \`dams-backend-production\`
3. Connect your GitHub repository
4. Set environment variables in each project

## 3. MongoDB Atlas Setup

1. Create MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create two clusters:
   - \`dams-staging\`
   - \`dams-production\`
3. Create databases and users
4. Get connection strings and add to GitHub secrets

## 4. Enable GitHub Pages

1. Go to repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Folder: / (root)
5. Save

## 5. First Deployment

1. Push your code to the \`develop\` branch
2. Monitor the GitHub Actions workflow
3. Check deployment status
4. Update backend URLs in GitHub secrets after first deployment

## 6. Testing

1. Test staging environment
2. Test production environment
3. Verify all endpoints work
4. Check monitoring and alerts

## 7. Custom Domain (Optional)

1. Add custom domain in GitHub Pages settings
2. Configure DNS records
3. Update CORS settings in backend

## Troubleshooting

- Check GitHub Actions logs for errors
- Verify all secrets are set correctly
- Test database connections
- Check Railway deployment logs
- Verify environment variables

## Support

If you encounter issues:
1. Check the logs in GitHub Actions
2. Review Railway deployment logs
3. Test locally with Docker Compose
4. Check the DEPLOYMENT_GUIDE.md file
EOF

print_status "Setup instructions saved to $SETUP_INSTRUCTIONS"

# Update package.json homepage
print_header "Updating Configuration Files"

# Update package.json homepage
if [ -f "package.json" ]; then
    sed -i.bak "s|\"homepage\": \".*\"|\"homepage\": \"$PRODUCTION_FRONTEND_URL\"|" package.json
    print_status "Updated package.json homepage"
fi

# Update backend CORS settings
if [ -f "backend/server.js" ]; then
    # This is a simplified update - you may need to manually update CORS settings
    print_warning "Please manually update CORS settings in backend/server.js to include:"
    print_warning "  - $STAGING_FRONTEND_URL"
    print_warning "  - $PRODUCTION_FRONTEND_URL"
    if [ -n "$CUSTOM_DOMAIN" ]; then
        print_warning "  - https://$CUSTOM_DOMAIN"
    fi
fi

# Final instructions
print_header "Setup Complete!"

echo ""
print_status "Your CI/CD pipeline is now configured!"
echo ""
print_status "Next steps:"
echo "1. Review the generated files:"
echo "   - $SECRETS_FILE (contains all secrets)"
echo "   - $SETUP_INSTRUCTIONS (detailed setup guide)"
echo ""
echo "2. Add secrets to GitHub repository"
echo "3. Set up Railway projects"
echo "4. Configure MongoDB Atlas"
echo "5. Push code to trigger first deployment"
echo ""
print_warning "Important: Keep the $SECRETS_FILE file secure and don't commit it to version control!"
echo ""
print_status "Happy deploying! 🚀" 