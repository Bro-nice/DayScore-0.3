import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

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
  journals: { [email: string]: JournalEntry[] };
  studySessions: { [email: string]: StudySession[] };
  posts: FeedPost[];
  chatRooms: ChatRoom[];
  friendRequests: FriendRequest[];
  friends: { [email: string]: string[] }; // email -> list of friend emails
}

let db: DBState = {
  users: {},
  journals: {},
  studySessions: {},
  posts: [],
  chatRooms: [],
  friendRequests: [],
  friends: {},
};

// --- PRE-SEEDED STUDENTS (CLASSMATES) ---
const SIMULATED_CLASSMATES = [
  {
    email: 'lukas@reflect.edu',
    username: 'lukas_codes',
    displayName: 'Lukas Weber',
    bio: 'CS sophomore 💻. Sleep is just a time-out. Building compilers & sipping espresso.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
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
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
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
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
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

// --- EXPRESS ROUTER ---
async function startServer() {
  const app = express();
  app.use(express.json());

  // Helper middleware to verify email authentication (represented simply in headers or queries)
  const getAuthenticatedUser = (req: express.Request): Profile | null => {
    const email = req.headers['x-auth-email'] as string;
    if (!email) return null;
    return db.users[email] || null;
  };

  // 1. Google Sign-In Verification
  app.post('/api/auth/login', (req, res) => {
    const { email, displayName, photoUrl } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = db.users[email];
    if (!user) {
      // Create new user profile
      const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_') + '_' + Math.floor(100 + Math.random() * 900);
      user = {
        email,
        username,
        displayName: displayName || email.split('@')[0],
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
      };
      db.users[email] = user;
      db.friends[email] = ['emma@reflect.edu', 'lukas@reflect.edu']; // auto-add classmates as friends
      
      // Auto-add back from classmates
      db.friends['emma@reflect.edu'].push(email);
      db.friends['lukas@reflect.edu'].push(email);

      // Create pre-seeded chat conversations with them
      const roomEmma = ['emma@reflect.edu', email].sort().join('_');
      db.chatRooms.push({
        id: roomEmma,
        participants: ['emma@reflect.edu', email].sort(),
        messages: [{
          id: `m_welcome_${roomEmma}`,
          senderEmail: 'emma@reflect.edu',
          text: `Welcome to ReflectAI! Let's help each other stay accountable. Let me know if you want to study together!`,
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
    }

    res.json({ user });
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

    const { displayName, bio, avatarUrl, theme, language, settings } = req.body;
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (theme) user.theme = theme;
    if (language) user.language = language;
    if (settings) user.settings = { ...user.settings, ...settings };

    saveDB();
    res.json({ user });
  });

  // Delete account
  app.delete('/api/user/profile', (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const email = user.email;
    delete db.users[email];
    delete db.journals[email];
    delete db.studySessions[email];
    delete db.friends[email];
    db.posts = db.posts.filter(p => p.authorEmail !== email);
    db.chatRooms = db.chatRooms.filter(room => !room.participants.includes(email));

    // Clean up friend lists
    Object.keys(db.friends).forEach(k => {
      db.friends[k] = db.friends[k].filter(f => f !== email);
    });

    saveDB();
    res.json({ success: true });
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
    res.json({ journal: existing });
  });

  // 4. Evaluate Journal using Gemini API
  app.post('/api/journals/evaluate', async (req, res) => {
    const user = getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { date } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    const userJournals = db.journals[user.email] || [];
    const entry = userJournals.find(j => j.date === date);

    if (!entry || !entry.text.trim()) {
      return res.status(400).json({ error: 'No journal reflection content found to evaluate for today!' });
    }

    let evaluationResult;
    const ai = getAIClient();

    if (ai) {
      try {
        console.log('Generating AI Evaluation for:', user.email);
        const promptText = `Analyze this student reflection journal and evaluate their productivity, focus, alignment with habits, and emotional/learning flow. Output JSON matches schema strictly. Do not score individual activities. Only evaluate the overall day holistically. Reflection Text: "${entry.text}"`;
        
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: promptText,
          config: {
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
        user.stats.currentStreak = 1;
      }
    }
    user.stats.lastActiveDate = todayStr;
    if (user.stats.currentStreak > user.stats.longestStreak) {
      user.stats.longestStreak = user.stats.currentStreak;
    }

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
    res.json({ journal: entry, user });
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

    const { durationMinutes, category, shareToFeed } = req.body;
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

    saveDB();
    res.json({ session, userStats: user.stats });
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

    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Content cannot be empty' });

    const post: FeedPost = {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      authorEmail: user.email,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      type: 'custom',
      content,
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

    const rooms = db.chatRooms.filter(room => room.participants.includes(user.email));
    
    // Map with peer info
    const roomsWithPeer = rooms.map(room => {
      const peerEmail = room.participants.find(e => e !== user.email) || '';
      const peerProfile = db.users[peerEmail] || { displayName: 'Deleted Student', avatarUrl: '', settings: { showOnlineStatus: false } };
      return {
        ...room,
        peer: {
          email: peerEmail,
          displayName: peerProfile.displayName,
          avatarUrl: peerProfile.avatarUrl,
          online: peerProfile.settings?.showOnlineStatus || false,
        }
      };
    });

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

    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Message text is required' });

    const message: Message = {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      senderEmail: user.email,
      text,
      timestamp: new Date().toISOString(),
      reactions: {},
      read: false
    };

    room.messages.push(message);

    // AI Classmate real-time response simulated instantly in 3 seconds!
    const peerEmail = room.participants.find(email => email !== user.email);
    if (peerEmail && SIMULATED_CLASSMATES.some(c => c.email === peerEmail)) {
      setTimeout(async () => {
        // Find classmate profile
        const classmate = SIMULATED_CLASSMATES.find(c => c.email === peerEmail);
        if (!classmate) return;

        // Generate response using Gemini if available, or fall back
        let replyText = `That sounds awesome! Let's stay focused. 🚀`;
        const ai = getAIClient();
        if (ai) {
          try {
            const context = `You are simulated classmate ${classmate.displayName} (bio: ${classmate.bio}). React to user's chat message: "${text}". Keep it friendly, student-focused, short (1-2 sentences), and encouraging!`;
            const reply = await ai.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: context,
            });
            replyText = reply.text?.trim() || replyText;
          } catch (e) {
            // fallback
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
      }, 3000);
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

    let targetUsers = Object.values(db.users);
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
    console.log(`ReflectAI application listening on http://0.0.0.0:${port}`);
  });
}

startServer();
