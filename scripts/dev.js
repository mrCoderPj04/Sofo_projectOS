import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Launching Sofo ProjectOS Dual Dev Environment (Backend + Frontend)...');

// 1. Spawn Express Backend Server (Port 5000)
const backend = spawn('node', ['backend/server.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' }
});

// 2. Spawn Next.js Frontend Client (Port 3000)
const frontend = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Shutting down backend & frontend servers...');
  backend.kill();
  frontend.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
