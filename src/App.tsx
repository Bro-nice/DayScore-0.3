import { useState, useEffect, useRef, useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  BookOpen,
  Award,
  Crown,
  Flame,
  Timer,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Globe,
  MessageSquare,
  Trophy,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Send,
  Heart,
  Smile,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Mic,
  UserPlus,
  UserCheck,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Search,
  Share2,
  Check,
  Languages,
  X,
  Bell,
  Shield,
  Trash,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Snowflake,
  Gem,
  Moon,
  Sun,
  Cloud,
  Download,
  RefreshCw,
  Unlink,
  Database,
  Sliders,
  FileText,
  AlertTriangle,
  HardDrive,
  Folder,
  Phone,
  Video,
  Info,
  Image,
  Upload,
  Camera
} from 'lucide-react';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

import { Profile, JournalEntry, StudySession, FeedPost, ChatRoom, LeaderboardRank, TodoItem } from './types';
import ConfettiCanvas from './components/ConfettiCanvas';
import ContributionGraph from './components/ContributionGraph';
import { CHARACTER_AVATARS, getFallbackAvatarSvg } from './data/avatars';
import { SafeAvatar, AvatarFrame } from './components/SafeAvatar';

// --- CRYPTOGRAPHIC AUTH TOKEN FETCH INTERCEPTOR ---
const originalFetch = window.fetch.bind(window);
const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = localStorage.getItem('reflect_auth_token');
  if (token) {
    init = init || {};
    init.headers = init.headers || {};
    if (init.headers instanceof Headers) {
      if (!init.headers.has('x-auth-token')) {
        init.headers.set('x-auth-token', token);
      }
    } else if (Array.isArray(init.headers)) {
      const hasToken = init.headers.some(([k]) => k.toLowerCase() === 'x-auth-token');
      if (!hasToken) {
        init.headers.push(['x-auth-token', token]);
      }
    } else {
      const hasToken = Object.keys(init.headers).some(k => k.toLowerCase() === 'x-auth-token');
      if (!hasToken) {
        (init.headers as any)['x-auth-token'] = token;
      }
    }
  }
  return originalFetch(input, init);
};

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'lg';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '', size = 'lg' }) => {
  const isLg = size === 'lg';
  const dimension = isLg ? 96 : 44;
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const outerGradId = `logoGradOuter_${id}`;
  const innerGradId = `logoGradInner_${id}`;
  const glowGradId = `glowRadial_${id}`;

  return (
    <motion.svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible`}
      initial="initial"
      animate="animate"
    >
      <defs>
        {/* Futuristic Gradients */}
        <linearGradient id={outerGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" /> {/* Purple */}
          <stop offset="50%" stopColor="#ec4899" /> {/* Pink */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
        </linearGradient>
        <linearGradient id={innerGradId} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" /> {/* Blue */}
          <stop offset="100%" stopColor="#d946ef" /> {/* Fuchsia */}
        </linearGradient>
        <radialGradient id={glowGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        fill={`url(#${glowGradId})`}
        animate={{
          scale: [0.9, 1.2, 0.9],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Outer rotating star/cross path */}
      <motion.path
        d="M50 10 C53 35, 65 35, 90 50 C65 65, 53 65, 50 90 C47 65, 35 65, 10 50 C35 35, 47 35, 50 10 Z"
        stroke={`url(#${outerGradId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          rotate: [0, 360],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{
          rotate: {
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Inner morphing organic loop */}
      <motion.path
        d="M50 25 C65 25, 75 35, 75 50 C75 65, 60 75, 50 75 C35 75, 25 65, 25 50 C25 35, 35 25, 50 25 Z"
        fill={`url(#${innerGradId})`}
        fillOpacity="0.2"
        stroke={`url(#${innerGradId})`}
        strokeWidth="2.5"
        animate={{
          rotate: [0, -360],
          scale: [1, 0.9, 1]
        }}
        transition={{
          rotate: {
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Orbiting tiny satellite dot */}
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="#22d3ee"
        animate={{
          x: [0, 24, 0, -24, 0],
          y: [-24, 0, 24, 0, -24],
          scale: [1, 1.3, 1, 0.8, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Center glowing pearl/sphere */}
      <motion.circle
        cx="50"
        cy="50"
        r="11"
        fill={`url(#${outerGradId})`}
        animate={{
          scale: [0.85, 1.15, 0.85]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: "50px 50px" }}
      />
    </motion.svg>
  );
};

// --- ANIMATED FIRE FLAME COMPONENT (REALISTIC FLUID SVG WITH DRIFTING EMBERS) ---
const AnimatedFireFlame = ({ isFrozen, size = "md" }: { isFrozen?: boolean; size?: "sm" | "md" | "lg" }) => {
  const containerSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-12 h-12 flex-shrink-0";
  
  return (
    <div className={`relative flex items-center justify-center ${containerSize} select-none`}>
      {/* Background radial flame warmth aura */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1.05, 1.2, 1],
          opacity: [0.4, 0.7, 0.5, 0.8, 0.4]
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute inset-0 rounded-full blur-xl transition-all ${
          isFrozen 
            ? "bg-cyan-500/35 shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
            : "bg-gradient-to-t from-red-600/40 via-orange-500/40 to-amber-400/30 shadow-[0_0_25px_rgba(249,115,22,0.6)]"
        }`} 
      />

      {/* Flame Layers SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible">
        <defs>
          <linearGradient id="fireBaseGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={isFrozen ? "#0284c7" : "#dc2626"} />
            <stop offset="50%" stopColor={isFrozen ? "#06b6d4" : "#ea580c"} />
            <stop offset="100%" stopColor={isFrozen ? "#38bdf8" : "#f97316"} />
          </linearGradient>

          <linearGradient id="fireMidGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={isFrozen ? "#06b6d4" : "#ea580c"} />
            <stop offset="60%" stopColor={isFrozen ? "#22d3ee" : "#f59e0b"} />
            <stop offset="100%" stopColor={isFrozen ? "#67e8f9" : "#fbbf24"} />
          </linearGradient>

          <linearGradient id="fireCoreGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={isFrozen ? "#38bdf8" : "#f59e0b"} />
            <stop offset="70%" stopColor={isFrozen ? "#a5f3fc" : "#fef08a"} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Outer Flame - Deep Crimson / Blue Base */}
        <motion.path
          d="M50 10 C68 35, 82 58, 80 82 C78 96, 22 96, 20 82 C18 58, 32 35, 50 10 Z"
          fill="url(#fireBaseGrad)"
          animate={{
            scaleY: [1, 1.15, 0.94, 1.1, 1],
            scaleX: [1, 0.92, 1.06, 0.96, 1],
            rotate: [-1.5, 2.5, -2, 1.5, -1.5],
            skewX: [-1, 2, -1, 1, -1]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "bottom center" }}
        />

        {/* Mid Flame - Intense Fiery Orange / Cyan */}
        <motion.path
          d="M50 24 C62 44, 72 62, 70 82 C68 93, 32 93, 30 82 C28 62, 38 44, 50 24 Z"
          fill="url(#fireMidGrad)"
          animate={{
            scaleY: [1, 1.22, 0.9, 1.14, 1],
            scaleX: [1, 0.88, 1.1, 0.92, 1],
            rotate: [2.5, -2.5, 3, -1.5, 2.5],
            skewX: [2, -2, 1.5, -1, 2]
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "bottom center" }}
        />

        {/* Inner Core Flame - White Hot / Golden Glow */}
        <motion.path
          d="M50 40 C58 56, 62 68, 60 82 C58 90, 42 90, 40 82 C38 68, 42 56, 50 40 Z"
          fill="url(#fireCoreGrad)"
          animate={{
            scaleY: [1, 1.28, 0.85, 1.18, 1],
            scaleX: [1, 0.85, 1.15, 0.88, 1],
            rotate: [-2, 3, -1.5, 2.5, -2],
          }}
          transition={{
            duration: 1.0,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "bottom center" }}
        />

        {/* Left Dancing Top Tongue */}
        <motion.path
          d="M42 35 C40 22, 45 15, 46 10 C42 18, 36 28, 42 35 Z"
          fill="url(#fireMidGrad)"
          animate={{
            y: [0, -6, 2, -4, 0],
            x: [0, -3, 2, -1, 0],
            scale: [0.9, 1.2, 0.8, 1.1, 0.9],
            opacity: [0.7, 1, 0.5, 0.9, 0.7]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "bottom left" }}
        />

        {/* Right Dancing Top Tongue */}
        <motion.path
          d="M58 35 C60 22, 55 15, 54 10 C58 18, 64 28, 58 35 Z"
          fill="url(#fireBaseGrad)"
          animate={{
            y: [0, -8, 1, -5, 0],
            x: [0, 3, -2, 1, 0],
            scale: [0.8, 1.25, 0.7, 1.15, 0.8],
            opacity: [0.6, 1, 0.4, 0.8, 0.6]
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "bottom right" }}
        />
      </svg>

      {/* Realistic Rising Ember Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {[1, 2, 3, 4, 5].map((id) => (
          <motion.div
            key={id}
            className={`absolute rounded-full ${isFrozen ? "bg-cyan-200" : "bg-amber-300"}`}
            style={{
              width: `${2 + (id % 3)}px`,
              height: `${2 + (id % 3)}px`,
              bottom: "25%",
              left: `${30 + id * 8}%`,
              boxShadow: isFrozen ? "0 0 6px #38bdf8" : "0 0 8px #fbbf24"
            }}
            animate={{
              y: [0, -35 - id * 8],
              x: [0, (id % 2 === 0 ? 10 : -10), (id % 2 === 0 ? -6 : 6)],
              scale: [1, 1.6, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2 + id * 0.25,
              repeat: Infinity,
              delay: id * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// --- MAIN REACT COMPONENT ---
export default function App() {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [savedGoogleAccounts, setSavedGoogleAccounts] = useState<{ email: string; displayName: string; photoUrl: string }[]>(() => {
    try {
      const saved = localStorage.getItem('babu_saved_google_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading saved google accounts:', e);
    }
    return [];
  });
  const [isEnteringNewAccount, setIsEnteringNewAccount] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // --- GOOGLE ACCOUNT AUTH & PASSWORD STATE ---
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<{ email: string; displayName: string; photoUrl: string } | null>(null);
  const [googleAccountIsRegistered, setGoogleAccountIsRegistered] = useState<boolean | null>(null);
  const [googlePasswordInput, setGooglePasswordInput] = useState('');
  const [showGooglePasswordText, setShowGooglePasswordText] = useState(false);

  // --- GOOGLE DRIVE CLOUD MEMORY STATE ---
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveSyncedAt, setDriveSyncedAt] = useState<string | null>(null);
  const [driveEmail, setDriveEmail] = useState<string | null>(null);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveStatusLoaded, setDriveStatusLoaded] = useState(false);

  // --- GENERAL APP STATE ---
  const [currentTab, setCurrentTab] = useState<'home' | 'journals' | 'analytics' | 'social' | 'chat' | 'leaderboard' | 'profile' | 'settings'>('home');
  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    try {
      const savedEmail = localStorage.getItem('reflect_auth_email') || 'guest';
      const cached = localStorage.getItem(`reflect_journals_${savedEmail}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading initial journals:', e);
    }
    return [];
  });
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    try {
      const savedEmail = localStorage.getItem('reflect_auth_email') || 'guest';
      const cached = localStorage.getItem(`reflect_study_${savedEmail}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading initial study sessions:', e);
    }
    return [];
  });
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [leaderboardRankings, setLeaderboardRankings] = useState<LeaderboardRank[]>([]);
  const [friendsList, setFriendsList] = useState<Profile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [userSearchResult, setUserSearchResult] = useState<Profile[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // --- ANALYTICS CACHE ---
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // --- UI STATES ---
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'badge' }[]>([]);
  const [isThemeDark, setIsThemeDark] = useState(() => {
    return localStorage.getItem('reflect_theme') !== 'light';
  });
  const [loadingEvaluate, setLoadingEvaluate] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState<any>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // --- DATE SELECTION & MULTI-DAY MEMORY STATE ---
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // --- REFLECTION WRITER STATE ---
  const [journalText, setJournalText] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'recording' | 'analyzing' | 'typing'>('idle');
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [voiceLiveTranscript, setVoiceLiveTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimerIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  const typingIntervalRef = useRef<any>(null);

  // --- STUDY TIMER STATE (POMODORO) ---
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerInitialDuration, setTimerInitialDuration] = useState(25 * 60);
  const [focusedSecondsInCurrentSession, setFocusedSecondsInCurrentSession] = useState(0);
  const [hasCompletedFocusPeriod, setHasCompletedFocusPeriod] = useState(false);
  const [showTimerFinishModal, setShowTimerFinishModal] = useState(false);
  const [selectedTimerCategory, setSelectedTimerCategory] = useState('Programming');
  const [shareTimerToFeed, setShareTimerToFeed] = useState(true);

  // --- POMODORO CYCLE SHARE STATE ---
  const [showPomodoroShareModal, setShowPomodoroShareModal] = useState(false);
  const [pomodoroShareCategory, setPomodoroShareCategory] = useState('Programming & Deep Work');
  const [pomodoroShareNote, setPomodoroShareNote] = useState('');
  const [pomodoroShareLoading, setPomodoroShareLoading] = useState(false);

  // --- STUDENT SOCIAL FEED STATE ---
  const [feedTab, setFeedTab] = useState<'public' | 'friends'>('public');
  const [postAudience, setPostAudience] = useState<'public' | 'friends'>('public');
  const [customPostText, setCustomPostText] = useState('');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'all' | 'journal_score' | 'pomodoro' | 'study'>('all');
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);

  // --- CHAT INPUT & DIRECT MESSAGES STATE ---
  const [chatInputText, setChatInputText] = useState('');
  const [chatSidebarTab, setChatSidebarTab] = useState<'chats' | 'friends'>('chats');
  const [showPeerInfoDrawer, setShowPeerInfoDrawer] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, string[]>>({});

  // --- STATUS NOTE & QUICK NOTES SYSTEM STATE ---
  const [userStatusNote, setUserStatusNote] = useState<string>(() => {
    return localStorage.getItem('reflect_status_note') || 'Studying & reflecting 🌱';
  });
  const [showStatusNoteModal, setShowStatusNoteModal] = useState(false);
  const [statusNoteInput, setStatusNoteInput] = useState('');

  const [quickNotes, setQuickNotes] = useState<{ id: string; title: string; content: string; category: string; color: string; date: string; pinned: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('reflect_quick_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: 'note_1',
          title: 'Compiler Lab Key Formulas 💻',
          content: 'LR(1) parsing table construction: set of items with lookahead symbols. Handle shift/reduce conflicts cleanly!',
          category: 'Academic',
          color: 'violet',
          date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
          pinned: true
        },
        {
          id: 'note_2',
          title: 'Daily Reflection Checklist 📝',
          content: '1. Complete core Pomodoro study blocks\n2. Reflect on 2 strengths & 1 area for growth\n3. Log evening score in DayScore',
          category: 'Focus',
          color: 'emerald',
          date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
          pinned: false
        }
      ];
    } catch (e) {
      return [];
    }
  });
  const [showQuickNotesModal, setShowQuickNotesModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Academic');
  const [newNoteColor, setNewNoteColor] = useState('violet');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState('All');

  // --- SPECIAL ANIMATED TROPHY SHOWCASE STATE ---
  const [selectedTrophyId, setSelectedTrophyId] = useState<string>('gold_champion');
  const [trophyInspectModal, setTrophyInspectModal] = useState<any | null>(null);

  const handleSaveStatusNote = (noteText: string) => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    setUserStatusNote(trimmed);
    localStorage.setItem('reflect_status_note', trimmed);
    setShowStatusNoteModal(false);
    showToast('✨ Status note updated on your profile!', 'success');
  };

  const handleAddQuickNote = () => {
    if (!newNoteContent.trim() && !newNoteTitle.trim()) {
      showToast('Please enter a note title or content', 'info');
      return;
    }
    const newNote = {
      id: 'note_' + Date.now(),
      title: newNoteTitle.trim() || 'Untitled Note',
      content: newNoteContent.trim(),
      category: newNoteCategory,
      color: newNoteColor,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      pinned: false,
    };
    const updated = [newNote, ...quickNotes];
    setQuickNotes(updated);
    localStorage.setItem('reflect_quick_notes', JSON.stringify(updated));
    setNewNoteTitle('');
    setNewNoteContent('');
    showToast('📌 Quick note saved successfully!', 'success');
  };

  const handleDeleteQuickNote = (id: string) => {
    const updated = quickNotes.filter(n => n.id !== id);
    setQuickNotes(updated);
    localStorage.setItem('reflect_quick_notes', JSON.stringify(updated));
    showToast('Note deleted', 'info');
  };

  const handleTogglePinQuickNote = (id: string) => {
    const updated = quickNotes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    setQuickNotes(updated);
    localStorage.setItem('reflect_quick_notes', JSON.stringify(updated));
  };

  // --- CHAT VOICE NOTE RECORDING & PLAYBACK STATE ---
  const [isRecordingVoiceNote, setIsRecordingVoiceNote] = useState(false);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState(0);
  const chatVoiceTimerRef = useRef<any>(null);
  const chatMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chatAudioChunksRef = useRef<Blob[]>([]);

  // Audio Playback state for voice messages
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [playingMsgProgress, setPlayingMsgProgress] = useState<Record<string, number>>({});
  const chatAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const generateVoiceToneBlob = (durationSec: number): string => {
    try {
      const sampleRate = 22050;
      const dur = Math.max(1, durationSec);
      const numSamples = sampleRate * dur;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
      const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const freq = 260 + Math.sin(t * 4) * 40 + Math.sin(t * 10) * 20;
        const envelope = Math.sin(Math.PI * (i / numSamples));
        data[i] = Math.sin(2 * Math.PI * freq * t) * 0.15 * envelope;
      }
      
      const numChannels = 1;
      const format = 1; // PCM
      const bitDepth = 16;
      const dataSize = data.length * 2;
      const arrayBuffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(arrayBuffer);

      const writeString = (offset: number, str: string) => {
        for (let j = 0; j < str.length; j++) {
          view.setUint8(offset + j, str.charCodeAt(j));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + dataSize, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
      view.setUint16(32, numChannels * (bitDepth / 8), true);
      view.setUint16(34, bitDepth, true);
      writeString(36, 'data');
      view.setUint32(40, dataSize, true);

      let offset = 44;
      for (let k = 0; k < data.length; k++) {
        const s = Math.max(-1, Math.min(1, data[k]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
      }

      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Failed to create voice blob:', err);
      return '';
    }
  };

  const startVoiceNoteRecording = async () => {
    setIsRecordingVoiceNote(true);
    setVoiceNoteDuration(0);
    chatAudioChunksRef.current = [];

    if (chatVoiceTimerRef.current) clearInterval(chatVoiceTimerRef.current);
    chatVoiceTimerRef.current = setInterval(() => {
      setVoiceNoteDuration(prev => prev + 1);
    }, 1000);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        chatMediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chatAudioChunksRef.current.push(e.data);
          }
        };
        mediaRecorder.start();
      }
    } catch (err) {
      console.log('Mic recording fallbacks to synth audio:', err);
    }
  };

  const cancelVoiceNoteRecording = () => {
    if (chatVoiceTimerRef.current) clearInterval(chatVoiceTimerRef.current);
    if (chatMediaRecorderRef.current && chatMediaRecorderRef.current.state !== 'inactive') {
      try {
        chatMediaRecorderRef.current.stop();
        chatMediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      } catch (e) {}
    }
    chatMediaRecorderRef.current = null;
    chatAudioChunksRef.current = [];
    setIsRecordingVoiceNote(false);
    setVoiceNoteDuration(0);
  };

  const finishAndSendVoiceNote = () => {
    if (chatVoiceTimerRef.current) clearInterval(chatVoiceTimerRef.current);
    const duration = Math.max(1, voiceNoteDuration);

    if (chatMediaRecorderRef.current && chatMediaRecorderRef.current.state !== 'inactive') {
      try {
        chatMediaRecorderRef.current.stop();
        chatMediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      } catch (e) {}
    }

    setTimeout(() => {
      let audioUrl = '';
      if (chatAudioChunksRef.current.length > 0) {
        const blob = new Blob(chatAudioChunksRef.current, { type: 'audio/webm' });
        audioUrl = URL.createObjectURL(blob);
      } else {
        audioUrl = generateVoiceToneBlob(duration);
      }

      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      const formattedDur = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      const voiceText = `🎙️ Voice Note (${formattedDur})`;

      handleSendChatMessage(voiceText, audioUrl, duration);

      setIsRecordingVoiceNote(false);
      setVoiceNoteDuration(0);
      chatAudioChunksRef.current = [];
      chatMediaRecorderRef.current = null;
      showToast(`Voice note (${formattedDur}) sent!`, 'success');
    }, 100);
  };

  const togglePlayVoiceMessage = (msgId: string, audioUrl?: string, duration: number = 5) => {
    if (playingMsgId === msgId) {
      if (chatAudioPlayerRef.current) {
        chatAudioPlayerRef.current.pause();
      }
      setPlayingMsgId(null);
      return;
    }

    if (chatAudioPlayerRef.current) {
      chatAudioPlayerRef.current.pause();
    }

    const src = audioUrl || generateVoiceToneBlob(duration);
    const audio = new Audio(src);
    chatAudioPlayerRef.current = audio;

    setPlayingMsgId(msgId);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        setPlayingMsgProgress(prev => ({ ...prev, [msgId]: pct }));
      }
    };

    audio.onended = () => {
      setPlayingMsgId(null);
      setPlayingMsgProgress(prev => ({ ...prev, [msgId]: 0 }));
    };

    audio.play().catch(e => {
      console.log('Audio playback fallback simulation:', e);
      setPlayingMsgId(msgId);
      setTimeout(() => {
        setPlayingMsgId(null);
      }, duration * 1000);
    });
  };

  const handleToggleMessageReaction = (msgId: string, emoji: string) => {
    setMessageReactions(prev => {
      const existing = prev[msgId] || [];
      if (existing.includes(emoji)) {
        return { ...prev, [msgId]: existing.filter(e => e !== emoji) };
      } else {
        return { ...prev, [msgId]: [...existing, emoji] };
      }
    });
  };
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editFrame, setEditFrame] = useState<AvatarFrame>('none');
  const [avatarSearchQuery, setAvatarSearchQuery] = useState('');
  const [avatarCategoryFilter, setAvatarCategoryFilter] = useState<string>('All');
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPG, PNG, WEBP, GIF)', 'info');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Please select an image smaller than 5MB', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditAvatarUrl(result);
        showToast('📷 Custom photo uploaded from device!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredAvatars = useMemo(() => {
    return CHARACTER_AVATARS.filter(avatar => {
      const matchesCategory = avatarCategoryFilter === 'All' || avatar.category === avatarCategoryFilter;
      const matchesQuery = !avatarSearchQuery.trim() || 
        avatar.name.toLowerCase().includes(avatarSearchQuery.toLowerCase().trim()) ||
        avatar.id.toString() === avatarSearchQuery.trim() ||
        avatar.category.toLowerCase().includes(avatarSearchQuery.toLowerCase().trim());
      return matchesCategory && matchesQuery;
    });
  }, [avatarSearchQuery, avatarCategoryFilter]);

  const activeAvatarCharacter = useMemo(() => {
    return CHARACTER_AVATARS.find(a => a.url === editAvatarUrl);
  }, [editAvatarUrl]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // --- STREAK & ALERT STATES ---
  const [showStreakShop, setShowStreakShop] = useState(false);
  const [isStreakLoading, setIsStreakLoading] = useState(false);
  const [streakFrozenAlert, setStreakFrozenAlert] = useState(false);

  // --- REAL-TIME DEVICE CLOCK STATE ---
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- DEVICE TIME GREETING HELPER ---
  const getDeviceGreeting = (displayName: string) => {
    const hour = currentTime.getHours();
    if (hour < 12) return `Good morning, ${displayName}`;
    if (hour < 17) return `Good afternoon, ${displayName}`;
    if (hour < 22) return `Good evening, ${displayName}`;
    return `Late night, ${displayName}`;
  };

  // --- TO-DO LIST STATE ---
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('babu_todos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', text: 'Complete 1 focused 45-min revision block', completed: false, category: 'Academic', createdAt: new Date().toISOString() },
      { id: '2', text: 'Log daily journal reflection on DayScore AI', completed: true, category: 'Habit', createdAt: new Date().toISOString() },
      { id: '3', text: 'Review flashcards for upcoming exam', completed: false, category: 'Focus', createdAt: new Date().toISOString() },
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('Academic');
  const [isGeneratingTodos, setIsGeneratingTodos] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    try {
      const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
      localStorage.setItem(`babu_todos_${emailKey}`, JSON.stringify(todos));
      localStorage.setItem('babu_todos', JSON.stringify(todos));
    } catch (e) {
      console.error(e);
    }
  }, [todos, currentUser?.email]);

  // Auto-persist user profile and progress to local device storage whenever currentUser updates
  useEffect(() => {
    if (currentUser?.email) {
      try {
        localStorage.setItem('reflect_auth_email', currentUser.email);
        localStorage.setItem(`reflect_cached_user_${currentUser.email}`, JSON.stringify(currentUser));
      } catch (e) {
        console.error('Error auto-saving user profile to device storage:', e);
      }
    }
  }, [currentUser]);

  // Auto-persist journals to local device storage
  useEffect(() => {
    try {
      const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
      localStorage.setItem(`reflect_journals_${emailKey}`, JSON.stringify(journals));
    } catch (e) {
      console.error('Error auto-saving journals to local storage:', e);
    }
  }, [journals, currentUser?.email]);

  // Auto-persist study sessions to local device storage
  useEffect(() => {
    try {
      const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
      localStorage.setItem(`reflect_study_${emailKey}`, JSON.stringify(studySessions));
    } catch (e) {
      console.error('Error auto-saving study sessions to local storage:', e);
    }
  }, [studySessions, currentUser?.email]);

  // Auto-persist quick notes to local device storage
  useEffect(() => {
    try {
      const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
      localStorage.setItem(`reflect_quick_notes_${emailKey}`, JSON.stringify(quickNotes));
      localStorage.setItem('reflect_quick_notes', JSON.stringify(quickNotes));
    } catch (e) {
      console.error('Error auto-saving quick notes to local storage:', e);
    }
  }, [quickNotes, currentUser?.email]);

  // Auto-persist friends list to local device storage
  useEffect(() => {
    try {
      const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
      localStorage.setItem(`reflect_friends_${emailKey}`, JSON.stringify(friendsList));
    } catch (e) {
      console.error('Error auto-saving friends list to local storage:', e);
    }
  }, [friendsList, currentUser?.email]);

  // Auto-persist chat rooms to local device storage
  useEffect(() => {
    try {
      const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
      localStorage.setItem(`reflect_chat_rooms_${emailKey}`, JSON.stringify(chatRooms));
    } catch (e) {
      console.error('Error auto-saving chat rooms to local storage:', e);
    }
  }, [chatRooms, currentUser?.email]);

  // Auto-persist feed posts to local device storage
  useEffect(() => {
    if (posts.length > 0) {
      try {
        localStorage.setItem('reflect_posts_feed', JSON.stringify(posts));
      } catch (e) {
        console.error('Error auto-saving posts feed to local storage:', e);
      }
    }
  }, [posts]);

  // --- MANUAL DEVICE LOCAL STORAGE FORCE SYNC ---
  const handleForceSyncDeviceStorage = () => {
    const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
    try {
      if (currentUser?.email) {
        localStorage.setItem('reflect_auth_email', currentUser.email);
        localStorage.setItem(`reflect_cached_user_${currentUser.email}`, JSON.stringify(currentUser));
      }
      localStorage.setItem(`reflect_journals_${emailKey}`, JSON.stringify(journals));
      localStorage.setItem(`reflect_study_${emailKey}`, JSON.stringify(studySessions));
      localStorage.setItem(`babu_todos_${emailKey}`, JSON.stringify(todos));
      localStorage.setItem('babu_todos', JSON.stringify(todos));
      localStorage.setItem(`reflect_quick_notes_${emailKey}`, JSON.stringify(quickNotes));
      localStorage.setItem('reflect_quick_notes', JSON.stringify(quickNotes));
      localStorage.setItem(`reflect_friends_${emailKey}`, JSON.stringify(friendsList));
      localStorage.setItem(`reflect_chat_rooms_${emailKey}`, JSON.stringify(chatRooms));
      if (posts.length > 0) {
        localStorage.setItem('reflect_posts_feed', JSON.stringify(posts));
      }
      showToast('⚡ All user profile, stats, streak, badges & progress saved to device storage!', 'success');
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 2500);
    } catch (e) {
      console.error('Error forcing device storage save:', e);
      showToast('Error saving to device local storage', 'info');
    }
  };

  // --- DIRECT DEVICE FOLDER STORAGE HANDLERS ---
  const handleSaveToDeviceFolder = async () => {
    const exportData = {
      version: '1.0',
      app: 'DayScore AI Student Hub',
      savedAt: new Date().toISOString(),
      userEmail: currentUser?.email || 'guest',
      userProfile: currentUser || null,
      journals,
      studySessions,
      todos,
      quickNotes,
      userStatusNote,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `DayScore_UserData_Backup_${new Date().toISOString().split('T')[0]}.json`;

    // Try modern File System Access API (opens direct device folder file save picker)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'DayScore User Data Backup (.json)',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(jsonString);
        await writable.close();
        showToast('💾 Successfully saved user data directly to your device folder!', 'success');
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 3000);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User cancelled save dialog
        console.log('File System Access API fallback:', err);
      }
    }

    // Fallback standard HTML5 file download to user's local device folder
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    showToast(`💾 Saved ${fileName} directly to your device folder!`, 'success');
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const handleLoadFromDeviceFolder = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed) {
          showToast('Invalid backup file format.', 'info');
          return;
        }

        let restoredCount = 0;

        if (Array.isArray(parsed.journals)) {
          setJournals(parsed.journals);
          restoredCount += parsed.journals.length;
          const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
          localStorage.setItem(`reflect_journals_${emailKey}`, JSON.stringify(parsed.journals));
        }

        if (Array.isArray(parsed.studySessions)) {
          setStudySessions(parsed.studySessions);
          restoredCount += parsed.studySessions.length;
          const emailKey = currentUser?.email || localStorage.getItem('reflect_auth_email') || 'guest';
          localStorage.setItem(`reflect_study_${emailKey}`, JSON.stringify(parsed.studySessions));
        }

        if (Array.isArray(parsed.todos)) {
          setTodos(parsed.todos);
          localStorage.setItem('babu_todos', JSON.stringify(parsed.todos));
          restoredCount += parsed.todos.length;
        }

        if (Array.isArray(parsed.quickNotes)) {
          setQuickNotes(parsed.quickNotes);
          localStorage.setItem('reflect_quick_notes', JSON.stringify(parsed.quickNotes));
          restoredCount += parsed.quickNotes.length;
        }

        if (parsed.userStatusNote) {
          setUserStatusNote(parsed.userStatusNote);
          localStorage.setItem('reflect_status_note', parsed.userStatusNote);
        }

        if (parsed.userProfile && !currentUser) {
          setCurrentUser(parsed.userProfile);
          localStorage.setItem('reflect_auth_email', parsed.userProfile.email);
        }

        // If user is logged in, sync restored items with backend server
        if (currentUser?.email) {
          try {
            if (Array.isArray(parsed.journals) && parsed.journals.length > 0) {
              for (const j of parsed.journals) {
                await fetch('/api/journals', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'x-auth-email': currentUser.email },
                  body: JSON.stringify(j),
                });
              }
            }
          } catch (err) {
            console.error('Syncing imported journals error:', err);
          }
        }

        showToast(`📂 Restored ${restoredCount} entries & items from your device backup!`, 'success');
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 4000);
      } catch (err) {
        console.error('Failed reading device backup file:', err);
        showToast('Error parsing file. Please select a valid JSON backup file.', 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const item: TodoItem = {
      id: `todo_${Date.now()}`,
      text: newTodoText.trim(),
      completed: false,
      category: newTodoCategory,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [item, ...prev]);
    setNewTodoText('');
    showToast('Task added to your list!', 'success');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleClearCompletedTodos = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear.', 'info');
      return;
    }
    setTodos(prev => prev.filter(t => !t.completed));
    showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}!`, 'success');
  };

  const handleSharePomodoroCyclesToFeed = async () => {
    if (!currentUser) return;
    setPomodoroShareLoading(true);

    const todaySessions = studySessions.filter(s => s.date === todayDateStr);
    const totalMins = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const cycleCount = Math.max(1, Math.max(todaySessions.length, Math.floor(totalMins / 25)));

    const noteText = pomodoroShareNote.trim() ? pomodoroShareNote.trim() : 'Stayed focused and crushed deep work sessions!';
    const content = `🍅 Pomodoro Victory: Completed ${cycleCount} Pomodoro ${cycleCount === 1 ? 'cycle' : 'cycles'} (${totalMins > 0 ? totalMins : cycleCount * 25} mins focus) in ${pomodoroShareCategory}! "${noteText}"`;

    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({
          content,
          type: 'pomodoro_summary',
          metadata: {
            pomodoroCycles: cycleCount,
            studyMinutes: totalMins > 0 ? totalMins : cycleCount * 25,
            studyCategory: pomodoroShareCategory,
            note: noteText,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => [data.post, ...prev]);
        setShowPomodoroShareModal(false);
        setPomodoroShareNote('');
        showToast(`🍅 Shared ${cycleCount} Pomodoro cycle accomplishment to feed!`, 'success');
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 4000);
      } else {
        showToast(data.error || 'Failed to share post', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to share Pomodoro post', 'info');
    } finally {
      setPomodoroShareLoading(false);
    }
  };

  const handleGenerateAiTodos = async () => {
    setIsGeneratingTodos(true);
    showToast('✨ DayScore AI is analyzing your reflections to generate personalized tasks...', 'info');
    try {
      const res = await fetch('/api/todos/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.todos && data.todos.length > 0) {
        setTodos(prev => [...data.todos, ...prev]);
        showToast(`✨ AI generated ${data.todos.length} high-impact improvement tasks!`, 'success');
        setConfettiActive(true);
      } else {
        generateFallbackAiTodos();
      }
    } catch (err) {
      console.error(err);
      generateFallbackAiTodos();
    } finally {
      setIsGeneratingTodos(false);
    }
  };

  const generateFallbackAiTodos = () => {
    const fallbackTasks: TodoItem[] = [
      { id: `ai_${Date.now()}_1`, text: 'Complete 1 focused 45-min study session before social media', completed: false, category: 'Focus', isAiGenerated: true, createdAt: new Date().toISOString() },
      { id: `ai_${Date.now()}_2`, text: 'Review yesterday\'s mistake notes & active revision goals', completed: false, category: 'Academic', isAiGenerated: true, createdAt: new Date().toISOString() },
      { id: `ai_${Date.now()}_3`, text: 'Put phone in another room during core study block', completed: false, category: 'Habit', isAiGenerated: true, createdAt: new Date().toISOString() },
      { id: `ai_${Date.now()}_4`, text: 'Take a 20-minute physical walk/exercise break', completed: false, category: 'Health', isAiGenerated: true, createdAt: new Date().toISOString() }
    ];
    setTodos(prev => [...fallbackTasks, ...prev]);
    showToast('✨ AI generated 4 actionable study & discipline tasks!', 'success');
    setConfettiActive(true);
  };

  // --- TOAST NOTIFICATIONS HELPER ---
  const showToast = (message: string, type: 'success' | 'info' | 'badge' = 'info') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // --- CORE SYSTEM LOADERS & AUTO SIGN-IN ---
  useEffect(() => {
    // Check local storage for persistent auth
    const savedEmail = localStorage.getItem('reflect_auth_email');
    if (savedEmail) {
      // Restore cached user profile instantly if available
      try {
        const cachedUser = localStorage.getItem(`reflect_cached_user_${savedEmail}`);
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          if (parsed && parsed.email) {
            setCurrentUser(parsed);
            fetchInitialData(parsed.email);
          }
        }
      } catch (e) {
        console.error('Failed restoring cached user:', e);
      }

      fetch('/api/user/profile', {
        headers: { 'x-auth-email': savedEmail }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Profile fetch failed');
      })
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          localStorage.setItem(`reflect_cached_user_${data.user.email}`, JSON.stringify(data.user));
          if (data.user.theme === 'dark') {
            setIsThemeDark(true);
            document.documentElement.classList.add('dark');
          } else {
            setIsThemeDark(false);
            document.documentElement.classList.remove('dark');
          }
          showToast(`Welcome back, ${data.user.displayName}! ✨`, 'success');
          fetchInitialData(data.user.email);
        }
      })
      .catch(err => {
        console.warn('Backend connection warning during profile fetch:', err);
      });
    }

    // Theme Check
    const savedTheme = localStorage.getItem('reflect_theme');
    if (savedTheme !== 'light') {
      setIsThemeDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsThemeDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Timer countdown hook
  useEffect(() => {
    let interval: any = null;
    if (timerIsRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
        setFocusedSecondsInCurrentSession(prev => prev + 1);
      }, 1000);
    } else if (timerIsRunning && timerSeconds === 0) {
      setTimerIsRunning(false);
      setHasCompletedFocusPeriod(true);
      setShowTimerFinishModal(true);
      showToast('🎉 Focus milestone achieved! Study session completed.', 'success');
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000);
    }
    return () => clearInterval(interval);
  }, [timerIsRunning, timerSeconds]);

  // Read message logs when active chat room changes
  useEffect(() => {
    if (activeRoomId) {
      fetchMessages(activeRoomId);
      // Setup polling for chat rooms (to feel responsive & real-time)
      const chatInterval = setInterval(() => {
        fetchMessages(activeRoomId);
        fetchChatRooms();
      }, 3500);
      return () => clearInterval(chatInterval);
    }
  }, [activeRoomId]);

  // Auto scroll down chat view when messages arrive (especially after bot answers)
  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages.length]);

  // Multi-day journal text synchronization with selectedDate
  useEffect(() => {
    if (journals) {
      const entry = journals.find(j => j.date === selectedDate);
      setJournalText(entry ? entry.text : '');
    }
  }, [selectedDate, journals]);

  // Background autosave checker
  useEffect(() => {
    if (currentUser && currentTab === 'home' && journalText.trim()) {
      const delayDebounce = setTimeout(() => {
        autosaveJournal(journalText, selectedDate);
      }, 1500);
      return () => clearTimeout(delayDebounce);
    }
  }, [journalText, selectedDate]);

  // --- API SERVICE CALLS ---
  const handleGoogleLogin = async (email: string, displayName: string, photoUrl: string, passInput?: string) => {
    if (!email || !email.trim()) {
      showToast('Please enter your Google account email', 'info');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0];
    const finalPhoto = photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanEmail}`;
    const pwd = passInput !== undefined ? passInput : googlePasswordInput;

    if (!pwd || !pwd.trim()) {
      showToast('Please enter your password to proceed.', 'info');
      return;
    }

    if (googleAccountIsRegistered === false && pwd.length < 6) {
      showToast('Please set a strong password with at least 6 characters.', 'info');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, displayName: cleanName, photoUrl: finalPhoto, password: pwd }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save account to device saved accounts
        setSavedGoogleAccounts(prev => {
          const exists = prev.some(acc => acc.email.toLowerCase() === cleanEmail);
          const newAcc = { email: cleanEmail, displayName: cleanName, photoUrl: finalPhoto };
          const updated = exists
            ? prev.map(acc => acc.email.toLowerCase() === cleanEmail ? newAcc : acc)
            : [newAcc, ...prev];
          localStorage.setItem('babu_saved_google_accounts', JSON.stringify(updated));
          return updated;
        });

        onAuthSuccess(data.user, data.token);
        setShowGoogleModal(false);
        setIsEnteringNewAccount(false);
        setCustomGoogleEmail('');
        setCustomGoogleName('');
        setSelectedGoogleAccount(null);
        setGooglePasswordInput('');
        setGoogleAccountIsRegistered(null);
      } else {
        showToast(data.error || 'Google Sign-In failed', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Google Sign-In connection error', 'info');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSelectGoogleAccountForAuth = async (email: string, displayName: string, photoUrl: string) => {
    if (!email || !email.trim()) {
      showToast('Please enter a valid Google email address.', 'info');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0];
    const finalPhoto = photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanEmail}`;

    setSelectedGoogleAccount({ email: cleanEmail, displayName: cleanName, photoUrl: finalPhoto });
    setGooglePasswordInput('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoogleAccountIsRegistered(!!data.exists);
      } else {
        setGoogleAccountIsRegistered(false);
      }
    } catch (err) {
      console.error(err);
      setGoogleAccountIsRegistered(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRemoveSavedAccount = (emailToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedGoogleAccounts(prev => {
      const updated = prev.filter(acc => acc.email.toLowerCase() !== emailToRemove.toLowerCase());
      localStorage.setItem('babu_saved_google_accounts', JSON.stringify(updated));
      return updated;
    });
    if (selectedGoogleAccount?.email.toLowerCase() === emailToRemove.toLowerCase()) {
      setSelectedGoogleAccount(null);
      setGooglePasswordInput('');
    }
    showToast('Account removed from this device', 'info');
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Password required', color: 'bg-slate-200 dark:bg-slate-700' };
    if (pass.length < 6) return { score: 1, label: 'Weak (min 6 characters)', color: 'bg-rose-500' };
    let points = 1;
    if (pass.length >= 8) points++;
    if (/[0-9]/.test(pass)) points++;
    if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) points++;
    if (points <= 2) return { score: 2, label: 'Medium security', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong & Secured password 💪', color: 'bg-emerald-500' };
  };

  const handleDirectGoogleSignIn = async (email?: string) => {
    setAuthLoading(true);
    try {
      const url = email 
        ? `/api/auth/google-drive/url?email=${encodeURIComponent(email)}`
        : '/api/auth/google-drive/url';
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.url) {
        const width = 500;
        const height = 650;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open(
          data.url,
          'GoogleSignInAuth',
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
        );
      } else {
        showToast(data.error || 'Failed to initialize Google Auth.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error initializing Google Sign-In.', 'info');
    } finally {
      setAuthLoading(false);
    }
  };

  const onAuthSuccess = (user: Profile, token?: string) => {
    setCurrentUser(user);
    localStorage.setItem('reflect_auth_email', user.email);
    localStorage.setItem(`reflect_cached_user_${user.email}`, JSON.stringify(user));
    if (token) {
      localStorage.setItem('reflect_auth_token', token);
    }
    if (user.theme === 'dark') {
      setIsThemeDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsThemeDark(false);
      document.documentElement.classList.remove('dark');
    }
    showToast(`Welcome back, ${user.displayName}! ✨`, 'success');
    fetchInitialData(user.email);
  };

  const handleLogout = () => {
    localStorage.removeItem('reflect_auth_email');
    localStorage.removeItem('reflect_auth_token');
    setCurrentUser(null);
    setJournals([]);
    setStudySessions([]);
    setPosts([]);
    setChatRooms([]);
    setDriveConnected(false);
    setDriveStatusLoaded(false);
    showToast('Securely logged out.', 'success');
  };

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && (event.data.type === 'GOOGLE_DRIVE_CONNECTED' || event.data.type === 'GOOGLE_LOGIN_SUCCESS')) {
        const loggedUser = event.data.user;
        const loggedToken = event.data.token;
        if (loggedUser) {
          onAuthSuccess(loggedUser, loggedToken);
          fetchInitialData(loggedUser.email);
          // Query drive status
          fetch('/api/google-drive/status', { headers: { 'x-auth-email': loggedUser.email } })
            .then(r => r.json())
            .then(data => {
              setDriveConnected(data.connected);
              setDriveSyncedAt(data.syncedAt);
              setDriveEmail(data.email);
              setDriveStatusLoaded(true);
            }).catch(err => {
              console.error('Failed to load Google Drive status', err);
              setDriveStatusLoaded(true);
            });
          
          showToast(`Welcome, ${loggedUser.displayName}! Google Drive cloud backup is active.`, 'success');
        } else {
          showToast('Google Drive Cloud Memory synchronized and active!', 'success');
          setDriveStatusLoaded(true);
          if (currentUser) {
            fetchInitialData(currentUser.email);
          } else {
            const savedEmail = localStorage.getItem('reflect_auth_email');
            if (savedEmail) fetchInitialData(savedEmail);
          }
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [currentUser]);

  const handleConnectDrive = async () => {
    if (!currentUser) return;
    setDriveLoading(true);
    try {
      const res = await fetch(`/api/auth/google-drive/url?email=${encodeURIComponent(currentUser.email)}`);
      const data = await res.json();
      if (res.ok && data.url) {
        // Open the OAuth Consent flow in a standard popup window
        const width = 500;
        const height = 650;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        window.open(
          data.url,
          'GoogleDriveAuth',
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
        );
      } else {
        showToast(data.error || 'Failed to fetch authorization URL.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error starting Google Drive auth.', 'info');
    } finally {
      setDriveLoading(false);
    }
  };

  const handleDisconnectDrive = async () => {
    if (!currentUser) return;
    if (!window.confirm('Are you sure you want to disconnect Google Drive memory sync? Your local data will remain intact, but it will no longer back up to your Google Drive.')) {
      return;
    }
    setDriveLoading(true);
    try {
      const res = await fetch('/api/google-drive/disconnect', {
        method: 'POST',
        headers: { 'x-auth-email': currentUser.email }
      });
      const data = await res.json();
      if (res.ok) {
        setDriveConnected(false);
        setDriveSyncedAt(null);
        setDriveEmail(null);
        showToast('Google Drive disconnected.', 'success');
      } else {
        showToast(data.error || 'Failed to disconnect Google Drive.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error during disconnect.', 'info');
    } finally {
      setDriveLoading(false);
    }
  };

  const handleSyncDrive = async () => {
    if (!currentUser) return;
    setDriveLoading(true);
    showToast('Synchronizing student cloud memory...', 'info');
    try {
      const res = await fetch('/api/google-drive/sync', {
        method: 'POST',
        headers: { 'x-auth-email': currentUser.email }
      });
      const data = await res.json();
      if (res.ok) {
        setDriveSyncedAt(data.syncedAt);
        if (data.journals) setJournals(data.journals);
        if (data.studySessions) setStudySessions(data.studySessions);
        if (data.user) setCurrentUser(data.user);
        showToast('Google Drive synchronized completely!', 'success');
      } else {
        showToast(data.error || 'Sync failed.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error during synchronization.', 'info');
    } finally {
      setDriveLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    setIsDeletingAccount(true);
    try {
      const email = currentUser.email;
      const headers: Record<string, string> = { 'x-auth-email': email };
      const savedToken = localStorage.getItem('reflect_auth_token');
      if (savedToken) headers['x-auth-token'] = savedToken;

      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Your account and all associated data have been permanently deleted.', 'info');
        localStorage.removeItem('reflect_auth_email');
        localStorage.removeItem('reflect_auth_token');
        localStorage.removeItem(`reflect_cached_user_${email}`);
        localStorage.removeItem(`reflect_journals_${email}`);
        localStorage.removeItem(`reflect_study_${email}`);
        localStorage.removeItem(`babu_todos`);
        
        setShowDeleteAccountModal(false);
        setDeleteConfirmInput('');
        setCurrentUser(null);
        setJournals([]);
        setStudySessions([]);
        setPosts([]);
        setChatRooms([]);
        setLeaderboardRankings([]);
        setDriveConnected(false);
        setDriveStatusLoaded(false);
      } else {
        showToast(data.error || 'Failed to delete account.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to server to delete account.', 'info');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const fetchInitialData = (email: string) => {
    const headers: Record<string, string> = { 'x-auth-email': email };
    const savedToken = localStorage.getItem('reflect_auth_token');
    if (savedToken) headers['x-auth-token'] = savedToken;
    
    // Instant restore from local device storage cache if present (Game-style instant load)
    try {
      const cachedJ = localStorage.getItem(`reflect_journals_${email}`);
      if (cachedJ) {
        const parsed = JSON.parse(cachedJ);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJournals(parsed);
          const todayJ = parsed.find((j: any) => j.date === todayDateStr);
          if (todayJ && todayJ.text) setJournalText(todayJ.text);
        }
      }
      const cachedS = localStorage.getItem(`reflect_study_${email}`);
      if (cachedS) {
        const parsed = JSON.parse(cachedS);
        if (Array.isArray(parsed) && parsed.length > 0) setStudySessions(parsed);
      }
      const cachedTodos = localStorage.getItem(`babu_todos_${email}`);
      if (cachedTodos) {
        const parsed = JSON.parse(cachedTodos);
        if (Array.isArray(parsed) && parsed.length > 0) setTodos(parsed);
      }
      const cachedNotes = localStorage.getItem(`reflect_quick_notes_${email}`);
      if (cachedNotes) {
        const parsed = JSON.parse(cachedNotes);
        if (Array.isArray(parsed) && parsed.length > 0) setQuickNotes(parsed);
      }
      const cachedFriends = localStorage.getItem(`reflect_friends_${email}`);
      if (cachedFriends) {
        const parsed = JSON.parse(cachedFriends);
        if (Array.isArray(parsed) && parsed.length > 0) setFriendsList(parsed);
      }
      const cachedRooms = localStorage.getItem(`reflect_chat_rooms_${email}`);
      if (cachedRooms) {
        const parsed = JSON.parse(cachedRooms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatRooms(parsed);
          if (!activeRoomId) setActiveRoomId(parsed[0].id);
        }
      }
      const cachedPosts = localStorage.getItem('reflect_posts_feed');
      if (cachedPosts) {
        const parsed = JSON.parse(cachedPosts);
        if (Array.isArray(parsed) && parsed.length > 0) setPosts(parsed);
      }
    } catch (e) {
      console.error('Local cache read warning:', e);
    }

    // Server load and cache update
    fetch('/api/journals', { headers })
      .then(r => r.json())
      .then(data => {
        if (data.journals && Array.isArray(data.journals)) {
          setJournals(data.journals);
          localStorage.setItem(`reflect_journals_${email}`, JSON.stringify(data.journals));
          const todayJ = data.journals.find((j: any) => j.date === todayDateStr);
          if (todayJ && todayJ.text) setJournalText(todayJ.text);
        }
      })
      .catch(err => console.error('Failed to load journals from server:', err));

    fetch('/api/study/sessions', { headers })
      .then(r => r.json())
      .then(data => {
        if (data.studySessions && Array.isArray(data.studySessions)) {
          setStudySessions(data.studySessions);
          localStorage.setItem(`reflect_study_${email}`, JSON.stringify(data.studySessions));
        }
      })
      .catch(err => console.error('Failed to load study sessions from server:', err));

    fetch('/api/google-drive/status', { headers }).then(r => r.json()).then(data => {
      setDriveConnected(data.connected);
      setDriveSyncedAt(data.syncedAt);
      setDriveEmail(data.email);
      setDriveStatusLoaded(true);
    }).catch(err => {
      console.error('Failed to load Google Drive status', err);
      setDriveStatusLoaded(true);
    });

    fetch('/api/social/feed', { headers }).then(r => r.json()).then(data => {
      setPosts(data.posts || []);
    });

    fetchChatRooms(email);
    fetchFriends(email);
    searchUsers('', email);
    fetchLeaderboards(email, 'global', 'weekly');
    fetchAnalytics(email);
  };

  const fetchChatRooms = (email = currentUser?.email) => {
    if (!email) return;
    fetch('/api/chat/rooms', { headers: { 'x-auth-email': email } })
      .then(r => r.json())
      .then(data => {
        const rooms = data.rooms || [];
        setChatRooms(rooms);
        if (rooms.length > 0) {
          const firstRoom = rooms[0];
          setActiveRoomId(firstRoom.id);
          fetchMessages(firstRoom.id, email);
        }
      });
  };

  const fetchMessages = (roomId: string, email = currentUser?.email) => {
    if (!email) return;
    fetch(`/api/chat/rooms/${roomId}/messages`, { headers: { 'x-auth-email': email } })
      .then(r => r.json())
      .then(data => {
        setChatMessages(data.messages || []);
      });
  };

  const fetchFriends = (email = currentUser?.email) => {
    if (!email) return;
    fetch('/api/social/friends', { headers: { 'x-auth-email': email } })
      .then(r => r.json())
      .then(data => {
        setFriendsList(data.friends || []);
        setPendingRequests(data.pendingRequests || []);
      });
  };

  const searchUsers = (query: string, email = currentUser?.email) => {
    if (!email) return;
    fetch(`/api/social/users?search=${encodeURIComponent(query)}`, { headers: { 'x-auth-email': email } })
      .then(r => r.json())
      .then(data => setUserSearchResult(data.users || []));
  };

  const fetchLeaderboards = (email = currentUser?.email, scope = 'global', period = 'weekly') => {
    if (!email) return;
    fetch(`/api/leaderboard?scope=${scope}&period=${period}`, { headers: { 'x-auth-email': email } })
      .then(r => r.json())
      .then(data => {
        const rankings = (data.rankings || []).filter(
          (r: any) => r.email !== 'dayscore_ai@reflect.edu' && r.username !== 'dayscore_ai'
        );
        setLeaderboardRankings(rankings);
      });
  };

  const fetchAnalytics = (email = currentUser?.email) => {
    if (!email) return;
    fetch('/api/analytics', { headers: { 'x-auth-email': email } })
      .then(r => r.json())
      .then(data => {
        setAnalyticsData(data);
      });
  };

  // --- ACTIONS ---

  const autosaveJournal = async (text: string, dateToUse: string = selectedDate) => {
    if (!currentUser) return;
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({
          text,
          date: dateToUse,
          isDraft: true,
        }),
      });
      if (res.ok) {
        setSaveStatus('saved');
        const d = await res.json();
        setJournals(prev => {
          const index = prev.findIndex(j => j.date === dateToUse);
          if (index > -1) {
            const updated = [...prev];
            updated[index] = d.journal;
            return updated;
          }
          return [...prev, d.journal];
        });
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const triggerEvaluation = async (dateToUse: string = selectedDate) => {
    if (!currentUser) return;
    if (!journalText.trim()) {
      showToast('Please type a reflection entry first!', 'info');
      return;
    }

    setLoadingEvaluate(true);
    try {
      const res = await fetch('/api/journals/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ date: dateToUse, text: journalText }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveEvaluation(data.journal.evaluation);
        setShowEvaluationModal(true);
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 5000);
        
        // Refresh local data state
        setJournals(prev => {
          const idx = prev.findIndex(j => j.date === dateToUse);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = data.journal;
            return copy;
          }
          return [...prev, data.journal];
        });
        setCurrentUser(data.user);
        
        showToast(`AI analysis complete! Score: ${data.journal.score}`, 'success');

        if (data.streakFrozen) {
          setStreakFrozenAlert(true);
        }

        // Check if new badges unlocked
        if (data.user.achievements.length > currentUser.achievements.length) {
          const newBadge = data.user.achievements.find((badge: string) => !currentUser.achievements.includes(badge));
          if (newBadge) {
            showToast(`🏆 Badge unlocked: ${formatBadgeName(newBadge)}`, 'badge');
          }
        }

        fetchInitialData(currentUser.email);
      } else {
        showToast(data.error || 'Evaluation failed', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error communicating with evaluator API', 'info');
    } finally {
      setLoadingEvaluate(false);
    }
  };

  const handleCreateCustomPost = async (text: string, audience: 'public' | 'friends' = postAudience) => {
    if (!currentUser || !text.trim()) return;
    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ content: text, audience }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => [data.post, ...prev]);
        setCustomPostText('');
        showToast(`Shared to ${audience === 'friends' ? 'Friends Feed 👥' : 'Public Feed 🌐'}!`, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Deleted feed update', 'success');
    if (!currentUser) return;
    try {
      await fetch(`/api/social/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'x-auth-email': currentUser.email },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    try {
      const res = await fetch(`/api/social/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? data.post : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostReact = async (postId: string, emoji: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/social/posts/${postId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ emoji }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? data.post : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimerFinishSave = async () => {
    if (!currentUser) return;
    const durationMinutes = Math.round(timerInitialDuration / 60);
    try {
      const res = await fetch('/api/study/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({
          durationMinutes,
          category: selectedTimerCategory,
          shareToFeed: shareTimerToFeed,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStudySessions(prev => [...prev, data.session]);
        setCurrentUser(prev => prev ? { ...prev, stats: data.userStats } : null);
        setShowTimerFinishModal(false);
        setTimerSeconds(timerInitialDuration);
        showToast(`Logged ${durationMinutes} minutes in ${selectedTimerCategory}!`, 'success');
        
        // Refresh feed & stats
        fetchInitialData(currentUser.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- STREAK FREEZE & SHOP ACTIONS ---
  const handleBuyStreakFreeze = async () => {
    if (!currentUser) return;
    setIsStreakLoading(true);
    try {
      const res = await fetch('/api/shop/buy-freeze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast('Successfully bought & equipped 1 Streak Freeze! ❄️', 'success');
        fetchInitialData(currentUser.email);
      } else {
        showToast(data.error || 'Failed to buy Streak Freeze', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error communicating with server', 'info');
    } finally {
      setIsStreakLoading(false);
    }
  };

  const handleClaimDailyGems = async () => {
    if (!currentUser) return;
    setIsStreakLoading(true);
    try {
      const res = await fetch('/api/shop/claim-daily-gems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast('Claimed 100 free Gems! 💎 Let\'s keep learning!', 'success');
        fetchInitialData(currentUser.email);
      } else {
        showToast(data.error || 'Failed to claim gems', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error communicating with server', 'info');
    } finally {
      setIsStreakLoading(false);
    }
  };

  const handleSimulateMissedDay = async () => {
    if (!currentUser) return;
    setIsStreakLoading(true);
    try {
      const res = await fetch('/api/shop/simulate-missed-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast('Missed day simulated! Write a journal reflection now to test the freeze!', 'badge');
        fetchInitialData(currentUser.email);
      } else {
        showToast(data.error || 'Failed to simulate missed day', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error communicating with server', 'info');
    } finally {
      setIsStreakLoading(false);
    }
  };

  const handleSendChatMessage = async (textOverride?: string, audioUrl?: string, audioDuration?: number) => {
    if (!currentUser || !activeRoomId) return;
    const text = textOverride !== undefined ? textOverride : chatInputText;
    if (!text.trim()) return;
    if (textOverride === undefined) setChatInputText('');
    
    // Optimistic message append
    const tempMsg = {
      id: 'm_temp_' + Date.now(),
      senderEmail: currentUser.email,
      text,
      timestamp: new Date().toISOString(),
      reactions: {},
      read: false,
      audioUrl,
      audioDuration
    };
    setChatMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/chat/rooms/${activeRoomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ text, audioUrl, audioDuration }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchMessages(activeRoomId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendFriendRequest = async (toEmail: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/social/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ toEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Friend request sent!', 'success');
        fetchFriends();
      } else {
        showToast(data.error, 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const respondFriendRequest = async (fromEmail: string, action: 'accept' | 'reject') => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/social/friends/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ fromEmail, action }),
      });
      if (res.ok) {
        showToast(action === 'accept' ? 'Friend request accepted!' : 'Friend request rejected', 'success');
        fetchFriends();
        fetchChatRooms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (displayName: string, bio: string, avatarUrl: string, frame: AvatarFrame = 'none') => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ displayName, bio, avatarUrl, frame }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast('Profile and Avatar Frame updated successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to update profile', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating profile', 'info');
    }
  };

  // --- VOICE TYPING PIPELINE: 1. RECORD -> 2. ANALYZE -> 3. FAST TYPE ---
  const startVoiceRecording = async () => {
    setVoiceLiveTranscript('');
    setVoiceSeconds(0);
    audioChunksRef.current = [];

    if (voiceTimerIntervalRef.current) clearInterval(voiceTimerIntervalRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);

      voiceTimerIntervalRef.current = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
      }, 1000);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let currentStr = '';
            for (let i = 0; i < event.results.length; ++i) {
              currentStr += event.results[i][0].transcript;
            }
            if (currentStr.trim()) {
              setVoiceLiveTranscript(currentStr.trim());
            }
          };

          speechRecognitionRef.current = recognition;
          recognition.start();
        } catch (e) {
          console.warn('Speech recognition interim warning:', e);
        }
      }

      setVoiceStatus('recording');
      showToast('🎙️ Voice recording active! Speak clearly...', 'info');

    } catch (err: any) {
      console.warn('Microphone stream error, starting fallback speech dictation:', err);
      startFallbackSpeechRecognition();
    }
  };

  const startFallbackSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        setVoiceStatus('recording');
        setVoiceSeconds(0);
        voiceTimerIntervalRef.current = setInterval(() => setVoiceSeconds(s => s + 1), 1000);

        recognition.onresult = (event: any) => {
          let str = '';
          for (let i = 0; i < event.results.length; ++i) {
            str += event.results[i][0].transcript;
          }
          setVoiceLiveTranscript(str.trim());
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
        showToast('🎙️ Voice dictation active! Speak clearly...', 'info');
      } catch (e) {
        runSimulatedVoiceTyping();
      }
    } else {
      runSimulatedVoiceTyping();
    }
  };

  const stopAndAnalyzeVoice = async () => {
    if (voiceTimerIntervalRef.current) {
      clearInterval(voiceTimerIntervalRef.current);
      voiceTimerIntervalRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      } catch (e) {}
    }

    setVoiceStatus('idle');

    const spokenText = voiceLiveTranscript.trim();
    if (spokenText) {
      setJournalText(prev => {
        const existing = prev.trim();
        return existing ? `${existing}\n\n${spokenText}` : spokenText;
      });
      showToast('🎙️ Voice recorded exactly as spoken!', 'success');
    } else {
      showToast('No speech detected. Please speak into your microphone.', 'info');
    }
  };

  const typeTextIntoJournal = (textToType: string) => {
    setVoiceStatus('typing');
    
    const existingText = journalText.trim();
    const prefix = existingText ? `${existingText}\n\n` : '';
    let charIndex = 0;

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      if (charIndex < textToType.length) {
        charIndex += 2;
        const typedChunk = textToType.substring(0, Math.min(charIndex, textToType.length));
        setJournalText(prefix + typedChunk);
      } else {
        clearInterval(typingIntervalRef.current);
        setJournalText(prefix + textToType);
        setVoiceStatus('idle');
        showToast('✨ Voice analyzed & typed with precision!', 'success');
      }
    }, 12);
  };

  const cancelOrSkipVoice = () => {
    if (voiceTimerIntervalRef.current) clearInterval(voiceTimerIntervalRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (e) {}
    }
    setVoiceStatus('idle');
  };

  const runSimulatedVoiceTyping = () => {
    setVoiceStatus('recording');
    setVoiceSeconds(0);
    voiceTimerIntervalRef.current = setInterval(() => setVoiceSeconds(s => s + 1), 1000);
    setVoiceLiveTranscript("");
  };

  // --- UTILS & LOOKUPS ---
  const formatBadgeName = (id: string) => {
    switch (id) {
      case 'reflection_rookie': return 'Reflection Rookie 🌱';
      case 'streak_master': return 'Streak Master 🔥';
      case 'perfect_score': return 'Perfect 100 Score 🏆';
      case 'study_marathoner': return 'Study Marathoner 🎓';
      default: return id;
    }
  };

  const getBadgeIcon = (id: string) => {
    switch (id) {
      case 'reflection_rookie': return <Award className="w-8 h-8 text-emerald-500" />;
      case 'streak_master': return <Flame className="w-8 h-8 text-orange-500" />;
      case 'perfect_score': return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'study_marathoner': return <Timer className="w-8 h-8 text-blue-500" />;
      default: return <Award className="w-8 h-8 text-slate-500" />;
    }
  };

  // Today's entry lookup helper
  const todayEntry = useMemo(() => {
    return journals.find(j => j.date === todayDateStr);
  }, [journals, todayDateStr]);

  // Selected date entry lookup helper
  const selectedEntry = useMemo(() => {
    return journals.find(j => j.date === selectedDate);
  }, [journals, selectedDate]);

  // Handle Light/Dark Theme Switcher
  const toggleTheme = () => {
    if (isThemeDark) {
      setIsThemeDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('reflect_theme', 'light');
    } else {
      setIsThemeDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('reflect_theme', 'dark');
    }
  };

  // --- RENDERING VIEWS ---

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors relative">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <AnimatedLogo size="lg" />
          </div>
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="text-[31px] font-bold text-center leading-[40px] tracking-tight text-slate-900 dark:text-white mb-1 cursor-pointer"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            BaBU
          </motion.h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
            Daily reflection, Pomodoro flow, and peer accountability powered by Google Gemini AI.
          </p>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl space-y-5 relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h2 className="text-xs font-black text-slate-800 dark:text-white font-display uppercase tracking-wider">
                  Google Account Sign-In
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                <Shield className="w-3 h-3" /> Secured
              </span>
            </div>

            {!selectedGoogleAccount ? (
              <div className="space-y-4">
                {/* Saved accounts if available */}
                {savedGoogleAccounts.length > 0 && !isEnteringNewAccount ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select a Google account on this device:</p>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                      {savedGoogleAccounts.map((acc) => (
                        <div
                          key={acc.email}
                          onClick={() => handleSelectGoogleAccountForAuth(acc.email, acc.displayName, acc.photoUrl)}
                          className="group relative flex items-center gap-3.5 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl transition-all cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm"
                        >
                          <img
                            src={acc.photoUrl}
                            alt={acc.displayName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {acc.displayName}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                              {acc.email}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveSavedAccount(acc.email, e)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Remove account from device"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEnteringNewAccount(true);
                        setCustomGoogleEmail('');
                        setCustomGoogleName('');
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <span>Use another Google account</span>
                    </button>
                  </div>
                ) : (
                  /* Form to enter Google Email & Name */
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!customGoogleEmail.trim()) return;
                      handleSelectGoogleAccountForAuth(
                        customGoogleEmail,
                        customGoogleName,
                        `https://api.dicebear.com/7.x/adventurer/svg?seed=${customGoogleEmail.trim().toLowerCase()}`
                      );
                    }}
                    className="space-y-3.5"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Enter your Google account details to proceed:
                    </p>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Google Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={customGoogleEmail}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomGoogleEmail(val);
                            if (!customGoogleName && val.includes('@')) {
                              const prefix = val.split('@')[0];
                              const formatted = prefix.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                              setCustomGoogleName(formatted);
                            }
                          }}
                          placeholder="e.g. yourname@gmail.com"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name / Display Name</label>
                      <input
                        type="text"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        placeholder="e.g. Alex Smith"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      {savedGoogleAccounts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsEnteringNewAccount(false)}
                          className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={authLoading || !customGoogleEmail.trim()}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {authLoading ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Continue with Google Account →'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Password Step for Selected Google Account */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGoogleLogin(selectedGoogleAccount.email, selectedGoogleAccount.displayName, selectedGoogleAccount.photoUrl, googlePasswordInput);
                }}
                className="space-y-4"
              >
                {/* Account card summary header */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedGoogleAccount.photoUrl}
                      alt={selectedGoogleAccount.displayName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedGoogleAccount.displayName}</h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate">{selectedGoogleAccount.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGoogleAccount(null);
                      setGooglePasswordInput('');
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg cursor-pointer shrink-0"
                  >
                    Change
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {googleAccountIsRegistered === false ? 'Set Strong Password (First Time)' : 'Account Password'}
                    </label>
                    {googleAccountIsRegistered === false ? (
                      <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        New Account
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                        Existing Account
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type={showGooglePasswordText ? "text" : "password"}
                      required
                      minLength={googleAccountIsRegistered === false ? 6 : undefined}
                      value={googlePasswordInput}
                      onChange={(e) => setGooglePasswordInput(e.target.value)}
                      placeholder={googleAccountIsRegistered === false ? "Set strong password (at least 6 characters)" : "Enter the same password you set while creating account"}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGooglePasswordText(!showGooglePasswordText)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showGooglePasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter when registering */}
                  {googleAccountIsRegistered === false && googlePasswordInput && (
                    <div className="space-y-1 pt-1">
                      <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${calculatePasswordStrength(googlePasswordInput).score >= 1 ? calculatePasswordStrength(googlePasswordInput).color : 'bg-transparent'}`} style={{ width: '33%' }} />
                        <div className={`h-full transition-all duration-300 ${calculatePasswordStrength(googlePasswordInput).score >= 2 ? calculatePasswordStrength(googlePasswordInput).color : 'bg-transparent'}`} style={{ width: '33%' }} />
                        <div className={`h-full transition-all duration-300 ${calculatePasswordStrength(googlePasswordInput).score >= 3 ? calculatePasswordStrength(googlePasswordInput).color : 'bg-transparent'}`} style={{ width: '34%' }} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{calculatePasswordStrength(googlePasswordInput).label}</span>
                      </p>
                    </div>
                  )}

                  <p className="text-[9px] text-slate-400 leading-tight">
                    {googleAccountIsRegistered === false
                      ? 'Set a strong password for your new account to keep it secured.'
                      : 'Enter the same password you set when creating your account.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={authLoading || (googleAccountIsRegistered === false && googlePasswordInput.length < 6)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <span>{googleAccountIsRegistered === false ? 'Set Password & Create Account →' : 'Log In with Password →'}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* --- GOOGLE SSO MODAL OVERLAY --- */}
        <AnimatePresence>
          {showGoogleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 md:p-7 text-slate-800 dark:text-slate-200 overflow-hidden"
              >
                {/* Google Brand Header */}
                <div className="text-center pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2.5">
                    <svg className="w-10 h-10" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                    Sign in with Google
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    to continue to <span className="font-extrabold text-indigo-600 dark:text-indigo-400">BaBU</span>
                  </p>
                </div>

                {/* Body Content */}
                <div className="py-5">
                  {!selectedGoogleAccount ? (
                    savedGoogleAccounts.length > 0 && !isEnteringNewAccount ? (
                      <div className="space-y-3">
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                          {savedGoogleAccounts.map((acc) => (
                            <div
                              key={acc.email}
                              onClick={() => handleSelectGoogleAccountForAuth(acc.email, acc.displayName, acc.photoUrl)}
                              className="group relative flex items-center gap-3.5 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl transition-all cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm"
                            >
                              <SafeAvatar
                                src={acc.photoUrl}
                                name={acc.displayName}
                                size="sm"
                              />
                              <div className="flex-grow min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {acc.displayName}
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                                  {acc.email}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveSavedAccount(acc.email, e)}
                                className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Remove account from this device"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsEnteringNewAccount(true);
                            setCustomGoogleEmail('');
                            setCustomGoogleName('');
                          }}
                          className="w-full flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                        >
                          <User className="w-4 h-4 text-indigo-500" />
                          <span>Use another Google account</span>
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!customGoogleEmail.trim()) return;
                          handleSelectGoogleAccountForAuth(
                            customGoogleEmail,
                            customGoogleName,
                            `https://api.dicebear.com/7.x/adventurer/svg?seed=${customGoogleEmail.trim().toLowerCase()}`
                          );
                        }}
                        className="space-y-4"
                      >
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Enter your Google account details to sign in to BaBU:
                        </p>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-display">
                            Google Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={customGoogleEmail}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomGoogleEmail(val);
                              if (!customGoogleName && val.includes('@')) {
                                const prefix = val.split('@')[0];
                                const formatted = prefix.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                setCustomGoogleName(formatted);
                              }
                            }}
                            placeholder="e.g. yourname@gmail.com"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-display">
                            Full Name / Display Name
                          </label>
                          <input
                            type="text"
                            value={customGoogleName}
                            onChange={(e) => setCustomGoogleName(e.target.value)}
                            placeholder="e.g. Alex Smith"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex gap-2.5 pt-2">
                          {savedGoogleAccounts.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setIsEnteringNewAccount(false)}
                              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                            >
                              Back
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={authLoading || !customGoogleEmail.trim()}
                            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {authLoading ? (
                              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                              <span>Continue →</span>
                            )}
                          </button>
                        </div>
                      </form>
                    )
                  ) : (
                    /* Password Step */
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleGoogleLogin(selectedGoogleAccount.email, selectedGoogleAccount.displayName, selectedGoogleAccount.photoUrl, googlePasswordInput);
                      }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={selectedGoogleAccount.photoUrl}
                            alt={selectedGoogleAccount.displayName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedGoogleAccount.displayName}</h4>
                            <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate">{selectedGoogleAccount.email}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGoogleAccount(null);
                            setGooglePasswordInput('');
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg cursor-pointer shrink-0"
                        >
                          Change
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            {googleAccountIsRegistered === false ? 'Set Strong Password (First Time)' : 'Account Password'}
                          </label>
                          {googleAccountIsRegistered === false ? (
                            <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                              New Account
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                              Existing Account
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                          <input
                            type={showGooglePasswordText ? "text" : "password"}
                            required
                            minLength={googleAccountIsRegistered === false ? 6 : undefined}
                            value={googlePasswordInput}
                            onChange={(e) => setGooglePasswordInput(e.target.value)}
                            placeholder={googleAccountIsRegistered === false ? "Set strong password (at least 6 characters)" : "Enter the same password you set while creating account"}
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowGooglePasswordText(!showGooglePasswordText)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showGooglePasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Password Strength Meter when registering */}
                        {googleAccountIsRegistered === false && googlePasswordInput && (
                          <div className="space-y-1 pt-1">
                            <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-300 ${calculatePasswordStrength(googlePasswordInput).score >= 1 ? calculatePasswordStrength(googlePasswordInput).color : 'bg-transparent'}`} style={{ width: '33%' }} />
                              <div className={`h-full transition-all duration-300 ${calculatePasswordStrength(googlePasswordInput).score >= 2 ? calculatePasswordStrength(googlePasswordInput).color : 'bg-transparent'}`} style={{ width: '33%' }} />
                              <div className={`h-full transition-all duration-300 ${calculatePasswordStrength(googlePasswordInput).score >= 3 ? calculatePasswordStrength(googlePasswordInput).color : 'bg-transparent'}`} style={{ width: '34%' }} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Shield className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>{calculatePasswordStrength(googlePasswordInput).label}</span>
                            </p>
                          </div>
                        )}

                        <p className="text-[9px] text-slate-400 leading-tight">
                          {googleAccountIsRegistered === false
                            ? 'Set a strong password for your new account to keep it secured.'
                            : 'Enter the same password you set when creating your account.'}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading || (googleAccountIsRegistered === false && googlePasswordInput.length < 6)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {authLoading ? (
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <span>{googleAccountIsRegistered === false ? 'Set Password & Create Account →' : 'Log In with Password →'}</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Cancel / Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleModal(false);
                      setIsEnteringNewAccount(false);
                      setSelectedGoogleAccount(null);
                      setGooglePasswordInput('');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-tight max-w-[200px]">
                    Google account data is protected with strong password security.
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-tr from-[#f5f3ff] via-[#faf5ff] to-[#fff1f2] dark:bg-gradient-to-tr dark:from-[#090514] dark:via-[#02010a] dark:to-[#0f0410] text-slate-900 dark:text-white transition-colors overflow-hidden font-sans relative">

      {/* Vibrant Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-gradient-to-br from-violet-400/20 to-fuchsia-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-gradient-to-br from-rose-400/20 to-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Toast notifications portal */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`p-4 rounded-xl shadow-lg flex items-center gap-2.5 max-w-sm pointer-events-auto border text-xs font-semibold ${
                t.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-100 dark:border-emerald-900' 
                  : t.type === 'badge'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border-indigo-100 dark:border-indigo-900'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-800'
              }`}
            >
              {t.type === 'badge' ? <Trophy className="w-5 h-5 text-indigo-500 flex-shrink-0 animate-bounce" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
              <div>{t.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confetti Celebration Overlay */}
      <ConfettiCanvas active={confettiActive} />

      {/* Mobile Top Header Bar with App Logo, Name, Student Hub & Branding */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AnimatedLogo size="sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black tracking-tight text-slate-900 dark:text-white font-display text-base leading-none">BaBU</h2>
              <span className="text-[9px] bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Student Hub</span>
            </div>
            <span className="text-[8px] font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 uppercase block mt-0.5">BY - AAROGYA PARAJULI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1 rounded-full text-xs font-black text-amber-600 dark:text-amber-400">
            <span>🔥</span>
            <span>{currentUser.stats.currentStreak}d</span>
          </div>
        </div>
      </div>

      {/* --- SIDEBAR LAYOUT --- */}
      <aside className="w-64 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between flex-shrink-0 select-none hidden md:flex relative z-10">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2.5">
            <AnimatedLogo size="sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black tracking-tight text-slate-900 dark:text-white font-display text-base leading-none">BaBU</h2>
                <span className="text-[9px] bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Student Hub</span>
              </div>
              <span className="text-[8px] font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 uppercase block mt-0.5">BY - AAROGYA PARAJULI</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Home Dashboard', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'journals', label: 'Time Hub & Tasks', icon: <Clock className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics Insights', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'social', label: 'Student Feed', icon: <Users className="w-4 h-4" /> },
              { id: 'chat', label: 'Classroom Chat', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'leaderboard', label: 'Trophy Rank', icon: <Trophy className="w-4 h-4" /> },
              { id: 'profile', label: 'Student Profile', icon: <User className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id as any);
                  if (item.id === 'analytics') fetchAnalytics();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                  currentTab === item.id
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-200/50 dark:shadow-none translate-x-1'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:translate-x-0.5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Mini Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <SafeAvatar
              src={currentUser.avatarUrl}
              name={currentUser.displayName}
              frame={currentUser.frame}
              size="sm"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentUser.displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-rose-500 py-2 px-2 text-xs font-bold transition-colors rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* --- MOBILE NAVBAR --- */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-6 gap-0.5 z-30 py-2 px-1"
      >
        {[
          { id: 'home', label: 'Home', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'journals', label: 'Time', icon: <Clock className="w-4 h-4" /> },
          { id: 'leaderboard', label: 'Rank', icon: <Trophy className="w-4 h-4 text-amber-500" /> },
          { id: 'social', label: 'Feed', icon: <Users className="w-4 h-4" /> },
          { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        ].map((item) => (
          <div
            key={item.id}
            role="button"
            onClick={() => {
              setCurrentTab(item.id as any);
              if (item.id === 'leaderboard') fetchLeaderboards(currentUser.email, 'global', 'weekly');
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold cursor-pointer transition-colors py-1 ${
              currentTab === item.id ? 'text-violet-600 dark:text-violet-400 font-extrabold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* --- CORE WORKING PANELS --- */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-20 md:pb-0 pt-12 md:pt-0">
        
        {/* TAB 1: HOME DASHBOARD */}
        {currentTab === 'home' && (
          <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* STREAK SAVED ALERT (DUOLINGO STYLE) */}
            <AnimatePresence>
              {streakFrozenAlert && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 border-4 border-cyan-400 rounded-[32px] p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(6,182,212,0.4)] relative overflow-hidden"
                  >
                    {/* Icicle background decoration */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 rounded-b-xl" />
                    
                    {/* Frozen Shield & Snowflake Graphic */}
                    <div className="relative flex justify-center mb-6 pt-4">
                      {/* Frozen Aura */}
                      <motion.div 
                        className="absolute w-24 h-24 rounded-full bg-cyan-400/20 blur-xl"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                      <div className="relative bg-gradient-to-b from-cyan-500 to-blue-600 p-6 rounded-full text-white shadow-lg border-2 border-cyan-200">
                        <Snowflake className="w-12 h-12 fill-cyan-100" />
                        <Flame className="w-6 h-6 absolute -bottom-1 -right-1 text-orange-400 fill-orange-400 animate-pulse" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight uppercase">
                      Streak Preserved! ❄️🔥
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">
                      You missed reflecting yesterday, but your <strong className="text-cyan-600 dark:text-cyan-400">{currentUser.stats.currentStreak} Day Streak</strong> was protected and frozen with a <strong>Streak Freeze</strong>!
                    </p>

                    <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl border border-cyan-100 dark:border-cyan-900 text-[11px] text-cyan-800 dark:text-cyan-300 font-bold">
                      Your streak did not reset to 0. Keep reflecting daily to maintain the spark!
                    </div>

                    <button
                      onClick={() => setStreakFrozenAlert(false)}
                      className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:translate-y-0.5 text-white font-black rounded-2xl shadow-lg shadow-cyan-200/50 dark:shadow-none transition-all cursor-pointer"
                    >
                      Awesome! Continue Streak 🙌
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>



            {/* Core Action Layout */}
            <div className="space-y-6">
              
              {/* Main Column: Reflection and Multi-Day Evaluation */}
              <div className="space-y-6">
                
                {/* Date Navigation & Multi-Day Memory Controller */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-[28px] border border-violet-100/50 dark:border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(selectedDate);
                        d.setDate(d.getDate() - 1);
                        setSelectedDate(d.toISOString().split('T')[0]);
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Previous Day"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev Day</span>
                    </button>

                    <div className="relative flex items-center gap-2 px-3 py-2 bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 rounded-2xl shadow-inner">
                      <CalendarIcon className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          if (e.target.value) setSelectedDate(e.target.value);
                        }}
                        className="bg-transparent text-xs font-black text-slate-800 dark:text-white cursor-pointer focus:outline-none"
                      />
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        selectedDate === todayDateStr 
                          ? 'bg-emerald-500 text-white' 
                          : selectedDate < todayDateStr 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-violet-500 text-white'
                      }`}>
                        {selectedDate === todayDateStr ? 'Today' : selectedDate < todayDateStr ? 'Past' : 'Future'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(selectedDate);
                        d.setDate(d.getDate() + 1);
                        setSelectedDate(d.toISOString().split('T')[0]);
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Next Day"
                    >
                      <span className="hidden sm:inline">Next Day</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Date Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 justify-center">
                    {[
                      { label: 'Today', date: todayDateStr },
                      { label: 'Yesterday', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
                      { label: '2d Ago', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] },
                      { label: '3d Ago', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] },
                    ].map(item => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedDate(item.date)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          selectedDate === item.date
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Journal reflection writer card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <h3 className="text-slate-800 dark:text-white font-bold text-sm">
                        {selectedDate === todayDateStr ? "Today's Reflection Journal" : `Reflection Journal for ${selectedDate}`}
                      </h3>
                    </div>
                    {/* Saved Status Indicator */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {saveStatus === 'saved' && <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /> Autosaved</span>}
                      {saveStatus === 'saving' && <span className="animate-pulse text-[11px] font-semibold text-slate-400">Saving draft...</span>}
                      {saveStatus === 'error' && <span className="text-rose-500 text-[11px] font-semibold">Autosave failed</span>}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={journalText}
                      onChange={e => setJournalText(e.target.value)}
                      placeholder={selectedDate === todayDateStr
                        ? "Write about your day. What goals did you hit? Where did you procrastinate? Feel free to use lists, emojis, bullet points, mixed language, or dictation..."
                        : `Write or update your reflection for ${selectedDate}...`
                      }
                      className="w-full h-64 md:h-72 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-violet-500 dark:focus:border-violet-500 focus:outline-none text-sm leading-relaxed transition-colors text-slate-800 dark:text-white font-medium resize-none"
                    />
                    
                    {/* Mic Button */}
                    <button
                      type="button"
                      onClick={voiceStatus === 'recording' ? stopAndAnalyzeVoice : startVoiceRecording}
                      disabled={voiceStatus === 'analyzing'}
                      className={`absolute bottom-3 right-3 p-3 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                        voiceStatus === 'recording'
                          ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse'
                          : voiceStatus === 'analyzing'
                          ? 'bg-violet-400 text-white opacity-60 cursor-not-allowed'
                          : 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white hover:scale-105'
                      }`}
                      title={voiceStatus === 'recording' ? "Stop & Analyze Voice" : "Voice Typing"}
                    >
                      <Mic className="w-4 h-4" />
                      {voiceStatus === 'recording' && (
                        <span className="text-[10px] font-black uppercase tracking-wider pr-1">Stop</span>
                      )}
                    </button>
                  </div>

                  {/* Evaluate Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => triggerEvaluation(selectedDate)}
                      disabled={loadingEvaluate || !journalText.trim()}
                      className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:translate-y-0.5 border-b-4 border-violet-800 active:border-b-0 text-white text-sm font-black rounded-2xl transition-all duration-100 flex items-center justify-center gap-2 shadow-lg shadow-violet-200/50 dark:shadow-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {loadingEvaluate ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Evaluating Reflection...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          {selectedDate === todayDateStr ? 'Evaluate Reflection' : `Evaluate Reflection for ${selectedDate}`}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* DayScore AI Score Mark - Shows mark directly at first, opens total detail modal when clicked */}
                {selectedEntry && (selectedEntry.score != null || selectedEntry.evaluation != null) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedEntry.evaluation) {
                        setActiveEvaluation(selectedEntry.evaluation);
                        setShowEvaluationModal(true);
                      } else {
                        triggerEvaluation(selectedDate);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-indigo-600/10 dark:from-violet-950/50 dark:to-slate-900 p-5 rounded-[28px] border-2 border-violet-300 dark:border-violet-700 hover:border-violet-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left group"
                    title="Click mark to open total detail of daily score"
                  >
                    <div className="flex items-center gap-4">
                      {/* Score Mark Circle Badge */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-indigo-600 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
                        <span className="text-xl sm:text-2xl leading-none font-display">
                          {selectedEntry.score ?? selectedEntry.evaluation?.score ?? 0}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider opacity-90 mt-0.5">/ 100</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg">{selectedEntry.emoji || selectedEntry.evaluation?.emoji || '✨'}</span>
                          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">
                            {selectedEntry.title || selectedEntry.evaluation?.title || 'Daily Score Mark'}
                          </h4>
                        </div>
                        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                          Daily reflection score calculated. Click this mark to view complete AI breakdown & tips →
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 text-white font-black text-xs rounded-xl shadow-sm group-hover:bg-violet-500 transition-colors shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>View Details</span>
                    </div>
                  </button>
                ) : (
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white font-display">
                      No DayScore Calculated Yet for {selectedDate === todayDateStr ? 'Today' : selectedDate}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Write your reflection journal entry above and click <strong className="text-violet-600 dark:text-violet-400">Evaluate Reflection</strong> to receive your score mark!
                    </p>
                  </div>
                )}

                {/* Contribution peek */}
                <ContributionGraph 
                  journals={journals} 
                  onCellClick={(evaluation, dateStr) => {
                    if (dateStr) setSelectedDate(dateStr);
                    if (evaluation) {
                      setActiveEvaluation(evaluation);
                      setShowEvaluationModal(true);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIME HUB, POMODORO & TO DO LIST */}
        {currentTab === 'journals' && (
          <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            
            {/* Grid layout for Pomodoro Timer & To-Do List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Pomodoro Focus Timer */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-violet-500" />
                    <h3 className="text-sm font-black text-slate-800 dark:text-white font-display">Pomodoro Focus Timer</h3>
                  </div>
                </div>

                {/* Pomodoro Time Selection Options */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Choose Focus Time:
                  </label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
                    {[15, 25, 45, 60].map(mins => {
                      const isSelected = Math.round(timerInitialDuration / 60) === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          disabled={timerIsRunning}
                          onClick={() => {
                            setTimerInitialDuration(mins * 60);
                            setTimerSeconds(mins * 60);
                            setFocusedSecondsInCurrentSession(0);
                            showToast(`Focus time set to ${mins} minutes`, 'info');
                          }}
                          className={`py-2 rounded-xl text-xs font-black transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          } ${timerIsRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {mins}m
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-4xl font-black text-slate-800 dark:text-white tracking-widest leading-none font-mono">
                    {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                    {(timerSeconds % 60).toString().padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-2">
                    Target: {Math.round(timerInitialDuration / 60)} Min Deep Work
                  </span>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      if (timerIsRunning) {
                        // User is pausing
                        setTimerIsRunning(false);
                        if (focusedSecondsInCurrentSession >= 30) {
                          setHasCompletedFocusPeriod(true);
                          showToast('Focus session paused. Option to share cycles is now unlocked!', 'success');
                        } else {
                          showToast('Paused focus timer.', 'info');
                        }
                      } else {
                        // User is starting
                        setTimerIsRunning(true);
                      }
                    }}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      timerIsRunning 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-b-4 border-orange-700 active:border-b-0' 
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-b-4 border-indigo-800 active:border-b-0'
                    }`}
                  >
                    {timerIsRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {timerIsRunning ? 'Pause' : 'Start Focus'}
                  </button>

                  {/* Small Share Pomodoro Button on side of Start Focus/Pause (Visible when paused) */}
                  {!timerIsRunning && (
                    <button
                      type="button"
                      onClick={() => {
                        setPomodoroShareCategory(selectedTimerCategory + ' & Deep Work');
                        setShowPomodoroShareModal(true);
                      }}
                      className="px-3.5 bg-gradient-to-r from-rose-600 via-amber-500 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 text-xs font-bold animate-pulse"
                      title="Share Pomodoro Focus to Feed"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-[11px] hidden sm:inline">Share</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setTimerIsRunning(false);
                      setTimerSeconds(timerInitialDuration);
                      setFocusedSecondsInCurrentSession(0);
                    }}
                    className="px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TO DO LIST & USER INPUT */}
              <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-violet-500" />
                      TO DO LIST
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage tasks manually or auto-generate actionable goals with DayScore AI</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-violet-500/10 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-800/80 rounded-full text-xs font-black">
                      {todos.filter(t => t.completed).length} / {todos.length} Done
                    </span>
                    {todos.some(t => t.completed) && (
                      <button
                        type="button"
                        onClick={handleClearCompletedTodos}
                        className="px-2.5 py-1 text-[11px] font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Clear finished tasks"
                      >
                        Clear Done
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary User Task Entry Form */}
                <form onSubmit={handleAddTodo} className="space-y-3 bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5">
                    <textarea
                      rows={2}
                      value={newTodoText}
                      onChange={e => setNewTodoText(e.target.value)}
                      placeholder="Write your task or detailed multi-step plan here (long tasks supported)..."
                      className="flex-1 w-full px-4 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-violet-500 text-slate-800 dark:text-white font-medium shadow-sm resize-y min-h-[44px]"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddTodo(e);
                        }
                      }}
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* Add Button */}
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer flex-shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>

                      {/* AI Task Generator Button - Responsive & Perfectly Fitted */}
                      <button
                        type="button"
                        onClick={handleGenerateAiTodos}
                        disabled={isGeneratingTodos}
                        className="flex-1 sm:flex-none px-3.5 py-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 hover:from-violet-500 hover:to-rose-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex-shrink-0"
                        title="AI Auto-Generate Tasks from Journal"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span className="whitespace-nowrap">✨ AI Auto-Task</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Selection Pills (Academic, Health, Focus, Habit) */}
                  <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0">Category:</span>
                    {[
                      { id: 'Academic', label: 'Academic 📚', color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
                      { id: 'Health', label: 'Health 🏃‍♂️', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
                      { id: 'Focus', label: 'Focus 🧠', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
                      { id: 'Habit', label: 'Habit ✨', color: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewTodoCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex-shrink-0 ${
                          newTodoCategory === cat.id
                            ? `${cat.color} ring-2 ring-violet-400 ring-offset-1 font-extrabold shadow-sm`
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-violet-300'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Aesthetic Todo Items List */}
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {todos.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="font-medium text-slate-500 dark:text-slate-400">No tasks added yet!</p>
                      <p className="text-[10px] text-slate-400 mt-1">Type your goal above and click Add, or tap ✨ AI Auto-Task button.</p>
                    </div>
                  ) : (
                    todos.map(todo => {
                      const getCategoryBadgeClass = (category: string) => {
                        switch (category) {
                          case 'Academic':
                            return 'bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
                          case 'Health':
                            return 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                          case 'Focus':
                            return 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                          case 'Habit':
                            return 'bg-fuchsia-100/80 dark:bg-fuchsia-950/80 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800';
                          default:
                            return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600';
                        }
                      };

                      return (
                        <div
                          key={todo.id}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                            todo.completed
                              ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 text-slate-400 opacity-75 line-through'
                              : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-white shadow-sm hover:shadow-md hover:border-violet-300/80'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => handleToggleTodo(todo.id)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer flex-shrink-0 mt-0.5 ${
                                todo.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-600 hover:border-violet-500 bg-slate-50 dark:bg-slate-900'
                              }`}
                            >
                              {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                            <div className="flex-1 min-w-0 space-y-1">
                              <p className={`text-xs font-semibold leading-relaxed whitespace-pre-wrap break-words ${
                                todo.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'
                              }`}>
                                {todo.text}
                              </p>
                              {todo.isAiGenerated && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/80 dark:to-orange-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 rounded-md text-[9px] font-black uppercase">
                                  <Sparkles className="w-2.5 h-2.5" /> AI Generated Task
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold ${getCategoryBadgeClass(todo.category)}`}>
                              {todo.category}
                            </span>
                            <button
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50"
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Calendar Grid Simulation (Last 35 days) */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white font-display flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-violet-500" />
                  Reflection Calendar History
                </h3>
                <span className="text-[10px] text-slate-400">Click any day to inspect AI evaluation</span>
              </div>

              <div className="grid grid-cols-7 gap-3 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <span key={d} className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: 35 }).map((_, idx) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (34 - idx));
                  const dateStr = date.toISOString().split('T')[0];
                  const entry = journals.find(j => j.date === dateStr);
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (entry && entry.evaluation) {
                          setActiveEvaluation(entry.evaluation);
                          setShowEvaluationModal(true);
                        } else {
                          showToast('No AI evaluation available for this day.', 'info');
                        }
                      }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all cursor-pointer hover:scale-105 ${
                        entry?.score
                          ? 'bg-gradient-to-tr from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 shadow-sm shadow-emerald-100/30'
                          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100/80 dark:border-slate-800/60 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{date.getDate()}</span>
                      {entry?.score ? (
                        <>
                          <span className="text-xs font-black mt-1 leading-none">{entry.score}</span>
                          <span className="text-xs mt-0.5 leading-none">{entry.emoji}</span>
                        </>
                      ) : (
                        <span className="text-[9px] text-slate-300 mt-1">•</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ANALYTICS INSIGHTS */}
        {currentTab === 'analytics' && (
          <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Personal Intelligence Engine</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">Analytics Dashboard</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Simple, visual insights into your daily reflection scores, study focus, and habit growth.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 text-violet-500" />
                  <span>Last 30 Days</span>
                </span>
              </div>
            </div>

            {analyticsData ? (
              <div className="space-y-8">
                {/* --- TOP 4 KPI METRICS CARDS --- */}
                {(() => {
                  const totalCategoryMins = analyticsData.radarData.reduce((acc, curr) => acc + curr.minutes, 0) || 1;
                  const sortedCategories = [...analyticsData.radarData].sort((a, b) => b.minutes - a.minutes);
                  const topCat = sortedCategories[0] || { subject: 'General Study', minutes: 60 };
                  const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1'];

                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* KPI 1: Average Score */}
                        <div className="p-5 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-white dark:to-slate-900 rounded-[28px] border border-violet-200/60 dark:border-violet-900/50 shadow-md flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400 font-display">Average Day Score</span>
                            <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white font-display flex items-baseline gap-1">
                              <span>{currentUser.stats.averageScore || 75}%</span>
                            </div>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-violet-500/10 text-violet-700 dark:text-violet-300 rounded-full text-[10px] font-bold">
                              {currentUser.stats.averageScore >= 80 ? '🔥 High Flow' : '✨ Solid Progress'}
                            </span>
                          </div>
                        </div>

                        {/* KPI 2: Total Focus Time */}
                        <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:to-slate-900 rounded-[28px] border border-emerald-200/60 dark:border-emerald-900/50 shadow-md flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-display">Total Focus Time</span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <Timer className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white font-display">
                              {currentUser.stats.totalStudyHours || 0}h
                            </div>
                            <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                              Logged in study sessions
                            </p>
                          </div>
                        </div>

                        {/* KPI 3: Streak Consistency */}
                        <div className="p-5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:to-slate-900 rounded-[28px] border border-amber-200/60 dark:border-amber-900/50 shadow-md flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-display">Reflection Streak</span>
                            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                              <Flame className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white font-display flex items-center gap-1.5">
                              <span>{currentUser.stats.currentStreak || 0} Days</span>
                              <span className="text-xl">🔥</span>
                            </div>
                            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                              Record: {currentUser.stats.longestStreak || 0} days
                            </p>
                          </div>
                        </div>

                        {/* KPI 4: Primary Subject */}
                        <div className="p-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-white dark:to-slate-900 rounded-[28px] border border-blue-200/60 dark:border-blue-900/50 shadow-md flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 font-display">Top Focus Topic</span>
                            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-black text-slate-900 dark:text-white font-display truncate">
                              {topCat.subject}
                            </div>
                            <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 mt-1">
                              {topCat.minutes} Mins Focused
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI DayScore Coach Smart Insights Card */}
                      <div className="p-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 rounded-[28px] text-white shadow-xl flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 mt-0.5">
                          💡
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black font-display uppercase tracking-wider text-amber-200">AI Productivity Coach Insights</h4>
                          <p className="text-xs font-medium text-white/95 leading-relaxed">
                            {currentUser.stats.averageScore >= 80 
                              ? "Outstanding consistency! Your reflections show strong goal alignment and disciplined focus blocks. Maintain your current study rhythm."
                              : "You are building great momentum! To boost your daily score above 80%, try scheduling your hardest study session early in the morning before distractions."
                            }
                          </p>
                        </div>
                      </div>

                      {/* --- CHARTS ROW 1 --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* CHART 1: Daily Score Trend (Area Chart) */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/60 dark:border-slate-800/80 shadow-md space-y-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400 font-display">Score Graph</span>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">Daily Productivity Score Trend</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Evaluated out of 100 based on your daily reflections.</p>
                          </div>

                          <div className="h-64 pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={analyticsData.dailyScores}>
                                <defs>
                                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
                                <ChartTooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 text-xs font-bold space-y-1">
                                          <div className="flex items-center gap-1.5 text-amber-300">
                                            <span>{data.emoji || '🙂'}</span>
                                            <span>Date: {data.date}</span>
                                          </div>
                                          <p className="text-sm font-black text-violet-400">Score: {data.score}/100</p>
                                          <p className="text-[10px] text-slate-400 font-normal">
                                            {data.score >= 80 ? '🔥 Exceptional Focus' : data.score >= 60 ? '✨ Good Progress' : '⚡ Needs Focus'}
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* CHART 2: Weekly Study Volume (Rounded Bar Chart) */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/60 dark:border-slate-800/80 shadow-md space-y-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 font-display">Time Graph</span>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">Weekly Study Hours Volume</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Total focus hours logged in study sessions per week.</p>
                          </div>

                          <div className="h-64 pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={analyticsData.weeklyTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <ChartTooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 text-xs font-bold space-y-1">
                                          <p className="text-fuchsia-400 font-black">{data.week}</p>
                                          <p className="text-xs font-bold text-white">{data.studyHours} Focus Hours</p>
                                          <p className="text-[10px] text-slate-400 font-normal">Avg Score: {data.score}%</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Bar dataKey="studyHours" fill="#ec4899" radius={[10, 10, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                      </div>

                      {/* --- CHARTS ROW 2: Subject Donut Breakdown & Progress Bar Share --- */}
                      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/60 dark:border-slate-800/80 shadow-md space-y-6">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-display">Subject Allocation</span>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">Study Focus Topic Breakdown</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">See exactly where your study time went across different subjects.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                          {/* Donut Chart */}
                          <div className="lg:col-span-1 h-56 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={sortedCategories}
                                  dataKey="minutes"
                                  nameKey="subject"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={80}
                                  paddingAngle={4}
                                >
                                  {sortedCategories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <ChartTooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 text-xs font-bold space-y-1">
                                          <p className="text-emerald-400 font-black">{data.subject}</p>
                                          <p className="text-xs font-bold text-white">{data.minutes} Minutes Studied</p>
                                          <p className="text-[10px] text-slate-400 font-normal">
                                            {Math.round((data.minutes / totalCategoryMins) * 100)}% of total study time
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Subject Progress Bars */}
                          <div className="lg:col-span-2 space-y-3">
                            {sortedCategories.map((cat, idx) => {
                              const pct = Math.round((cat.minutes / totalCategoryMins) * 100);
                              const barColor = COLORS[idx % COLORS.length];

                              return (
                                <div key={cat.subject} className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: barColor }}></span>
                                      <span>{cat.subject}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{cat.minutes} Mins</span>
                                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: barColor }}>
                                        {pct}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                    </>
                  );
                })()}

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] border border-violet-100/50 dark:border-slate-800 space-y-2">
                <TrendingUp className="w-8 h-8 mx-auto animate-bounce text-violet-500" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Assembling personal analytics & performance graphs...</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDENT SOCIAL FEED */}
        {currentTab === 'social' && (
          <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-3xl mx-auto w-full animate-fade-in">
            {/* --- COMPACT & SLEEK ANIMATED FEED TAB SWITCHER (PUBLIC vs FRIENDS) --- */}
            <div className="relative p-1.5 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-violet-500/25 dark:border-slate-800 shadow-lg flex items-center gap-1.5 overflow-hidden">
              {/* Subtle ambient gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-indigo-600/10 pointer-events-none" />

              {/* Public Section Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFeedTab('public')}
                className={`relative flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 overflow-hidden group ${
                  feedTab === 'public'
                    ? 'text-white shadow-md shadow-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {feedTab === 'public' && (
                  <motion.div
                    layoutId="activeFeedTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 rounded-xl -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
                <div className={`p-1 rounded-lg transition-colors ${
                  feedTab === 'public' ? 'bg-white/20 text-white' : 'bg-slate-800/80 text-slate-400 group-hover:text-violet-400'
                }`}>
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span className="font-display tracking-tight text-xs">Public Feed</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold tracking-wider transition-colors ${
                  feedTab === 'public' 
                    ? 'bg-white/25 text-white border border-white/20' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700/80'
                }`}>
                  {posts.filter(p => !p.audience || p.audience === 'public').length}
                </span>
              </motion.button>

              {/* Friends Section Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFeedTab('friends')}
                className={`relative flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 overflow-hidden group ${
                  feedTab === 'friends'
                    ? 'text-white shadow-md shadow-fuchsia-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {feedTab === 'friends' && (
                  <motion.div
                    layoutId="activeFeedTabBg"
                    className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 rounded-xl -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
                <div className={`p-1 rounded-lg transition-colors ${
                  feedTab === 'friends' ? 'bg-white/20 text-white' : 'bg-slate-800/80 text-slate-400 group-hover:text-fuchsia-400'
                }`}>
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="font-display tracking-tight text-xs">Friends Feed</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold tracking-wider transition-colors ${
                  feedTab === 'friends' 
                    ? 'bg-white/25 text-white border border-white/20' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700/80'
                }`}>
                  {posts.filter(p => {
                    const isFriend = friendsList.some(f => f.email === p.authorEmail);
                    const isOwn = p.authorEmail === currentUser?.email;
                    return isFriend || isOwn;
                  }).length}
                </span>
              </motion.button>
            </div>

            {/* Sub-banner describing active feed section */}
            <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/60 text-[11px]">
              <div className="flex items-center gap-1.5">
                {feedTab === 'public' ? (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500"></span>
                  </span>
                ) : (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuchsia-500"></span>
                  </span>
                )}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {feedTab === 'public' ? 'Public Community Feed' : 'Classmates & Friends Feed'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                {feedTab === 'public' 
                  ? 'Showing public updates from all students' 
                  : 'Showing updates from your connected classmates'}
              </span>
            </div>

            {/* --- CUSTOM POST CREATOR COMPOSER --- */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-[32px] border border-violet-100/60 dark:border-slate-800/80 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <SafeAvatar src={currentUser?.avatarUrl} name={currentUser?.displayName} frame={currentUser?.frame} size="sm" />
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white font-display">Share Feed Update</span>
                    <p className="text-[10px] text-slate-400">Log a learning goal or milestone for classmates</p>
                  </div>
                </div>

                {/* Audience switch */}
                <div className="relative flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setPostAudience('public')}
                    className={`relative z-10 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      postAudience === 'public'
                        ? 'text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {postAudience === 'public' && (
                      <motion.div
                        layoutId="composerAudiencePill"
                        className="absolute inset-0 bg-violet-600 rounded-xl -z-10 shadow-xs"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <Globe className="w-3 h-3" />
                    <span>Public</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostAudience('friends')}
                    className={`relative z-10 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      postAudience === 'friends'
                        ? 'text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {postAudience === 'friends' && (
                      <motion.div
                        layoutId="composerAudiencePill"
                        className="absolute inset-0 bg-fuchsia-600 rounded-xl -z-10 shadow-xs"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <Users className="w-3 h-3" />
                    <span>Friends Only</span>
                  </button>
                </div>
              </div>

              {/* Quick Template Tag Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">Quick Tag:</span>
                {[
                  { label: 'Study Goal', template: 'Today\'s Study Goal: Focused on master concepts & review exercises!' },
                  { label: 'Streak Hit', template: `Streak Milestone: Celebrated my active reflection streak with ${currentUser?.stats?.currentStreak || 1} days!` },
                  { label: 'Pomodoro Sprint', template: 'Deep Work Sprint: Finished high-intensity focus sessions today!' },
                  { label: 'Score Victory', template: `Reflection Victory: High daily score achieved on DayScore!` }
                ].map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => setCustomPostText(tag.template)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-violet-500/10 hover:text-violet-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700/60 shrink-0"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {/* Composer Input Area */}
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={customPostText}
                  onChange={e => setCustomPostText(e.target.value)}
                  placeholder={`What did you accomplish or learn today? Sharing to ${postAudience === 'friends' ? 'friends feed' : 'public feed'}...`}
                  className="w-full px-4 py-3 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateCustomPost(customPostText, postAudience);
                    }
                  }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    {postAudience === 'friends' ? (
                      <span className="text-fuchsia-600 dark:text-fuchsia-400 font-extrabold flex items-center gap-1">
                        <Users className="w-3 h-3" /> Visible to friends only
                      </span>
                    ) : (
                      <span className="text-violet-600 dark:text-violet-400 font-extrabold flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Visible to public
                      </span>
                    )}
                    • {customPostText.length} / 280 chars
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleCreateCustomPost(customPostText, postAudience)}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Update</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* --- FEED SEARCH & CATEGORY FILTER TOOLBAR --- */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Updates' },
                  { id: 'journal_score', label: 'Scores' },
                  { id: 'pomodoro', label: 'Pomodoro' },
                  { id: 'study', label: 'Focus' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFeedCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer whitespace-nowrap ${
                      feedCategoryFilter === cat.id
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Feed Search Input */}
              <div className="relative min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={feedSearchQuery}
                  onChange={e => setFeedSearchQuery(e.target.value)}
                  placeholder="Search feed..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 border border-slate-200/60 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400"
                />
                {feedSearchQuery && (
                  <button onClick={() => setFeedSearchQuery('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* --- ANIMATED POSTS FEED STREAM --- */}
            <div className="space-y-5">
              {(() => {
                const filteredPosts = posts.filter(post => {
                  // Tab audience filter
                  if (feedTab === 'public') {
                    if (post.audience === 'friends') return false;
                  } else {
                    const isFriend = friendsList.some(f => f.email === post.authorEmail);
                    const isOwnPost = post.authorEmail === currentUser?.email;
                    if (!isFriend && !isOwnPost) return false;
                  }

                  // Category filter
                  if (feedCategoryFilter !== 'all') {
                    if (feedCategoryFilter === 'journal_score' && post.type !== 'journal_score') return false;
                    if (feedCategoryFilter === 'pomodoro' && post.type !== 'pomodoro_summary') return false;
                    if (feedCategoryFilter === 'study' && post.type !== 'study_session') return false;
                  }

                  // Keyword search
                  if (feedSearchQuery.trim()) {
                    const q = feedSearchQuery.toLowerCase();
                    const matchContent = post.content?.toLowerCase().includes(q);
                    const matchAuthor = post.authorName?.toLowerCase().includes(q);
                    if (!matchContent && !matchAuthor) return false;
                  }

                  return true;
                });

                if (filteredPosts.length === 0) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-12 text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[36px] border border-violet-100/60 dark:border-slate-800/80 shadow-md space-y-4"
                    >
                      <div className="w-16 h-16 rounded-3xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
                        {feedTab === 'public' ? <Globe className="w-8 h-8" /> : <Users className="w-8 h-8" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800 dark:text-white font-display">No updates match this view!</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          {feedSearchQuery 
                            ? `No feed posts found matching "${feedSearchQuery}".` 
                            : feedTab === 'friends'
                              ? 'No updates from your friends yet. Share a post to friends feed or add classmates!'
                              : 'Be the first student to post a daily reflection, Pomodoro cycle, or study update!'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setFeedCategoryFilter('all');
                          setFeedSearchQuery('');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Post First Update</span>
                      </button>
                    </motion.div>
                  );
                }

                return (
                  <AnimatePresence mode="popLayout">
                    {filteredPosts.map((post, index) => {
                      const isCommentsOpen = expandedCommentsPostId === post.id;
                      const commentsCount = post.comments?.length || 0;

                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.25), ease: "easeOut" }}
                          className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-[36px] border border-violet-100/60 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 relative group"
                        >
                          {/* Post Card Glow accent */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

                          {/* Post Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <SafeAvatar src={post.authorAvatar} name={post.authorName} size="md" status="online" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-black text-slate-900 dark:text-white font-display leading-tight">{post.authorName}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 ${
                                    post.audience === 'friends'
                                      ? 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/20'
                                      : 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                                  }`}>
                                    {post.audience === 'friends' ? <Users className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                                    {post.audience === 'friends' ? 'Friends' : 'Public'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Verified Student
                                </span>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                              title="Delete post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Post Main Text Content */}
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-semibold whitespace-pre-wrap break-words">
                            {post.content}
                          </p>

                          {/* Post Metadata Attachment Cards */}
                          {post.type === 'journal_score' && post.metadata?.score && (
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{post.metadata.emoji || '🙂'}</span>
                                <div>
                                  <p className="text-xs font-black text-emerald-900 dark:text-emerald-300 font-display">Daily Reflection Logged</p>
                                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">
                                    Productivity Rating: {post.metadata.score} / 100
                                  </p>
                                </div>
                              </div>
                              <div className="px-3.5 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md">
                                {post.metadata.score}%
                              </div>
                            </div>
                          )}

                          {post.type === 'study_session' && post.metadata?.studyMinutes && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-violet-500/5 border border-violet-500/30 dark:border-violet-500/20 shadow-sm">
                              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                <Timer className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-violet-900 dark:text-violet-300 font-display">Study Focus Session</p>
                                <p className="text-[10px] text-violet-600 dark:text-violet-400 font-extrabold mt-0.5">
                                  ⏱️ {post.metadata.studyMinutes} Mins Focused • {post.metadata.studyCategory || 'Academic'}
                                </p>
                              </div>
                            </div>
                          )}

                          {post.type === 'pomodoro_summary' && (
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-violet-500/10 border border-rose-500/30 dark:border-rose-500/20 space-y-2.5 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-2xl animate-bounce">🍅</span>
                                  <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white font-display flex items-center gap-1.5">
                                      Pomodoro Focus Victory
                                      <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase shadow-xs">
                                        {post.metadata?.pomodoroCycles || 1} {post.metadata?.pomodoroCycles === 1 ? 'Cycle' : 'Cycles'}
                                      </span>
                                    </p>
                                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold mt-0.5">
                                      ⏱️ {post.metadata?.studyMinutes || 25} Mins Focused • {post.metadata?.studyCategory || 'Deep Work'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: Math.min(post.metadata?.pomodoroCycles || 1, 6) }).map((_, i) => (
                                    <span key={i} className="text-base transform hover:scale-130 transition-transform">🍅</span>
                                  ))}
                                </div>
                              </div>
                              {post.metadata?.note && (
                                <p className="text-xs italic text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 font-medium">
                                  "{post.metadata.note}"
                                </p>
                              )}
                            </div>
                          )}

                          {/* Interactive Animated Reaction Buttons Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            
                            {/* Reactions Cluster */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {['🔥', '🙌', '🎉', '🎓', '❤️'].map(emoji => {
                                const list = post.reactions?.[emoji] || [];
                                const hasReacted = list.includes(currentUser?.email || '');
                                return (
                                  <motion.button
                                    key={emoji}
                                    whileTap={{ scale: 1.35, rotate: 8 }}
                                    onClick={() => handlePostReact(post.id, emoji)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                      hasReacted 
                                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-violet-400 text-violet-700 dark:text-violet-300 font-black shadow-xs ring-2 ring-violet-500/30' 
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 hover:bg-slate-100 dark:border-slate-700/80 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    <span>{emoji}</span>
                                    <span>{list.length}</span>
                                  </motion.button>
                                );
                              })}
                            </div>

                            {/* Toggle Comments Drawer Button */}
                            <button
                              onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                              className="px-3 py-1.5 text-xs font-extrabold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-violet-500" />
                              <span>{commentsCount > 0 ? `${commentsCount} Comments` : 'Comment'}</span>
                            </button>

                          </div>

                          {/* Expandable Comment Section */}
                          {(isCommentsOpen || commentsCount > 0) && (
                            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                              
                              {/* Existing Comments list */}
                              {commentsCount > 0 && (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                  {post.comments?.map(c => (
                                    <div key={c.id} className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl text-xs leading-relaxed space-y-0.5 border border-slate-100 dark:border-slate-800/60">
                                      <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-slate-900 dark:text-white font-display">{c.authorName}</span>
                                        <span className="text-[9px] text-slate-400">Classmate</span>
                                      </div>
                                      <p className="text-slate-700 dark:text-slate-300 font-medium">{c.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Comment Input */}
                              <div className="flex items-center gap-2">
                                <SafeAvatar src={currentUser?.avatarUrl} name={currentUser?.displayName} size="xs" />
                                <input
                                  type="text"
                                  placeholder="Write an encouraging comment..."
                                  className="flex-1 px-4 py-2 text-xs bg-slate-100/80 dark:bg-slate-800/60 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500/50 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                      const val = (e.target as HTMLInputElement).value;
                                      if (val.trim()) {
                                        handlePostComment(post.id, val);
                                        (e.target as HTMLInputElement).value = '';
                                        setExpandedCommentsPostId(post.id);
                                      }
                                    }
                                  }}
                                />
                              </div>

                            </div>
                          )}

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 5: CLASSROOM PRIVATE MESSAGING (MESSENGER / INSTAGRAM DIRECT UI) */}
        {currentTab === 'chat' && (
          <div className="flex h-[calc(100vh-80px)] md:h-screen overflow-hidden relative z-10 bg-slate-50/50 dark:bg-slate-950/40">
            
            {/* Friends/Chat Rooms List Sidebar */}
            <div className={`w-full lg:w-80 lg:w-96 border-r border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl flex flex-col flex-shrink-0 transition-all duration-300 ${
              activeRoomId ? 'hidden lg:flex' : 'flex w-full'
            }`}>
              
              {/* Header */}
              <div className="p-4 border-b border-slate-100/80 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-1.5">
                        Direct Messages
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium">Classmate Study Network</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQuickNotesModal(true)}
                    className="px-2.5 py-1 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 rounded-full text-[9px] font-extrabold uppercase transition-all cursor-pointer flex items-center gap-1"
                    title="Open Quick Notes & Cheat Sheets"
                  >
                    <FileText className="w-3 h-3 text-violet-500" />
                    Quick Notes
                  </button>
                </div>

                {/* Active Classmates Stories Row (Instagram / Messenger Active Now Bar) */}
                <div className="pt-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Active Classmates & Status Notes</span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar pt-4">
                    {/* User's own note / status */}
                    <div
                      onClick={() => {
                        setStatusNoteInput(userStatusNote);
                        setShowStatusNoteModal(true);
                      }}
                      className="flex flex-col items-center flex-shrink-0 cursor-pointer group relative"
                    >
                      {/* Floating Speech Bubble for status note */}
                      <div className="absolute -top-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md max-w-[70px] truncate z-20 pointer-events-none ring-1 ring-white/30">
                        {userStatusNote}
                      </div>
                      <div className="relative mt-1">
                        <SafeAvatar src={currentUser?.avatarUrl} name={currentUser?.displayName || 'User'} frame={currentUser?.frame || 'none'} size="sm" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 shadow-xs z-10">
                          +
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-300 mt-1 truncate w-14 text-center">Your note</span>
                    </div>

                    {/* Classmates with active story/online ring */}
                    {friendsList.map(friend => {
                      const room = chatRooms.find(r => r.peer?.email === friend.email);
                      const isAi = friend.email === 'dayscore_ai@reflect.edu';
                      const defaultNote = isAi ? 'Here to support ✨' : friend.email.includes('emma') ? 'Bio marathon 🩺' : friend.email.includes('lukas') ? 'Compilers 💻' : 'Reflecting 🌱';
                      return (
                        <button
                          key={friend.email}
                          onClick={() => {
                            if (room) {
                              setActiveRoomId(room.id);
                              setChatMessages([]);
                            } else {
                              sendFriendRequest(friend.email);
                            }
                          }}
                          className="flex flex-col items-center flex-shrink-0 cursor-pointer group relative"
                        >
                          <div className="absolute -top-5 bg-slate-800 dark:bg-slate-700 text-slate-100 text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs max-w-[70px] truncate z-20 pointer-events-none">
                            {defaultNote}
                          </div>
                          <div className="relative mt-1">
                            <SafeAvatar src={friend.avatarUrl} name={friend.displayName} frame={friend.frame || 'none'} size="sm" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 z-10" />
                          </div>
                          <span className="text-[9px] font-semibold text-slate-700 dark:text-slate-300 mt-1 truncate w-14 text-center">
                            {friend.displayName.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    placeholder="Search messages or classmates..."
                    className="w-full pl-8 pr-8 py-2 text-xs bg-slate-100/80 dark:bg-slate-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-white placeholder:text-slate-400 font-medium"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  {userSearchQuery && (
                    <button onClick={() => setUserSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                {/* Switcher tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setChatSidebarTab('chats')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      chatSidebarTab === 'chats'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Chats
                  </button>
                  <button
                    onClick={() => setChatSidebarTab('friends')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                      chatSidebarTab === 'friends'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Classmates
                    {pendingRequests.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px]">
                        {pendingRequests.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Chat Sidebar Body */}
              {chatSidebarTab === 'chats' ? (
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {chatRooms.length === 0 ? (
                    <div className="text-center p-6 space-y-2">
                      <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                      <p className="text-xs font-bold text-slate-500">No active chats</p>
                      <p className="text-[10px] text-slate-400">Switch to Classmates tab to start a new conversation!</p>
                    </div>
                  ) : (
                    chatRooms.map(room => {
                      const isActive = activeRoomId === room.id;
                      const lastMsg = room.messages[room.messages.length - 1];
                      const isAiCoach = room.participants.includes('dayscore_ai@reflect.edu');
                      return (
                        <button
                          key={room.id}
                          onClick={() => {
                            setActiveRoomId(room.id);
                            setChatMessages([]);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left cursor-pointer ${
                            isAiCoach
                              ? 'bg-gradient-to-r from-violet-600/15 via-fuchsia-600/10 to-indigo-600/15 border border-violet-400/50 dark:border-violet-600/50 shadow-md ring-1 ring-violet-500/30'
                              : isActive 
                              ? 'bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-indigo-500/15 border border-violet-300/40 dark:border-violet-700/40 shadow-sm' 
                              : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/50 border border-transparent'
                          }`}
                        >
                          <div className="relative flex-shrink-0">
                            <img src={room.peer?.avatarUrl} alt="peer" className={`w-11 h-11 rounded-full object-cover ring-2 ${isAiCoach ? 'ring-violet-500 ring-offset-2 dark:ring-offset-slate-900' : 'ring-slate-200/80 dark:ring-slate-700'}`} />
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              room.peer?.online || isAiCoach ? 'bg-emerald-500' : 'bg-slate-300'
                            }`} />
                          </div>
                          <div className="overflow-hidden flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate font-display">{room.peer?.displayName}</p>
                                {isAiCoach && (
                                  <span className="px-1.5 py-0.2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[8px] font-black rounded-full uppercase tracking-wider shrink-0">AI Coach</span>
                                )}
                              </div>
                              {lastMsg && (
                                <span className="text-[9px] text-slate-400 flex-shrink-0">
                                  {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                            {isAiCoach && (
                              <p className="text-[9px] font-bold text-violet-600 dark:text-violet-300 truncate">
                                ⚡ Super Intelligent, Fast, Logical & Empathetic
                              </p>
                            )}
                            <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-violet-600 dark:text-violet-300 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                              {lastMsg?.text || 'Tap to send a message...'}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              ) : (
                /* Classmates Search & Requests List */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Requests */}
                  {pendingRequests.length > 0 && (
                    <div className="p-3 border-b border-slate-150/80 dark:border-slate-800/80 space-y-2 bg-pink-50/30 dark:bg-pink-950/20">
                      <span className="text-[9px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider block">Friend Requests ({pendingRequests.length})</span>
                      <div className="space-y-2">
                        {pendingRequests.map(req => (
                          <div key={req.fromEmail} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-pink-100 dark:border-pink-900/30 shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img src={req.fromUser?.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                              <div className="overflow-hidden">
                                <p className="text-[11px] font-bold truncate text-slate-900 dark:text-white leading-tight">{req.fromUser?.displayName}</p>
                                <span className="text-[9px] text-slate-400 truncate">@{req.fromUser?.username}</span>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => respondFriendRequest(req.fromEmail, 'accept')}
                                className="px-2.5 py-1 text-[10px] font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-lg cursor-pointer transition-colors shadow-sm"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => respondFriendRequest(req.fromEmail, 'reject')}
                                className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Classmate candidates */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block px-2 pt-1">
                      {userSearchQuery ? 'Search Results' : 'Suggested Classmates'}
                    </span>
                    
                    {(userSearchQuery ? userSearchResult : userSearchResult.filter(c => c.email !== currentUser?.email && !friendsList.some(f => f.email === c.email))).length === 0 ? (
                      <p className="text-xs text-slate-400 p-4 text-center">No classmates found.</p>
                    ) : (
                      (userSearchQuery ? userSearchResult : userSearchResult.filter(c => c.email !== currentUser?.email && !friendsList.some(f => f.email === c.email))).map(student => {
                        const isFriend = friendsList.some(f => f.email === student.email);
                        const isSentPending = pendingRequests.some(r => r.fromEmail === currentUser?.email && r.toEmail === student.email);
                        
                        return (
                          <div key={student.email} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-violet-300 transition-all">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <SafeAvatar src={student.avatarUrl} name={student.displayName} frame={student.frame} size="sm" />
                              <div className="overflow-hidden">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">{student.displayName}</h4>
                                <p className="text-[9px] text-slate-400 truncate">@{student.username}</p>
                              </div>
                            </div>
                            
                            {isFriend ? (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">Connected</span>
                            ) : isSentPending ? (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Requested</span>
                            ) : (
                              <button
                                onClick={() => sendFriendRequest(student.email)}
                                className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-[10px] font-bold rounded-xl cursor-pointer transition-all shadow-sm"
                              >
                                Follow
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Instagram/Messenger Chat Window Pane */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 relative transition-all duration-300 ${
              !activeRoomId ? 'hidden lg:flex' : 'flex w-full h-full'
            }`}>
              {activeRoomId ? (
                (() => {
                  const currentRoom = chatRooms.find(r => r.id === activeRoomId);
                  const activePeer = currentRoom?.peer;
                  return (
                    <>
                      {/* Top Peer Info bar (Instagram DM Style Header) */}
                      <div className="px-3 sm:px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between shadow-xs z-10">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => setActiveRoomId(null)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-300 rounded-xl transition-all cursor-pointer flex-shrink-0 font-extrabold text-xs border border-violet-200/80 dark:border-violet-800/80 active:scale-95 shadow-xs"
                            title="Back to direct messages & classmate list"
                          >
                            <ArrowLeft className="w-4 h-4 text-violet-600 dark:text-violet-400 stroke-[2.5]" />
                            <span>Chats</span>
                          </button>
                          <div className="relative cursor-pointer" onClick={() => setShowPeerInfoDrawer(true)}>
                            <SafeAvatar
                              src={activePeer?.avatarUrl}
                              name={activePeer?.displayName}
                              frame={(activePeer as any)?.frame}
                              size="md"
                              status={activePeer?.online ? 'online' : 'offline'}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                                {activePeer?.displayName}
                              </h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 fill-violet-500/20" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">
                              @{(activePeer as any)?.username || activePeer?.email.split('@')[0]} • {activePeer?.online ? 'Active now' : 'Active recently'}
                            </p>
                          </div>
                        </div>

                        {/* Top Right Action Icons */}
                        <div className="flex items-center gap-1 md:gap-2">
                          <button
                            type="button"
                            onClick={() => setShowPeerInfoDrawer(!showPeerInfoDrawer)}
                            className={`p-2 rounded-full transition-colors cursor-pointer ${
                              showPeerInfoDrawer ? 'text-violet-600 bg-violet-50 dark:bg-violet-950/50' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title="Chat Details"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 flex overflow-hidden relative">
                        {/* Messages Stream */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/40 dark:bg-slate-950/30">
                          
                          {/* Chat Encryption / Header notice */}
                          <div className="text-center my-4 space-y-2 flex flex-col items-center">
                            <SafeAvatar src={activePeer?.avatarUrl} name={activePeer?.displayName} frame={(activePeer as any)?.frame} size="xl" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">{activePeer?.displayName}</h3>
                            <p className="text-[11px] text-slate-400">Classmate Student Account • Reflection Peer</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 rounded-full text-[10px] text-slate-500 font-medium shadow-xs">
                              <Shield className="w-3 h-3 text-emerald-500" /> Encrypted Direct Messaging
                            </div>
                          </div>

                          {chatMessages.map((msg, idx) => {
                            const isMe = currentUser && msg.senderEmail === currentUser.email;
                            const reactions = messageReactions[msg.id] || [];

                            return (
                              <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}>
                                <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
                                  {!isMe && (
                                    <div className="mb-1 shrink-0">
                                      <SafeAvatar src={activePeer?.avatarUrl} name={activePeer?.displayName} size="xs" />
                                    </div>
                                  )}
                                  
                                  <div className="relative">
                                    {msg.audioUrl || msg.text?.includes('Voice Note') || msg.text?.includes('🎙️') ? (
                                      <div 
                                        className={`p-3 text-xs shadow-xs transition-all ${
                                          isMe 
                                            ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white rounded-2xl rounded-br-xs' 
                                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 min-w-[190px] sm:min-w-[220px]">
                                          <button
                                            type="button"
                                            onClick={() => togglePlayVoiceMessage(msg.id, msg.audioUrl, msg.audioDuration || 5)}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 cursor-pointer shadow-sm ${
                                              isMe
                                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                                : 'bg-violet-600 hover:bg-violet-700 text-white'
                                            }`}
                                            title={playingMsgId === msg.id ? 'Pause Voice Note' : 'Play Voice Note'}
                                          >
                                            {playingMsgId === msg.id ? (
                                              <Pause className="w-4 h-4 fill-current" />
                                            ) : (
                                              <Play className="w-4 h-4 fill-current ml-0.5" />
                                            )}
                                          </button>

                                          <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between text-[10px] opacity-90 font-mono">
                                              <span className="font-bold flex items-center gap-1">
                                                <Mic className="w-3 h-3" /> Voice Note
                                              </span>
                                              <span>{msg.audioDuration ? `${Math.floor(msg.audioDuration / 60)}:${msg.audioDuration % 60 < 10 ? '0' : ''}${msg.audioDuration % 60}` : '0:05'}</span>
                                            </div>

                                            {/* Waveform Visualization Bars */}
                                            <div className="flex items-center gap-0.5 h-4 w-full">
                                              {[25, 50, 85, 40, 30, 95, 65, 45, 80, 35, 90, 60, 30, 75, 40].map((h, i) => {
                                                const isPlaying = playingMsgId === msg.id;
                                                const progress = playingMsgProgress[msg.id] || 0;
                                                const isPlayed = (i / 15) * 100 <= progress;
                                                return (
                                                  <div
                                                    key={i}
                                                    className={`flex-1 rounded-full transition-all duration-150 ${
                                                      isPlaying ? 'animate-pulse' : ''
                                                    } ${
                                                      isMe
                                                        ? isPlayed ? 'bg-white' : 'bg-white/40'
                                                        : isPlayed ? 'bg-violet-600 dark:bg-violet-400' : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                                    style={{
                                                      height: `${h}%`,
                                                    }}
                                                  />
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div 
                                        className={`p-3.5 text-xs font-medium leading-relaxed shadow-xs transition-all ${
                                          isMe 
                                            ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white rounded-2xl rounded-br-xs' 
                                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                                        }`}
                                      >
                                        <p>{msg.text}</p>
                                      </div>
                                    )}

                                    {/* Hover Quick Reaction Pill (Instagram DM Double-Tap / Reaction style) */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-20' : '-right-20'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-md z-10`}>
                                      {['❤️', '👍', '🔥', '😂'].map(emoji => (
                                        <button
                                          key={emoji}
                                          type="button"
                                          onClick={() => handleToggleMessageReaction(msg.id, emoji)}
                                          className="text-xs hover:scale-125 transition-transform p-0.5 cursor-pointer"
                                        >
                                          {emoji}
                                        </button>
                                      ))}
                                    </div>

                                    {/* Reaction Display Badges */}
                                    {reactions.length > 0 && (
                                      <div className={`absolute -bottom-2 ${isMe ? 'left-2' : 'right-2'} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-0.5 text-[10px] shadow-sm flex items-center gap-0.5`}>
                                        {reactions.map((r, i) => <span key={i}>{r}</span>)}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <span className="text-[9px] text-slate-400 mt-1 px-1">
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {isMe && idx === chatMessages.length - 1 && (
                                    <span className="ml-1 text-emerald-500 font-bold">• Seen</span>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Peer Info Drawer (Right Sidebar if toggled) */}
                        {showPeerInfoDrawer && (
                          <div className="w-64 border-l border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 p-4 space-y-4 overflow-y-auto hidden lg:block">
                            <div className="text-center space-y-2 pt-2">
                              <img src={activePeer?.avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-violet-500/10" />
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">{activePeer?.displayName}</h4>
                              <p className="text-[10px] text-slate-400">@{(activePeer as any)?.username || activePeer?.email.split('@')[0]}</p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Study Stats</span>
                              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-slate-500">Streak:</span>
                                  <span className="text-amber-500 font-bold">{(activePeer as any)?.stats?.currentStreak || 5} Days 🔥</span>
                                </div>
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-slate-500">Focus Hours:</span>
                                  <span className="text-violet-600 dark:text-violet-400 font-bold">{(activePeer as any)?.stats?.totalFocusMinutes || 120} mins</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Privacy & Actions</span>
                              <button 
                                onClick={() => showToast('Chat notifications muted for 24h', 'info')}
                                className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <Bell className="w-4 h-4 text-slate-400" /> Mute Notifications
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Live Voice Mail Recording Mode or Regular Message Input Bar */}
                      {isRecordingVoiceNote ? (
                        <div className="p-3 md:p-4 bg-rose-500/10 dark:bg-rose-950/30 border-t border-rose-500/20 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                              <span className="w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping absolute"></span>
                              <span className="w-3 h-3 bg-rose-600 rounded-full relative"></span>
                            </div>
                            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                              Recording {Math.floor(voiceNoteDuration / 60)}:{voiceNoteDuration % 60 < 10 ? '0' : ''}{voiceNoteDuration % 60}
                            </span>
                            
                            {/* Animated Soundwave bars */}
                            <div className="hidden sm:flex items-center gap-0.5 h-5 ml-2">
                              {[14, 22, 10, 28, 16, 24, 12, 20].map((h, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-rose-500 dark:bg-rose-400 rounded-full animate-bounce"
                                  style={{ 
                                    height: `${h}px`, 
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: '0.8s'
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={cancelVoiceNoteRecording}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-full transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                              title="Discard voice recording"
                            >
                              <Trash2 className="w-4 h-4" /> Cancel
                            </button>
                            <button
                              type="button"
                              onClick={finishAndSendVoiceNote}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white rounded-full text-xs font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" /> Send Voice
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 md:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2">
                          {/* Note: Photo attachment removed per user request */}
                          
                          {/* Mic / Voice Note Button */}
                          <button
                            type="button"
                            onClick={startVoiceNoteRecording}
                            className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-full transition-colors cursor-pointer flex-shrink-0"
                            title="Record voice message"
                          >
                            <Mic className="w-5 h-5" />
                          </button>

                          {/* Text Input Pill */}
                          <div className="flex-1 relative flex items-center">
                            <input
                              type="text"
                              value={chatInputText}
                              onChange={e => setChatInputText(e.target.value)}
                              placeholder="Message..."
                              className="w-full pl-4 pr-10 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSendChatMessage();
                              }}
                            />
                          </div>

                          {/* Instant Quick Love Reaction / Send Button */}
                          {chatInputText.trim() ? (
                            <button
                              type="button"
                              onClick={() => handleSendChatMessage()}
                              className="p-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:opacity-90 text-white rounded-full transition-all shadow-md cursor-pointer flex-shrink-0"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleSendChatMessage('❤️');
                              }}
                              className="p-2 text-rose-500 hover:scale-125 transition-transform cursor-pointer flex-shrink-0"
                              title="Send quick ❤️"
                            >
                              <Heart className="w-6 h-6 fill-rose-500" />
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                /* Empty Chat Screen (Instagram DM Style) */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-pink-500/20 to-indigo-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 ring-8 ring-violet-500/5">
                    <Send className="w-10 h-10 transform -rotate-12" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Your Messages</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Send private messages, share daily study progress, and collaborate with your classmates.
                    </p>
                  </div>
                  <button
                    onClick={() => setChatSidebarTab('friends')}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: TROPHY RANK LEADERBOARDS */}
        {currentTab === 'leaderboard' && (
          <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full animate-fade-in">
            {/* Hero Trophy Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-600/20 dark:from-amber-950/40 dark:via-yellow-900/20 dark:to-slate-900 p-6 sm:p-8 rounded-[36px] border border-amber-400/30 dark:border-amber-500/30 shadow-xl">
              <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl animate-bounce">
                      🏆
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 dark:bg-amber-500/20 border border-amber-400/30 rounded-full text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 animate-spin" />
                      <span>Season Leaderboards</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">Hall of Trophies</h1>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md">Compare daily productivity rates, climb ranks, and claim your place on the champions podium!</p>
                  </div>
                </div>

                {/* Scope Switchers */}
                <div className="flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-md">
                  {['global', 'friends'].map(sc => (
                    <button
                      key={sc}
                      onClick={() => fetchLeaderboards(currentUser.email, sc, 'weekly')}
                      className="px-4 py-2 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 text-xs font-black rounded-xl capitalize transition-all cursor-pointer"
                    >
                      {sc === 'global' ? '🌍 Global' : '👥 Classmates'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtered Rankings (No AI Coach) */}
            {(() => {
              const cleanRankings = leaderboardRankings.filter(r => r.email !== 'dayscore_ai@reflect.edu' && r.username !== 'dayscore_ai');

              if (cleanRankings.length === 0) {
                return (
                  <div className="p-12 text-center bg-white/80 dark:bg-slate-900/80 rounded-[32px] border border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
                    <Trophy className="w-12 h-12 mx-auto text-amber-500/40 animate-pulse" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No active rankers found in this category yet.</p>
                    <p className="text-[11px] text-slate-400">Log daily reflections to claim the #1 spot!</p>
                  </div>
                );
              }

              const top1 = cleanRankings[0];
              const top2 = cleanRankings[1];
              const top3 = cleanRankings[2];

              const trophiesList = [
                {
                  id: 'gold_champion',
                  title: 'Grand Champion Gold Cup',
                  subtitle: '#1 Ranked Season Champion',
                  icon: '🏆',
                  gradient: 'from-amber-400 via-yellow-300 to-amber-500',
                  border: 'border-amber-400 dark:border-amber-500',
                  glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
                  textAccent: 'text-amber-600 dark:text-amber-400',
                  holder: top1 ? top1.displayName : 'Unclaimed',
                  holderAvatar: top1?.avatarUrl,
                  holderScore: top1 ? `${top1.score}%` : 'N/A',
                  req: 'Maintain #1 spot in student rankings',
                  status: top1?.email === currentUser?.email ? '✨ Yours Now!' : top1 ? 'Held by Champion' : 'Available',
                },
                {
                  id: 'silver_vanguard',
                  title: 'Silver Vanguard Shield',
                  subtitle: '#2 Ranked Season Titan',
                  icon: '🛡️',
                  gradient: 'from-slate-200 via-slate-100 to-slate-300',
                  border: 'border-slate-300 dark:border-slate-600',
                  glow: 'shadow-[0_0_25px_rgba(203,213,225,0.3)]',
                  textAccent: 'text-slate-700 dark:text-slate-300',
                  holder: top2 ? top2.displayName : 'Unclaimed',
                  holderAvatar: top2?.avatarUrl,
                  holderScore: top2 ? `${top2.score}%` : 'N/A',
                  req: 'Secure #2 spot in student rankings',
                  status: top2?.email === currentUser?.email ? '✨ Yours Now!' : top2 ? 'Held by Vanguard' : 'Available',
                },
                {
                  id: 'bronze_crest',
                  title: 'Bronze Pioneer Crest',
                  subtitle: '#3 Ranked Season Scholar',
                  icon: '🥉',
                  gradient: 'from-amber-700 via-amber-600 to-amber-800',
                  border: 'border-amber-700 dark:border-amber-800',
                  glow: 'shadow-[0_0_25px_rgba(180,83,9,0.3)]',
                  textAccent: 'text-amber-800 dark:text-amber-400',
                  holder: top3 ? top3.displayName : 'Unclaimed',
                  holderAvatar: top3?.avatarUrl,
                  holderScore: top3 ? `${top3.score}%` : 'N/A',
                  req: 'Secure #3 podium place in rankings',
                  status: top3?.email === currentUser?.email ? '✨ Yours Now!' : top3 ? 'Held by Pioneer' : 'Available',
                },
                {
                  id: 'diamond_crystal',
                  title: 'Diamond Reflection Crystal',
                  subtitle: '90%+ Daily Score Legend',
                  icon: '💎',
                  gradient: 'from-cyan-400 via-sky-300 to-indigo-400',
                  border: 'border-cyan-400 dark:border-cyan-500',
                  glow: 'shadow-[0_0_30px_rgba(6,182,212,0.35)]',
                  textAccent: 'text-cyan-600 dark:text-cyan-400',
                  holder: currentUser?.stats?.highestScore && currentUser.stats.highestScore >= 90 ? currentUser.displayName : 'Streak Achievers',
                  holderAvatar: currentUser?.avatarUrl,
                  holderScore: `${currentUser?.stats?.highestScore || 0}%`,
                  req: 'Achieve 90%+ daily reflection score',
                  status: (currentUser?.stats?.highestScore || 0) >= 90 ? '✓ Unlocked' : 'In Progress',
                },
                {
                  id: 'emerald_star',
                  title: 'Emerald Flame Star',
                  subtitle: '7-Day Streak Master',
                  icon: '🌟',
                  gradient: 'from-emerald-400 via-teal-300 to-emerald-500',
                  border: 'border-emerald-400 dark:border-emerald-500',
                  glow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
                  textAccent: 'text-emerald-600 dark:text-emerald-400',
                  holder: (currentUser?.stats?.currentStreak || 0) >= 7 ? currentUser?.displayName : 'Streak Legends',
                  holderAvatar: currentUser?.avatarUrl,
                  holderScore: `${currentUser?.stats?.currentStreak || 0} Days`,
                  req: 'Maintain a 7-day active reflection streak',
                  status: (currentUser?.stats?.currentStreak || 0) >= 7 ? '✓ Unlocked' : `${currentUser?.stats?.currentStreak || 0}/7 Days`,
                },
              ];

              return (
                <div className="space-y-8">
                  {/* --- SPECIAL 3D ANIMATED PODIUM STAGE --- */}
                  <div className="pt-6 pb-2">
                    <div className="text-center mb-6 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 font-display flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                        <span>Top Productivity Champions</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">Season Champions Podium</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto">
                      {/* Rank 2 - Silver Titan */}
                      {top2 ? (
                        <motion.div
                          whileHover={{ y: -8, scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          onClick={() => setTrophyInspectModal(trophiesList[1])}
                          className="cursor-pointer bg-gradient-to-b from-slate-100 via-white to-slate-200/80 dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-950 p-4 rounded-[28px] border-2 border-slate-300 dark:border-slate-700 shadow-xl flex flex-col items-center text-center relative group"
                        >
                          <div className="absolute -top-3 px-2.5 py-0.5 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-900 dark:text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-md border border-slate-400/50 flex items-center gap-1">
                            🥈 2nd Place
                          </div>
                          <div className="relative mt-3 mb-2">
                            <SafeAvatar src={top2.avatarUrl} name={top2.displayName} frame={top2.frame || 'diamond'} size="lg" />
                            <span className="absolute -bottom-1 -right-1 text-lg z-10">🥈</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-full font-display">{top2.displayName}</h4>
                          <span className="text-[10px] text-slate-400">@{top2.username}</span>
                          <div className="mt-2.5 px-3 py-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-800 dark:text-slate-200 border border-slate-300/50 dark:border-slate-700">
                            {top2.score}% Rate
                          </div>
                        </motion.div>
                      ) : <div />}

                      {/* Rank 1 - Gold Champion (Center & Elevated) */}
                      {top1 && (
                        <motion.div
                          whileHover={{ y: -12, scale: 1.04 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          onClick={() => setTrophyInspectModal(trophiesList[0])}
                          className="cursor-pointer bg-gradient-to-b from-amber-500/25 via-yellow-400/15 to-amber-500/20 dark:from-amber-950/60 dark:via-yellow-900/30 dark:to-slate-900 p-5 rounded-[32px] border-2 border-amber-400 dark:border-yellow-400 shadow-[0_0_35px_rgba(245,158,11,0.3)] flex flex-col items-center text-center relative transform -translate-y-4 group"
                        >
                          <div className="absolute -top-4 px-3.5 py-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black rounded-full text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse border border-yellow-200">
                            👑 Champion #1
                          </div>
                          <div className="relative mt-3 mb-2">
                            <SafeAvatar src={top1.avatarUrl} name={top1.displayName} frame={top1.frame || 'gold'} size="xl" />
                            <motion.span 
                              animate={{ y: [0, -6, 0] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                              className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-3xl z-10"
                            >
                              🏆
                            </motion.span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-full font-display">{top1.displayName}</h4>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">@{top1.username}</span>
                          <div className="mt-2.5 px-3.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded-xl text-xs font-black shadow-lg flex items-center gap-1">
                            <span>🔥</span> {top1.score}% Rate
                          </div>
                        </motion.div>
                      )}

                      {/* Rank 3 - Bronze Scholar */}
                      {top3 ? (
                        <motion.div
                          whileHover={{ y: -8, scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          onClick={() => setTrophyInspectModal(trophiesList[2])}
                          className="cursor-pointer bg-gradient-to-b from-amber-900/15 via-white to-amber-950/15 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-950 p-4 rounded-[28px] border-2 border-amber-700/60 dark:border-amber-700/50 shadow-xl flex flex-col items-center text-center relative group"
                        >
                          <div className="absolute -top-3 px-2.5 py-0.5 bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md border border-amber-600/50 flex items-center gap-1">
                            🥉 3rd Place
                          </div>
                          <div className="relative mt-3 mb-2">
                            <SafeAvatar src={top3.avatarUrl} name={top3.displayName} frame={top3.frame || 'neon'} size="lg" />
                            <span className="absolute -bottom-1 -right-1 text-lg z-10">🥉</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-full font-display">{top3.displayName}</h4>
                          <span className="text-[10px] text-slate-400">@{top3.username}</span>
                          <div className="mt-2.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-xl text-xs font-black text-amber-900 dark:text-amber-300 border border-amber-300/50 dark:border-amber-800/50">
                            {top3.score}% Rate
                          </div>
                        </motion.div>
                      ) : <div />}
                    </div>
                  </div>

                  {/* --- SPECIAL INTERACTIVE 3D TROPHY GALLERY SHOWCASE --- */}
                  <div className="bg-gradient-to-br from-white/90 via-amber-50/20 to-white/90 dark:from-slate-900/90 dark:via-amber-950/20 dark:to-slate-900/90 backdrop-blur-md p-6 sm:p-8 rounded-[36px] border-2 border-amber-300/50 dark:border-amber-800/40 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 dark:border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                          <h3 className="text-base font-black text-slate-900 dark:text-white font-display">Special Separate Trophy Gallery</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click any trophy to launch full 3D interactive inspection & celebration</p>
                      </div>

                      <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 dark:from-amber-950/50 dark:to-yellow-950/50 border border-amber-300/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 text-xs font-black rounded-full flex items-center gap-1.5 shrink-0">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Streak: {currentUser?.stats?.currentStreak || 0} Days</span>
                      </span>
                    </div>

                    {/* Interactive Trophy Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trophiesList.map(trophy => {
                        const isSelected = selectedTrophyId === trophy.id;
                        return (
                          <motion.div
                            key={trophy.id}
                            whileHover={{ y: -6, scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 350 }}
                            onClick={() => {
                              setSelectedTrophyId(trophy.id);
                              setTrophyInspectModal(trophy);
                            }}
                            className={`cursor-pointer p-5 rounded-[28px] border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                              isSelected
                                ? `${trophy.border} ${trophy.glow} bg-white dark:bg-slate-900 ring-2 ring-amber-400/50`
                                : 'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 hover:border-amber-300 dark:hover:border-amber-700'
                            }`}
                          >
                            {/* Animated Background Shimmer */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent rounded-full blur-xl pointer-events-none" />

                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 ${trophy.textAccent}`}>
                                  {trophy.subtitle}
                                </span>
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                                  {trophy.status}
                                </span>
                              </div>

                              {/* Big 3D Trophy Animated Emblem */}
                              <div className="my-3 flex items-center justify-center">
                                <motion.div
                                  animate={{ 
                                    rotateY: [0, 15, -15, 0],
                                    y: [0, -4, 0]
                                  }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 4, 
                                    ease: "easeInOut" 
                                  }}
                                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${trophy.gradient} p-0.5 shadow-lg flex items-center justify-center text-4xl shrink-0`}
                                >
                                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
                                    {trophy.icon}
                                  </div>
                                </motion.div>
                              </div>

                              <h4 className="text-sm font-black text-slate-900 dark:text-white text-center font-display leading-snug">
                                {trophy.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 text-center mt-1">
                                {trophy.req}
                              </p>
                            </div>

                            {/* Holder Info Footer */}
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                              <div className="flex items-center gap-2 overflow-hidden">
                                {trophy.holderAvatar ? (
                                  <img src={trophy.holderAvatar} alt="avatar" className="w-6 h-6 rounded-full object-cover shrink-0" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    👑
                                  </div>
                                )}
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                                  {trophy.holder}
                                </span>
                              </div>
                              <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 rounded-md shrink-0">
                                {trophy.holderScore}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rankings List */}
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] border border-amber-200/50 dark:border-slate-800/80 shadow-lg overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 dark:text-white font-display uppercase tracking-wider">Full Leaderboard Ranks</span>
                      <span className="text-[10px] text-slate-400 font-bold">{cleanRankings.length} Active Students</span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {cleanRankings.map((rank, index) => {
                        const isSelf = currentUser && rank.email.toLowerCase() === currentUser.email.toLowerCase();
                        return (
                          <div key={rank.email} className={`flex items-center justify-between p-4 transition-colors ${
                            isSelf ? 'bg-amber-50/70 dark:bg-amber-950/20 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}>
                            <div className="flex items-center gap-4">
                              {/* Position */}
                              <span className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs ${
                                index === 0 ? 'bg-amber-400 text-slate-950 shadow-md' :
                                index === 1 ? 'bg-slate-300 text-slate-900' :
                                index === 2 ? 'bg-amber-700 text-white' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              </span>

                              <SafeAvatar src={rank.avatarUrl} name={rank.displayName} frame={rank.frame || 'none'} size="sm" />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{rank.displayName}</h4>
                                  {isSelf && <span className="text-[9px] px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-md font-black">You</span>}
                                  {index === 0 && <span className="text-[9px] px-1.5 py-0.2 bg-amber-400/20 text-amber-600 dark:text-amber-400 rounded-md font-bold">Top Ranker</span>}
                                </div>
                                <span className="text-[10px] text-slate-400">@{rank.username}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {rank.streak > 0 && (
                                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
                                  <span>{rank.streak}</span>
                                  <span>🔥</span>
                                </span>
                              )}
                              <div className="text-right">
                                <span className="text-sm font-black text-slate-900 dark:text-white block">{rank.score}%</span>
                                <span className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">Productivity</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {currentTab === 'profile' && (
          <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Student Profile</h1>
              <p className="text-xs text-slate-400 mt-0.5">Verified Academic Student Identity & Custom Hyper-Realistic Avatar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Profile Card Panel - Hyper Realistic 3D Student ID Card */}
              <div className="md:col-span-1 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-6 rounded-[32px] border border-violet-500/30 shadow-xl flex flex-col items-center justify-between text-center space-y-5 relative overflow-hidden group">
                {/* Holographic Shimmer Overlay */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400" />
                <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-violet-600/10 blur-2xl pointer-events-none" />

                {/* ID Card Top Header */}
                <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-300 font-display">
                      Verified Identity
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    ID #{currentUser.email.substring(0, 6).toUpperCase()}
                  </span>
                </div>

                {/* SafeAvatar with Frame */}
                <div className="relative pt-2">
                  <SafeAvatar
                    src={currentUser.avatarUrl}
                    name={currentUser.displayName}
                    frame={currentUser.frame || 'neon'}
                    size="xl"
                  />
                </div>

                {/* Name & Bio */}
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="text-base font-black text-white leading-tight font-display">
                      {currentUser.displayName}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20 shrink-0" />
                  </div>
                  <span className="text-[11px] text-violet-300 font-mono block">@{currentUser.username}</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1 px-1">
                    "{currentUser.bio || 'Daily learner & reflector'}"
                  </p>
                </div>

                {/* Status Note Badge */}
                <div className="w-full p-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-2 text-left">
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                    <p className="text-xs font-semibold text-violet-200 truncate">{userStatusNote}</p>
                  </div>
                  <button
                    onClick={() => {
                      setStatusNoteInput(userStatusNote);
                      setShowStatusNoteModal(true);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold shrink-0 transition-colors"
                  >
                    Edit
                  </button>
                </div>

                {/* Direct quick profile edit & settings buttons */}
                <div className="flex flex-wrap gap-2 w-full justify-center pt-1">
                  <button
                    onClick={() => {
                      setEditDisplayName(currentUser.displayName);
                      setEditBio(currentUser.bio);
                      setEditAvatarUrl(currentUser.avatarUrl);
                      setEditFrame(currentUser.frame || 'none');
                      setAvatarSearchQuery('');
                      setAvatarCategoryFilter('All');
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2.5 text-xs font-black bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-indigo-600 hover:opacity-90 text-white rounded-2xl shadow-lg transition-all cursor-pointer flex-1 min-w-[120px]"
                  >
                    Edit Profile & Avatar
                  </button>
                  <button
                    onClick={() => setCurrentTab('settings')}
                    className="px-3.5 py-2.5 text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <SettingsIcon className="w-4 h-4 text-violet-400" />
                  </button>
                </div>
              </div>

              {/* Badges, statistics and Settings panel */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-[24px] border border-violet-100/50 dark:border-slate-800/80 text-center shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-display">average score</span>
                    <span className="text-xl font-black text-violet-600 dark:text-violet-400 mt-1 block">{currentUser.stats.averageScore}%</span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-[24px] border border-violet-100/50 dark:border-slate-800/80 text-center shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-display">highest score</span>
                    <span className="text-xl font-black text-amber-500 mt-1 block">{currentUser.stats.highestScore}%</span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-[24px] border border-violet-100/50 dark:border-slate-800/80 text-center shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-display">streak day</span>
                    <span className="text-xl font-black text-orange-500 mt-1 block">{currentUser.stats.currentStreak} 🔥</span>
                  </div>
                </div>

                {/* Achievements block */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-display">Unlocked Badges & Medals</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {currentUser.achievements.map(badgeId => (
                      <div key={badgeId} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                        {getBadgeIcon(badgeId)}
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white">{formatBadgeName(badgeId)}</p>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Verified Goal achieved</span>
                        </div>
                      </div>
                    ))}
                    {currentUser.achievements.length === 0 && (
                      <p className="text-xs text-slate-400 col-span-2 text-center py-4">Reflect consistently to unlock custom badges!</p>
                    )}
                  </div>
                </div>

                {/* Quick App Settings Section */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-display flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4 text-violet-500" />
                      <span>App Settings & Theme</span>
                    </h4>
                    <button
                      onClick={() => setCurrentTab('settings')}
                      className="text-[10px] text-violet-500 dark:text-violet-400 hover:underline font-bold"
                    >
                      Open Settings Portal →
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-black text-slate-800 dark:text-white">Dark Mode Theme</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Toggle eye-safe slate dark mode presets</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-3.5 py-2 bg-violet-500/10 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900 text-xs font-extrabold rounded-xl cursor-pointer flex-shrink-0"
                    >
                      {isThemeDark ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {currentTab === 'settings' && (
          <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto w-full animate-fade-in relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 dark:bg-violet-950/50 border border-violet-200/80 dark:border-violet-800/80 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white font-display">Settings</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage app preferences, cloud synchronization, and account data.</p>
              </div>
            </div>

            <div className="space-y-4">

              {/* Card 1: Appearance */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  {isThemeDark ? <Moon className="w-4 h-4 text-violet-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <h3 className="text-xs font-black text-slate-800 dark:text-white font-display uppercase tracking-wider">Appearance</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Dark Mode</h4>
                    <p className="text-[11px] text-slate-400">Switch visual theme for reduced eye strain</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
                      isThemeDark
                        ? 'bg-violet-950/60 text-violet-300 border-violet-800/80 hover:bg-violet-900/60'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isThemeDark ? (
                      <>
                        <Moon className="w-3.5 h-3.5 text-violet-400" />
                        <span>Dark Theme</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light Theme</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: Cloud Storage & Sync */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-black text-slate-800 dark:text-white font-display uppercase tracking-wider">Cloud Storage & Backup</h3>
                  </div>

                  {driveConnected ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Disconnected
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Google Drive Cloud Memory</h4>
                    <p className="text-[11px] text-slate-400">Automatically backup journal logs and focus stats to your Google account</p>
                  </div>

                  {!driveConnected ? (
                    <button
                      type="button"
                      onClick={handleConnectDrive}
                      disabled={driveLoading}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {driveLoading ? (
                        <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Cloud className="w-3.5 h-3.5" />
                          <span>Connect Google Drive</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleSyncDrive}
                        disabled={driveLoading}
                        className="px-3 py-2 bg-violet-500/10 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 hover:bg-violet-500/20 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${driveLoading ? 'animate-spin' : ''}`} />
                        <span>Sync Now</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDisconnectDrive}
                        disabled={driveLoading}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Unlink className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  )}
                </div>

                {driveConnected && (
                  <div className="p-3.5 bg-slate-50/80 dark:bg-slate-950/50 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <User className="w-3.5 h-3.5 text-indigo-500" /> Connected Account
                      </span>
                      <span className="font-extrabold text-[11px]">{driveEmail}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" /> Last Backup
                      </span>
                      <span className="font-extrabold text-[11px] font-mono">
                        {driveSyncedAt ? new Date(driveSyncedAt).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <HardDrive className="w-3.5 h-3.5 text-indigo-500" /> Partition
                      </span>
                      <span className="font-extrabold text-[11px] font-mono text-slate-500 dark:text-slate-400">Google Drive /AppDataFolder</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3: Direct Local Device Storage Engine */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-xs font-black text-slate-800 dark:text-white font-display uppercase tracking-wider flex items-center gap-1.5">
                      <span>Device Storage Engine</span>
                      <span className="text-[10px] text-amber-500 font-bold">(Game-Style Auto-Save)</span>
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ACTIVE & SAVED</span>
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-950/20 dark:bg-emerald-950/30 rounded-2xl border border-emerald-500/20 text-xs text-slate-300 space-y-2">
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold leading-relaxed">
                    ✨ Just like games store player data on device storage, DayScore automatically saves all your profile stats, average score ({currentUser?.stats?.averageScore || 0}%), flame streak ({currentUser?.stats?.currentStreak || 0}d), unlocked badges ({currentUser?.achievements?.length || 0}), journals, focus sessions, and tasks directly on your device. When you reopen the app, your progress is instantly loaded!
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleForceSyncDeviceStorage}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sync Progress to Device Storage</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span>Save to Device Folder</span>
                        <span className="text-[10px] font-normal text-slate-400">(JSON File Export)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Export a complete snapshot file of all your user progress to your device downloads or documents folder</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveToDeviceFolder}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save to Device File</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <span>Load from Device Folder</span>
                        <span className="text-[10px] font-normal text-slate-400">(Restore Data)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Select and restore a previously exported snapshot file from your local device folder</p>
                    </div>
                    <label className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                      <Folder className="w-3.5 h-3.5" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLoadFromDeviceFolder(file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>
                    Saved Items: <strong className="text-slate-700 dark:text-slate-200 font-mono">{journals.length}</strong> journals, <strong className="text-slate-700 dark:text-slate-200 font-mono">{studySessions.length}</strong> study logs, <strong className="text-slate-700 dark:text-slate-200 font-mono">{todos.length}</strong> tasks
                  </span>
                </div>
              </div>

              {/* Card 4: Account & Session Management */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <User className="w-4 h-4 text-violet-500" />
                  <h3 className="text-xs font-black text-slate-800 dark:text-white font-display uppercase tracking-wider">Account & Session</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Log Out Account</h4>
                    <p className="text-[11px] text-slate-400">Safely sign out of your current session ({currentUser.email})</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-900 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>

              {/* Card 5: Danger Zone */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-rose-100 dark:border-rose-950/60 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-rose-100 dark:border-rose-950/50">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-black text-rose-600 dark:text-rose-400 font-display uppercase tracking-wider">Danger Zone</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Delete Account Data</h4>
                    <p className="text-[11px] text-slate-400">Permanently erase your account profile and all saved entries</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountModal(true)}
                    className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- REWARDING AI EVALUATION DETAILS MODAL --- */}
      <AnimatePresence>
        {showEvaluationModal && activeEvaluation && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-violet-200/80 dark:border-slate-800 w-full max-w-lg p-6 rounded-[32px] shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto custom-scrollbar"
            >
              {/* Modal Header with Score Mark */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-indigo-600 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
                    <span className="text-xl sm:text-2xl font-display leading-none">
                      {activeEvaluation.score ?? selectedEntry?.score ?? 0}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-80 mt-0.5">/ 100</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{activeEvaluation.emoji || selectedEntry?.emoji || '✨'}</span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                        {activeEvaluation.title || selectedEntry?.title || 'Daily AI Score Breakdown'}
                      </h3>
                    </div>
                    <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                      Total Reflection Analysis Details ({selectedDate})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEvaluationModal(false);
                    setActiveEvaluation(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Score Quality Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>DayScore Quality</span>
                  <span className="font-mono text-violet-600 dark:text-violet-400 font-black">
                    {activeEvaluation.score ?? selectedEntry?.score ?? 0}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, activeEvaluation.score ?? selectedEntry?.score ?? 0))}%` }}
                  />
                </div>
              </div>

              {/* Summary Block */}
              <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-2xl text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-semibold">
                "{activeEvaluation.summary}"
              </div>

              {/* Strengths & Improvements */}
              <div className="space-y-4">
                {((activeEvaluation.strengths && activeEvaluation.strengths.length > 0) || activeEvaluation.strength) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-500" /> Key Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {activeEvaluation.strengths && activeEvaluation.strengths.length > 0 ? (
                        activeEvaluation.strengths.map((str: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                            <span className="text-emerald-500 shrink-0 font-bold">✔</span> <span>{str}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                          <span className="text-emerald-500 shrink-0 font-bold">✔</span> <span>{activeEvaluation.strength}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {activeEvaluation.improvements && activeEvaluation.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                      🎯 Tailored Recommendations
                    </h4>
                    <ul className="space-y-1.5">
                      {activeEvaluation.improvements.map((imp: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                          <span className="text-amber-500 shrink-0 font-bold">▶</span> <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tomorrow's challenge */}
              {activeEvaluation.tomorrowChallenge && (
                <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-300/80 dark:border-amber-700/80 rounded-2xl space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 tracking-wider leading-none">
                    🔥 Tomorrow's Growth Challenge
                  </h4>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeEvaluation.tomorrowChallenge}</p>
                </div>
              )}

              {/* Encouragement text */}
              {activeEvaluation.encouragement && (
                <div className="p-3 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-2xl text-xs font-medium text-violet-800 dark:text-violet-300 text-center italic">
                  "{activeEvaluation.encouragement}"
                </div>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowEvaluationModal(false);
                  setActiveEvaluation(null);
                }}
                className="w-full py-3.5 text-center text-xs font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:translate-y-0.5 border-b-4 border-violet-800 active:border-b-0 rounded-2xl transition-all duration-100 cursor-pointer shadow-md"
              >
                Got it, keep reflecting!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CREATIVE POMODORO CYCLES SHARE MODAL --- */}
      <AnimatePresence>
        {showPomodoroShareModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-lg p-6 rounded-3xl shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🍅</span>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white font-display">Share Pomodoro Accomplishment</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Post your total focus cycles today to inspire classmates on the feed</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPomodoroShareModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Live Preview Card */}
              {(() => {
                const todaySessions = studySessions.filter(s => s.date === todayDateStr);
                const totalMins = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
                const cyclesCount = Math.max(1, Math.max(todaySessions.length, Math.floor(totalMins / 25)));

                return (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-violet-500/10 border border-rose-500/30 dark:border-rose-500/20 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                          {currentUser?.displayName?.[0] || 'S'}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white font-display">{currentUser?.displayName}</h4>
                          <span className="text-[9px] text-rose-600 dark:text-rose-400 font-extrabold">🍅 Today's Pomodoro Mastery</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs rounded-full shadow-sm">
                        {cyclesCount} {cyclesCount === 1 ? 'Cycle' : 'Cycles'} ({totalMins > 0 ? totalMins : cyclesCount * 25} Mins)
                      </span>
                    </div>

                    {/* Cycle Badges */}
                    <div className="flex items-center gap-1.5 py-1">
                      {Array.from({ length: Math.min(cyclesCount, 10) }).map((_, i) => (
                        <span key={i} className="text-xl transform hover:scale-125 transition-transform" title={`Cycle ${i + 1}`}>🍅</span>
                      ))}
                    </div>

                    {/* Category & Custom Note Preview */}
                    <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-rose-100 dark:border-rose-950/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="font-extrabold text-violet-600 dark:text-violet-400 mr-1.5">[{pomodoroShareCategory}]</span>
                      <span>{pomodoroShareNote.trim() || 'Crushed focus cycles and built deep learning momentum today! 🚀'}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Input Controls */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-display">Study Focus Subject</label>
                  <select
                    value={pomodoroShareCategory}
                    onChange={e => setPomodoroShareCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Programming & Deep Work">Programming & Deep Work 💻</option>
                    <option value="Academic Revision & Exams">Academic Revision & Exams 📚</option>
                    <option value="Research & Problem Solving">Research & Problem Solving 🔬</option>
                    <option value="Writing & Essay Creation">Writing & Essay Creation ✍️</option>
                    <option value="Language & Skill Practice">Language & Skill Practice 🌍</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-display">Custom Reflection Note (Optional)</label>
                  <textarea
                    value={pomodoroShareNote}
                    onChange={e => setPomodoroShareNote(e.target.value)}
                    placeholder="e.g. Finished 4 pomodoro cycles on Algorithms & Data Structures! Feeling focused 🚀"
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPomodoroShareModal(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSharePomodoroCyclesToFeed}
                  disabled={pomodoroShareLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 via-amber-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-black rounded-2xl text-xs shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {pomodoroShareLoading ? (
                    <span className="animate-spin text-sm">⏳</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Publish Creative Post</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SPECIAL INTERACTIVE 3D TROPHY INSPECTION MODAL --- */}
      <AnimatePresence>
        {trophyInspectModal && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/60 w-full max-w-md p-6 sm:p-8 rounded-[36px] shadow-2xl relative overflow-hidden space-y-6 text-center"
            >
              {/* Top ambient glow */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setTrophyInspectModal(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>3D Animated Trophy Showcase</span>
              </div>

              {/* Big 3D Trophy Animated Stage */}
              <div className="py-4 flex justify-center">
                <motion.div
                  animate={{
                    rotateY: [0, 360],
                    y: [0, -8, 0]
                  }}
                  transition={{
                    rotateY: { duration: 10, repeat: Infinity, ease: 'linear' },
                    y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] bg-gradient-to-br ${trophyInspectModal.gradient} p-1 shadow-2xl flex items-center justify-center text-6xl relative group`}
                >
                  <div className="w-full h-full bg-slate-950 rounded-[28px] flex items-center justify-center text-6xl shadow-inner">
                    {trophyInspectModal.icon}
                  </div>
                </motion.div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  {trophyInspectModal.title}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                  {trophyInspectModal.subtitle}
                </p>
              </div>

              {/* Requirement & Holder Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Holder</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    {trophyInspectModal.holderAvatar && (
                      <img src={trophyInspectModal.holderAvatar} alt="holder" className="w-4 h-4 rounded-full object-cover" />
                    )}
                    <span>{trophyInspectModal.holder}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unlock Condition</span>
                  <span className="text-[11px] font-extrabold text-violet-600 dark:text-violet-300">
                    {trophyInspectModal.req}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {trophyInspectModal.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setConfettiActive(true);
                    setTimeout(() => setConfettiActive(false), 4000);
                    showToast(`🎉 Celebrated ${trophyInspectModal.title}! Keep striving for excellence.`, 'success');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Celebrate Trophy Rank 🎉</span>
                </button>

                <button
                  onClick={() => setTrophyInspectModal(null)}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close Showcase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE ACCOUNT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showDeleteAccountModal && currentUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/80 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-950/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">Delete Account Permanently</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteAccountModal(false);
                    setDeleteConfirmInput('');
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl space-y-2 text-xs text-rose-900 dark:text-rose-200 font-medium">
                <p className="font-bold text-rose-700 dark:text-rose-300">⚠️ Warning: This action is permanent and cannot be undone!</p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800 dark:text-rose-300/90">
                  <li>Your user profile (@{currentUser.username}) will be erased.</li>
                  <li>All daily reflection journals and study logs will be destroyed.</li>
                  <li>Your earned achievements, trophies, and streak data will be lost.</li>
                  <li>All saved passwords and recovery PINs will be deleted.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  Type <span className="font-black text-rose-600 dark:text-rose-400 font-mono underline">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteAccountModal(false);
                    setDeleteConfirmInput('');
                  }}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmInput.trim().toUpperCase() !== 'DELETE' || isDeletingAccount}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDeletingAccount ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOCUS SESSION FINISH CONFIGURATION MODAL --- */}
      <AnimatePresence>
        {showTimerFinishModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-violet-100 dark:border-slate-800 w-full max-w-md p-6 rounded-[32px] shadow-2xl space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white shadow-xl shadow-violet-200/50 dark:shadow-none animate-bounce">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white font-display">Save Study Focus Session</h3>
                <p className="text-xs text-slate-400 font-semibold">Classmates will celebrate your learning progress on the feed!</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-display">Topic of Study</label>
                  <select
                    value={selectedTimerCategory}
                    onChange={e => setSelectedTimerCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-150 dark:border-slate-700 focus:outline-none rounded-2xl text-xs font-bold"
                  >
                    {['Programming', 'Math', 'Anatomy', 'Mindfulness', 'Writing', 'History'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-bold font-display">Share to classroom feed</h4>
                    <p className="text-[9px] text-slate-400 font-semibold">Let friends celebrate your study blocks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareTimerToFeed}
                    onChange={e => setShareTimerToFeed(e.target.checked)}
                    className="w-4.5 h-4.5 rounded-lg text-violet-600 border-2 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowTimerFinishModal(false)}
                  className="flex-1 py-3.5 text-center text-xs font-black bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleTimerFinishSave}
                  className="flex-1 py-3.5 text-center text-xs font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-b-4 border-violet-800 active:border-b-0 rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  Save & Share block
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- STUDENT PROFILE EDITING MODAL --- */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-violet-100/50 dark:border-slate-800/80 p-6 md:p-7 rounded-[36px] shadow-2xl max-w-2xl w-full space-y-5 text-left my-auto max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <span>Edit Student Profile</span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold">
                      70 Avatars Available
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Customize your public details and pick your favorite character profile picture.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {/* Current Active Avatar Preview Banner with Frame */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-indigo-500/10 border border-violet-200/70 dark:border-violet-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <SafeAvatar
                        src={editAvatarUrl || CHARACTER_AVATARS[0].url}
                        name={editDisplayName || activeAvatarCharacter?.name || 'User'}
                        frame={editFrame}
                        size="lg"
                      />
                    </div>
                    <div className="overflow-hidden space-y-0.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white font-display truncate">
                          {activeAvatarCharacter?.name || 'Custom Photo Avatar'}
                        </span>
                        {activeAvatarCharacter && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-black text-violet-600 dark:text-violet-400">
                            #{activeAvatarCharacter.id}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-violet-600 dark:text-violet-300">
                        Frame: {editFrame === 'none' ? 'Standard' : editFrame.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Device Upload Button */}
                  <div className="shrink-0 w-full sm:w-auto">
                    <input
                      type="file"
                      ref={avatarFileInputRef}
                      onChange={handleFileUploadAvatar}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Device</span>
                    </button>
                  </div>
                </div>

                {/* Profile Aura Frame Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-display flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Select Profile Frame Aura</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[
                      { id: 'none', label: 'None', color: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
                      { id: 'gold', label: 'Gold 👑', color: 'bg-amber-500/20 text-amber-600 border-amber-400' },
                      { id: 'neon', label: 'Neon ⚡', color: 'bg-cyan-500/20 text-cyan-600 border-cyan-400' },
                      { id: 'cosmic', label: 'Cosmic 🌌', color: 'bg-purple-500/20 text-purple-600 border-purple-400' },
                      { id: 'emerald', label: 'Emerald 🌿', color: 'bg-emerald-500/20 text-emerald-600 border-emerald-400' },
                      { id: 'diamond', label: 'Diamond 💎', color: 'bg-sky-500/20 text-sky-600 border-sky-400' },
                      { id: 'flame', label: 'Flame 🔥', color: 'bg-rose-500/20 text-rose-600 border-rose-400' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setEditFrame(f.id as AvatarFrame)}
                        className={`p-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${f.color} ${
                          editFrame === f.id ? 'ring-2 ring-violet-600 dark:ring-violet-400 scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Character Avatar Picker */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-display">
                      Select Avatar Character
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">
                      Showing {filteredAvatars.length} Avatars
                    </span>
                  </div>

                  {/* Search and Category Filter Bar */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={avatarSearchQuery}
                        onChange={(e) => setAvatarSearchQuery(e.target.value)}
                        placeholder="Search avatar characters by name or # (e.g. Zylo, Sophia, 3D)..."
                        className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:outline-none focus:border-violet-500"
                      />
                      {avatarSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setAvatarSearchQuery('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {['All', 'Aliens & Spirits', 'Monsters & Beasts', 'Robots & Mechs', 'Cute & Fuzzy', 'Elementals & Golems'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setAvatarCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            avatarCategoryFilter === cat
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatars Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 max-h-56 overflow-y-auto p-2 bg-slate-50/80 dark:bg-slate-950/60 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 custom-scrollbar">
                    {filteredAvatars.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-xs text-slate-400">
                        No characters found matching "{avatarSearchQuery}".
                      </div>
                    ) : (
                      filteredAvatars.map((avatar) => {
                        const isSelected = editAvatarUrl === avatar.url;
                        return (
                          <button
                            key={avatar.id}
                            type="button"
                            onClick={() => setEditAvatarUrl(avatar.url)}
                            className={`group flex flex-col items-center p-1.5 rounded-xl transition-all relative cursor-pointer ${
                              isSelected
                                ? 'bg-violet-500/15 ring-2 ring-violet-600 dark:ring-violet-400 scale-105'
                                : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/60 opacity-85 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                              <SafeAvatar
                                src={avatar.url}
                                name={avatar.name}
                                size="sm"
                              />
                              <span className="absolute top-0.5 left-0.5 text-[8px] font-black bg-slate-950/80 text-white px-1 rounded z-10">
                                #{avatar.id}
                              </span>
                              {isSelected && (
                                <div className="absolute inset-0 bg-violet-600/30 backdrop-blur-[1px] flex items-center justify-center z-10">
                                  <div className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-md">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-300 truncate w-full text-center mt-1 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                              {avatar.name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Display name field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="Enter display name..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 dark:focus:border-violet-500 focus:outline-none rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                {/* Biography field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Biography
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell your classmates about your study goals..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-violet-500 dark:focus:border-violet-500 focus:outline-none rounded-xl text-xs font-semibold text-slate-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 text-center text-xs font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateProfile(editDisplayName, editBio, editAvatarUrl, editFrame);
                    setIsEditingProfile(false);
                  }}
                  className="flex-1 py-3 text-center text-xs font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 border-b-4 border-violet-800 active:border-b-0 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Status Note Modal */}
        {showStatusNoteModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                    💭
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white font-display">Set Status Note</h3>
                </div>
                <button onClick={() => setShowStatusNoteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Share a brief status note with your classmates (displayed above your avatar in chat).
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  value={statusNoteInput}
                  onChange={(e) => setStatusNoteInput(e.target.value)}
                  placeholder="e.g. Studying Calculus 📚, 2hr Focus 🧠"
                  maxLength={40}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                  <span>Max 40 characters</span>
                  <span>{statusNoteInput.length} / 40</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusNoteModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveStatusNote(statusNoteInput)}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 rounded-xl shadow-md transition-all"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Notes System Modal */}
        {showQuickNotesModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">My Quick Notes & Cheat Sheets</h3>
                    <p className="text-xs text-slate-400">Save study formulas, key reminders, and micro-notes anytime.</p>
                  </div>
                </div>
                <button onClick={() => setShowQuickNotesModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Note Creation Form */}
              <div className="py-4 border-b border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Note Title (e.g. Organic Chem Lab)..."
                    className="sm:col-span-2 px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <select
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Academic">Academic 📚</option>
                    <option value="Focus">Focus & Habit 🧠</option>
                    <option value="Reminder">Reminder ⏰</option>
                    <option value="Ideas">Ideas 💡</option>
                  </select>
                </div>

                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your study note, key points, formula, or reminder here..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  {/* Color palette options */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Color:</span>
                    {[
                      { id: 'violet', bg: 'bg-violet-500' },
                      { id: 'emerald', bg: 'bg-emerald-500' },
                      { id: 'amber', bg: 'bg-amber-500' },
                      { id: 'rose', bg: 'bg-rose-500' },
                      { id: 'indigo', bg: 'bg-indigo-500' },
                    ].map(col => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setNewNoteColor(col.id)}
                        className={`w-5 h-5 rounded-full ${col.bg} transition-transform ${newNoteColor === col.id ? 'ring-2 ring-offset-2 ring-violet-600 scale-110' : 'opacity-70 hover:opacity-100'}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuickNote}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Note
                  </button>
                </div>
              </div>

              {/* Notes List with Filter */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Saved Notes ({quickNotes.length})
                  </span>
                  <div className="flex gap-1">
                    {['All', 'Academic', 'Focus', 'Reminder', 'Ideas'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNoteCategoryFilter(cat)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors ${
                          noteCategoryFilter === cat ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {quickNotes.filter(n => noteCategoryFilter === 'All' || n.category === noteCategoryFilter).length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No notes found in this category. Create one above!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickNotes
                      .filter(n => noteCategoryFilter === 'All' || n.category === noteCategoryFilter)
                      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                      .map(note => (
                        <div
                          key={note.id}
                          className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                            note.color === 'emerald'
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : note.color === 'amber'
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : note.color === 'rose'
                              ? 'bg-rose-500/10 border-rose-500/30'
                              : note.color === 'indigo'
                              ? 'bg-indigo-500/10 border-indigo-500/30'
                              : 'bg-violet-500/10 border-violet-500/30'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-black text-slate-900 dark:text-white font-display leading-snug">{note.title}</h4>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleTogglePinQuickNote(note.id)}
                                  className={`p-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${note.pinned ? 'text-amber-500' : 'text-slate-400'}`}
                                  title={note.pinned ? 'Unpin Note' : 'Pin Note'}
                                >
                                  📌
                                </button>
                                <button
                                  onClick={() => handleDeleteQuickNote(note.id)}
                                  className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                                  title="Delete Note"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">
                              {note.content}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/40 dark:border-slate-800/40 text-[9px] font-bold text-slate-400">
                            <span className="px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40">
                              {note.category}
                            </span>
                            <span>{note.date}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
export type { App };
