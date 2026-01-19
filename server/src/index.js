import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import sanitize from './middleware/sanitize.js';
import ApiError from './utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();


const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath, {
  maxAge: '1y',
  etag: true
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://replit-cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));

// CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize inputs
app.use(sanitize);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  const startTime = process.hrtime(); // high-resolution time

  // Build the response object
  const response = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  };

  // Calculate response time in milliseconds
  const diff = process.hrtime(startTime);
  const responseTimeMs = (diff[0] * 1e9 + diff[1]) / 1e6; // seconds * 1e9 + nanoseconds -> ms

  response.responseTimeMs = responseTimeMs;

  res.json(response);
});


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  // If API route not found, go to error handler
  if (req.path.startsWith('/api')) {
    return next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
  }

  // Serveing React app
  const indexPath = path.join(clientDistPath, 'index.html');

  res.sendFile(indexPath, (err) => {
    if (err) {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Blog App</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 50px; text-align: center; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; }
              code { background: #eee; padding: 5px 10px; border-radius: 4px; }
              a { color: #3b82f6; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 Blog API Server Running!</h1>
              <p>Client not built yet.</p>
              <p>Run: <code>cd client && npm run build</code></p>
              <hr>
              <p>API Health: <a href="/api/health">/api/health</a></p>
              <p><strong>Demo:</strong> demo@example.com / password123</p>
            </div>
          </body>
        </html>
      `);
    }
  });
});

// Global error handler
app.use(errorHandler);

// Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Blog App Running on Port ${PORT}\n\n📧 Demo: demo@example.com / password123`);
});

export default app;