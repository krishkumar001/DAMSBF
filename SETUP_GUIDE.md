# DAMS (Data Acquisition and Monitoring System) - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# (See Environment Configuration section below)

# Start the server
npm start
# or for development with auto-restart
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Start the frontend
npm run dev
```

## 🔧 Environment Configuration

### Backend (.env file in backend directory)

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/dams_db
MONGODB_USER=dams_user
MONGODB_PASSWORD=dams_password
MONGODB_AUTH_SOURCE=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration (Optional)
REDIS_ENABLED=false
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env file in root directory)

```env
# Frontend Environment Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DAMS
VITE_APP_VERSION=1.0.0
```

## 📊 Sample Data Setup

### Create Sample Data

```bash
# Navigate to backend directory
cd backend

# Run sample data creation script
node scripts/create-sample-data.js
```

This will create:
- **3 Users**: admin, operator, viewer roles
- **3 Equipment**: Boiler, Compressor, Cooling Tower
- **6 Parameters**: Temperature, pressure, flow, vibration sensors

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dams.com | admin123 |
| Operator | operator1@dams.com | operator123 |
| Viewer | viewer1@dams.com | viewer123 |

## 👥 User Management

### List All Users
```bash
cd backend
node scripts/user-management.js list
```

### Create New User
```bash
cd backend
node scripts/user-management.js create username email password firstName lastName role
```

Example:
```bash
node scripts/user-management.js create john john@example.com pass123 John Doe operator
```

### Update User Role
```bash
cd backend
node scripts/user-management.js role email newRole
```

Example:
```bash
node scripts/user-management.js role john@example.com admin
```

### Reset Password
```bash
cd backend
node scripts/user-management.js password email newPassword
```

### Toggle User Status
```bash
cd backend
node scripts/user-management.js status email
```

### Delete User
```bash
cd backend
node scripts/user-management.js delete email
```

## 🧪 Testing

### Test Backend API
```bash
cd backend
node test-api.js
```

### Test Database Connection
```bash
cd backend
node test-connection.js
```

### Comprehensive Debug
```bash
cd backend
node comprehensive-debug.js
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview (requires auth)
- `GET /api/dashboard/parameters` - Dashboard parameters (requires auth)
- `GET /api/dashboard/categories` - Parameter categories (requires auth)
- `GET /api/dashboard/health` - System health (requires auth)

### Parameters
- `GET /api/parameters` - Get all parameters (requires auth)
- `POST /api/parameters` - Create parameter (requires admin/manager)
- `PUT /api/parameters/:id` - Update parameter (requires admin/manager)
- `DELETE /api/parameters/:id` - Delete parameter (requires admin)

### Equipment
- `GET /api/equipment` - Get all equipment (requires auth)
- `POST /api/equipment` - Create equipment (requires admin/operator)
- `PUT /api/equipment/:id` - Update equipment (requires admin/operator)
- `DELETE /api/equipment/:id` - Delete equipment (requires admin)

### Alerts
- `GET /api/alerts` - Get all alerts (requires auth)
- `GET /api/alerts/active` - Get active alerts (requires auth)
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert (requires operator/admin)
- `PUT /api/alerts/:id/resolve` - Resolve alert (requires operator/admin)

### Reports
- `GET /api/reports/types` - Get report types (requires auth)
- `POST /api/reports/generate` - Generate report (requires auth)

## 🔐 User Roles & Permissions

### Admin
- Full system access
- User management
- Equipment management
- Parameter management
- Alert management
- Report generation

### Manager
- Equipment management
- Parameter management
- Alert management
- Report generation
- Limited user management

### Operator
- Equipment monitoring
- Alert acknowledgment/resolution
- Parameter viewing
- Basic reporting

### Viewer
- Read-only access
- Dashboard viewing
- Parameter viewing
- Basic reporting

## 🏗️ System Architecture

```
Frontend (React + Vite)
    ↓
Backend (Node.js + Express)
    ↓
Business Logic Layer (BAL)
    ↓
Data Access Layer (DAL)
    ↓
Database (MongoDB)
```

### Key Components

- **Models**: User, Parameter, ParameterValue, Alert, Equipment
- **DAL**: Data Access Layer for database operations
- **BAL**: Business Logic Layer for business rules
- **Routes**: API endpoints with authentication/authorization
- **Middleware**: Auth, validation, error handling

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify MongoDB port (default: 27017)

2. **Redis Connection Warnings**
   - These are normal if Redis is not installed
   - Set `REDIS_ENABLED=false` in .env to disable

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on the port

4. **Authentication Errors**
   - Check JWT_SECRET in .env
   - Ensure user exists and is active
   - Verify password is correct

### Logs

- Backend logs are in `backend/logs/` directory
- Log level can be configured in .env file
- Use `LOG_LEVEL=debug` for detailed debugging

## 📈 Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB with authentication
- Set up Redis for caching (optional)
- Configure proper CORS origins

### Security
- Use HTTPS in production
- Set up proper firewall rules
- Regular security updates
- Database backups
- Monitor logs for suspicious activity

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs
3. Test individual components
4. Verify environment configuration

---

**DAMS System v1.0.0** - Industrial Data Acquisition and Monitoring System 