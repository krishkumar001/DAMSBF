const fs = require('fs');
const path = require('path');

console.log('🔍 DAMS Backend Setup Check');
console.log('============================');
console.log('');

// Check current directory
console.log('📁 Current Directory:', process.cwd());
console.log('');

// Check if backend folder exists
const backendPath = path.join(process.cwd(), 'backend');
if (fs.existsSync(backendPath)) {
  console.log('✅ Backend folder found');
} else {
  console.log('❌ Backend folder not found');
  console.log('   Expected path:', backendPath);
  process.exit(1);
}

// Check if server.js exists
const serverPath = path.join(backendPath, 'server.js');
if (fs.existsSync(serverPath)) {
  console.log('✅ server.js found');
} else {
  console.log('❌ server.js not found');
  console.log('   Expected path:', serverPath);
  process.exit(1);
}

// Check if package.json exists
const packagePath = path.join(backendPath, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json found');
} else {
  console.log('❌ package.json not found');
  console.log('   Expected path:', packagePath);
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(backendPath, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules found');
} else {
  console.log('❌ node_modules not found');
  console.log('   Run: cd backend && npm install');
  process.exit(1);
}

// Check if .env exists
const envPath = path.join(backendPath, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
} else {
  console.log('⚠️  .env file not found');
  console.log('   Run: cd backend && cp env.example .env');
}

console.log('');
console.log('🚀 Setup looks good! To run the server:');
console.log('   cd backend');
console.log('   node server.js');
console.log('');
console.log('   Or use the batch file: run-backend.bat'); 