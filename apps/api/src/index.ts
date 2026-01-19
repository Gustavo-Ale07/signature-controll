import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import { clerkMiddleware } from '@clerk/express';
import passport from './config/passport';
import { config } from './config';
import authRoutes from './routes/auth';
import itemsRoutes from './routes/items';
import { errorHandler, notFound } from './middleware/error';
import path from 'path';
import fs from 'fs';

const app = express();
const isTestEnv = config.nodeEnv === 'test' || process.env.JEST_WORKER_ID !== undefined;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = new Set([
  config.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(limiter);

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk auth middleware
app.use(
  clerkMiddleware({
    secretKey: config.clerk.secretKey || undefined,
    publishableKey: config.clerk.publishableKey || undefined,
  })
);

// Session configuration with PostgreSQL store
const PgSession = connectPgSimple(session);
const pgPool = new Pool({
  connectionString: config.databaseUrl,
});

app.use(
  session({
    store: isTestEnv
      ? new session.MemoryStore()
      : new PgSession({
          pool: pgPool,
          tableName: 'Session',
          createTableIfMissing: false,
        }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serve uploaded files
fs.mkdirSync(config.upload.uploadDir, { recursive: true });
app.use('/uploads', express.static(path.resolve(config.upload.uploadDir)));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

if (!isTestEnv) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

export default app;
