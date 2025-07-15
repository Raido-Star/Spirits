import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  SparklesIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  PlusIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalProjects: 0,
    totalConversations: 0,
    tokensUsed: 0,
    costsThisMonth: 0,
    activeDeployments: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();
      
      // Fetch recent activity
      const activityResponse = await fetch('/api/dashboard/activity');
      const activityData = await activityResponse.json();
      
      setStats(statsData.data || {
        totalAgents: 12,
        totalProjects: 8,
        totalConversations: 156,
        tokensUsed: 45000,
        costsThisMonth: 23.45,
        activeDeployments: 3,
      });
      
      setRecentActivity(activityData.data || [
        {
          id: '1',
          type: 'agent_created',
          title: 'Created new agent',
          description: 'Web Developer Assistant',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          type: 'project_deployed',
          title: 'Deployed project',
          description: 'E-commerce Website',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          id: '3',
          type: 'conversation_started',
          title: 'Started conversation',
          description: 'Music Composition Agent',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
      ]);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Agent',
      description: 'Build a new AI agent with custom capabilities',
      icon: <CpuChipIcon className="h-8 w-8 text-blue-500" />,
      href: '/agents/create',
      color: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'New Project',
      description: 'Start a new application or website project',
      icon: <DocumentTextIcon className="h-8 w-8 text-green-500" />,
      href: '/projects/create',
      color: 'bg-green-500/10 border-green-500/20',
    },
    {
      title: 'Chat with Agent',
      description: 'Start a conversation with your AI agents',
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />,
      href: '/chat',
      color: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Deploy Project',
      description: 'Deploy your project to production',
      icon: <CloudArrowUpIcon className="h-8 w-8 text-orange-500" />,
      href: '/deploy',
      color: 'bg-orange-500/10 border-orange-500/20',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_created':
        return <CpuChipIcon className="h-5 w-5 text-blue-500" />;
      case 'project_deployed':
        return <CloudArrowUpIcon className="h-5 w-5 text-green-500" />;
      case 'conversation_started':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SparklesIcon className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Nexus AI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <CogIcon className="h-5 w-5 text-white" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-white/80">Here's what's happening with your AI agents and projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <CpuChipIcon className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">{stats.totalAgents}</span>
            </div>
            <p className="text-white/80 text-sm">AI Agents</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <DocumentTextIcon className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-white">{stats.totalProjects}</span>
            </div>
            <p className="text-white/80 text-sm">Projects</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">{stats.totalConversations}</span>
            </div>
            <p className="text-white/80 text-sm">Conversations</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <BoltIcon className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">{stats.tokensUsed.toLocaleString()}</span>
            </div>
            <p className="text-white/80 text-sm">Tokens Used</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <ChartBarIcon className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-white">${stats.costsThisMonth}</span>
            </div>
            <p className="text-white/80 text-sm">This Month</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <CloudArrowUpIcon className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-white">{stats.activeDeployments}</span>
            </div>
            <p className="text-white/80 text-sm">Deployments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className={`${action.color} p-6 rounded-xl border transition-all hover:scale-105 hover:border-white/40 text-left`}
              >
                <div className="mb-4">{action.icon}</div>
                <h4 className="text-white font-semibold mb-2">{action.title}</h4>
                <p className="text-white/80 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-white/80 text-sm">{activity.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-white/60 text-xs">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">API Status</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Database</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 text-sm">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">AI Models</span>
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-yellow-500 text-sm">Degraded</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage This Month */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Usage This Month</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">API Calls</span>
                    <span className="text-white">1,234 / 10,000</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">Storage</span>
                    <span className="text-white">2.1 GB / 10 GB</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/80">Bandwidth</span>
                    <span className="text-white">45 GB / 100 GB</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;