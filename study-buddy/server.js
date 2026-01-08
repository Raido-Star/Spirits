require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Configure file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Study Buddy API is running',
    visionEnabled: !!process.env.OPENAI_API_KEY
  });
});

// Explain screenshot/image
app.post('/api/explain', upload.single('image'), async (req, res) => {
  try {
    const { explanationLevel = 'beginner', question } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Clean up uploaded file
      await fs.unlink(req.file.path);
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        message: 'Please add your OpenAI API key to the .env file'
      });
    }

    // Read image and convert to base64
    const imageBuffer = await fs.readFile(req.file.path);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    // Determine explanation style based on level
    const levelInstructions = {
      beginner: 'Explain this in very simple terms, as if teaching someone who just started learning to code. Use analogies and avoid jargon.',
      intermediate: 'Explain this clearly, assuming basic programming knowledge. Include relevant technical terms but explain them.',
      advanced: 'Provide a detailed technical explanation with advanced concepts, design patterns, and best practices.'
    };

    const instruction = levelInstructions[explanationLevel] || levelInstructions.beginner;

    const userPrompt = question
      ? `${instruction}\n\nUser's specific question: ${question}`
      : instruction;

    // Call GPT-4 Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Study Buddy, a friendly and patient AI tutor who helps students understand code, concepts, and technical topics. Always be encouraging and provide clear, structured explanations.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const explanation = response.choices[0].message.content;

    res.json({
      success: true,
      explanation,
      level: explanationLevel,
      usage: {
        tokens: response.usage.total_tokens,
        estimatedCost: `$${(response.usage.total_tokens * 0.00003).toFixed(4)}`
      },
      followUpSuggestions: generateFollowUpSuggestions(explanationLevel)
    });

  } catch (error) {
    console.error('Error explaining image:', error);

    // Clean up file if it still exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {
        // File already cleaned up
      }
    }

    res.status(500).json({
      error: 'Failed to explain image',
      details: error.message
    });
  }
});

// Follow-up question (with conversation context)
app.post('/api/follow-up', async (req, res) => {
  try {
    const { question, previousExplanation } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      return res.status(500).json({
        error: 'OpenAI API key not configured'
      });
    }

    const messages = [
      {
        role: 'system',
        content: 'You are Study Buddy, a helpful AI tutor. Answer follow-up questions clearly and encourage learning.'
      }
    ];

    if (previousExplanation) {
      messages.push({
        role: 'assistant',
        content: previousExplanation
      });
    }

    messages.push({
      role: 'user',
      content: question
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    const answer = response.choices[0].message.content;

    res.json({
      success: true,
      answer,
      usage: {
        tokens: response.usage.total_tokens,
        estimatedCost: `$${(response.usage.total_tokens * 0.00003).toFixed(4)}`
      }
    });

  } catch (error) {
    console.error('Error answering follow-up:', error);
    res.status(500).json({
      error: 'Failed to answer question',
      details: error.message
    });
  }
});

// Helper function
function generateFollowUpSuggestions(level) {
  const suggestions = {
    beginner: [
      'Can you explain this with a real-world example?',
      'What would happen if I changed this part?',
      'How do I use this in my own project?'
    ],
    intermediate: [
      'What are the best practices for this?',
      'Are there alternative approaches?',
      'What are common mistakes to avoid?'
    ],
    advanced: [
      'What are the performance implications?',
      'How does this relate to design patterns?',
      'What are the edge cases to consider?'
    ]
  };

  return suggestions[level] || suggestions.beginner;
}

// Start server
app.listen(PORT, () => {
  console.log(`\n🎓 Study Buddy API running on http://localhost:${PORT}`);
  console.log(`📸 Open http://localhost:${PORT} to start learning!`);

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
    console.warn('\n⚠️  WARNING: OpenAI API key not configured!');
    console.warn('   1. Copy .env.example to .env');
    console.warn('   2. Add your OpenAI API key from https://platform.openai.com/api-keys\n');
  } else {
    console.log('✅ OpenAI API configured\n');
  }
});
