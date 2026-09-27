import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ==========================================
// STARTUP ENVIRONMENT VALIDATION
// ==========================================
const REQUIRED_VARS = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const MISSING = REQUIRED_VARS.filter(v => !process.env[v]);
if (MISSING.length > 0) {
  console.error(`[STARTUP ERROR] Missing required environment variables: ${MISSING.join(', ')}`);
  process.exit(1);
}

// Guard against insecure default secrets in production
if (process.env.NODE_ENV === 'production') {
  const INSECURE = [
    { key: 'JWT_ACCESS_SECRET', value: process.env.JWT_ACCESS_SECRET },
    { key: 'JWT_REFRESH_SECRET', value: process.env.JWT_REFRESH_SECRET },
  ];
  for (const { key, value } of INSECURE) {
    if (!value || value.length < 32) {
      console.error(`[STARTUP ERROR] ${key} must be at least 32 characters in production.`);
      process.exit(1);
    }
  }
}

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/internatlas',
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'],
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || 'mock',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    fromAddress: process.env.EMAIL_FROM || 'noreply@internatlas.com',
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    s3Bucket: process.env.S3_BUCKET || '',
    s3Region: process.env.S3_REGION || 'us-east-1',
    s3AccessKey: process.env.S3_ACCESS_KEY || '',
    s3SecretKey: process.env.S3_SECRET_KEY || '',
  },
};
