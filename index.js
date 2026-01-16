// Root entry point for Render deployment
// This file loads the backend server from the compiled dist folder
const path = require('path');
const serverPath = path.join(__dirname, 'apps', 'backend', 'dist', 'server.js');

try {
  require(serverPath);
} catch (error) {
  console.error('Error loading backend server:', error.message);
  console.error('Make sure you have run: cd apps/backend && npm install && npm run build');
  process.exit(1);
}
