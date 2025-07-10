#!/bin/bash

# DAMS Backend CI/CD Setup Script
# This script configures the CI/CD pipeline for the Dams-Backend repository

set -e

echo "🚀 Setting up DAMS Backend CI/CD Pipeline"
echo "=========================================="

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

# Check if gh CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed. Please install it first:"
        echo "  https://cli.github.com/"
        exit 1
    fi
}

# Check if user is authenticated with GitHub
check_github_auth() {
    if ! gh auth status &> /dev/null; then
        print_error "You are not authenticated with GitHub. Please run:"
        echo "  gh auth login"
        exit 1
    fi
}

# Get repository information
get_repo_info() {
    print_status "Getting repository information..."
    
    # Get current repository
    REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
    
    if [ -z "$REPO_URL" ]; then
        print_error "No git repository found. Please run this script from the repository root."
        exit 1
    fi
    
    # Extract owner and repo name
    if [[ $REPO_URL == *"github.com"* ]]; then
        REPO_FULL=$(echo $REPO_URL | sed 's/.*github\.com[:/]\([^/]*\/[^/]*\).*/\1/')
        REPO_OWNER=$(echo $REPO_FULL | cut -d'/' -f1)
        REPO_NAME=$(echo $REPO_FULL | cut -d'/' -f2 | sed 's/\.git$//')
    else
        print_error "Not a GitHub repository. Please ensure you're in the correct repository."
        exit 1
    fi
    
    print_success "Repository: $REPO_OWNER/$REPO_NAME"
}

# Setup GitHub secrets
setup_github_secrets() {
    print_status "Setting up GitHub secrets..."
    
    # Required secrets
    declare -a secrets=(
        "RAILWAY_TOKEN_STAGING"
        "RAILWAY_TOKEN_PRODUCTION"
        "STAGING_BACKEND_URL"
        "PRODUCTION_BACKEND_URL"
        "MONGODB_URI"
        "JWT_SECRET"
        "REDIS_URL"
        "SLACK_WEBHOOK_URL"
        "SNYK_TOKEN"
    )
    
    for secret in "${secrets[@]}"; do
        if ! gh secret list | grep -q "$secret"; then
            print_warning "Secret $secret not found. Please add it manually:"
            echo "  gh secret set $secret"
            
            case $secret in
                "RAILWAY_TOKEN_STAGING")
                    echo "  Get it from: https://railway.app/account/tokens"
                    echo "  Create a token for staging environment"
                    ;;
                "RAILWAY_TOKEN_PRODUCTION")
                    echo "  Get it from: https://railway.app/account/tokens"
                    echo "  Create a token for production environment"
                    ;;
                "STAGING_BACKEND_URL")
                    echo "  Set to your staging backend URL (e.g., https://dams-backend-staging.railway.app)"
                    ;;
                "PRODUCTION_BACKEND_URL")
                    echo "  Set to your production backend URL (e.g., https://dams-backend-production.railway.app)"
                    ;;
                "MONGODB_URI")
                    echo "  Set to your MongoDB connection string"
                    echo "  Format: mongodb+srv://username:password@cluster.mongodb.net/dams"
                    ;;
                "JWT_SECRET")
                    echo "  Set to a secure random string for JWT signing"
                    echo "  Generate with: openssl rand -base64 32"
                    ;;
                "REDIS_URL")
                    echo "  Set to your Redis connection string (optional)"
                    echo "  Format: redis://username:password@host:port"
                    ;;
                "SLACK_WEBHOOK_URL")
                    echo "  Set to your Slack webhook URL for notifications (optional)"
                    echo "  Get it from: https://api.slack.com/apps"
                    ;;
                "SNYK_TOKEN")
                    echo "  Set to your Snyk API token for security scanning (optional)"
                    echo "  Get it from: https://app.snyk.io/account"
                    ;;
            esac
            echo ""
        else
            print_success "Secret $secret already exists"
        fi
    done
}

# Setup Railway projects
setup_railway_projects() {
    print_status "Setting up Railway projects..."
    
    print_warning "Please create Railway projects manually:"
    echo ""
    echo "1. Go to https://railway.app/"
    echo "2. Create a new project called 'dams-backend-staging'"
    echo "3. Create a new project called 'dams-backend-production'"
    echo "4. Connect your GitHub repository to both projects"
    echo "5. Set the branch for staging to 'krish/backend'"
    echo "6. Set the branch for production to 'main'"
    echo ""
    echo "After creating the projects, update the secrets:"
    echo "  STAGING_BACKEND_URL and PRODUCTION_BACKEND_URL"
}

# Setup branch protection
setup_branch_protection() {
    print_status "Setting up branch protection rules..."
    
    # Check if we have admin access
    if gh repo view --json permissions --jq '.permissions.admin' 2>/dev/null | grep -q "true"; then
        print_status "Setting up branch protection for main branch..."
        
        # Protect main branch
        gh api repos/$REPO_OWNER/$REPO_NAME/branches/main/protection \
            --method PUT \
            --field required_status_checks='{"strict":true,"contexts":["Backend Linting & Code Quality","Backend Testing","Security Scanning"]}' \
            --field enforce_admins=true \
            --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
            --field restrictions=null || print_warning "Could not set branch protection (may already exist)"
        
        print_success "Branch protection configured for main branch"
    else
        print_warning "Admin access required for branch protection. Please configure manually:"
        echo "  Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/branches"
        echo "  Add rule for main branch with:"
        echo "    - Require status checks to pass"
        echo "    - Require branches to be up to date"
        echo "    - Require pull request reviews"
    fi
}

# Setup GitHub Pages (if needed for documentation)
setup_github_pages() {
    print_status "Setting up GitHub Pages for API documentation..."
    
    print_warning "GitHub Pages setup (optional):"
    echo "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/pages"
    echo "2. Source: Deploy from a branch"
    echo "3. Branch: gh-pages (create if needed)"
    echo "4. Folder: / (root)"
    echo "5. Save"
}

# Create sample test files
create_sample_tests() {
    print_status "Creating sample test files..."
    
    # Create test directory structure
    mkdir -p __tests__/unit
    mkdir -p __tests__/integration
    mkdir -p __tests__/e2e
    
    # Create sample unit test
    cat > __tests__/unit/health.test.js << 'EOF'
const request = require('supertest');
const app = require('../../server');

describe('Health Check Endpoint', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});
EOF

    # Create sample integration test
    cat > __tests__/integration/auth.test.js << 'EOF'
const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dams-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/auth/register should create new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('username', userData.username);
  });
});
EOF

    print_success "Sample test files created"
}

# Setup ESLint configuration
setup_eslint() {
    print_status "Setting up ESLint configuration..."
    
    cat > .eslintrc.js << 'EOF'
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'max-len': ['error', { code: 120 }],
    'camelcase': 'off',
    'no-underscore-dangle': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
    },
  ],
};
EOF

    print_success "ESLint configuration created"
}

# Setup Prettier configuration
setup_prettier() {
    print_status "Setting up Prettier configuration..."
    
    cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false
}
EOF

    print_success "Prettier configuration created"
}

# Main setup function
main() {
    print_status "Starting DAMS Backend CI/CD setup..."
    
    # Check prerequisites
    check_gh_cli
    check_github_auth
    
    # Get repository info
    get_repo_info
    
    # Setup configurations
    setup_eslint
    setup_prettier
    create_sample_tests
    
    # Setup GitHub features
    setup_github_secrets
    setup_branch_protection
    setup_github_pages
    
    # Setup Railway
    setup_railway_projects
    
    print_success "DAMS Backend CI/CD setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Add the required GitHub secrets (see warnings above)"
    echo "2. Create Railway projects for staging and production"
    echo "3. Push your code to trigger the first CI/CD run"
    echo "4. Monitor the GitHub Actions tab for pipeline status"
    echo ""
    echo "For more information, see the README.md file"
}

# Run main function
main "$@" 