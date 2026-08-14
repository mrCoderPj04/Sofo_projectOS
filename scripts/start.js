import { spawn } from 'child_process';

console.log('🚀 Launching Sofo ProjectOS Production Environment...');

// 1. Spawn Express Backend API Server (Port 5000)
const backend = spawn('node', ['backend/server.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: process.env.BACKEND_PORT || '5000' }
});

// 2. Spawn Next.js Production App Server (Port process.env.PORT || 3000)
const port = process.env.PORT || '3000';
const frontend = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'production' }
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
