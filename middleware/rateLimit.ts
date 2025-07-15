import { NextRequest, NextResponse } from 'next/server';
import { config } from '../config/environment';

// In-memory store for rate limiting (fallback when Redis is not available)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const rateLimitConfig = {
  windowMs: config.security.rateLimit.windowMs, // 15 minutes
  max: config.security.rateLimit.max, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// Different rate limits for different endpoints
const endpointLimits = {
  '/api/auth/login': { windowMs: 15 * 60 * 1000, max: 5 }, // 5 per 15 minutes
  '/api/auth/register': { windowMs: 60 * 60 * 1000, max: 3 }, // 3 per hour
  '/api/auth/forgot-password': { windowMs: 60 * 60 * 1000, max: 3 }, // 3 per hour
  '/api/agents/create': { windowMs: 60 * 60 * 1000, max: 10 }, // 10 per hour
  '/api/agents/chat': { windowMs: 60 * 1000, max: 30 }, // 30 per minute
  '/api/projects/create': { windowMs: 60 * 60 * 1000, max: 5 }, // 5 per hour
  '/api/workflows/execute': { windowMs: 60 * 1000, max: 10 }, // 10 per minute
};

// Get client IP address
const getClientIP = (req: NextRequest): string => {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  
  return req.ip || 'unknown';
};

// Get user identifier (IP + user ID if authenticated)
const getUserIdentifier = (req: NextRequest): string => {
  const ip = getClientIP(req);
  const authHeader = req.headers.get('authorization');
  
  if (authHeader) {
    try {
      // Extract user ID from token for per-user rate limiting
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(atob(token.split('.')[1]));
      return `user:${payload.userId}`;
    } catch (error) {
      // Fall back to IP-based limiting
    }
  }
  
  return `ip:${ip}`;
};

// Clean up expired entries from in-memory store
const cleanupMemoryStore = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Redis-based rate limiting (when Redis is available)
const redisRateLimit = async (key: string, limit: number, windowMs: number): Promise<{
  isLimited: boolean;
  remaining: number;
  resetTime: number;
}> => {
  // This would be implemented with Redis
  // For now, we'll use the memory store
  return memoryRateLimit(key, limit, windowMs);
};

// Memory-based rate limiting (fallback)
const memoryRateLimit = async (key: string, limit: number, windowMs: number): Promise<{
  isLimited: boolean;
  remaining: number;
  resetTime: number;
}> => {
  const now = Date.now();
  const resetTime = now + windowMs;
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    cleanupMemoryStore();
  }
  
  let record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime };
    rateLimitStore.set(key, record);
  }
  
  record.count++;
  
  const remaining = Math.max(0, limit - record.count);
  const isLimited = record.count > limit;
  
  return {
    isLimited,
    remaining,
    resetTime: record.resetTime,
  };
};

// Main rate limiting function
export const rateLimit = async (req: NextRequest): Promise<NextResponse | null> => {
  try {
    const identifier = getUserIdentifier(req);
    const pathname = req.nextUrl.pathname;
    
    // Get rate limit configuration for this endpoint
    const endpointConfig = endpointLimits[pathname as keyof typeof endpointLimits] || rateLimitConfig;
    
    const key = `rate_limit:${pathname}:${identifier}`;
    
    // Use Redis if available, otherwise use memory store
    const result = config.services.redis.enabled
      ? await redisRateLimit(key, endpointConfig.max, endpointConfig.windowMs)
      : await memoryRateLimit(key, endpointConfig.max, endpointConfig.windowMs);
    
    if (result.isLimited) {
      const response = NextResponse.json(
        {
          error: 'Too many requests',
          message: endpointConfig.message || rateLimitConfig.message,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', endpointConfig.max.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      response.headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
      
      return response;
    }
    
    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', endpointConfig.max.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    
    return null; // No rate limit exceeded
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Don't block requests if rate limiting fails
    return null;
  }
};

// Rate limiting middleware for specific endpoints
export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) => {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const identifier = getUserIdentifier(req);
    const pathname = req.nextUrl.pathname;
    const key = `rate_limit:${pathname}:${identifier}`;
    
    const result = config.services.redis.enabled
      ? await redisRateLimit(key, options.max, options.windowMs)
      : await memoryRateLimit(key, options.max, options.windowMs);
    
    if (result.isLimited) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: options.message || rateLimitConfig.message,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }
    
    return null;
  };
};

// Burst protection for expensive operations
export const burstProtection = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many requests for this resource, please slow down.',
});

// Authentication rate limiting
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
});

// API rate limiting for external calls
export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'API rate limit exceeded, please try again later.',
});

// Heavy computation rate limiting
export const computeRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 heavy operations per hour
  message: 'Too many compute-intensive requests, please try again later.',
});

// Clean up memory store periodically
setInterval(cleanupMemoryStore, 5 * 60 * 1000); // Every 5 minutes

export default {
  rateLimit,
  createRateLimiter,
  burstProtection,
  authRateLimit,
  apiRateLimit,
  computeRateLimit,
};