import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { io, Socket } from 'socket.io-client';

// Components
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import CodeGenerator from './pages/CodeGenerator/CodeGenerator';
import MusicComposer from './pages/MusicComposer/MusicComposer';
import GameCreator from './pages/GameCreator/GameCreator';
import WebsiteBuilder from './pages/WebsiteBuilder/WebsiteBuilder';
import ImageGenerator from './pages/ImageGenerator/ImageGenerator';
import TextGenerator from './pages/TextGenerator/TextGenerator';
import AIChat from './pages/AIChat/AIChat';
import Projects from './pages/Projects/Projects';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Analytics from './pages/Analytics/Analytics';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeContext } from './contexts/ThemeContext';

// Types
import { User } from './types/user';

// Create theme
const createAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: mode === 'dark' ? '#0f0f23' : '#f8fafc',
      paper: mode === 'dark' ? '#1a1a2e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#1e293b',
      secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'dark' 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [socket, setSocket] = useState<Socket | null>(null);

  const theme = createAppTheme(themeMode);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join-user', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <SocketProvider socket={socket}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/code" element={
                  <ProtectedRoute>
                    <Layout>
                      <CodeGenerator />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/music" element={
                  <ProtectedRoute>
                    <Layout>
                      <MusicComposer />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/games" element={
                  <ProtectedRoute>
                    <Layout>
                      <GameCreator />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/websites" element={
                  <ProtectedRoute>
                    <Layout>
                      <WebsiteBuilder />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/images" element={
                  <ProtectedRoute>
                    <Layout>
                      <ImageGenerator />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/text" element={
                  <ProtectedRoute>
                    <Layout>
                      <TextGenerator />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Layout>
                      <AIChat />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects" element={
                  <ProtectedRoute>
                    <Layout>
                      <Projects />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </Box>
        </ThemeProvider>
      </SocketProvider>
    </ThemeContext.Provider>
  );
};

// Root App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
