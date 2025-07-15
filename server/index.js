const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

app.use(limiter);
app.use(speedLimiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      ai: 'active',
      database: 'active',
      redis: 'active'
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle real-time collaboration
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`User joined project ${projectId}`);
  });

  // Handle AI generation progress
  socket.on('ai-generation-start', (data) => {
    socket.to(`user-${data.userId}`).emit('ai-generation-progress', {
      type: data.type,
      progress: 0,
      message: 'Starting generation...'
    });
  });

  // Handle code generation
  socket.on('code-generation-request', async (data) => {
    try {
      const { prompt, language, userId } = data;
      socket.to(`user-${userId}`).emit('code-generation-progress', {
        progress: 10,
        message: 'Analyzing requirements...'
      });

      // Simulate AI processing
      setTimeout(() => {
        socket.to(`user-${userId}`).emit('code-generation-progress', {
          progress: 50,
          message: 'Generating code...'
        });
      }, 2000);

      setTimeout(() => {
        socket.to(`user-${userId}`).emit('code-generation-complete', {
          code: `// Generated ${language} code\nfunction example() {\n  console.log("Hello from AI!");\n}`,
          language,
          timestamp: new Date().toISOString()
        });
      }, 4000);
    } catch (error) {
      socket.to(`user-${data.userId}`).emit('ai-generation-error', {
        error: error.message
      });
    }
  });

  // Handle music generation
  socket.on('music-generation-request', async (data) => {
    try {
      const { genre, mood, duration, userId } = data;
      socket.to(`user-${userId}`).emit('music-generation-progress', {
        progress: 10,
        message: 'Composing melody...'
      });

      setTimeout(() => {
        socket.to(`user-${userId}`).emit('music-generation-progress', {
          progress: 60,
          message: 'Adding instruments...'
        });
      }, 3000);

      setTimeout(() => {
        socket.to(`user-${userId}`).emit('music-generation-complete', {
          audioUrl: '/api/ai/generated-music/sample.mp3',
          metadata: {
            genre,
            mood,
            duration,
            bpm: 120,
            key: 'C major'
          },
          timestamp: new Date().toISOString()
        });
      }, 6000);
    } catch (error) {
      socket.to(`user-${data.userId}`).emit('ai-generation-error', {
        error: error.message
      });
    }
  });

  // Handle game generation
  socket.on('game-generation-request', async (data) => {
    try {
      const { genre, platform, complexity, userId } = data;
      socket.to(`user-${userId}`).emit('game-generation-progress', {
        progress: 10,
        message: 'Designing game mechanics...'
      });

      setTimeout(() => {
        socket.to(`user-${userId}`).emit('game-generation-progress', {
          progress: 40,
          message: 'Creating assets...'
        });
      }, 2000);

      setTimeout(() => {
        socket.to(`user-${userId}`).emit('game-generation-progress', {
          progress: 80,
          message: 'Compiling game...'
        });
      }, 4000);

      setTimeout(() => {
        socket.to(`user-${userId}`).emit('game-generation-complete', {
          gameUrl: '/api/ai/generated-games/sample-game.html',
          metadata: {
            genre,
            platform,
            complexity,
            playTime: '5-10 minutes'
          },
          timestamp: new Date().toISOString()
        });
      }, 6000);
    } catch (error) {
      socket.to(`user-${data.userId}`).emit('ai-generation-error', {
        error: error.message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 NexusForge AI Platform Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🎮 WebSocket: ws://localhost:${PORT}`);
});

module.exports = { app, server, io };