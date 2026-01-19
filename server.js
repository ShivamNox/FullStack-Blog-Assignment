import express from 'express';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

/* console.log('Building client manually...');
execSync('npm --prefix client run build', { stdio: 'inherit' });
console.log('Client build done');
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

const log = {
  server: (msg) => console.log(`${colors.green}[SERVER]${colors.reset} ${msg}`),
  client: (msg) => console.log(`${colors.blue}[CLIENT]${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`)
};


// DEVELOPMENT MODE
if (NODE_ENV === 'development') {
  log.info('Starting in DEVELOPMENT mode...\n');

  // Start Backend Server using nodemon from root node_modules
  const serverProcess = spawn('node', ['node_modules/nodemon/bin/nodemon.js', 'server/src/index.js'], {
    cwd: __dirname,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  serverProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) log.server(msg);
  });

  serverProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) log.server(msg);
  });

  // Start Frontend Dev Server using vite from root node_modules
  const clientProcess = spawn('node', ['node_modules/vite/bin/vite.js', '--config', 'client/vite.config.js', 'client'], {
    cwd: __dirname,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  clientProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) log.client(msg);
  });

  clientProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) log.client(msg);
  });

  // Handle process termination
  const cleanup = () => {
    log.info('\nShutting down...');
    serverProcess.kill();
    clientProcess.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  console.log(`🚀 Blog App - Development Mode\n\n📡 Backend:  http://localhost:5000\n🌐 Frontend: http://localhost:5173`);
}

// PRODUCTION MODE
  
else {
  log.info('Starting in PRODUCTION mode...\n');

  const clientDistPath = join(__dirname, 'client', 'dist');

  // Check if client build exists
  if (!fs.existsSync(clientDistPath)) {
    log.error('Client build not found! Run "npm run build" first.');
    process.exit(1);
  }

  // Import and start the server
  import('./server/src/index.js').then((serverModule) => {
    const app = serverModule.default;

    // Serveing static files
    app.use(express.static(clientDistPath));

    // Handle React Router
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(join(clientDistPath, 'index.html'));
    });
    
  }).catch((err) => {
    log.error(`Failed to start: ${err.message}`);
    process.exit(1);
  });
}