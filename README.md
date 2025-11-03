# NexusForge AI Platform

A comprehensive AI-powered creative platform for building applications, games, music, websites, and more. NexusForge combines multiple AI agents to provide a unified creative experience.

## 🚀 Features

### AI-Powered Tools
- **Code Generator**: Generate applications and scripts in multiple languages
- **Music Composer**: Create original music tracks with AI
- **Game Creator**: Build interactive games and experiences
- **Website Builder**: Design and deploy websites
- **Image Generator**: Create stunning visuals and artwork
- **Text Generator**: Generate written content and copy

### Platform Features
- **Real-time Collaboration**: Work together with team members
- **Project Management**: Organize and manage your AI-generated projects
- **Analytics Dashboard**: Track usage and performance metrics
- **User Management**: Role-based access control and team features
- **API Integration**: Connect with external AI services
- **Real-time Updates**: Live progress tracking for AI generation

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **MongoDB** (configured but using in-memory storage for demo)
- **Redis** for caching and session management
- **Multer** for file uploads
- **Sharp** for image processing
- **FFmpeg** for audio/video processing

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for UI components
- **Framer Motion** for animations
- **React Router** for navigation
- **Socket.IO Client** for real-time features
- **Monaco Editor** for code editing
- **Three.js** for 3D graphics
- **Tone.js** for audio processing
- **Recharts** for data visualization

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexusforge-ai-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend client on http://localhost:3000

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/nexusforge

# Redis
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your-openai-api-key
REPLICATE_API_KEY=your-replicate-api-key
STABILITY_API_KEY=your-stability-api-key

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=nexusforge-uploads

# Email (for password reset, etc.)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Stripe (for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

## 🏃‍♂️ Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client
- `npm run build` - Build the client for production
- `npm run start` - Start the production server
- `npm run install-all` - Install dependencies for both client and server
- `npm run setup` - Complete setup including build

## 📁 Project Structure

```
nexusforge-ai-platform/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── ai-agents/         # AI service integrations
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── index.js          # Main server file
├── package.json
└── README.md
```

## 🔧 Development

### Backend Development

The server uses Express.js with the following key features:

- **Authentication**: JWT-based authentication with role-based access
- **Real-time Communication**: Socket.IO for live updates
- **File Uploads**: Multer for handling file uploads
- **Rate Limiting**: Express rate limiter for API protection
- **Error Handling**: Centralized error handling middleware
- **Logging**: Morgan for HTTP request logging

### Frontend Development

The React app includes:

- **TypeScript**: Full type safety
- **Material-UI**: Modern, accessible UI components
- **State Management**: React Context for global state
- **Routing**: React Router for navigation
- **Real-time Updates**: Socket.IO client integration
- **Animations**: Framer Motion for smooth transitions

## 🚀 Deployment

### Production Build

1. **Build the client**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@nexusforge.ai or join our Discord community.

## 🔧 Embedded Development Environment

NexusForge includes a comprehensive embedded development environment for microcontrollers and Raspberry Pi!

### Features
- **ESP32 Family**: ESP32, ESP32-S2, ESP32-S3, ESP32-C3, ESP32-C6
- **Arduino**: All compatible boards
- **STM32**: Complete STM32 family support
- **Raspberry Pi**: Cross-compilation for all models
- **Docker-based**: Consistent environment across platforms
- **Rich Tooling**: PlatformIO, ESP-IDF, Arduino CLI, and more

### Quick Start
```bash
cd embedded
make setup
make docker-up
make shell
```

See [embedded/README.md](embedded/README.md) for complete documentation.

## 🔮 Roadmap

- [x] **Embedded Development Environment** - Build code for microcontrollers and Raspberry Pi
- [ ] Advanced AI model fine-tuning
- [ ] Collaborative editing features
- [ ] Mobile app development
- [ ] Advanced analytics and insights
- [ ] Plugin system for custom AI agents
- [ ] Enterprise features and SSO
- [ ] Multi-language support
- [ ] Advanced project templates

---

Built with ❤️ by the NexusForge Team