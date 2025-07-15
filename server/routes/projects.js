const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// In-memory project storage (replace with database in production)
let projects = [
  {
    id: '1',
    userId: '1',
    name: 'AI Music Composer',
    type: 'music',
    description: 'An AI-powered music composition tool',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    metadata: {
      genre: 'electronic',
      duration: 120,
      instruments: ['piano', 'synth', 'drums']
    },
    files: [
      { name: 'composition.mp3', url: '/uploads/composition.mp3', size: 2048000 },
      { name: 'sheet-music.pdf', url: '/uploads/sheet-music.pdf', size: 512000 }
    ],
    settings: {
      public: false,
      collaborative: false
    },
    stats: {
      views: 45,
      downloads: 12,
      likes: 8
    }
  }
];

// Get all projects for user
router.get('/', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { type, status, page = 1, limit = 10 } = req.query;

  let userProjects = projects.filter(p => p.userId === userId);

  // Filter by type
  if (type) {
    userProjects = userProjects.filter(p => p.type === type);
  }

  // Filter by status
  if (status) {
    userProjects = userProjects.filter(p => p.status === status);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProjects = userProjects.slice(startIndex, endIndex);

  res.json({
    success: true,
    projects: paginatedProjects,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(userProjects.length / limit),
      hasNext: endIndex < userProjects.length,
      hasPrev: page > 1
    },
    total: userProjects.length
  });
}));

// Get single project
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  const project = projects.find(p => p.id === id && p.userId === userId);
  
  if (!project) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  res.json({
    success: true,
    project
  });
}));

// Create new project
router.post('/', asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const { name, type, description, metadata, settings } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      error: 'Name and type are required',
      code: 'MISSING_REQUIRED_FIELDS'
    });
  }

  const newProject = {
    id: Date.now().toString(),
    userId,
    name,
    type,
    description: description || '',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: metadata || {},
    files: [],
    settings: {
      public: false,
      collaborative: false,
      ...settings
    },
    stats: {
      views: 0,
      downloads: 0,
      likes: 0
    }
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    project: newProject
  });
}));

// Update project
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  const { name, description, metadata, settings, status } = req.body;

  const project = projects.find(p => p.id === id && p.userId === userId);
  
  if (!project) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  // Update fields
  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (metadata) project.metadata = { ...project.metadata, ...metadata };
  if (settings) project.settings = { ...project.settings, ...settings };
  if (status) project.status = status;
  
  project.updatedAt = new Date();

  res.json({
    success: true,
    message: 'Project updated successfully',
    project
  });
}));

// Delete project
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  const projectIndex = projects.findIndex(p => p.id === id && p.userId === userId);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  projects.splice(projectIndex, 1);

  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
}));

// Add file to project
router.post('/:id/files', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  const { name, url, size, type } = req.body;

  const project = projects.find(p => p.id === id && p.userId === userId);
  
  if (!project) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  const newFile = {
    name,
    url,
    size: parseInt(size),
    type,
    uploadedAt: new Date()
  };

  project.files.push(newFile);
  project.updatedAt = new Date();

  res.json({
    success: true,
    message: 'File added successfully',
    file: newFile
  });
}));

// Remove file from project
router.delete('/:id/files/:fileId', asyncHandler(async (req, res) => {
  const { id, fileId } = req.params;
  const { userId } = req.query;

  const project = projects.find(p => p.id === id && p.userId === userId);
  
  if (!project) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  const fileIndex = project.files.findIndex(f => f.name === fileId);
  
  if (fileIndex === -1) {
    return res.status(404).json({
      error: 'File not found',
      code: 'FILE_NOT_FOUND'
    });
  }

  project.files.splice(fileIndex, 1);
  project.updatedAt = new Date();

  res.json({
    success: true,
    message: 'File removed successfully'
  });
}));

// Duplicate project
router.post('/:id/duplicate', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  const { name } = req.body;

  const originalProject = projects.find(p => p.id === id && p.userId === userId);
  
  if (!originalProject) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  const duplicatedProject = {
    ...originalProject,
    id: Date.now().toString(),
    name: name || `${originalProject.name} (Copy)`,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    stats: {
      views: 0,
      downloads: 0,
      likes: 0
    }
  };

  projects.push(duplicatedProject);

  res.json({
    success: true,
    message: 'Project duplicated successfully',
    project: duplicatedProject
  });
}));

// Export project
router.get('/:id/export', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  const { format = 'zip' } = req.query;

  const project = projects.find(p => p.id === id && p.userId === userId);
  
  if (!project) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  // Simulate export process
  const exportData = {
    project: {
      name: project.name,
      type: project.type,
      description: project.description,
      metadata: project.metadata,
      createdAt: project.createdAt
    },
    files: project.files,
    exportUrl: `/api/projects/${id}/download?format=${format}`,
    format,
    size: project.files.reduce((total, file) => total + file.size, 0)
  };

  res.json({
    success: true,
    export: exportData
  });
}));

// Get project analytics
router.get('/:id/analytics', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  const { period = '30d' } = req.query;

  const project = projects.find(p => p.id === id && p.userId === userId);
  
  if (!project) {
    return res.status(404).json({
      error: 'Project not found',
      code: 'PROJECT_NOT_FOUND'
    });
  }

  // Simulate analytics data
  const analytics = {
    views: {
      total: project.stats.views,
      daily: Array(30).fill(0).map(() => Math.floor(Math.random() * 10)),
      weekly: Array(4).fill(0).map(() => Math.floor(Math.random() * 50))
    },
    engagement: {
      downloads: project.stats.downloads,
      likes: project.stats.likes,
      shares: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 15)
    },
    performance: {
      loadTime: Math.random() * 2 + 0.5,
      errorRate: Math.random() * 0.05,
      uptime: 99.9
    }
  };

  res.json({
    success: true,
    analytics
  });
}));

module.exports = router;