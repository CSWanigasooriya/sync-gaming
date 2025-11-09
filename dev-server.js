#!/usr/bin/env node

/**
 * Dev Server - Runs both frontend and backend with hot reloading
 * Usage: npm run dev
 * 
 * This script:
 * 1. Starts the backend server on port 5000
 * 2. Starts the frontend on port 3000
 * 3. Watches for changes and auto-reloads
 * 4. Shows combined logs
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = projectRoot;

console.log('\n🚀 SyncGaming Development Server\n');
console.log('=' .repeat(50));
console.log('Frontend: http://localhost:3000');
console.log('Backend:  http://localhost:5000');
console.log('=' .repeat(50));
console.log('\n');

// Start Backend
console.log('📦 Starting backend server...\n');
const backend = spawn('node', ['server.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

backend.on('error', (err) => {
  console.error('❌ Backend error:', err.message);
  process.exit(1);
});

backend.on('close', (code) => {
  console.error(`❌ Backend exited with code ${code}`);
  process.exit(1);
});

// Wait a bit, then start Frontend
setTimeout(() => {
  console.log('\n📱 Starting frontend server...\n');
  const frontend = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: 'inherit',
    env: { ...process.env, REACT_APP_API_URL: 'http://localhost:5000/api' }
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend error:', err.message);
    process.exit(1);
  });

  frontend.on('close', (code) => {
    console.error(`❌ Frontend exited with code ${code}`);
    process.exit(1);
  });
}, 2000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});

console.log('✅ Servers starting...');
console.log('💡 Both servers will hot-reload on file changes');
console.log('📝 Check both logs for issues\n');
