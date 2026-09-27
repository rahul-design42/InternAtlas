import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/env';

// ==========================================
// CORS CONFIGURATION (environment-based)
// ==========================================
const allowedOrigins = config.allowedOrigins;

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ==========================================
// RATE LIMITERS (endpoint-specific)
// ==========================================
// General: 100 req/15min
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth: 20 req/15min (login, signup, forgot-password)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Messaging: 30 req/min
const messagingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many messages. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

// ==========================================
// SECURITY HEADERS via Helmet
// ==========================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow static assets (resumes/logos)
  contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false, // Only enforce CSP in prod
  hsts: config.nodeEnv === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
}));

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(generalLimiter);

// Apply auth-specific limiter to sensitive auth endpoints
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api/auth/refresh', authLimiter);

// Apply messaging limiter
app.use('/api/candidate/applications/:id/messages', messagingLimiter);
app.use('/api/recruiter/applications/:id/messages', messagingLimiter);

// Serve static uploads (only in development; production should use S3)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging (sanitized — no tokens or bodies logged)
app.use((req, res, next) => {
  if (config.nodeEnv !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

export default app;
