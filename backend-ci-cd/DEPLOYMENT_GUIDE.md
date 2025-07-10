# 🚀 DAMS Backend Deployment Guide

This guide provides step-by-step instructions for deploying the DAMS Backend API using the CI/CD pipeline.

## 📋 Prerequisites

Before starting the deployment process, ensure you have:

- ✅ GitHub account with repository access
- ✅ Railway account (free tier available)
- ✅ MongoDB Atlas account (free tier available)
- ✅ Node.js 18+ installed locally (for testing)

## 🔧 Step 1: Repository Setup

### 1.1 Clone the Repository

```bash
git clone https://github.com/Advaita151/Dams-Backend.git
cd Dams-Backend
```

### 1.2 Create Feature Branch

```bash
git checkout -b krish/backend
```

### 1.3 Copy CI/CD Files

Copy all the CI/CD configuration files from the `backend-ci-cd` directory to your repository root:

```bash
# Copy workflow files
cp -r backend-ci-cd/.github ./

# Copy configuration files
cp backend-ci-cd/package.json ./
cp backend-ci-cd/jest.config.js ./
cp backend-ci-cd/Dockerfile ./
cp backend-ci-cd/railway.json ./
cp backend-ci-cd/env.example ./
cp backend-ci-cd/README.md ./

# Copy setup script
cp backend-ci-cd/setup-backend-ci-cd.sh ./
chmod +x setup-backend-ci-cd.sh
```

## 🔐 Step 2: GitHub Secrets Configuration

### 2.1 Required Secrets

Navigate to your GitHub repository: `https://github.com/Advaita151/Dams-Backend/settings/secrets/actions`

Add the following secrets:

#### Railway Tokens
```bash
# Get from: https://railway.app/account/tokens
RAILWAY_TOKEN_STAGING=your_staging_token_here
RAILWAY_TOKEN_PRODUCTION=your_production_token_here
```

#### Environment URLs
```bash
# Set after creating Railway projects
STAGING_BACKEND_URL=https://dams-backend-staging.railway.app
PRODUCTION_BACKEND_URL=https://dams-backend-production.railway.app
```

#### Database Configuration
```bash
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dams

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_super_secure_jwt_secret_here
```

#### Optional Secrets
```bash
# Redis connection (optional)
REDIS_URL=redis://username:password@host:port

# Slack webhook for notifications (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Snyk token for security scanning (optional)
SNYK_TOKEN=your_snyk_token_here
```

### 2.2 Using GitHub CLI

Alternatively, use the GitHub CLI to set secrets:

```bash
# Install GitHub CLI if not installed
# https://cli.github.com/

# Login to GitHub
gh auth login

# Set secrets
gh secret set RAILWAY_TOKEN_STAGING --body "your_staging_token"
gh secret set RAILWAY_TOKEN_PRODUCTION --body "your_production_token"
gh secret set MONGODB_URI --body "your_mongodb_connection_string"
gh secret set JWT_SECRET --body "your_jwt_secret"
```

## 🚂 Step 3: Railway Setup

### 3.1 Create Railway Projects

1. **Go to Railway**: https://railway.app/
2. **Sign in** with your GitHub account
3. **Create two projects**:

#### Staging Project
- Name: `dams-backend-staging`
- Connect to: `Advaita151/Dams-Backend`
- Branch: `krish/backend`
- Environment: Staging

#### Production Project
- Name: `dams-backend-production`
- Connect to: `Advaita151/Dams-Backend`
- Branch: `main`
- Environment: Production

### 3.2 Configure Environment Variables

For each Railway project, add these environment variables:

#### Required Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dams
JWT_SECRET=your_super_secure_jwt_secret_here
```

#### Optional Variables
```env
REDIS_URL=redis://username:password@host:port
FRONTEND_URL=https://your-frontend-url.com
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3.3 Railway Configuration

The `railway.json` file in your repository will automatically configure:
- Build process using Nixpacks
- Health check endpoint: `/health`
- Restart policy on failure
- Environment-specific variables

## 🗄️ Step 4: Database Setup

### 4.1 MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/atlas
2. **Create a Cluster** (free tier available)
3. **Create Database User**:
   - Username: `dams-user`
   - Password: `secure-password`
   - Role: `Read and write to any database`
4. **Whitelist IP Addresses**: `0.0.0.0/0` (for Railway)
5. **Get Connection String**:
   ```
   mongodb+srv://dams-user:secure-password@cluster.mongodb.net/dams
   ```

### 4.2 Database Initialization

The application will automatically create collections on first run, but you can also run the setup script:

```bash
# Run database setup
npm run setup
```

## 🧪 Step 5: Local Testing

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Environment Setup

```bash
# Copy environment file
cp env.example .env

# Edit .env with your local settings
nano .env
```

### 5.3 Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

### 5.4 Local Development

```bash
# Start development server
npm run dev

# Test health endpoint
curl http://localhost:5000/health
```

## 🚀 Step 6: Deployment

### 6.1 Push to Trigger CI/CD

```bash
# Add all files
git add .

# Commit changes
git commit -m "feat: add CI/CD pipeline for backend deployment"

# Push to trigger pipeline
git push origin krish/backend
```

### 6.2 Monitor Deployment

1. **GitHub Actions**: https://github.com/Advaita151/Dams-Backend/actions
2. **Railway Dashboard**: https://railway.app/dashboard
3. **Check Logs**: Monitor deployment logs in Railway

### 6.3 Verify Deployment

#### Staging Environment
```bash
# Test staging health endpoint
curl https://dams-backend-staging.railway.app/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123
}
```

#### Production Environment
```bash
# Test production health endpoint
curl https://dams-backend-production.railway.app/health
```

## 🔄 Step 7: Continuous Deployment

### 7.1 Branch Strategy

- **`krish/backend`** → Automatic deployment to staging
- **`main`** → Automatic deployment to production
- **Feature branches** → Testing only, no deployment

### 7.2 Manual Deployment

To manually trigger deployment:

1. Go to GitHub Actions
2. Select the workflow: "DAMS Backend CI/CD Pipeline"
3. Click "Run workflow"
4. Choose environment (staging/production)
5. Click "Run workflow"

### 7.3 Rollback Strategy

If deployment fails:

1. **Check Railway Logs**: Identify the issue
2. **Fix the Code**: Make necessary changes
3. **Redeploy**: Push fixes to trigger new deployment
4. **Monitor**: Watch for successful deployment

## 📊 Step 8: Monitoring & Alerts

### 8.1 Health Monitoring

The application includes built-in health checks:

```bash
# Health check endpoint
GET /health

# Expected response
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123,
  "database": "connected",
  "redis": "connected"
}
```

### 8.2 Logs Monitoring

- **Railway Logs**: Real-time application logs
- **GitHub Actions**: CI/CD pipeline logs
- **Application Logs**: Winston logging to files

### 8.3 Alert Notifications

Configured alerts for:
- ✅ Successful deployments (Slack)
- ❌ Failed deployments (Slack + GitHub Issues)
- ⚠️ Performance issues
- 🔒 Security vulnerabilities

## 🔧 Step 9: Troubleshooting

### 9.1 Common Issues

#### Build Failures
```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 8+

# Clear npm cache
npm cache clean --force
```

#### Database Connection Issues
```bash
# Verify MongoDB URI format
mongodb+srv://username:password@cluster.mongodb.net/database

# Check network connectivity
ping cluster.mongodb.net

# Test connection locally
npm run test:ci
```

#### Railway Deployment Issues
```bash
# Check Railway logs
railway logs

# Verify environment variables
railway variables

# Restart service
railway service restart
```

### 9.2 Debug Commands

```bash
# Test database connection
npm run test:ci

# Check linting
npm run lint

# Format code
npm run format

# Security audit
npm run security:audit
```

## 📈 Step 10: Performance Optimization

### 10.1 Production Optimizations

- **Compression**: Enabled with `compression` middleware
- **Caching**: Redis for session and data caching
- **Rate Limiting**: Prevents abuse
- **Security Headers**: Helmet.js protection

### 10.2 Monitoring Metrics

- Response time tracking
- Error rate monitoring
- Database connection pool status
- Memory and CPU usage

## 🎯 Success Criteria

Your deployment is successful when:

✅ **Staging Environment**:
- Health endpoint returns 200 OK
- All tests pass in CI/CD
- No security vulnerabilities
- Application logs show no errors

✅ **Production Environment**:
- Health endpoint returns 200 OK
- Smoke tests pass
- Performance metrics are acceptable
- Monitoring alerts are configured

## 📞 Support

If you encounter issues:

1. **Check Documentation**: This guide and README.md
2. **Review Logs**: Railway and GitHub Actions logs
3. **Create Issue**: https://github.com/Advaita151/Dams-Backend/issues
4. **Contact Team**: Reach out to the DAMS development team

---

**Happy Deploying! 🚀** 