// Nexus AI Platform - TypeScript Types

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: Role;
  tier: Tier;
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  description?: string;
  avatar?: string;
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  capabilities: string[];
  config?: Record<string, any>;
  isActive: boolean;
  isPublic: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  agentId: string;
  userId: string;
  title?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  tokens?: number;
  cost?: number;
  createdAt: Date;
}

export interface Tool {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon?: string;
  config: Record<string, any>;
  isActive: boolean;
  isBuiltIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: string;
  config?: Record<string, any>;
  files?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  userId: string;
  agentId?: string;
  projectId?: string;
  name: string;
  description?: string;
  steps: Record<string, any>;
  triggers?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface Deployment {
  id: string;
  userId: string;
  agentId?: string;
  projectId?: string;
  name: string;
  url?: string;
  status: DeploymentStatus;
  config?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  permissions: string[];
  isActive: boolean;
  lastUsed?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface UsageRecord {
  id: string;
  userId: string;
  type: string;
  amount: number;
  cost?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Enums
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR'
}

export enum Tier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum DeploymentStatus {
  PENDING = 'PENDING',
  BUILDING = 'BUILDING',
  DEPLOYED = 'DEPLOYED',
  FAILED = 'FAILED',
  STOPPED = 'STOPPED'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Agent Configuration types
export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  capabilities: string[];
  systemPrompt?: string;
  memoryConfig?: {
    enabled: boolean;
    maxMessages: number;
    summaryThreshold: number;
  };
  rateLimits?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

// Tool Configuration types
export interface ToolConfig {
  name: string;
  version: string;
  parameters: Record<string, any>;
  authentication?: {
    type: 'api_key' | 'oauth' | 'none';
    config: Record<string, any>;
  };
}

// Workflow Step types
export interface WorkflowStep {
  id: string;
  type: 'agent' | 'tool' | 'condition' | 'loop';
  name: string;
  config: Record<string, any>;
  inputs: string[];
  outputs: string[];
  nextSteps: string[];
}

// Project types
export interface ProjectFile {
  path: string;
  content: string;
  type: 'text' | 'binary';
  lastModified: Date;
}

export interface ProjectConfig {
  framework?: string;
  language?: string;
  dependencies?: Record<string, string>;
  buildConfig?: Record<string, any>;
  deploymentConfig?: Record<string, any>;
}

// Authentication types
export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Dashboard types
export interface DashboardStats {
  totalAgents: number;
  totalProjects: number;
  totalConversations: number;
  tokensUsed: number;
  costsThisMonth: number;
  activeDeployments: number;
}

export interface RecentActivity {
  id: string;
  type: 'agent_created' | 'project_deployed' | 'conversation_started' | 'workflow_executed';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Real-time types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface AgentResponse {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  tokens?: number;
  cost?: number;
  timestamp: Date;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Component props types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form types
export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}