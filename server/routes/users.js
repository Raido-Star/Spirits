const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  const { userId } = req.query;

  // Simulate user data
  const user = {
    id: userId,
    name: 'Demo User',
    email: 'demo@nexusforge.com',
    role: 'admin',
    subscription: 'enterprise',
    profile: {
      avatar: '/uploads/avatar.jpg',
      bio: 'AI enthusiast and creative developer',
      website: 'https://nexusforge.com',
      location: 'San Francisco, CA',
      skills: ['JavaScript', 'React', 'AI/ML', 'Music Production']
    },
    settings: {
      theme: 'dark',
      notifications: true,
      language: 'en',
      timezone: 'America/Los_Angeles'
    },
    stats: {
      projectsCreated: 15,
      aiRequests: 234,
      totalTokens: 1250000,
      memberSince: '2024-01-01'
    }
  };

  res.json({
    success: true,
    user
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { name, bio, website, location, skills } = req.body;

  // Simulate profile update
  const updatedProfile = {
    name: name || 'Demo User',
    bio: bio || 'AI enthusiast and creative developer',
    website: website || 'https://nexusforge.com',
    location: location || 'San Francisco, CA',
    skills: skills || ['JavaScript', 'React', 'AI/ML', 'Music Production']
  };

  res.json({
    success: true,
    message: 'Profile updated successfully',
    profile: updatedProfile
  });
}));

// Get user settings
router.get('/settings', asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const settings = {
    theme: 'dark',
    notifications: true,
    language: 'en',
    timezone: 'America/Los_Angeles',
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      allowMessages: true
    },
    ai: {
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048
    }
  };

  res.json({
    success: true,
    settings
  });
}));

// Update user settings
router.put('/settings', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { theme, notifications, language, timezone, privacy, ai } = req.body;

  const updatedSettings = {
    theme: theme || 'dark',
    notifications: notifications !== undefined ? notifications : true,
    language: language || 'en',
    timezone: timezone || 'America/Los_Angeles',
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      allowMessages: true,
      ...privacy
    },
    ai: {
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      ...ai
    }
  };

  res.json({
    success: true,
    message: 'Settings updated successfully',
    settings: updatedSettings
  });
}));

// Get user statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { period = '30d' } = req.query;

  const stats = {
    overview: {
      projectsCreated: 15,
      aiRequests: 234,
      totalTokens: 1250000,
      memberSince: '2024-01-01'
    },
    activity: {
      daily: Array(30).fill(0).map(() => Math.floor(Math.random() * 10)),
      weekly: Array(12).fill(0).map(() => Math.floor(Math.random() * 50)),
      monthly: Array(12).fill(0).map(() => Math.floor(Math.random() * 200))
    },
    breakdown: {
      code: 45,
      music: 30,
      image: 25,
      text: 20
    },
    achievements: [
      { id: 'first-project', name: 'First Project', description: 'Created your first AI project', earned: '2024-01-15' },
      { id: 'ai-master', name: 'AI Master', description: 'Made 100 AI requests', earned: '2024-02-01' },
      { id: 'creative-genius', name: 'Creative Genius', description: 'Created 10 projects', earned: '2024-03-01' }
    ]
  };

  res.json({
    success: true,
    stats
  });
}));

// Get user billing information
router.get('/billing', asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const billing = {
    currentPlan: {
      name: 'Enterprise',
      price: 99.99,
      interval: 'monthly',
      features: [
        'Unlimited AI requests',
        'Priority support',
        'Advanced analytics',
        'Custom integrations'
      ]
    },
    usage: {
      requests: 234,
      tokens: 1250000,
      storage: 2.5, // GB
      limits: {
        requests: -1,
        tokens: -1,
        storage: 100
      }
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiry: '12/25'
    },
    invoices: [
      {
        id: 'inv_001',
        date: '2024-03-01',
        amount: 99.99,
        status: 'paid',
        downloadUrl: '/api/users/invoices/inv_001'
      },
      {
        id: 'inv_002',
        date: '2024-02-01',
        amount: 99.99,
        status: 'paid',
        downloadUrl: '/api/users/invoices/inv_002'
      }
    ]
  };

  res.json({
    success: true,
    billing
  });
}));

// Update billing information
router.put('/billing', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { plan, paymentMethod } = req.body;

  res.json({
    success: true,
    message: 'Billing information updated successfully'
  });
}));

// Get user notifications
router.get('/notifications', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { page = 1, limit = 10 } = req.query;

  const notifications = [
    {
      id: '1',
      type: 'project',
      title: 'Project completed',
      message: 'Your AI music composition has been generated successfully',
      read: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      type: 'system',
      title: 'New feature available',
      message: 'Try our new game generation feature',
      read: true,
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      type: 'billing',
      title: 'Payment successful',
      message: 'Your monthly subscription has been renewed',
      read: true,
      createdAt: new Date(Date.now() - 172800000)
    }
  ];

  res.json({
    success: true,
    notifications,
    unreadCount: notifications.filter(n => !n.read).length
  });
}));

// Mark notification as read
router.put('/notifications/:id/read', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  res.json({
    success: true,
    message: 'Notification marked as read'
  });
}));

// Mark all notifications as read
router.put('/notifications/read-all', asyncHandler(async (req, res) => {
  const { userId } = req.query;

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

// Delete notification
router.delete('/notifications/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  res.json({
    success: true,
    message: 'Notification deleted'
  });
}));

// Get user API keys
router.get('/api-keys', asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const apiKeys = [
    {
      id: 'key_1',
      name: 'Production API Key',
      key: 'nf_live_...',
      permissions: ['read', 'write'],
      lastUsed: new Date(Date.now() - 3600000),
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'key_2',
      name: 'Development API Key',
      key: 'nf_test_...',
      permissions: ['read'],
      lastUsed: new Date(Date.now() - 86400000),
      createdAt: new Date('2024-02-01')
    }
  ];

  res.json({
    success: true,
    apiKeys
  });
}));

// Create new API key
router.post('/api-keys', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { name, permissions } = req.body;

  const newApiKey = {
    id: `key_${Date.now()}`,
    name: name || 'New API Key',
    key: `nf_${Math.random().toString(36).substring(2, 15)}`,
    permissions: permissions || ['read'],
    lastUsed: null,
    createdAt: new Date()
  };

  res.json({
    success: true,
    message: 'API key created successfully',
    apiKey: newApiKey
  });
}));

// Delete API key
router.delete('/api-keys/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  res.json({
    success: true,
    message: 'API key deleted successfully'
  });
}));

// Get user team members (for enterprise accounts)
router.get('/team', asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const team = [
    {
      id: '1',
      email: 'john@company.com',
      name: 'John Doe',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      email: 'jane@company.com',
      name: 'Jane Smith',
      role: 'member',
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 86400000)
    }
  ];

  res.json({
    success: true,
    team
  });
}));

// Invite team member
router.post('/team/invite', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { email, role } = req.body;

  res.json({
    success: true,
    message: 'Invitation sent successfully'
  });
}));

// Remove team member
router.delete('/team/:memberId', asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const { userId } = req.query;

  res.json({
    success: true,
    message: 'Team member removed successfully'
  });
}));

module.exports = router;