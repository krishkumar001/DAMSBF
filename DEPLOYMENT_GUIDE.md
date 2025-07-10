# 🚀 DAMS CI/CD & Deployment Guide

This guide covers the complete setup of CI/CD pipeline and hosting for the DAMS (Data Acquisition and Monitoring System) project.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
3. [Hosting Options](#hosting-options)
4. [Environment Configuration](#environment-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Tools
- **Git** (for version control)
- **Node.js 18+** (for frontend and backend)
- **Python 3.11+** (for AI models)
- **Docker** (optional, for containerized deployment)
- **MongoDB** (local or cloud)
- **Redis** (optional, for caching)

### Accounts Needed
- **GitHub** (for repository and GitHub Pages)
- **Railway** or **Render** (for backend hosting)
- **MongoDB Atlas** (for database hosting)
- **Redis Cloud** (optional, for Redis hosting)

## 🔄 CI/CD Pipeline Setup

### 1. GitHub Actions Workflow

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and includes:

- **Frontend Testing**: Linting, building, and artifact upload
- **Backend Testing**: Linting, testing with MongoDB, and validation
- **AI Model Testing**: Python dependency installation and testing
- **Automatic Deployment**: Frontend to GitHub Pages, Backend to Railway/Render

### 2. Pipeline Triggers

The pipeline runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### 3. Required Secrets

Add these secrets in your GitHub repository settings:

```bash
# Railway Deployment
RAILWAY_TOKEN=your_railway_token

# Alternative: Render Deployment
RENDER_SERVICE_ID=your_render_service_id
RENDER_API_KEY=your_render_api_key

# Database (if needed)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 🌐 Hosting Options

### Frontend Hosting

#### Option 1: GitHub Pages (Recommended)
- **Pros**: Free, integrated with GitHub, automatic SSL
- **Cons**: Limited to static sites
- **Setup**: Already configured in package.json

#### Option 2: Vercel
- **Pros**: Excellent React support, automatic deployments, edge functions
- **Cons**: Limited free tier
- **Setup**: Connect GitHub repository to Vercel

#### Option 3: Netlify
- **Pros**: Good free tier, form handling, serverless functions
- **Cons**: Build time limits
- **Setup**: Connect GitHub repository to Netlify

### Backend Hosting

#### Option 1: Railway (Recommended)
- **Pros**: Easy deployment, good free tier, MongoDB integration
- **Cons**: Limited resources on free tier
- **Setup**: 
  1. Install Railway CLI: `npm install -g @railway/cli`
  2. Login: `railway login`
  3. Deploy: `cd backend && railway up`

#### Option 2: Render
- **Pros**: Good free tier, automatic deployments
- **Cons**: Cold starts on free tier
- **Setup**: Connect GitHub repository to Render

#### Option 3: Heroku
- **Pros**: Mature platform, good documentation
- **Cons**: No free tier anymore
- **Setup**: Use Heroku CLI or GitHub integration

### Database Hosting

#### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Add to environment variables

#### Alternative: Railway MongoDB
- Railway provides MongoDB as a service
- Automatically connects to your backend

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create `.env` file in the root directory:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=DAMS
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables

Use `backend/env.production.example` as a template:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dams
JWT_SECRET=your-super-secure-secret
REDIS_URL=redis://your-redis-url:6379
FRONTEND_URL=https://your-frontend-url.com
```

## 🚀 Deployment Steps

### Automated Deployment (Recommended)

1. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Monitor GitHub Actions**
   - Go to your repository → Actions tab
   - Watch the CI/CD pipeline run
   - Check for any failures

3. **Verify Deployment**
   - Frontend: Check GitHub Pages URL
   - Backend: Check Railway/Render dashboard
   - Test API endpoints

### Manual Deployment

1. **Build and Deploy Frontend**
   ```bash
   npm run build
   npm run deploy
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   railway up
   ```

3. **Update Environment Variables**
   - Set production environment variables in hosting platform
   - Update CORS origins to include your frontend URL

## 📊 Monitoring & Maintenance

### Health Checks

- **Frontend**: `https://your-domain.com/health`
- **Backend**: `https://your-backend-url.com/health`
- **Database**: Monitor MongoDB Atlas dashboard

### Logs

- **GitHub Actions**: Check Actions tab for build/deploy logs
- **Railway**: Use Railway dashboard for backend logs
- **GitHub Pages**: Check repository settings for deployment status

### Performance Monitoring

- **Frontend**: Use browser dev tools and Lighthouse
- **Backend**: Monitor response times and error rates
- **Database**: Monitor query performance in MongoDB Atlas

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. Deployment Failures
```bash
# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI

# Test locally
npm run build
npm start
```

#### 3. Database Connection Issues
```bash
# Test MongoDB connection
mongosh "your-connection-string"

# Check network access
# Ensure IP is whitelisted in MongoDB Atlas
```

#### 4. CORS Issues
```bash
# Update CORS configuration in backend/server.js
# Add your frontend URL to allowed origins
```

### Getting Help

1. **Check Logs**: Always check GitHub Actions logs first
2. **Test Locally**: Reproduce issues in local environment
3. **Documentation**: Refer to hosting platform documentation
4. **Community**: Use GitHub Issues for project-specific problems

## 📈 Next Steps

### Advanced Features

1. **Custom Domain**: Configure custom domain for production
2. **SSL Certificates**: Ensure HTTPS is enabled
3. **CDN**: Add CDN for better performance
4. **Monitoring**: Set up application monitoring (Sentry, LogRocket)
5. **Backup**: Configure automated database backups

### Scaling

1. **Load Balancing**: Add load balancer for multiple instances
2. **Caching**: Implement Redis caching for better performance
3. **CDN**: Use CDN for static assets
4. **Database**: Consider database sharding for large datasets

---

## 🎯 Quick Start Checklist

- [ ] Fork/clone the repository
- [ ] Set up GitHub Actions secrets
- [ ] Configure environment variables
- [ ] Set up MongoDB Atlas database
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to GitHub Pages
- [ ] Test all functionality
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)

---

**Need Help?** Check the [GitHub Issues](https://github.com/your-repo/issues) or create a new one for specific problems. 