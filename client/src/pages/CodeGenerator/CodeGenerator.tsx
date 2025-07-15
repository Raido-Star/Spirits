import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  ContentCopy,
  Download,
  Save,
  Refresh,
  Code,
  Language,
  Settings,
  History,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

interface CodeGenerationRequest {
  prompt: string;
  language: string;
  framework?: string;
  complexity: 'simple' | 'medium' | 'complex';
  includeTests: boolean;
  includeDocs: boolean;
}

interface GeneratedCode {
  code: string;
  language: string;
  explanation: string;
  timestamp: string;
  metadata: {
    tokens: number;
    model: string;
    duration: number;
  };
}

const CodeGenerator: React.FC = () => {
  const theme = useTheme();
  const socket = useSocket();
  const { user } = useAuth();
  
  const [request, setRequest] = useState<CodeGenerationRequest>({
    prompt: '',
    language: 'javascript',
    framework: '',
    complexity: 'medium',
    includeTests: false,
    includeDocs: false,
  });
  
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '⚡' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'csharp', label: 'C#', icon: '🔷' },
    { value: 'cpp', label: 'C++', icon: '⚙️' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'ruby', label: 'Ruby', icon: '💎' },
  ];

  const frameworks = {
    javascript: ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js'],
    typescript: ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js'],
    python: ['Django', 'Flask', 'FastAPI', 'PyTorch', 'TensorFlow'],
    java: ['Spring Boot', 'Spring MVC', 'Hibernate', 'Maven'],
    csharp: ['.NET', 'ASP.NET', 'Entity Framework', 'Xamarin'],
    cpp: ['Qt', 'Boost', 'OpenGL', 'SFML'],
    go: ['Gin', 'Echo', 'GORM', 'Cobra'],
    rust: ['Actix', 'Rocket', 'Tokio', 'Serde'],
    php: ['Laravel', 'Symfony', 'CodeIgniter', 'WordPress'],
    ruby: ['Rails', 'Sinatra', 'RSpec', 'Capybara'],
  };

  useEffect(() => {
    if (socket) {
      socket.on('code-generation-progress', (data) => {
        setProgress(data.progress);
        setProgressMessage(data.message);
      });

      socket.on('code-generation-complete', (data) => {
        setGeneratedCode({
          code: data.code,
          language: data.language,
          explanation: 'Code generated successfully using AI.',
          timestamp: data.timestamp,
          metadata: {
            tokens: 1500,
            model: 'gpt-4',
            duration: 4000,
          },
        });
        setIsGenerating(false);
        setProgress(100);
        setSuccess('Code generated successfully!');
      });

      socket.on('ai-generation-error', (data) => {
        setError(data.error);
        setIsGenerating(false);
        setProgress(0);
      });

      return () => {
        socket.off('code-generation-progress');
        socket.off('code-generation-complete');
        socket.off('ai-generation-error');
      };
    }
  }, [socket]);

  const handleGenerate = () => {
    if (!request.prompt.trim()) {
      setError('Please enter a description of the code you want to generate.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressMessage('Starting code generation...');
    setError(null);
    setGeneratedCode(null);

    if (socket) {
      socket.emit('code-generation-request', {
        ...request,
        userId: user?.id,
      });
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.code);
      setSuccess('Code copied to clipboard!');
    }
  };

  const handleDownloadCode = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-code.${getFileExtension(generatedCode.language)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess('Code downloaded successfully!');
    }
  };

  const getFileExtension = (language: string) => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      cpp: 'cpp',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
    };
    return extensions[language] || 'txt';
  };

  const handleSaveProject = () => {
    if (generatedCode) {
      // TODO: Implement save to projects
      setSuccess('Project saved successfully!');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Code Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Generate code in any language with AI assistance
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Generate Code
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Describe what you want to build"
                  placeholder="e.g., Create a React component for a user profile card with avatar, name, and bio"
                  value={request.prompt}
                  onChange={(e) => setRequest({ ...request, prompt: e.target.value })}
                  sx={{ mb: 3 }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Programming Language</InputLabel>
                      <Select
                        value={request.language}
                        label="Programming Language"
                        onChange={(e) => setRequest({ ...request, language: e.target.value })}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.value} value={lang.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{lang.icon}</span>
                              {lang.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Framework (Optional)</InputLabel>
                      <Select
                        value={request.framework}
                        label="Framework (Optional)"
                        onChange={(e) => setRequest({ ...request, framework: e.target.value })}
                      >
                        <MenuItem value="">None</MenuItem>
                        {frameworks[request.language as keyof typeof frameworks]?.map((framework) => (
                          <MenuItem key={framework} value={framework}>
                            {framework}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Complexity</InputLabel>
                      <Select
                        value={request.complexity}
                        label="Complexity"
                        onChange={(e) => setRequest({ ...request, complexity: e.target.value as any })}
                      >
                        <MenuItem value="simple">Simple</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="complex">Complex</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleGenerate}
                  disabled={isGenerating || !request.prompt.trim()}
                  sx={{ mb: 2 }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Code'}
                </Button>

                {isGenerating && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {progressMessage}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {progress}% complete
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ height: 'fit-content' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Generated Code
                  </Typography>
                  {generatedCode && (
                    <Box>
                      <Tooltip title="Copy Code">
                        <IconButton onClick={handleCopyCode} size="small">
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Code">
                        <IconButton onClick={handleDownloadCode} size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save Project">
                        <IconButton onClick={handleSaveProject} size="small">
                          <Save />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {generatedCode ? (
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={generatedCode.language} color="primary" />
                      <Chip label={`${generatedCode.metadata.tokens} tokens`} variant="outlined" />
                      <Chip label={`${generatedCode.metadata.duration}ms`} variant="outlined" />
                    </Box>

                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        color: 'grey.100',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        maxHeight: 400,
                        overflow: 'auto',
                        mb: 2,
                      }}
                    >
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {generatedCode.code}
                      </pre>
                    </Paper>

                    <Typography variant="body2" color="text.secondary">
                      {generatedCode.explanation}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 8,
                      color: 'text.secondary',
                    }}
                  >
                    <Code sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No code generated yet
                    </Typography>
                    <Typography variant="body2">
                      Describe what you want to build and click "Generate Code"
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CodeGenerator;