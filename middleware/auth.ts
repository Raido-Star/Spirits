import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../config/auth';
import { prisma } from '../config/database';
import { rateLimit } from './rateLimit';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
    tier: string;
  };
}

// JWT Authentication Middleware
export const authenticate = async (req: AuthenticatedRequest) => {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = verifyToken(token);
      
      // Check if user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          tier: true,
          isActive: true,
          isVerified: true,
        },
      });

      if (!user || !user.isActive) {
        return NextResponse.json(
          { error: 'User not found or inactive' },
          { status: 401 }
        );
      }

      // Attach user to request
      req.user = user;
      return null; // Success
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
};

// API Key Authentication Middleware
export const authenticateApiKey = async (req: AuthenticatedRequest) => {
  try {
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key' },
        { status: 401 }
      );
    }

    const keyRecord = await prisma.apiKey.findFirst({
      where: {
        keyHash: apiKey, // In production, this should be hashed
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            tier: true,
            isActive: true,
          }
        }
      }
    });

    if (!keyRecord || !keyRecord.user.isActive) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsed: new Date() }
    });

    // Attach user to request
    req.user = keyRecord.user;
    return null; // Success
  } catch (error) {
    return NextResponse.json(
      { error: 'API key authentication failed' },
      { status: 500 }
    );
  }
};

// Role-based Authorization Middleware
export const authorize = (requiredRoles: string[]) => {
  return async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!requiredRoles.includes(req.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return null; // Success
  };
};

// Tier-based Authorization Middleware
export const requireTier = (requiredTier: string) => {
  const tierLevels = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
  
  return async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userTierLevel = tierLevels[req.user.tier as keyof typeof tierLevels] || 0;
    const requiredTierLevel = tierLevels[requiredTier as keyof typeof tierLevels] || 0;

    if (userTierLevel < requiredTierLevel) {
      return NextResponse.json(
        { error: 'Upgrade required for this feature' },
        { status: 402 }
      );
    }

    return null; // Success
  };
};

// Session Management Middleware
export const sessionAuth = async (req: AuthenticatedRequest) => {
  try {
    const sessionToken = req.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            tier: true,
            isActive: true,
          }
        }
      }
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    if (!session.user.isActive) {
      return NextResponse.json(
        { error: 'User account is inactive' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastLogin: new Date() }
    });

    // Attach user to request
    req.user = session.user;
    return null; // Success
  } catch (error) {
    return NextResponse.json(
      { error: 'Session authentication failed' },
      { status: 500 }
    );
  }
};

// Combined Authentication Middleware (JWT or API Key)
export const flexibleAuth = async (req: AuthenticatedRequest) => {
  // Try JWT first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return await authenticate(req);
  }

  // Try API key
  const apiKey = req.headers.get('x-api-key');
  if (apiKey) {
    return await authenticateApiKey(req);
  }

  // Try session
  const sessionToken = req.cookies.get('session_token')?.value;
  if (sessionToken) {
    return await sessionAuth(req);
  }

  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  );
};

// Security Headers Middleware
export const securityHeaders = (req: NextRequest) => {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return response;
};

// CORS Middleware
export const corsMiddleware = (req: NextRequest) => {
  const response = NextResponse.next();
  
  const origin = req.headers.get('origin');
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
};

// Usage tracking middleware
export const trackUsage = async (req: AuthenticatedRequest, type: string, amount: number = 1) => {
  if (!req.user) return;
  
  try {
    await prisma.usageRecord.create({
      data: {
        userId: req.user.id,
        type,
        amount,
        createdAt: new Date(),
      }
    });
  } catch (error) {
    console.error('Failed to track usage:', error);
  }
};

// Combine multiple middlewares
export const withAuth = (handler: Function, options: {
  roles?: string[];
  tier?: string;
  rateLimit?: boolean;
} = {}) => {
  return async (req: AuthenticatedRequest) => {
    // Apply rate limiting if enabled
    if (options.rateLimit) {
      const rateLimitResult = await rateLimit(req);
      if (rateLimitResult) return rateLimitResult;
    }

    // Apply authentication
    const authResult = await flexibleAuth(req);
    if (authResult) return authResult;

    // Apply role-based authorization
    if (options.roles && options.roles.length > 0) {
      const roleResult = await authorize(options.roles)(req);
      if (roleResult) return roleResult;
    }

    // Apply tier-based authorization
    if (options.tier) {
      const tierResult = await requireTier(options.tier)(req);
      if (tierResult) return tierResult;
    }

    // Call the actual handler
    return handler(req);
  };
};

export default {
  authenticate,
  authenticateApiKey,
  authorize,
  requireTier,
  sessionAuth,
  flexibleAuth,
  securityHeaders,
  corsMiddleware,
  trackUsage,
  withAuth,
};