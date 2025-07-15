import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '../../../config/database';
import { comparePassword, generateToken, generateSessionToken } from '../../../config/auth';
import { authRateLimit } from '../../../middleware/rateLimit';
import { ApiResponse, LoginCredentials } from '../../../types';

// Request validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Apply rate limiting
    const rateLimitResult = await authRateLimit(req as any);
    if (rateLimitResult) {
      return res.status(429).json({
        success: false,
        error: 'Too many login attempts. Please try again later.',
      });
    }

    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: validation.error.errors.map(e => e.message).join(', '),
      });
    }

    const { email, password, rememberMe = false } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        tier: true,
        isActive: true,
        isVerified: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account disabled',
        message: 'Your account has been disabled. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      tier: user.tier,
    };

    const token = generateToken(tokenPayload);

    // Create session
    const sessionToken = generateSessionToken();
    const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
    const expiresAt = new Date(Date.now() + sessionDuration);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || null,
        isActive: true,
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Remove sensitive data from response
    const { passwordHash, ...userWithoutPassword } = user;

    // Set session cookie
    res.setHeader('Set-Cookie', [
      `session_token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${sessionDuration / 1000}`,
      `user_id=${user.id}; Path=/; Secure; SameSite=Strict; Max-Age=${sessionDuration / 1000}`,
    ]);

    return res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        sessionToken,
        expiresAt: expiresAt.toISOString(),
      },
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred during login',
    });
  }
}