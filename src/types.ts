export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  isAiGenerated?: boolean;
  createdAt: string;
}

export type AvatarFrame = 'none' | 'gold' | 'neon' | 'cyber' | 'diamond' | 'fire' | 'emerald' | 'cosmic' | 'flame';

export interface Profile {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  frame?: AvatarFrame;
  theme: 'light' | 'dark' | 'system';
  language: string;
  settings: {
    notifications: boolean;
    aiCoachingLevel: 'standard' | 'deep' | 'aggressive';
    isProfilePublic: boolean;
    showOnlineStatus: boolean;
  };
  stats: {
    averageScore: number;
    highestScore: number;
    longestStreak: number;
    currentStreak: number;
    totalStudyHours: number;
    lastActiveDate: string | null;
  };
  achievements: string[];
  gems?: number;
  streakFreezes?: number;
  driveTokens?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    email: string;
    syncedAt?: string;
  };
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  score: number | null;
  emoji: string | null;
  title?: string | null;
  evaluation: {
    score?: number;
    emoji?: string;
    title?: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    tomorrowChallenge: string;
    strength?: string;
    encouragement?: string;
  } | null;
  isDraft: boolean;
  savedAt: string;
}

export interface StudySession {
  id: string;
  date: string;
  durationMinutes: number;
  category: string;
  sharedToFeed: boolean;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  authorEmail: string;
  authorName: string;
  authorAvatar: string;
  type: 'journal_score' | 'study_session' | 'pomodoro_summary' | 'achievement' | 'custom';
  content: string;
  audience?: 'public' | 'friends';
  metadata?: {
    score?: number;
    emoji?: string;
    studyMinutes?: number;
    studyCategory?: string;
    pomodoroCycles?: number;
    note?: string;
    achievementTitle?: string;
  };
  timestamp: string;
  likes: string[];
  reactions: { [emoji: string]: string[] };
  comments: {
    id: string;
    authorEmail: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    timestamp: string;
  }[];
}

export interface Message {
  id: string;
  senderEmail: string;
  text: string;
  timestamp: string;
  reactions: { [emoji: string]: string[] };
  read: boolean;
  audioUrl?: string;
  audioDuration?: number;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  messages: Message[];
  typingEmails: string[];
  pinnedBy: string[];
  peer?: {
    email: string;
    displayName: string;
    avatarUrl: string;
    online: boolean;
  };
}

export interface FriendRequest {
  fromEmail: string;
  toEmail: string;
  timestamp: string;
  fromUser?: Profile;
}

export interface LeaderboardRank {
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  frame?: AvatarFrame;
  score: number;
  streak: number;
  totalHours: number;
}
