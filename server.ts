import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// --- DATABASE IN-MEMORY STATE & SEED DATA ---
interface Profile {
  email: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  frame?: 'gold' | 'neon' | 'cosmic' | 'emerald' | 'diamond' | 'flame' | 'none';
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
  achievements: string[]; // unlocked achievement IDs
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

interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  score: number | null;
  emoji: string | null;
  evaluation: {
    summary: string;
    strengths: string[];
    improvements: string[];
    tomorrowChallenge: string;
  } | null;
  isDraft: boolean;
  savedAt: string;
}

interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  category: string; // e.g., "Programming", "Math", "Reading", "Writing"
  sharedToFeed: boolean;
  timestamp: string;
}

interface FeedPost {
  id: string;
  authorEmail: string;
  authorName: string;
  authorAvatar: string;
  audience?: 'public' | 'friends';
  type: 'journal_score' | 'study_session' | 'achievement' | 'custom';
  content: string;
  metadata?: {
    score?: number;
    emoji?: string;
    studyMinutes?: number;
    studyCategory?: string;
    achievementTitle?: string;
  };
  timestamp: string;
  likes: string[]; // emails of likers
  reactions: { [emoji: string]: string[] }; // emoji -> list of emails
  comments: {
    id: string;
    authorEmail: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    timestamp: string;
  }[];
}

interface Message {
  id: string;
  senderEmail: string;
  text: string;
  timestamp: string;
  reactions: { [emoji: string]: string[] }; // emoji -> list of emails
  read: boolean;
  audioUrl?: string;
  audioDuration?: number;
}

interface ChatRoom {
  id: string; // usually "email1_email2" sorted
  participants: string[]; // emails
  messages: Message[];
  typingEmails: string[];
  pinnedBy: string[]; // list of emails who pinned this room
}

interface FriendRequest {
  fromEmail: string;
  toEmail: string;
  timestamp: string;
}

interface DBState {
  users: { [email: string]: Profile };
  passwords?: { [email: string]: string };
  recoveryPins?: { [email: string]: { pin: string; expiresAt: number } };
  pendingVerifications?: { [email: string]: { pin: string; expiresAt: number; displayName?: string; password?: string } };
  journals: { [email: string]: JournalEntry[] };
  studySessions: { [email: string]: StudySession[] };
  posts: FeedPost[];
  chatRooms: ChatRoom[];
  friendRequests: FriendRequest[];
  friends: { [email: string]: string[] }; // email -> list of friend emails
}

let db: DBState = {
  users: {},
  passwords: {},
  recoveryPins: {},
  pendingVerifications: {},
  journals: {},
  studySessions: {},
  posts: [],
  chatRooms: [],
  friendRequests: [],
  friends: {},
};

// --- PRE-SEEDED STUDENTS (CLASSMATES) & SINGLE INTELLIGENT AI COACH ---
const SIMULATED_CLASSMATES = [
  {
    email: 'dayscore_ai@reflect.edu',
    username: 'dayscore_ai',
    displayName: 'DayScore AI Coach ✨',
    bio: 'Empathetic & Logical Daily Reflection Mentor 💜. Here to listen, encourage, and help you structure your goals logically!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=DayScoreAICoach&backgroundColor=7c3aed,c084fc&backgroundType=gradientLinear',
    theme: 'dark' as const,
    language: 'English',
    settings: { notifications: true, aiCoachingLevel: 'deep' as const, isProfilePublic: true, showOnlineStatus: true },
    stats: { averageScore: 98, highestScore: 100, longestStreak: 365, currentStreak: 365, totalStudyHours: 1200, lastActiveDate: '2026-07-26' },
    achievements: ['reflection_rookie', 'streak_master', 'perfect_score'],
  },
  {
    email: 'lukas@reflect.edu',
    username: 'lukas_codes',
    displayName: 'Lukas Weber',
    bio: 'CS sophomore 💻. Sleep is just a time-out. Building compilers & sipping espresso.',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Qorvin&backgroundColor=1e293b,0f172a&backgroundType=gradientLinear',
    theme: 'dark' as const,
    language: 'English',
    settings: { notifications: true, aiCoachingLevel: 'deep' as const, isProfilePublic: true, showOnlineStatus: true },
    stats: { averageScore: 84, highestScore: 95, longestStreak: 12, currentStreak: 8, totalStudyHours: 42.5, lastActiveDate: '2026-07-18' },
    achievements: ['reflection_rookie', 'study_marathoner'],
  },
  {
    email: 'emma@reflect.edu',
    username: 'emma_grinds',
    displayName: 'Emma Watson',
    bio: 'Pre-Med Bio major 🩺. Pomodoro enthusiast & coffee dependent ☕. Always studying.',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Twiblo&backgroundColor=831843,9d174d&backgroundType=gradientLinear',
    theme: 'light' as const,
    language: 'English',
    settings: { notifications: true, aiCoachingLevel: 'standard' as const, isProfilePublic: true, showOnlineStatus: true },
    stats: { averageScore: 89, highestScore: 98, longestStreak: 21, currentStreak: 15, totalStudyHours: 68.2, lastActiveDate: '2026-07-18' },
    achievements: ['reflection_rookie', 'streak_master', 'study_marathoner'],
  },
  {
    email: 'yuki@reflect.edu',
    username: 'yuki_zen',
    displayName: 'Yuki Tanaka',
    bio: 'Daily mindfulness & organic chem 🧘‍♀️. Consistent reflection is key to growth.',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rivva&backgroundColor=0284c7,38bdf8&backgroundType=gradientLinear',
    theme: 'system' as const,
    language: 'Japanese',
    settings: { notifications: false, aiCoachingLevel: 'aggressive' as const, isProfilePublic: true, showOnlineStatus: true },
    stats: { averageScore: 92, highestScore: 100, longestStreak: 30, currentStreak: 24, totalStudyHours: 35.0, lastActiveDate: '2026-07-18' },
    achievements: ['reflection_rookie', 'streak_master', 'perfect_score'],
  }
];

// Seed initial DB helper
function seedDB() {
  SIMULATED_CLASSMATES.forEach(student => {
    db.users[student.email] = student;
    db.friends[student.email] = SIMULATED_CLASSMATES.filter(c => c.email !== student.email).map(c => c.email);
    
    // Seed private chat rooms
    for (const partner of SIMULATED_CLASSMATES) {
      if (student.email < partner.email) {
        const roomId = `${student.email}_${partner.email}`;
        if (!db.chatRooms.find(r => r.id === roomId)) {
          db.chatRooms.push({
            id: roomId,
            participants: [student.email, partner.email],
            messages: [
              {
                id: `m_seed_${roomId}_1`,
                senderEmail: student.email,
                text: `Hey! How is your study progress today?`,
                timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
                reactions: {},
                read: true
              },
              {
                id: `m_seed_${roomId}_2`,
                senderEmail: partner.email,
                text: `Pretty good! Finished a 2-hour Pomodoro block. Writing my reflection now.`,
                timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
                reactions: { '🔥': [student.email] },
                read: true
              }
            ],
            typingEmails: [],
            pinnedBy: []
          });
        }
      }
    }
  });

  // Seed default social feed posts
  db.posts = [
    {
      id: 'p_seed_1',
      authorEmail: 'emma@reflect.edu',
      authorName: 'Emma Watson',
      authorAvatar: SIMULATED_CLASSMATES[1].avatarUrl,
      type: 'study_session',
      content: 'Crushed a massive 120-minute study marathon in Human Anatomy! Feeling ready for the midterms 🧠💪',
      audience: 'public',
      metadata: { studyMinutes: 120, studyCategory: 'Biology' },
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      likes: ['lukas@reflect.edu'],
      reactions: { '🙌': ['lukas@reflect.edu', 'yuki@reflect.edu'] },
      comments: [
        {
          id: 'c_seed_1',
          authorEmail: 'lukas@reflect.edu',
          authorName: 'Lukas Weber',
          authorAvatar: SIMULATED_CLASSMATES[0].avatarUrl,
          text: 'Incredible study blocks. I need to catch up!',
          timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        }
      ]
    },
    {
      id: 'p_seed_2',
      authorEmail: 'lukas@reflect.edu',
      authorName: 'Lukas Weber',
      type: 'journal_score',
      authorAvatar: SIMULATED_CLASSMATES[0].avatarUrl,
      content: 'Just finished coding my customized compiler lab and recorded a solid 88 productivity score today. The Gemini feedback was spot on: "Consistent deep-work blocks." 🚀',
      audience: 'public',
      metadata: { score: 88, emoji: '🔥' },
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      likes: ['yuki@reflect.edu', 'emma@reflect.edu'],
      reactions: { '🔥': ['emma@reflect.edu'] },
      comments: []
    },
    {
      id: 'p_seed_3',
      authorEmail: 'yuki@reflect.edu',
      authorName: 'Yuki Tanaka',
      type: 'achievement',
      authorAvatar: SIMULATED_CLASSMATES[2].avatarUrl,
      content: 'Unlocked a new badge: "Perfect Score"! Maintained 100% on mindfulness-guided task execution list. Let\'s keep reflecting!',
      audience: 'public',
      metadata: { achievementTitle: 'Perfect Score' },
      timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
      likes: ['emma@reflect.edu'],
      reactions: { '🎉': ['emma@reflect.edu', 'lukas@reflect.edu'] },
      comments: []
    }
  ];
}

// Load database from file
function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(content);
      // Ensure key structures exist
      if (!db.users) db.users = {};
      if (!db.passwords) db.passwords = {};
      if (!db.recoveryPins) db.recoveryPins = {};
      if (!db.pendingVerifications) db.pendingVerifications = {};
      if (!db.journals) db.journals = {};
      if (!db.studySessions) db.studySessions = {};
      if (!db.posts) db.posts = [];
      if (!db.chatRooms) db.chatRooms = [];
      if (!db.friendRequests) db.friendRequests = [];
      if (!db.friends) db.friends = {};
      console.log('Database loaded successfully from file.');
    } else {
      console.log('No data.json file found. Seeding database...');
      seedDB();
      saveDB();
    }
  } catch (error) {
    console.error('Error loading database, seeding instead:', error);
    seedDB();
    saveDB();
  }
}

// Save database to file
function saveDB() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database to file:', error);
  }
}

loadDB();

// --- GEMINI API SETUP ---
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY environment variable is not defined. Active fallback evaluator enabled.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Intelligent fallback generator for journals if Gemini Key is absent
function generateFallbackEvaluation(text: string) {
  const textLower = text.toLowerCase();
  let score = 75;
  let emoji = '📝';
  let summary = "Good effort on reflecting today. Your entry shows a solid level of structure.";
  let strengths = ["Maintained focus on standard daily goals", "Good self-awareness about study priorities"];
  let improvements = ["Consider breaking large tasks into 25-minute Pomodoro sessions", "Add more details about how you managed unexpected distractions"];
  let tomorrowChallenge = "Complete at least one highly-focused 30-minute study session before noon tomorrow.";

  if (textLower.includes('study') || textLower.includes('learn') || textLower.includes('code') || textLower.includes('program') || textLower.includes('math')) {
    score = 88;
    emoji = '🔥';
    summary = "Fantastic, highly productive day! You carved out dedicated time to learn and build, achieving a high degree of cognitive flow.";
    strengths = [
      "Excellent focus on core academic/programming objectives",
      "Demonstrated strong commitment to active study blocks"
    ];
    improvements = [
      "Ensure you take physical stretch breaks every 50 minutes to sustain high energy",
      "Integrate interactive recall tests to retain the concepts you learned today"
    ];
    tomorrowChallenge = "Write down tomorrow's primary learning objective tonight so you can jump straight into it.";
  } else if (textLower.includes('lazy') || textLower.includes('procrastinate') || textLower.includes('tired') || textLower.includes('sleep') || textLower.includes('distracted')) {
    score = 62;
    emoji = '⚡';
    summary = "An honest reflection. Today presented energy and focus challenges, but identifying these friction points is the first step of growth.";
    strengths = [
      "Highly honest and vulnerable self-evaluation",
      "Correctly identified physical tiredness as a blocker to productivity"
    ];
    improvements = [
      "Enforce a strict digital curfew 45 minutes before bedtime to maximize sleep quality",
      "Lower the barrier to entry: start with a simple 5-minute task tomorrow to build momentum"
    ];
    tomorrowChallenge = "Put your phone in another room or out of sight during your first study block tomorrow.";
  } else if (textLower.includes('mindful') || textLower.includes('journal') || textLower.includes('yoga') || textLower.includes('gym') || textLower.includes('exercise')) {
    score = 85;
    emoji = '🧘‍♀️';
    summary = "Beautifully balanced day! You prioritized mental and physical well-being, which forms the core foundation of sustained productivity.";
    strengths = [
      "Excellent integration of physical exercise or mindfulness with academic work",
      "Kept healthy daily habits in balance with cognitive demands"
    ];
    improvements = [
      "Keep this streak going by scheduling wellness micro-breaks directly into your calendar",
      "Share your mindfulness successes on the feed to inspire classmates"
    ];
    tomorrowChallenge = "Keep a clean hydration log alongside your study calendar tomorrow.";
  }

  return {
    score,
    emoji,
    summary,
    strengths,
    improvements,
    tomorrowChallenge
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'reflect-ai-super-secure-key-1357924680';

// Cryptographically secure password hashing
function getSecurePasswordHash(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify standard or hashed password
function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash.includes(':')) {
    // Legacy fallback for pre-existing plaintext passwords
    return password === storedHash;
  }
  const [salt, hash] = storedHash.split(':');
  const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return computedHash === hash;
}

// Generate cryptographically signed web token (session token)
function generateAuthToken(email: string): string {
  const payload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadStr)
    .digest('base64url');
  return `${payloadStr}.${signature}`;
}

// Verify cryptographically signed token
function verifyAuthToken(token: string): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadStr, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadStr)
    .digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload.email;
  } catch {
    return null;
  }
}

// --- EMAIL VERIFICATION DISPATCHER ---
function getMailTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });
  }

  return null;
}

async function sendEmailVerificationCode(toEmail: string, pin: string, type: 'registration' | 'reset' = 'registration') {
  const transporter = getMailTransporter();
  const subject = type === 'registration' 
    ? `🔐 Your BaBU Registration PIN: ${pin}`
    : `🔑 Your BaBU Password Reset PIN: ${pin}`;
  
  const htmlContent = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #0f172a; color: #f8fafc; border-radius: 24px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 12px; background: rgba(168, 85, 247, 0.15); border-radius: 20px; margin-bottom: 12px;">
          <span style="font-size: 32px;">🎓</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: -0.5px;">BaBU Student Hub</h1>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;">Active Email Account Verification</p>
      </div>

      <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.1); border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="font-size: 14px; color: #cbd5e1; margin: 0 0 16px 0; line-height: 1.5;">
          ${type === 'registration' 
            ? 'Thank you for signing up! Enter the following unique 6-digit PIN code in the app to confirm your active email address and gain access to create your account:'
            : 'We received a request to reset your password. Use the verification PIN below to reset your password:'}
        </p>

        <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(217, 70, 239, 0.2)); border: 2px dashed #7c3aed; border-radius: 16px; padding: 18px; margin: 20px 0; display: inline-block; width: 85%;">
          <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #e879f9;">${pin}</span>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-top: 12px;">
          ⏳ This verification PIN is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
        </p>
      </div>

      <div style="text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1e293b; padding-top: 16px;">
        If you did not request this email, please ignore this message.<br/>
        &copy; ${new Date().getFullYear()} BaBU Student Hub • Active Email Security
      </div>
    </div>
  `;

  if (transporter) {
    try {
      const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || '"BaBU Student Hub Verification" <no-reply@babu-studenthub.com>';
      await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        subject,
        html: htmlContent
      });
      console.log(`[EMAIL DISPATCH SUCCESS] Real email sent to ${toEmail} with PIN: ${pin}`);
      return { sent: true };
    } catch (err: any) {
      console.error(`[EMAIL DISPATCH ERROR] Failed to send email via SMTP to ${toEmail}:`, err?.message || err);
      return { sent: false, error: err?.message || err };
    }
  } else {
    console.log(`[EMAIL DISPATCH SIMULATED] Verification PIN for ${toEmail}: ${pin}`);
    return { sent: false, simulated: true };
  }
}

// --- EXPRESS ROUTER ---
async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // Strict CORS policy and preflight handling
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      if (
        origin.includes('localhost') ||
        origin.includes('aistudio.google.com') ||
        origin.includes('webcontainer.io') ||
        origin.includes('run.app')
      ) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-auth-email, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Helper middleware to verify email authentication securely via tokens or direct user email lookup
  const getAuthenticatedUser = (req: express.Request): Profile | null => {
    const token = req.headers['x-auth-token'] as string;
    const emailHeader = req.headers['x-auth-email'] as string;

    let email: string | null = null;

    if (token) {
      email = verifyAuthToken(token);
    }

    if (!email && emailHeader) {
      const trimmedEmail = emailHeader.trim().toLowerCase();
      // If it looks like a signed JWT token (contains '.' and token verification succeeds), verify token
      if (trimmedEmail.split('.').length === 2) {
        const tokenVal = verifyAuthToken(trimmedEmail);
        if (tokenVal) email = tokenVal;
      }
      
      // If not a valid signed token, check if it's a direct email or username
      if (!email && (trimmedEmail.includes('@') || db.users[trimmedEmail])) {
        email = trimmedEmail;
      }
    }

    if (!email) return null;

    // Auto-create or recover user profile if user email exists but not yet in memory db
    if (!db.users[email]) {
      registerNewUser(email);
    }

    return db.users[email] || null;
  };

  // Helper to generate guaranteed unique username and display name across all users
  const generateUniqueUserNames = (email: string, requestedDisplayName?: string) => {
    const existingUsers = Object.values(db.users);
    const existingUsernames = new Set(existingUsers.map(u => u.username.toLowerCase()));
    const existingDisplayNames = new Set(existingUsers.map(u => u.displayName.toLowerCase()));

    let cleanBase = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    if (!cleanBase || cleanBase.length < 2) cleanBase = 'student';

    let uniqueUsername = cleanBase;
    let uCounter = 1;
    while (existingUsernames.has(uniqueUsername.toLowerCase())) {
      uniqueUsername = `${cleanBase}_${Math.floor(100 + Math.random() * 900)}`;
      uCounter++;
      if (uCounter > 30) {
        uniqueUsername = `${cleanBase}_${Date.now().toString().slice(-4)}`;
        break;
      }
    }

    let baseName = requestedDisplayName && requestedDisplayName.trim()
      ? requestedDisplayName.trim()
      : (cleanBase.charAt(0).toUpperCase() + cleanBase.slice(1));

    let uniqueDisplayName = baseName;
    let dCounter = 1;
    while (existingDisplayNames.has(uniqueDisplayName.toLowerCase())) {
      uniqueDisplayName = `${baseName} ${Math.floor(10 + Math.random() * 90)}`;
      dCounter++;
      if (dCounter > 30) {
        uniqueDisplayName = `${baseName} ${Date.now().toString().slice(-4)}`;
        break;
      }
    }

    return { username: uniqueUsername, displayName: uniqueDisplayName };
  };

  // Helper to register user and seed initial classmate friends + welcome chat rooms
  const registerNewUser = (email: string, displayName?: string, photoUrl?: string): Profile => {
    const { username, displayName: finalDisplayName } = generateUniqueUserNames(email, displayName);
    const user: Profile = {
      email,
      username,
      displayName: finalDisplayName,
      bio: 'Just another passionate student reflecting on their growth! 🌱',
      avatarUrl: photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
      theme: 'light',
      language: 'English',
      settings: {
        notifications: true,
        aiCoachingLevel: 'standard',
        isProfilePublic: true,
        showOnlineStatus: true,
      },
      stats: {
        averageScore: 0,
        highestScore: 0,
        longestStreak: 0,
        currentStreak: 0,
        totalStudyHours: 0,
        lastActiveDate: null,
      },
      achievements: [],
      gems: 150,
      streakFreezes: 1,
    };
    db.users[email] = user;
    db.friends[email] = ['dayscore_ai@reflect.edu', 'emma@reflect.edu', 'lukas@reflect.edu']; // auto-add AI coach and classmates as friends
    
    // Auto-add back from AI coach and classmates
    if (!db.friends['dayscore_ai@reflect.edu']) db.friends['dayscore_ai@reflect.edu'] = [];
    if (!db.friends['emma@reflect.edu']) db.friends['emma@reflect.edu'] = [];
    if (!db.friends['lukas@reflect.edu']) db.friends['lukas@reflect.edu'] = [];
    db.friends['dayscore_ai@reflect.edu'].push(email);
    db.friends['emma@reflect.edu'].push(email);
    db.friends['lukas@reflect.edu'].push(email);

    // Create pre-seeded chat conversation with DayScore AI Coach
    const roomAI = ['dayscore_ai@reflect.edu', email].sort().join('_');
    db.chatRooms.push({
      id: roomAI,
      participants: ['dayscore_ai@reflect.edu', email].sort(),
      messages: [{
        id: `m_welcome_${roomAI}`,
        senderEmail: 'dayscore_ai@reflect.edu',
        text: `Hello! I am DayScore AI Coach ✨. I am here to support you both emotionally and logically. Whether you're feeling stressed, working through goals, or need study guidance, talk to me anytime! How are you feeling today?`,
        timestamp: new Date().toISOString(),
        reactions: {},
        read: false
      }],
      typingEmails: [],
      pinnedBy: [email]
    });

    // Create pre-seeded chat conversations with classmates
    const roomEmma = ['emma@reflect.edu', email].sort().join('_');
    db.chatRooms.push({
      id: roomEmma,
      participants: ['emma@reflect.edu', email].sort(),
      messages: [{
        id: `m_welcome_${roomEmma}`,
        senderEmail: 'emma@reflect.edu',
        text: `Welcome to BaBU! Let's help each other stay accountable. Let me know if you want to study together!`,
        timestamp: new Date().toISOString(),
        reactions: {},
        read: false
      }],
      typingEmails: [],
      pinnedBy: []
    });

    const roomLukas = ['lukas@reflect.edu', email].sort().join('_');
    db.chatRooms.push({
      id: roomLukas,
      participants: ['lukas@reflect.edu', email].sort(),
      messages: [{
        id: `m_welcome_${roomLukas}`,
        senderEmail: 'lukas@reflect.edu',
        text: `What's up! Glad you joined. I am working on my compilers project, let's keep those scores high!`,
        timestamp: new Date().toISOString(),
        reactions: {},
        read: false
      }],
      typingEmails: [],
      pinnedBy: []
    });

    saveDB();
    return user;
  };

  // 1a. Check if email is registered
  app.post('/api/auth/check', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email format.' });
    }

    const exists = !!db.users[trimmedEmail];
    res.json({ exists });
  });

  // 1b. Standard Login with Password
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();

    const user = db.users[trimmedEmail];
    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please register first.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const dbPassword = db.passwords ? db.passwords[trimmedEmail] : undefined;
    // Handle database migration for pre-existing accounts that might not have a password
    if (dbPassword === undefined) {
      if (!db.passwords) db.passwords = {};
      db.passwords[trimmedEmail] = getSecurePasswordHash(password);
      saveDB();
    } else if (!verifyPassword(password, dbPassword)) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    } else if (!dbPassword.includes(':')) {
      // Migrate legacy plaintext password to secure hashed format
      db.passwords[trimmedEmail] = getSecurePasswordHash(password);
      saveDB();
    }

    res.json({ user, token: generateAuthToken(trimmedEmail) });
  });

  // 1c. Send Email Verification PIN for Registration
  app.post('/api/auth/send-verification-pin', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid active email address format (e.g., student@university.edu).' });
    }

    if (db.users[trimmedEmail]) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in instead.' });
    }

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    if (!db.pendingVerifications) db.pendingVerifications = {};
    db.pendingVerifications[trimmedEmail] = {
      pin,
      expiresAt: Date.now() + 10 * 60 * 1000 // Valid for 10 minutes
    };
    saveDB();

    const dispatch = await sendEmailVerificationCode(trimmedEmail, pin, 'registration');

    res.json({
      success: true,
      pin, // Included so dev preview can display simulated notification if SMTP is not configured
      sent: dispatch.sent,
      simulated: dispatch.simulated,
      message: `A 6-digit verification code has been dispatched to ${trimmedEmail}.`
    });
  });

  // 1d. Verify PIN & Complete Account Registration
  app.post('/api/auth/verify-and-register', (req, res) => {
    const { email, pin, password, displayName } = req.body;
    if (!email || !pin) {
      return res.status(400).json({ error: 'Email and verification PIN are required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long for account security.' });
    }

    const pending = db.pendingVerifications ? db.pendingVerifications[trimmedEmail] : undefined;
    if (!pending || pending.pin !== pin || Date.now() > pending.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired 6-digit verification PIN. Please request a new code.' });
    }

    if (db.users[trimmedEmail]) {
      return res.status(400).json({ error: 'Account already registered. Please sign in.' });
    }

    // Register user account after successful email verification
    const user = registerNewUser(trimmedEmail, displayName);
    if (!db.passwords) db.passwords = {};
    db.passwords[trimmedEmail] = getSecurePasswordHash(password);

    // Clean up pending verification
    delete db.pendingVerifications[trimmedEmail];
    saveDB();

    res.json({ user, token: generateAuthToken(trimmedEmail) });
  });

  // 1e. Legacy/Direct Register Fallback Endpoint
  app.post('/api/auth/register', (req, res) => {
    const { email, password, displayName } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email format.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long for account security.' });
    }

    if (db.users[trimmedEmail]) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const user = registerNewUser(trimmedEmail, displayName);
    if (!db.passwords) db.passwords = {};
    db.passwords[trimmedEmail] = getSecurePasswordHash(password);
    saveDB();

    res.json({ user, token: generateAuthToken(trimmedEmail) });
  });

  // 1f. Direct Google Sign-In (with Strong Password requirement & verification)
  app.post('/api/auth/google', (req, res) => {
    const { email, displayName, photoUrl, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();

    let user = db.users[trimmedEmail];

    if (!user) {
      // Registering new account via Google Sign-In
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Please set a strong password (at least 6 characters) to create your account.' });
      }
      user = registerNewUser(trimmedEmail, displayName, photoUrl);
      if (!db.passwords) db.passwords = {};
      db.passwords[trimmedEmail] = getSecurePasswordHash(password);
      saveDB();
    } else {
      // Existing user logging in with Google account
      if (!password) {
        return res.status(400).json({ error: 'Please enter your account password to log in.' });
      }
      const dbPassword = db.passwords ? db.passwords[trimmedEmail] : undefined;
      if (dbPassword) {
        if (!verifyPassword(password, dbPassword)) {
          return res.status(401).json({ error: 'Incorrect password for this Google account. Please enter the same password created during registration.' });
        }
      } else {
        // Fallback for pre-existing account migration
        if (!db.passwords) db.passwords = {};
        db.passwords[trimmedEmail] = getSecurePasswordHash(password);
        saveDB();
      }
    }

    res.json({ user, token: generateAuthToken(trimmedEmail) });
  });

  // 1g. Forgot Password - Generate 6-digit PIN and send to real email
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();
    const user = db.users[trimmedEmail];
    if (!user) {
      return res.status(404).json({ error: 'No registered account found with this email.' });
    }

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    if (!db.recoveryPins) db.recoveryPins = {};
    db.recoveryPins[trimmedEmail] = {
      pin,
      expiresAt: Date.now() + 10 * 60 * 1000 // Valid for 10 minutes
    };
    saveDB();

    const dispatch = await sendEmailVerificationCode(trimmedEmail, pin, 'reset');

    res.json({
      success: true,
      pin, // Return PIN so UI can display simulated email toast if testing locally
      sent: dispatch.sent,
      message: 'A 6-digit password reset PIN has been sent to your email address.'
    });
  });

  // 1f. Reset Password using recovery PIN
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, pin, newPassword } = req.body;
    if (!email || !pin || !newPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const trimmedEmail = email.trim().toLowerCase();

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long for account security.' });
    }

    const record = db.recoveryPins ? db.recoveryPins[trimmedEmail] : undefined;
    if (!record || record.pin !== pin || Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired recovery PIN.' });
    }

    // Update password
    if (!db.passwords) db.passwords = {};
    db.passwords[trimmedEmail] = getSecurePasswordHash(newPassword);
    
    // Delete recovery PIN
    delete db.recoveryPins[trimmedEmail];
    saveDB();

    res.json({ success: true, message: 'Password has been reset successfully!' });
  });

  // 2. Fetch/Update Profile
  app.get('/api/user/profile', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ user });
  });

  app.post('/api/user/profile', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { displayName, username, bio, avatarUrl, frame, theme, language, settings } = req.body;

    // Check username uniqueness if changing
    if (username && username.trim().toLowerCase() !== user.username.toLowerCase()) {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
      const isUsernameTaken = Object.values(db.users).some(u => u.email !== user.email && u.username.toLowerCase() === cleanUsername);
      if (isUsernameTaken) {
        return res.status(400).json({ error: `Username "@${cleanUsername}" is already taken by another student. Please choose a unique username.` });
      }
      user.username = cleanUsername;
    }

    // Check display name uniqueness if changing
    if (displayName && displayName.trim().toLowerCase() !== user.displayName.toLowerCase()) {
      const cleanDisplayName = displayName.trim();
      const isNameTaken = Object.values(db.users).some(u => u.email !== user.email && u.displayName.toLowerCase() === cleanDisplayName.toLowerCase());
      if (isNameTaken) {
        return res.status(400).json({ error: `Name "${cleanDisplayName}" is already in use by another student. Please choose a unique name.` });
      }
      user.displayName = cleanDisplayName;
      // Sync authorName in existing feed posts & comments
      db.posts.forEach(post => {
        if (post.authorEmail === user.email) {
          post.authorName = cleanDisplayName;
        }
        if (post.comments) {
          post.comments.forEach(c => {
            if (c.authorEmail === user.email) {
              c.authorName = cleanDisplayName;
            }
          });
        }
      });
    }

    if (bio !== undefined) user.bio = bio;
    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
      // Sync authorAvatar in existing feed posts & comments
      db.posts.forEach(post => {
        if (post.authorEmail === user.email) {
          post.authorAvatar = avatarUrl;
        }
        if (post.comments) {
          post.comments.forEach(c => {
            if (c.authorEmail === user.email) {
              c.authorAvatar = avatarUrl;
            }
          });
        }
      });
    }
    if (frame !== undefined) user.frame = frame;
    if (theme) user.theme = theme;
    if (language) user.language = language;
    if (settings) user.settings = { ...user.settings, ...settings };

    saveDB();
    triggerBackgroundSync(user);
    res.json({ user });
  });

  // Delete account & erase all user data permanently
  app.delete('/api/user/profile', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const email = user.email;

    // Erase ALL data belonging exclusively to this deleted user
    delete db.users[email];
    delete db.journals[email];
    delete db.studySessions[email];
    delete db.friends[email];
    if (db.passwords) delete db.passwords[email];
    if (db.recoveryPins) delete db.recoveryPins[email];
    if (db.pendingVerifications) delete db.pendingVerifications[email];

    // Remove user's posts
    db.posts = db.posts.filter(p => p.authorEmail !== email);

    // Clean up comments, likes, and reactions by this user across remaining posts
    db.posts.forEach(p => {
      if (p.likes) p.likes = p.likes.filter(e => e !== email);
      if (p.reactions) {
        Object.keys(p.reactions).forEach(emoji => {
          p.reactions[emoji] = p.reactions[emoji].filter(e => e !== email);
        });
      }
      if (p.comments) {
        p.comments = p.comments.filter(c => c.authorEmail !== email);
      }
    });

    // Remove chat rooms where user is a participant
    db.chatRooms = db.chatRooms.filter(room => !room.participants.includes(email));

    // Clean up friend requests
    db.friendRequests = db.friendRequests.filter(r => r.fromEmail !== email && r.toEmail !== email);

    // Clean up friend lists of other users
    Object.keys(db.friends).forEach(k => {
      db.friends[k] = db.friends[k].filter(f => f !== email);
    });

    saveDB();
    res.json({ success: true, message: 'User account and all associated personal data erased completely.' });
  });

  // --- GOOGLE DRIVE MEMORY SYNC SYSTEM ---
  const GOOGLE_CLIENT_ID = process.env.OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || '';
  const GOOGLE_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET || '';

  const getRedirectUri = (req: express.Request) => {
    if (process.env.APP_URL) {
      return `${process.env.APP_URL}/api/auth/google-drive/callback`;
    }
    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    return `${protocol}://${host}/api/auth/google-drive/callback`;
  };

  async function getValidDriveToken(user: Profile): Promise<string | null> {
    if (!user.driveTokens) return null;
    const { accessToken, refreshToken, expiresAt } = user.driveTokens;
    
    if (expiresAt > Date.now() + 5 * 60 * 1000) {
      return accessToken;
    }
    
    if (refreshToken && GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
      try {
        console.log(`Refreshing Google Drive token for user: ${user.email}`);
        const res = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
          })
        });
        const data: any = await res.json();
        if (res.ok && data.access_token) {
          user.driveTokens.accessToken = data.access_token;
          user.driveTokens.expiresAt = Date.now() + (data.expires_in * 1000);
          if (data.refresh_token) {
            user.driveTokens.refreshToken = data.refresh_token;
          }
          saveDB();
          return data.access_token;
        } else {
          console.error('Failed to refresh Google Drive token:', data);
        }
      } catch (error) {
        console.error('Error refreshing Google Drive token:', error);
      }
    }
    return null;
  }

  async function syncWithGoogleDrive(user: Profile): Promise<{ success: boolean; message: string; syncedAt?: string }> {
    const token = await getValidDriveToken(user);
    if (!token) {
      return { success: false, message: 'Google Drive is not connected or token expired. Please reconnect.' };
    }
    
    const email = user.email;
    
    try {
      // 1. Search for existing 'reflectai_memory.json' in appDataFolder
      const listRes = await fetch(
        'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name=%27reflectai_memory.json%27&fields=files(id,name)',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (!listRes.ok) {
        const errData: any = await listRes.json();
        console.error('Error listing Drive files:', errData);
        return { success: false, message: `Failed to access Google Drive: ${errData.error?.message || listRes.statusText}` };
      }
      
      const listData: any = await listRes.json();
      const existingFile = listData.files && listData.files[0];
      
      // Prepare local data
      const localData = {
        profile: {
          displayName: user.displayName,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          theme: user.theme,
          language: user.language,
          settings: user.settings,
          stats: user.stats,
          achievements: user.achievements
        },
        journals: db.journals[email] || [],
        studySessions: db.studySessions[email] || [],
        updatedAt: new Date().toISOString()
      };
      
      let mergedData = { ...localData };
      let fileId = existingFile?.id;
      
      if (fileId) {
        // 2. File exists! Let's download it
        const downloadRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (downloadRes.ok) {
          try {
            const remoteData: any = await downloadRes.json();
            
            // Merge Journals
            const remoteJournals = remoteData.journals || [];
            const localJournals = db.journals[email] || [];
            const mergedJournalsMap = new Map();
            
            remoteJournals.forEach((j: any) => mergedJournalsMap.set(j.id, j));
            localJournals.forEach((j: any) => {
              const existing = mergedJournalsMap.get(j.id);
              if (!existing || new Date(j.savedAt) > new Date(existing.savedAt)) {
                mergedJournalsMap.set(j.id, j);
              }
            });
            mergedData.journals = Array.from(mergedJournalsMap.values());
            
            // Merge Study Sessions
            const remoteSessions = remoteData.studySessions || [];
            const localSessions = db.studySessions[email] || [];
            const mergedSessionsMap = new Map();
            
            remoteSessions.forEach((s: any) => mergedSessionsMap.set(s.id, s));
            localSessions.forEach((s: any) => mergedSessionsMap.set(s.id, s));
            mergedData.studySessions = Array.from(mergedSessionsMap.values());
            
            // Merge Profile stats/settings
            if (remoteData.profile) {
              const remoteProf = remoteData.profile;
              mergedData.profile.stats = {
                averageScore: Math.max(localData.profile.stats.averageScore, remoteProf.stats?.averageScore || 0),
                highestScore: Math.max(localData.profile.stats.highestScore, remoteProf.stats?.highestScore || 0),
                longestStreak: Math.max(localData.profile.stats.longestStreak, remoteProf.stats?.longestStreak || 0),
                currentStreak: Math.max(localData.profile.stats.currentStreak, remoteProf.stats?.currentStreak || 0),
                totalStudyHours: Math.max(localData.profile.stats.totalStudyHours, remoteProf.stats?.totalStudyHours || 0),
                lastActiveDate: localData.profile.stats.lastActiveDate || remoteProf.stats?.lastActiveDate || null
              };
              
              const mergedAchievementsSet = new Set([
                ...localData.profile.achievements,
                ...(remoteProf.achievements || [])
              ]);
              mergedData.profile.achievements = Array.from(mergedAchievementsSet);
            }
            
            // Update DB state
            db.journals[email] = mergedData.journals;
            db.studySessions[email] = mergedData.studySessions;
            user.stats = mergedData.profile.stats;
            user.achievements = mergedData.profile.achievements;
            
          } catch (parseError) {
            console.error('Error parsing remote data file, overwriting instead:', parseError);
          }
        } else {
          console.error('Failed to download remote file content:', downloadRes.statusText);
        }
      }
      
      // 3. Save to Google Drive
      const syncedAt = new Date().toISOString();
      mergedData.updatedAt = syncedAt;
      
      if (fileId) {
        // Update existing file content
        const updateRes = await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(mergedData)
          }
        );
        
        if (!updateRes.ok) {
          const updateErr: any = await updateRes.json();
          console.error('Failed to update Google Drive file content:', updateErr);
          return { success: false, message: `Failed to save to Google Drive: ${updateErr.error?.message || updateRes.statusText}` };
        }
      } else {
        // Create new file
        const boundary = 'reflectai_boundary_sync';
        const metadata = {
          name: 'reflectai_memory.json',
          parents: ['appDataFolder']
        };
        
        const multipartBody = [
          `--${boundary}`,
          'Content-Type: application/json; charset=UTF-8',
          '',
          JSON.stringify(metadata),
          `--${boundary}`,
          'Content-Type: application/json',
          '',
          JSON.stringify(mergedData),
          `--${boundary}--`
        ].join('\r\n');
        
        const createRes = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartBody
          }
        );
        
        if (!createRes.ok) {
          const createErr: any = await createRes.json();
          console.error('Failed to create Google Drive file content:', createErr);
          return { success: false, message: `Failed to create file on Google Drive: ${createErr.error?.message || createRes.statusText}` };
        }
      }
      
      // Save locally
      if (user.driveTokens) {
        user.driveTokens.syncedAt = syncedAt;
      }
      saveDB();
      
      return { success: true, message: 'Google Drive synchronized successfully!', syncedAt };
      
    } catch (error: any) {
      console.error('Sync execution failed:', error);
      return { success: false, message: `Connection error during sync: ${error.message || error}` };
    }
  }

  const triggerBackgroundSync = (user: Profile) => {
    if (user.driveTokens) {
      console.log(`Triggering auto background sync for user: ${user.email}`);
      syncWithGoogleDrive(user).catch(err => {
        console.error('Background sync failed:', err);
      });
    }
  };

  // Google Drive Authentication Url Endpoint
  app.get('/api/auth/google-drive/url', (req, res) => {
    const email = req.query.email as string;
    const state = email ? encodeURIComponent(email) : 'login';

    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google OAuth Client ID is not configured on the host server.' });
    }

    const redirectUri = getRedirectUri(req);
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ url: authUrl });
  });

  // Google Drive Auth Callback
  app.get(['/api/auth/google-drive/callback', '/api/auth/google-drive/callback/'], async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).send('Invalid auth callback arguments.');
    }

    try {
      const redirectUri = getRedirectUri(req);
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData: any = await tokenResponse.json();
      if (!tokenResponse.ok) {
        console.error('Google token exchange error:', tokenData);
        return res.status(500).send(`Token exchange failed: ${tokenData.error_description || tokenResponse.statusText}`);
      }

      // Fetch user profile from Google Userinfo API
      let gUser: any = null;
      try {
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        if (userinfoRes.ok) {
          gUser = await userinfoRes.json();
        }
      } catch (err) {
        console.error('Failed to fetch Google userinfo:', err);
      }

      let email = '';
      if (state !== 'login') {
        email = decodeURIComponent(state as string).trim().toLowerCase();
      } else if (gUser && gUser.email) {
        email = gUser.email.trim().toLowerCase();
      }

      if (!email) {
        return res.status(400).send('Could not determine Google account email.');
      }

      let user = db.users[email];
      const isNewUser = !user;
      if (!user) {
        const displayName = (gUser && gUser.name) || email.split('@')[0];
        const photoUrl = (gUser && gUser.picture) || `https://api.dicebear.com/7.x/adventurer/svg?seed=${displayName}`;
        user = registerNewUser(email, displayName, photoUrl);
      }

      user.driveTokens = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: Date.now() + (tokenData.expires_in * 1000),
        email: email,
        syncedAt: new Date().toISOString()
      };

      // Perform an initial sync immediately upon connection
      await syncWithGoogleDrive(user);

      saveDB();

      // Return a popup close page that posts a message back to parent
      res.send(`
        <html>
          <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background: #faf9f6; color: #1e293b; text-align: center; padding: 24px;">
            <div style="background: white; padding: 32px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); max-width: 400px; border: 1px solid #f1f0ec;">
              <div style="font-size: 48px; margin-bottom: 16px;">💾</div>
              <h2 style="font-weight: 800; font-size: 20px; margin: 0 0 8px 0; color: #7c3aed;">Google Cloud Memory Sync Active!</h2>
              <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin: 0 0 24px 0;">
                ${isNewUser ? 'Your new DayScore account has been registered' : 'Successfully authenticated'} and connected securely to Google Drive.
              </p>
              <p style="font-size: 11px; color: #94a3b8; font-weight: 500;">Returning to application...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'GOOGLE_LOGIN_SUCCESS', 
                  user: ${JSON.stringify(user)},
                  token: "${generateAuthToken(email)}"
                }, '*');
              }
              setTimeout(() => {
                window.close();
              }, 1500);
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Error in google drive oauth callback:', err);
      res.status(500).send(`OAuth callback error: ${err.message || err}`);
    }
  });

  // Google Drive connection status
  app.get('/api/google-drive/status', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    res.json({
      connected: !!user.driveTokens,
      syncedAt: user.driveTokens?.syncedAt || null,
      email: user.driveTokens?.email || null
    });
  });

  // Google Drive Manual Sync trigger
  app.post('/api/google-drive/sync', async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!user.driveTokens) return res.status(400).json({ error: 'Google Drive is not connected for this profile.' });

    const result = await syncWithGoogleDrive(user);
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        syncedAt: result.syncedAt,
        journals: db.journals[user.email] || [],
        studySessions: db.studySessions[user.email] || [],
        user
      });
    } else {
      res.status(500).json({ error: result.message });
    }
  });

  // Google Drive Disconnect
  app.post('/api/google-drive/disconnect', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    delete user.driveTokens;
    saveDB();
    res.json({ success: true, message: 'Google Drive cloud memory disconnected successfully.' });
  });

  // 3. Journals List & Autosave Drafts
  app.get('/api/journals', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const userJournals = db.journals[user.email] || [];
    res.json({ journals: userJournals });
  });

  app.post('/api/journals', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { text, date, isDraft } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    let userJournals = db.journals[user.email] || [];
    let existing = userJournals.find(j => j.date === date);

    if (existing) {
      existing.text = text;
      existing.isDraft = isDraft !== undefined ? isDraft : existing.isDraft;
      existing.savedAt = new Date().toISOString();
    } else {
      existing = {
        id: 'j_' + Math.random().toString(36).substr(2, 9),
        date,
        text,
        score: null,
        emoji: null,
        evaluation: null,
        isDraft: isDraft !== undefined ? isDraft : true,
        savedAt: new Date().toISOString()
      };
      userJournals.push(existing);
    }

    db.journals[user.email] = userJournals;
    saveDB();
    triggerBackgroundSync(user);
    res.json({ journal: existing });
  });

  // 4. Evaluate Journal using Gemini API
  app.post('/api/journals/evaluate', async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { date, text } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    let userJournals = db.journals[user.email] || [];
    let entry = userJournals.find(j => j.date === date);

    if (text && text.trim()) {
      if (entry) {
        entry.text = text;
        entry.savedAt = new Date().toISOString();
      } else {
        entry = {
          id: 'j_' + Math.random().toString(36).substr(2, 9),
          date,
          text,
          score: null,
          emoji: null,
          evaluation: null,
          isDraft: true,
          savedAt: new Date().toISOString()
        };
        userJournals.push(entry);
      }
      db.journals[user.email] = userJournals;
    }

    if (!entry || !entry.text.trim()) {
      return res.status(400).json({ error: 'No journal reflection content found to evaluate for today!' });
    }

    let evaluationResult;
    const ai = getAIClient();

    if (ai) {
      try {
        const promptText = `Analyze this student reflection journal and evaluate their productivity, focus, alignment with habits, and emotional/learning flow. Output JSON matches schema strictly. Do not score individual activities. Only evaluate the overall day holistically. Reflection Text: "${entry.text}"`;
        
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptText,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER, description: 'Productivity/reflection score out of 100.' },
                emoji: { type: Type.STRING, description: 'Single representative emoji like 🔥, 🧘‍♀️, 😴, 🧠.' },
                summary: { type: Type.STRING, description: '1-2 sentences of emotional and academic feedback.' },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 key strengths of the day.' },
                improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 tailored productivity recommendations.' },
                tomorrowChallenge: { type: Type.STRING, description: 'A daily challenge for tomorrow.' }
              },
              required: ['score', 'emoji', 'summary', 'strengths', 'improvements', 'tomorrowChallenge']
            }
          }
        });

        const textOutput = aiResponse.text?.trim() || '{}';
        evaluationResult = JSON.parse(textOutput);
      } catch (err) {
        console.error('Gemini call failed. Activating intelligent fallback evaluation:', err);
        evaluationResult = generateFallbackEvaluation(entry.text);
      }
    } else {
      evaluationResult = generateFallbackEvaluation(entry.text);
    }

    // Update journal entry
    entry.score = evaluationResult.score;
    entry.emoji = evaluationResult.emoji;
    entry.isDraft = false;
    entry.evaluation = {
      summary: evaluationResult.summary,
      strengths: evaluationResult.strengths,
      improvements: evaluationResult.improvements,
      tomorrowChallenge: evaluationResult.tomorrowChallenge
    };
    entry.savedAt = new Date().toISOString();

    // Update User Stats (Streak & averages)
    const todayStr = new Date().toISOString().split('T')[0];
    const lastActive = user.stats.lastActiveDate;
    let streakFrozen = false;
    
    // Ensure properties exist
    if (user.gems === undefined) user.gems = 150;
    if (user.streakFreezes === undefined) user.streakFreezes = 1;

    // Streaks logic
    if (lastActive === null) {
      user.stats.currentStreak = 1;
    } else {
      const lastDate = new Date(lastActive);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.stats.currentStreak += 1;
      } else if (diffDays > 1) {
        if (user.streakFreezes > 0) {
          user.streakFreezes -= 1;
          streakFrozen = true;
          // Protect streak and increment it for today's active entry
          user.stats.currentStreak += 1;
        } else {
          user.stats.currentStreak = 1;
        }
      }
    }
    user.stats.lastActiveDate = todayStr;
    if (user.stats.currentStreak > user.stats.longestStreak) {
      user.stats.longestStreak = user.stats.currentStreak;
    }

    // Award Gems based on score
    user.gems += (entry.score || 0);

    // Averages
    const evaluatedJournals = userJournals.filter(j => j.score !== null);
    const sum = evaluatedJournals.reduce((acc, curr) => acc + (curr.score || 0), 0);
    user.stats.averageScore = Math.round(sum / evaluatedJournals.length);
    if (entry.score > user.stats.highestScore) {
      user.stats.highestScore = entry.score;
    }

    // Achievements unlocking
    const achievements = new Set(user.achievements);
    achievements.add('reflection_rookie'); // First evaluation
    if (user.stats.currentStreak >= 5) achievements.add('streak_master');
    if (entry.score === 100) achievements.add('perfect_score');
    if (user.stats.totalStudyHours >= 20) achievements.add('study_marathoner');
    user.achievements = Array.from(achievements);

    // Create Feed Post celebrating evaluation automatically
    const post: FeedPost = {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      authorEmail: user.email,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      type: 'journal_score',
      content: `Just completed my daily reflection journal reflection and achieved an AI productivity score of ${entry.score}! ${entry.emoji}`,
      audience: 'public',
      metadata: {
        score: entry.score,
        emoji: entry.emoji || '📝'
      },
      timestamp: new Date().toISOString(),
      likes: [],
      reactions: {},
      comments: []
    };
    db.posts.unshift(post);

    // Simulated responses in chat from classmates when scoring high!
    if (entry.score >= 85) {
      setTimeout(() => {
        const randomFriend = SIMULATED_CLASSMATES[Math.floor(Math.random() * SIMULATED_CLASSMATES.length)];
        const roomId = [randomFriend.email, user.email].sort().join('_');
        const r = db.chatRooms.find(room => room.id === roomId);
        if (r) {
          r.messages.push({
            id: 'm_auto_' + Date.now(),
            senderEmail: randomFriend.email,
            text: `Whoa! Just saw your reflection score of ${entry.score} on the feed. Keep it up, you are on absolute fire! 🔥`,
            timestamp: new Date().toISOString(),
            reactions: {},
            read: false
          });
          saveDB();
        }
      }, 60000); // Send message after 1 min to feel real!
    }

    db.journals[user.email] = userJournals;
    saveDB();
    triggerBackgroundSync(user);
    res.json({ journal: entry, user, streakFrozen });
  });

  // --- FAST & PRECISE VOICE AI TRANSCRIBE ENDPOINT ---
  app.post('/api/voice-transcribe', async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { audioData, mimeType } = req.body;
    if (!audioData) return res.status(400).json({ error: 'No audio data provided' });

    const ai = getAIClient();
    if (ai) {
      try {
        const base64Content = audioData.includes(',') ? audioData.split(',')[1] : audioData;
        const cleanMimeType = mimeType || 'audio/webm';

        console.log(`Transcribing voice recording for user ${user.email} (${cleanMimeType})...`);

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              inlineData: {
                mimeType: cleanMimeType,
                data: base64Content,
              },
            },
            "Transcribe this spoken voice recording with high precision. Clean up stuttering, repeats, or filler words naturally, and format with proper punctuation, sentence capitalization, and clear structure. Output ONLY the transcribed text string."
          ],
        });

        const transcript = aiResponse.text?.trim() || '';
        if (transcript) {
          return res.json({ success: true, transcript });
        }
      } catch (err: any) {
        console.error('Gemini voice transcription error:', err);
      }
    }

    return res.json({ success: false, error: 'AI transcription service unavailable' });
  });

  // 5. Study Sessions
  app.get('/api/study/sessions', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ studySessions: db.studySessions[user.email] || [] });
  });

  app.post('/api/study/sessions', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { durationMinutes, category, shareToFeed, audience } = req.body;
    if (!durationMinutes || !category) {
      return res.status(400).json({ error: 'Duration and Category are required' });
    }

    const session: StudySession = {
      id: 's_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Number(durationMinutes),
      category,
      sharedToFeed: !!shareToFeed,
      timestamp: new Date().toISOString(),
    };

    const userSessions = db.studySessions[user.email] || [];
    userSessions.push(session);
    db.studySessions[user.email] = userSessions;

    // Update study hours
    user.stats.totalStudyHours = Number((user.stats.totalStudyHours + (durationMinutes / 60)).toFixed(1));

    // Unlock study badge
    if (user.stats.totalStudyHours >= 20) {
      const achievements = new Set(user.achievements);
      achievements.add('study_marathoner');
      user.achievements = Array.from(achievements);
    }

    // Share to feed
    if (shareToFeed) {
      const post: FeedPost = {
        id: 'p_' + Math.random().toString(36).substr(2, 9),
        authorEmail: user.email,
        authorName: user.displayName,
        authorAvatar: user.avatarUrl,
        type: 'study_session',
        content: `Just completed a dedicated ${durationMinutes}-minute study focus block in ${category}! 📚✍️`,
        audience: audience === 'friends' ? 'friends' : 'public',
        metadata: {
          studyMinutes: durationMinutes,
          studyCategory: category
        },
        timestamp: new Date().toISOString(),
        likes: [],
        reactions: {},
        comments: []
      };
      db.posts.unshift(post);
    }

    // Award Gems for study session duration
    if (user.gems === undefined) user.gems = 150;
    user.gems += Number(durationMinutes);

    saveDB();
    triggerBackgroundSync(user);
    res.json({ session, userStats: user.stats, user });
  });

  // --- AI TO-DO LIST GENERATOR ENDPOINT ---
  app.post('/api/todos/ai-generate', async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const userJournals = db.journals[user.email] || [];
    const recentJournals = userJournals.slice(-5);
    const journalSummaryText = recentJournals.map(j => `Date: ${j.date}, Text: ${j.text}, Score: ${j.score || 'N/A'}, Improvements: ${j.evaluation?.improvements?.join('; ') || 'N/A'}`).join('\n');

    let generatedTasks: Array<{ text: string; category: string }> = [];
    const ai = getAIClient();

    if (ai) {
      try {
        const promptText = `You are DayScore AI productivity coach. Analyze the student's recent reflection logs and evaluations below, then generate 3 to 5 highly specific, actionable, high-impact To-Do items for today/tomorrow to help them improve focus, overcome procrastination, and stay disciplined.
Student logs:
${journalSummaryText || 'No previous reflections logged yet. Generate standard high-impact student daily habits.'}

Output JSON strictly as an array of objects with keys "text" (concise action) and "category" (Academic, Focus, Health, or Habit).`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ['text', 'category']
              }
            }
          }
        });

        const parsed = JSON.parse(response.text?.trim() || '[]');
        if (Array.isArray(parsed) && parsed.length > 0) {
          generatedTasks = parsed;
        }
      } catch (err) {
        console.error('AI Todo generation error:', err);
      }
    }

    if (generatedTasks.length === 0) {
      generatedTasks = [
        { text: "Complete 1 focused 45-min study session before social media", category: "Focus" },
        { text: "Review yesterday's mistake notes & active revision goals", category: "Academic" },
        { text: "Put phone in another room during core study block", category: "Habit" },
        { text: "Take a 20-minute physical walk/exercise break", category: "Health" }
      ];
    }

    const todos = generatedTasks.map((t, idx) => ({
      id: `ai_todo_${Date.now()}_${idx}`,
      text: t.text,
      category: t.category || 'Focus',
      completed: false,
      isAiGenerated: true,
      createdAt: new Date().toISOString()
    }));

    res.json({ success: true, todos });
  });

  // 6. Social Feed List, Posts, Comments, Likes, Reactions
  app.get('/api/social/feed', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    // Sort feed by newest first
    const sortedFeed = [...db.posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json({ posts: sortedFeed });
  });

  app.post('/api/social/posts', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { content, type, metadata, audience } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Content cannot be empty' });

    const post: FeedPost = {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      authorEmail: user.email,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      type: type || 'custom',
      content,
      audience: audience === 'friends' ? 'friends' : 'public',
      metadata: metadata || undefined,
      timestamp: new Date().toISOString(),
      likes: [],
      reactions: {},
      comments: []
    };

    db.posts.unshift(post);
    saveDB();
    res.json({ post });
  });

  app.delete('/api/social/posts/:id', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const postId = req.params.id;
    const postIndex = db.posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });
    if (db.posts[postIndex].authorEmail !== user.email) {
      return res.status(403).json({ error: 'You can only delete your own posts!' });
    }

    db.posts.splice(postIndex, 1);
    saveDB();
    res.json({ success: true });
  });

  app.post('/api/social/posts/:id/react', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const postId = req.params.id;
    const { emoji } = req.body; // e.g., "🔥", "🙌", "🎉"

    if (!emoji) return res.status(400).json({ error: 'Emoji reaction is required' });

    const post = db.posts.find(p => p.id === postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (!post.reactions) post.reactions = {};
    if (!post.reactions[emoji]) post.reactions[emoji] = [];

    const existingIndex = post.reactions[emoji].indexOf(user.email);
    if (existingIndex > -1) {
      post.reactions[emoji].splice(existingIndex, 1); // toggle off
      if (post.reactions[emoji].length === 0) {
        delete post.reactions[emoji];
      }
    } else {
      post.reactions[emoji].push(user.email); // toggle on
    }

    saveDB();
    res.json({ post });
  });

  app.post('/api/social/posts/:id/comment', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const postId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text cannot be empty' });

    const post = db.posts.find(p => p.id === postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      authorEmail: user.email,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      text,
      timestamp: new Date().toISOString()
    };

    post.comments.push(comment);
    saveDB();
    res.json({ post });
  });

  // 7. Messaging & Private Realtime Chats
  app.get('/api/chat/rooms', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const aiEmail = 'dayscore_ai@reflect.edu';
    if (!db.users[aiEmail]) {
      db.users[aiEmail] = {
        email: aiEmail,
        username: 'dayscore_ai',
        displayName: 'DayScore AI Coach ✨',
        bio: 'Hell damn intelligent, super fast, accurate, logical, and deeply emotional AI mentor 💜.',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=DayScoreAICoach&backgroundColor=7c3aed,c084fc&backgroundType=gradientLinear',
        theme: 'dark' as const,
        language: 'English',
        settings: { notifications: true, aiCoachingLevel: 'deep' as const, isProfilePublic: true, showOnlineStatus: true },
        stats: { averageScore: 99, highestScore: 100, longestStreak: 365, currentStreak: 365, totalStudyHours: 9999, lastActiveDate: new Date().toISOString().split('T')[0] },
        achievements: ['reflection_rookie', 'streak_master', 'perfect_score'],
      };
    }

    let aiRoom = db.chatRooms.find(room => room.participants.includes(user.email) && room.participants.includes(aiEmail));
    if (!aiRoom) {
      const roomId = `room_ai_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      aiRoom = {
        id: roomId,
        participants: [user.email, aiEmail],
        messages: [
          {
            id: `m_welcome_${Date.now()}`,
            senderEmail: aiEmail,
            text: `Hello ${user.displayName}! 👋 I am your DayScore AI Coach ✨. I am hell damn intelligent, super fast, logical, accurate, and deeply empathetic. How can I help you reflect or crush your goals today?`,
            timestamp: new Date().toISOString(),
            reactions: {},
            read: true
          }
        ],
        typingEmails: [],
        pinnedBy: []
      };
      db.chatRooms.push(aiRoom);
      saveDB();
    }

    const aiProfile = db.users[aiEmail];
    const roomsWithPeer = [{
      ...aiRoom,
      peer: {
        email: aiEmail,
        displayName: aiProfile.displayName,
        avatarUrl: aiProfile.avatarUrl,
        online: true,
      }
    }];

    res.json({ rooms: roomsWithPeer });
  });

  app.get('/api/chat/rooms/:roomId/messages', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const room = db.chatRooms.find(r => r.id === req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (!room.participants.includes(user.email)) return res.status(403).json({ error: 'Forbidden' });

    // Mark messages as read
    room.messages.forEach(msg => {
      if (msg.senderEmail !== user.email) msg.read = true;
    });

    saveDB();
    res.json({ messages: room.messages });
  });

  app.post('/api/chat/rooms/:roomId/messages', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const room = db.chatRooms.find(r => r.id === req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (!room.participants.includes(user.email)) return res.status(403).json({ error: 'Forbidden' });

    const { text, audioUrl, audioDuration } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Message text is required' });

    const message: Message = {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      senderEmail: user.email,
      text,
      timestamp: new Date().toISOString(),
      reactions: {},
      read: false,
      audioUrl: audioUrl || undefined,
      audioDuration: audioDuration ? Number(audioDuration) : undefined
    };

    room.messages.push(message);

    // Real-time peer/AI Coach response simulation
    const peerEmail = room.participants.find(email => email !== user.email);
    if (peerEmail && SIMULATED_CLASSMATES.some(c => c.email === peerEmail)) {
      const isAiCoach = peerEmail === 'dayscore_ai@reflect.edu';
      const delayMs = isAiCoach ? 200 : 2500; // Hyper-fast 200ms response time for AI Coach

      setTimeout(async () => {
        const classmate = SIMULATED_CLASSMATES.find(c => c.email === peerEmail);
        if (!classmate) return;

        let replyText = isAiCoach
          ? "I hear you completely. I am right here with you with crystal-clear logic and deep emotional support. Let's tackle this step by step!"
          : `That sounds awesome! Let's stay focused. 🚀`;

        const ai = getAIClient();
        if (ai) {
          try {
            // Build conversation history from recent room messages
            const recentHistory = room.messages.slice(-10).map(m => {
              const name = m.senderEmail === user.email 
                ? user.displayName 
                : (m.senderEmail === 'dayscore_ai@reflect.edu' ? 'DayScore AI Coach' : classmate.displayName);
              return `${name}: ${m.text}`;
            }).join('\n');

            const context = isAiCoach
              ? `You are DayScore AI Coach ✨, an intelligent, highly logical, deeply empathetic, and supportive self-improvement mentor inside the BaBU Student Hub application.

STUDENT INFORMATION:
- Name: ${user.displayName} (@${user.username})
- Current Streak: ${user.stats.currentStreak} days
- Average Score: ${user.stats.averageScore}/100
- Study Hours: ${user.stats.totalStudyHours} hrs

CORE BEHAVIOR RULES:
1. HIGH LOGICAL & ANALYTICAL INTELLIGENCE: Give clear, structured, logically sound guidance on study schedules, problem solving, learning strategies, time management, and academic questions.
2. HIGH EMOTIONAL INTELLIGENCE: Validate emotional states (stress, fatigue, anxiety, excitement), offer authentic warmth, encouragement, and active listening. Never judge or shame.
3. PERSONALIZED & CONVERSATIONAL: Reference previous chat context and user details smoothly.
4. CONCISE & ARTICULATE: Keep answers crisp, warm, and highly engaging (2-4 sentences or clear bullet points).

RECENT CONVERSATION HISTORY:
${recentHistory}

Student's Latest Message: "${text}"

Respond directly to ${user.displayName} with deep logical brilliance, warmth, and supportive coaching:`
              : `You are student classmate ${classmate.displayName} (bio: ${classmate.bio}).
RECENT CHAT HISTORY:
${recentHistory}
Student's Message: "${text}"
Reply naturally as a supportive student friend in 1-2 short, friendly, upbeat sentences.`;

            const reply = await ai.models.generateContent({
              model: 'gemini-3.6-flash',
              contents: context,
              config: {
                thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
              }
            });
            replyText = reply.text?.trim() || replyText;
          } catch (e) {
            console.error('AI reply generation failed:', e);
          }
        }

        room.messages.push({
          id: 'm_' + Math.random().toString(36).substr(2, 9),
          senderEmail: peerEmail,
          text: replyText,
          timestamp: new Date().toISOString(),
          reactions: {},
          read: false
        });
        saveDB();
      }, delayMs);
    }

    saveDB();
    res.json({ message });
  });

  app.post('/api/chat/rooms/:roomId/pin', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const room = db.chatRooms.find(r => r.id === req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (!room.pinnedBy) room.pinnedBy = [];
    const idx = room.pinnedBy.indexOf(user.email);
    if (idx > -1) {
      room.pinnedBy.splice(idx, 1);
    } else {
      room.pinnedBy.push(user.email);
    }

    saveDB();
    res.json({ pinned: room.pinnedBy.includes(user.email) });
  });

  // Typing status toggle
  app.post('/api/chat/rooms/:roomId/typing', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const room = db.chatRooms.find(r => r.id === req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const { isTyping } = req.body;
    if (!room.typingEmails) room.typingEmails = [];

    const idx = room.typingEmails.indexOf(user.email);
    if (isTyping && idx === -1) {
      room.typingEmails.push(user.email);
    } else if (!isTyping && idx > -1) {
      room.typingEmails.splice(idx, 1);
    }

    res.json({ typingEmails: room.typingEmails });
  });

  // 8. Friends List, Search & Friend Requests
  app.get('/api/social/friends', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const friendEmails = db.friends[user.email] || [];
    const friendsProfiles = friendEmails.map(e => db.users[e]).filter(Boolean);

    const pendingRequests = db.friendRequests.filter(r => r.toEmail === user.email);
    const sentRequests = db.friendRequests.filter(r => r.fromEmail === user.email);

    res.json({
      friends: friendsProfiles,
      pendingRequests: pendingRequests.map(r => ({ ...r, fromUser: db.users[r.fromEmail] })),
      sentRequests
    });
  });

  app.get('/api/social/users', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const search = (req.query.search as string || '').toLowerCase();
    const allUsers = Object.values(db.users).filter(u => u.email !== user.email);
    
    const filtered = allUsers.filter(u => 
      u.displayName.toLowerCase().includes(search) || 
      u.username.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );

    res.json({ users: filtered });
  });

  app.post('/api/social/friends/request', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { toEmail } = req.body;
    if (!toEmail || toEmail === user.email) return res.status(400).json({ error: 'Invalid friend request' });

    // Check existing
    const alreadyFriends = (db.friends[user.email] || []).includes(toEmail);
    if (alreadyFriends) return res.status(400).json({ error: 'Already friends' });

    const existingReq = db.friendRequests.find(r => 
      (r.fromEmail === user.email && r.toEmail === toEmail) ||
      (r.fromEmail === toEmail && r.toEmail === user.email)
    );
    if (existingReq) return res.status(400).json({ error: 'Friend request already pending' });

    db.friendRequests.push({
      fromEmail: user.email,
      toEmail,
      timestamp: new Date().toISOString()
    });

    saveDB();
    res.json({ success: true });
  });

  app.post('/api/social/friends/respond', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { fromEmail, action } = req.body; // action: "accept", "reject", "remove"
    if (!fromEmail) return res.status(400).json({ error: 'Partner email is required' });

    if (action === 'accept') {
      // Remove request
      db.friendRequests = db.friendRequests.filter(r => 
        !(r.fromEmail === fromEmail && r.toEmail === user.email)
      );

      // Add to friend lists
      if (!db.friends[user.email]) db.friends[user.email] = [];
      if (!db.friends[fromEmail]) db.friends[fromEmail] = [];

      if (!db.friends[user.email].includes(fromEmail)) db.friends[user.email].push(fromEmail);
      if (!db.friends[fromEmail].includes(user.email)) db.friends[fromEmail].push(user.email);

      // Create Chat room
      const roomId = [user.email, fromEmail].sort().join('_');
      if (!db.chatRooms.find(r => r.id === roomId)) {
        db.chatRooms.push({
          id: roomId,
          participants: [user.email, fromEmail].sort(),
          messages: [],
          typingEmails: [],
          pinnedBy: []
        });
      }
    } else if (action === 'reject') {
      db.friendRequests = db.friendRequests.filter(r => 
        !(r.fromEmail === fromEmail && r.toEmail === user.email)
      );
    } else if (action === 'remove') {
      if (db.friends[user.email]) db.friends[user.email] = db.friends[user.email].filter(e => e !== fromEmail);
      if (db.friends[fromEmail]) db.friends[fromEmail] = db.friends[fromEmail].filter(e => e !== user.email);
    }

    saveDB();
    res.json({ success: true, friends: db.friends[user.email] || [] });
  });

  // 9. Leaderboards
  app.get('/api/leaderboard', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const scope = req.query.scope as string || 'global'; // "global" or "friends"
    const period = req.query.period as string || 'weekly'; // "daily", "weekly", "monthly"

    let targetUsers = Object.values(db.users).filter(u => u.email !== 'dayscore_ai@reflect.edu' && u.username !== 'dayscore_ai');
    if (scope === 'friends') {
      const friendList = db.friends[user.email] || [];
      targetUsers = targetUsers.filter(u => u.email === user.email || friendList.includes(u.email));
    }

    // Since we seed realistic averages, we can calculate sorting score:
    // We add some variation based on period
    const rankings = targetUsers.map((u, i) => {
      let multiplier = 1;
      if (period === 'daily') multiplier = 0.95 + (Math.sin(i) * 0.05);
      if (period === 'monthly') multiplier = 1.02 + (Math.cos(i) * 0.03);

      const computedScore = Math.min(100, Math.round(u.stats.averageScore * multiplier));
      return {
        email: u.email,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        score: computedScore || 70,
        streak: u.stats.currentStreak,
        totalHours: u.stats.totalStudyHours,
      };
    }).sort((a, b) => b.score - a.score);

    res.json({ rankings });
  });

  // 10. Consolidated Analytics
  app.get('/api/analytics', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const userJournals = db.journals[user.email] || [];
    const studySessions = db.studySessions[user.email] || [];

    // Daily scores (last 7 entries)
    const dailyScores = userJournals
      .filter(j => j.score !== null)
      .slice(-7)
      .map(j => ({
        date: j.date.substring(5), // MM-DD
        score: j.score,
        emoji: j.emoji
      }));

    // Weekly average trends (last 4 weeks - mock combined with actual)
    const weeklyTrends = [
      { week: 'Wk -3', score: 72, studyHours: 4.5 },
      { week: 'Wk -2', score: 78, studyHours: 6.2 },
      { week: 'Wk -1', score: 81, studyHours: 8.0 },
      { week: 'Current', score: user.stats.averageScore || 75, studyHours: Number((studySessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1)) }
    ];

    // Category distribution of study sessions
    const categoryMinutes: { [key: string]: number } = {};
    studySessions.forEach(s => {
      categoryMinutes[s.category] = (categoryMinutes[s.category] || 0) + s.durationMinutes;
    });
    const radarData = Object.keys(categoryMinutes).map(cat => ({
      subject: cat,
      minutes: categoryMinutes[cat],
      fullMark: 300,
    }));
    if (radarData.length === 0) {
      // seed fallback if empty
      radarData.push(
        { subject: 'Coding', minutes: 120, fullMark: 300 },
        { subject: 'Reading', minutes: 80, fullMark: 300 },
        { subject: 'Writing', minutes: 60, fullMark: 300 },
        { subject: 'Revision', minutes: 40, fullMark: 300 }
      );
    }

    res.json({
      dailyScores,
      weeklyTrends,
      radarData,
      stats: user.stats,
    });
  });

  // --- SERVE CLIENT SPA FRONTEND ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development Mode using Vite Dev Server Middleware
    console.log('Spawning Vite Dev Server Middleware on Express...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // --- START SERVER ---
  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`BaBU application listening on http://0.0.0.0:${port}`);
  });
}

startServer();
