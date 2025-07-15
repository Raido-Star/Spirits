export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  subscription: 'free' | 'basic' | 'pro' | 'enterprise';
  profile: UserProfile;
  settings: UserSettings;
  stats: UserStats;
  createdAt: string;
  lastLogin: string;
}

export interface UserProfile {
  avatar: string | null;
  bio: string;
  website: string;
  location: string;
  skills: string[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
  privacy: PrivacySettings;
  ai: AISettings;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  allowMessages: boolean;
}

export interface AISettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
}

export interface UserStats {
  projectsCreated: number;
  aiRequests: number;
  totalTokens: number;
  memberSince: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}