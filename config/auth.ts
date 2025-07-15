import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

// Authentication configuration
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256' as const,
  },
  session: {
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    cleanupInterval: 60 * 60 * 1000, // 1 hour
  },
  password: {
    saltRounds: 12,
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDuration: 60 * 60 * 1000, // 1 hour
  },
};

// JWT utilities
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
    algorithm: authConfig.jwt.algorithm,
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, authConfig.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, authConfig.password.saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < authConfig.password.minLength) {
    errors.push(`Password must be at least ${authConfig.password.minLength} characters long`);
  }
  
  if (authConfig.password.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (authConfig.password.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (authConfig.password.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (authConfig.password.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Session utilities
export const generateSessionToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const generateApiKey = (): string => {
  return 'nexus_' + randomBytes(32).toString('hex');
};

export const hashApiKey = async (apiKey: string): Promise<string> => {
  return bcrypt.hash(apiKey, 10);
};

export const compareApiKey = async (apiKey: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(apiKey, hash);
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username validation
export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  if (/^\d/.test(username)) {
    errors.push('Username cannot start with a number');
  }
  
  return { isValid: errors.length === 0, errors };
};

// CSRF protection
export const generateCSRFToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Two-factor authentication
export const generateTOTPSecret = (): string => {
  return randomBytes(20).toString('base32');
};

export const generateBackupCodes = (): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
};

export default authConfig;