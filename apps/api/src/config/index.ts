import dotenv from 'dotenv';

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  sessionSecret: process.env.SESSION_SECRET || (isTestEnv ? 'test-session-secret' : ''),
  encryptionKey: process.env.ENCRYPTION_KEY || (isTestEnv ? Buffer.alloc(32).toString('base64') : ''),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
  },
  
  facebook: {
    appId: process.env.FACEBOOK_APP_ID!,
    appSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL!,
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },

  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY || '',
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  },
};

// Validate required env vars
function validateEnv() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const required = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'ENCRYPTION_KEY',
  ];
  
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnv();
