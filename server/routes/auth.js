const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { generateToken, hashPassword, comparePassword } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// In-memory user storage (replace with database in production)
let users = [
  {
    id: '1',
    email: 'demo@nexusforge.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', // 'password123'
    name: 'Demo User',
    role: 'admin',
    subscription: 'enterprise',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  }
];

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().isLength({ min: 2 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }

  const { email, password, name } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      error: 'User already exists',
      code: 'USER_EXISTS'
    });
  }

  // Create new user
  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    role: 'user',
    subscription: 'free',
    createdAt: new Date(),
    lastLogin: new Date(),
    profile: {
      avatar: null,
      bio: '',
      website: '',
      location: '',
      skills: []
    },
    settings: {
      theme: 'dark',
      notifications: true,
      language: 'en'
    },
    stats: {
      projectsCreated: 0,
      aiRequests: 0,
      totalTokens: 0
    }
  };

  users.push(newUser);

  // Generate token
  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      subscription: newUser.subscription
    }
  });
}));

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Update last login
  user.lastLogin = new Date();

  // Generate token
  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
      profile: user.profile,
      settings: user.settings,
      stats: user.stats
    }
  });
}));

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  // This would normally use the authenticateToken middleware
  // For demo purposes, we'll get user from query param
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
      profile: user.profile,
      settings: user.settings,
      stats: user.stats,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }
  });
}));

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('bio').optional().trim(),
  body('website').optional().isURL(),
  body('location').optional().trim(),
  body('skills').optional().isArray()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }

  const { userId } = req.query;
  const { name, bio, website, location, skills } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Update profile
  if (name) user.name = name;
  if (bio !== undefined) user.profile.bio = bio;
  if (website !== undefined) user.profile.website = website;
  if (location !== undefined) user.profile.location = location;
  if (skills !== undefined) user.profile.skills = skills;

  res.json({
    success: true,
    message: 'Profile updated successfully',
    profile: user.profile
  });
}));

// Update user settings
router.put('/settings', [
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('notifications').optional().isBoolean(),
  body('language').optional().isIn(['en', 'es', 'fr', 'de', 'zh'])
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }

  const { userId } = req.query;
  const { theme, notifications, language } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Update settings
  if (theme !== undefined) user.settings.theme = theme;
  if (notifications !== undefined) user.settings.notifications = notifications;
  if (language !== undefined) user.settings.language = language;

  res.json({
    success: true,
    message: 'Settings updated successfully',
    settings: user.settings
  });
}));

// Change password
router.put('/password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }

  const { userId } = req.query;
  const { currentPassword, newPassword } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    return res.status(400).json({
      error: 'Current password is incorrect',
      code: 'INVALID_CURRENT_PASSWORD'
    });
  }

  // Hash new password
  user.password = await hashPassword(newPassword);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// Request password reset
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }

  const { email } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent'
    });
  }

  // Generate reset token (in production, send email)
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  res.json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent',
    resetToken // Remove this in production
  });
}));

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }

  const { token, newPassword } = req.body;

  const user = users.find(u => u.resetToken === token && u.resetTokenExpiry > new Date());
  if (!user) {
    return res.status(400).json({
      error: 'Invalid or expired reset token',
      code: 'INVALID_RESET_TOKEN'
    });
  }

  // Update password and clear reset token
  user.password = await hashPassword(newPassword);
  user.resetToken = null;
  user.resetTokenExpiry = null;

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
}));

// Logout (client-side token removal)
router.post('/logout', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Demo login endpoint
router.post('/demo', asyncHandler(async (req, res) => {
  const demoUser = users.find(u => u.email === 'demo@nexusforge.com');
  const token = generateToken(demoUser);

  res.json({
    success: true,
    message: 'Demo login successful',
    token,
    user: {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
      subscription: demoUser.subscription,
      profile: demoUser.profile,
      settings: demoUser.settings,
      stats: demoUser.stats
    }
  });
}));

module.exports = router;