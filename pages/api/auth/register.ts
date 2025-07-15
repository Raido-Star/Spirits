import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '../../../config/database';
import { hashPassword, validatePassword, validateEmail, validateUsername, generateToken, generateSessionToken } from '../../../config/auth';
import { authRateLimit } from '../../../middleware/rateLimit';
import { ApiResponse, RegisterCredentials } from '../../../types';

// Request validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be no more than 20 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
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
        error: 'Too many registration attempts. Please try again later.',
      });
    }

    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: validation.error.errors.map(e => e.message).join(', '),
      });
    }

    const { email, username, password, firstName, lastName } = validation.data;

    // Additional validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid username',
        message: usernameValidation.errors.join(', '),
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid password',
        message: passwordValidation.errors.join(', '),
      });
    }

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
        message: 'An account with this email already exists',
      });
    }

    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });

    if (existingUserByUsername) {
      return res.status(409).json({
        success: false,
        error: 'Username already taken',
        message: 'This username is already taken',
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: 'USER',
        tier: 'FREE',
        isActive: true,
        isVerified: false, // Email verification required
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        tier: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });

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
    const sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
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

    // Create default tools for the user
    await prisma.tool.createMany({
      data: [
        {
          name: 'web_search',
          displayName: 'Web Search',
          description: 'Search the web for information',
          category: 'research',
          icon: 'search',
          config: { enabled: true },
          isBuiltIn: true,
        },
        {
          name: 'code_generator',
          displayName: 'Code Generator',
          description: 'Generate code in various programming languages',
          category: 'development',
          icon: 'code',
          config: { enabled: true },
          isBuiltIn: true,
        },
        {
          name: 'image_generator',
          displayName: 'Image Generator',
          description: 'Generate images from text descriptions',
          category: 'creative',
          icon: 'image',
          config: { enabled: true },
          isBuiltIn: true,
        },
      ],
      skipDuplicates: true,
    });

    // Set session cookie
    res.setHeader('Set-Cookie', [
      `session_token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${sessionDuration / 1000}`,
      `user_id=${user.id}; Path=/; Secure; SameSite=Strict; Max-Age=${sessionDuration / 1000}`,
    ]);

    return res.status(201).json({
      success: true,
      data: {
        user,
        token,
        sessionToken,
        expiresAt: expiresAt.toISOString(),
      },
      message: 'Registration successful. Please check your email for verification.',
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('email')) {
        return res.status(409).json({
          success: false,
          error: 'Email already registered',
          message: 'An account with this email already exists',
        });
      }
      if (target?.includes('username')) {
        return res.status(409).json({
          success: false,
          error: 'Username already taken',
          message: 'This username is already taken',
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred during registration',
    });
  }
}