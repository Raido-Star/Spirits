import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().default('3000'),
  
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_SSL: z.string().default('false'),
  
  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SESSION_SECRET: z.string().min(32),
  
  // API Keys
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),
  AZURE_OPENAI_API_KEY: z.string().optional(),
  
  // External Services
  REDIS_URL: z.string().optional(),
  ELASTICSEARCH_URL: z.string().optional(),
  WEBHOOK_SECRET: z.string().optional(),
  
  // Email
  EMAIL_FROM: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().optional(),
  DATADOG_API_KEY: z.string().optional(),
  
  // Security
  RATE_LIMIT_WINDOW: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100'),
  CORS_ORIGIN: z.string().default('*'),
  
  // Features
  ENABLE_ANALYTICS: z.string().default('true'),
  ENABLE_TELEMETRY: z.string().default('true'),
  ENABLE_WEBSOCKETS: z.string().default('true'),
  
  // Deployment
  VERCEL_URL: z.string().optional(),
  RAILWAY_URL: z.string().optional(),
  DOCKER_IMAGE: z.string().optional(),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Environment validation failed:', error.errors);
    process.exit(1);
  }
};

// Environment configuration
export const env = parseEnv();

// Configuration object
export const config = {
  // Server
  server: {
    port: parseInt(env.PORT, 10),
    host: '0.0.0.0',
    nodeEnv: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isStaging: env.NODE_ENV === 'staging',
  },
  
  // Database
  database: {
    url: env.DATABASE_URL,
    ssl: env.DATABASE_SSL === 'true',
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 30000,
    },
  },
  
  // Authentication
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    sessionSecret: env.SESSION_SECRET,
  },
  
  // AI Services
  ai: {
    openai: {
      apiKey: env.OPENAI_API_KEY,
      baseURL: 'https://api.openai.com/v1',
      models: {
        gpt4: 'gpt-4',
        gpt4Turbo: 'gpt-4-turbo-preview',
        gpt35Turbo: 'gpt-3.5-turbo',
      },
    },
    anthropic: {
      apiKey: env.ANTHROPIC_API_KEY,
      baseURL: 'https://api.anthropic.com',
      models: {
        claude3: 'claude-3-sonnet-20240229',
        claude3Haiku: 'claude-3-haiku-20240307',
      },
    },
    google: {
      apiKey: env.GOOGLE_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1',
      models: {
        gemini: 'gemini-pro',
        geminiVision: 'gemini-pro-vision',
      },
    },
    azure: {
      apiKey: env.AZURE_OPENAI_API_KEY,
      baseURL: process.env.AZURE_OPENAI_ENDPOINT,
      deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    },
  },
  
  // External Services
  services: {
    redis: {
      url: env.REDIS_URL,
      enabled: Boolean(env.REDIS_URL),
    },
    elasticsearch: {
      url: env.ELASTICSEARCH_URL,
      enabled: Boolean(env.ELASTICSEARCH_URL),
    },
    webhook: {
      secret: env.WEBHOOK_SECRET,
    },
  },
  
  // Email
  email: {
    from: env.EMAIL_FROM,
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 587,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    enabled: Boolean(env.EMAIL_FROM && env.SMTP_HOST),
  },
  
  // Storage
  storage: {
    aws: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      bucket: env.S3_BUCKET,
    },
    enabled: Boolean(env.AWS_ACCESS_KEY_ID && env.S3_BUCKET),
  },
  
  // Monitoring
  monitoring: {
    sentry: {
      dsn: env.SENTRY_DSN,
      enabled: Boolean(env.SENTRY_DSN),
    },
    datadog: {
      apiKey: env.DATADOG_API_KEY,
      enabled: Boolean(env.DATADOG_API_KEY),
    },
  },
  
  // Security
  security: {
    rateLimit: {
      windowMs: parseInt(env.RATE_LIMIT_WINDOW, 10),
      max: parseInt(env.RATE_LIMIT_MAX, 10),
    },
    cors: {
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
      credentials: true,
    },
  },
  
  // Features
  features: {
    analytics: env.ENABLE_ANALYTICS === 'true',
    telemetry: env.ENABLE_TELEMETRY === 'true',
    websockets: env.ENABLE_WEBSOCKETS === 'true',
  },
  
  // Deployment
  deployment: {
    vercelUrl: env.VERCEL_URL,
    railwayUrl: env.RAILWAY_URL,
    dockerImage: env.DOCKER_IMAGE,
  },
};

// Helper functions
export const isDevelopment = () => config.server.isDevelopment;
export const isProduction = () => config.server.isProduction;
export const isStaging = () => config.server.isStaging;

export const getBaseUrl = () => {
  if (config.deployment.vercelUrl) return `https://${config.deployment.vercelUrl}`;
  if (config.deployment.railwayUrl) return config.deployment.railwayUrl;
  return `http://localhost:${config.server.port}`;
};

export const validateRequiredEnvVars = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully');
};

export default config;