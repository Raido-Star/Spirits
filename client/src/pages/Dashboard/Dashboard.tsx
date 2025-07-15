import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Code,
  MusicNote,
  SportsEsports,
  Language,
  Image,
  TextFields,
  TrendingUp,
  PlayArrow,
  Download,
  Share,
  MoreVert,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalProjects: number;
  aiRequests: number;
  totalTokens: number;
  successRate: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'failed';
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 15,
    aiRequests: 234,
    totalTokens: 1250000,
    successRate: 94.3,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'music',
      title: 'Electronic Dance Track',
      description: 'Generated a 3-minute electronic track with synth and drums',
      timestamp: '2 hours ago',
      status: 'completed',
    },
    {
      id: '2',
      type: 'code',
      title: 'React Component',
      description: 'Created a responsive navigation component with TypeScript',
      timestamp: '4 hours ago',
      status: 'completed',
    },
    {
      id: '3',
      type: 'image',
      title: 'Landscape Artwork',
      description: 'Generated a fantasy landscape with mountains and sunset',
      timestamp: '6 hours ago',
      status: 'completed',
    },
    {
      id: '4',
      type: 'game',
      title: 'Puzzle Game',
      description: 'Creating a brain teaser puzzle game for mobile',
      timestamp: '1 day ago',
      status: 'in-progress',
    },
  ]);

  const quickActions = [
    {
      title: 'Generate Code',
      icon: <Code />,
      color: '#6366f1',
      path: '/code',
      description: 'Create applications and scripts',
    },
    {
      title: 'Compose Music',
      icon: <MusicNote />,
      color: '#ec4899',
      path: '/music',
      description: 'Generate original music tracks',
    },
    {
      title: 'Create Games',
      icon: <SportsEsports />,
      color: '#10b981',
      path: '/games',
      description: 'Build interactive games',
    },
    {
      title: 'Build Websites',
      icon: <Language />,
      color: '#f59e0b',
      path: '/websites',
      description: 'Design and deploy websites',
    },
    {
      title: 'Generate Images',
      icon: <Image />,
      color: '#8b5cf6',
      path: '/images',
      description: 'Create stunning visuals',
    },
    {
      title: 'Write Content',
      icon: <TextFields />,
      color: '#ef4444',
      path: '/text',
      description: 'Generate written content',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code />;
      case 'music':
        return <MusicNote />;
      case 'game':
        return <SportsEsports />;
      case 'website':
        return <Language />;
      case 'image':
        return <Image />;
      case 'text':
        return <TextFields />;
      default:
        return <Code />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ready to create something amazing with AI?
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Code />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary">
                    Projects
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.totalProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total created
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary">
                    AI Requests
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.aiRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <TextFields />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary">
                    Tokens Used
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {(stats.totalTokens / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total processed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary">
                    Success Rate
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.successRate}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.successRate}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={action.title}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: action.color,
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {action.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PlayArrow />}
                    >
                      Start
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                    Recent Activity
                  </Typography>
                  <Button variant="text" size="small">
                    View All
                  </Button>
                </Box>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        borderBottom: index < recentActivity.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        py: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getTypeIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {activity.timestamp}
                              </Typography>
                              <Chip
                                label={activity.status}
                                size="small"
                                color={getStatusColor(activity.status) as any}
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <Box>
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                        <IconButton size="small">
                          <Share />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Subscription Status
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Chip
                    label={user?.subscription.toUpperCase()}
                    color="primary"
                    size="large"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Current Plan
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    AI Requests Used
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.aiRequests / 500) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {stats.aiRequests} / 500 requests
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth>
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard;