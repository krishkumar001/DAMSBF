@echo off
REM DAMS Deployment Script for Windows
REM This script handles deployment of the DAMS application

echo [INFO] Starting DAMS deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    exit /b 1
)

echo [INFO] All dependencies are installed

REM Build frontend
echo [INFO] Building frontend...
call npm ci
if errorlevel 1 (
    echo [ERROR] Frontend dependency installation failed
    exit /b 1
)

call npm run lint
if errorlevel 1 (
    echo [ERROR] Frontend linting failed
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    exit /b 1
)

echo [INFO] Frontend built successfully

REM Build backend
echo [INFO] Building backend...
cd backend
call npm ci
if errorlevel 1 (
    echo [ERROR] Backend dependency installation failed
    exit /b 1
)

call npm run lint
if errorlevel 1 (
    echo [ERROR] Backend linting failed
    exit /b 1
)

call npm test
if errorlevel 1 (
    echo [ERROR] Backend tests failed
    exit /b 1
)

cd ..
echo [INFO] Backend built successfully

REM Deploy frontend
echo [INFO] Deploying frontend to GitHub Pages...
call npm run deploy
if errorlevel 1 (
    echo [ERROR] Frontend deployment failed
    exit /b 1
)

echo [INFO] Frontend deployed successfully

REM Deploy backend
echo [INFO] Deploying backend...
echo [WARNING] Please deploy backend manually using Railway CLI:
echo 1. Install Railway CLI: npm install -g @railway/cli
echo 2. Login: railway login
echo 3. Deploy: cd backend ^&^& railway up

echo [INFO] Deployment completed successfully!
pause 