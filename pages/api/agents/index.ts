import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '../../../config/database';
import { withAuth } from '../../../middleware/auth';
import { ApiResponse, Agent } from '../../../types';

// Agent creation schema
const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(5000, 'Prompt is too long'),
  model: z.enum(['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'gemini-pro']),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(8000).default(2000),
  tools: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]),
  isPublic: z.boolean().default(false),
});

// Agent update schema
const updateAgentSchema = createAgentSchema.partial();

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { method } = req;
  const userId = (req as any).user.id;

  try {
    switch (method) {
      case 'GET':
        return await getAgents(req, res, userId);
      case 'POST':
        return await createAgent(req, res, userId);
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
        });
    }
  } catch (error) {
    console.error('Agents API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

async function getAgents(req: NextApiRequest, res: NextApiResponse<ApiResponse>, userId: string) {
  const {
    page = '1',
    limit = '10',
    search = '',
    model = '',
    isPublic = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  // Build where clause
  const where: any = {
    OR: [
      { userId }, // User's own agents
      { isPublic: true }, // Public agents
    ],
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (model) {
    where.model = model;
  }

  if (isPublic === 'true') {
    where.isPublic = true;
  } else if (isPublic === 'false') {
    where.isPublic = false;
    where.userId = userId; // Only show user's private agents
  }

  // Build order by clause
  const orderBy: any = {};
  orderBy[sortBy as string] = sortOrder;

  const [agents, total] = await Promise.all([
    prisma.agent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            conversations: true,
            workflows: true,
          },
        },
      },
      orderBy,
      skip: offset,
      take: limitNum,
    }),
    prisma.agent.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return res.status(200).json({
    success: true,
    data: agents,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  });
}

async function createAgent(req: NextApiRequest, res: NextApiResponse<ApiResponse>, userId: string) {
  // Validate request body
  const validation = createAgentSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request data',
      message: validation.error.errors.map(e => e.message).join(', '),
    });
  }

  const data = validation.data;

  // Check if user has reached agent limit
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // Check tier limits
  const agentCount = await prisma.agent.count({
    where: { userId, isActive: true },
  });

  const tierLimits = {
    FREE: 5,
    PRO: 50,
    ENTERPRISE: 1000,
  };

  const limit = tierLimits[user.tier as keyof typeof tierLimits] || 5;

  if (agentCount >= limit) {
    return res.status(402).json({
      success: false,
      error: 'Agent limit reached',
      message: `Your ${user.tier} tier allows up to ${limit} agents. Please upgrade to create more.`,
    });
  }

  // Validate tools exist
  if (data.tools.length > 0) {
    const toolCount = await prisma.tool.count({
      where: {
        name: { in: data.tools },
        isActive: true,
      },
    });

    if (toolCount !== data.tools.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tools',
        message: 'One or more specified tools do not exist or are inactive',
      });
    }
  }

  // Create agent
  const agent = await prisma.agent.create({
    data: {
      ...data,
      userId,
      version: '1.0.0',
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  return res.status(201).json({
    success: true,
    data: agent,
    message: 'Agent created successfully',
  });
}

export default withAuth(handler, {
  rateLimit: true,
});

// Individual agent routes
export { handler as agents };

// Export for use in other files
export async function getAgentById(id: string, userId: string) {
  return await prisma.agent.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { isPublic: true },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      conversations: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 5,
      },
    },
  });
}

export async function updateAgent(id: string, userId: string, data: any) {
  // Validate that user owns the agent
  const agent = await prisma.agent.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!agent) {
    throw new Error('Agent not found or access denied');
  }

  // Validate update data
  const validation = updateAgentSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Invalid update data');
  }

  // Update agent
  return await prisma.agent.update({
    where: { id },
    data: {
      ...validation.data,
      updatedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });
}

export async function deleteAgent(id: string, userId: string) {
  // Validate that user owns the agent
  const agent = await prisma.agent.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!agent) {
    throw new Error('Agent not found or access denied');
  }

  // Soft delete by setting isActive to false
  return await prisma.agent.update({
    where: { id },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}