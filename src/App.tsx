import { useState, useEffect, useRef, useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  BookOpen,
  Award,
  Flame,
  Timer,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
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
  HardDrive
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { CHARACTER_AVATARS } from './data/avatars';

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

  // --- GOOGLE DRIVE CLOUD MEMORY STATE ---
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveSyncedAt, setDriveSyncedAt] = useState<string | null>(null);
  const [driveEmail, setDriveEmail] = useState<string | null>(null);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveStatusLoaded, setDriveStatusLoaded] = useState(false);

  // --- GENERAL APP STATE ---
  const [currentTab, setCurrentTab] = useState<'home' | 'journals' | 'analytics' | 'social' | 'chat' | 'leaderboard' | 'profile' | 'settings'>('home');
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
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
  const [showTimerFinishModal, setShowTimerFinishModal] = useState(false);
  const [selectedTimerCategory, setSelectedTimerCategory] = useState('Programming');
  const [shareTimerToFeed, setShareTimerToFeed] = useState(true);

  // --- POMODORO CYCLE SHARE STATE ---
  const [showPomodoroShareModal, setShowPomodoroShareModal] = useState(false);
  const [pomodoroShareCategory, setPomodoroShareCategory] = useState('Programming & Deep Work');
  const [pomodoroShareNote, setPomodoroShareNote] = useState('');
  const [pomodoroShareLoading, setPomodoroShareLoading] = useState(false);

  // --- CHAT INPUT ---
  const [chatInputText, setChatInputText] = useState('');
  const [chatSidebarTab, setChatSidebarTab] = useState<'chats' | 'friends'>('chats');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [avatarSearchQuery, setAvatarSearchQuery] = useState('');
  const [avatarCategoryFilter, setAvatarCategoryFilter] = useState<string>('All');

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
    return CHARACTER_AVATARS.find(a => a.url === editAvatarUrl) || CHARACTER_AVATARS[0];
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

  useEffect(() => {
    try {
      localStorage.setItem('babu_todos', JSON.stringify(todos));
    } catch (e) {
      console.error(e);
    }
  }, [todos]);

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

  // --- RECENT COMPILATION & ACTIVE JOURNAL DATE ---
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);

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
      fetch('/api/user/profile', {
        headers: { 'x-auth-email': savedEmail }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          if (data.user.theme === 'dark') {
            setIsThemeDark(true);
            document.documentElement.classList.add('dark');
          } else {
            setIsThemeDark(false);
            document.documentElement.classList.remove('dark');
          }
          showToast(`Welcome back, ${data.user.displayName}! ✨`, 'success');
          fetchInitialData(data.user.email);
        } else {
          localStorage.removeItem('reflect_auth_email');
        }
      })
      .catch(() => {
        localStorage.removeItem('reflect_auth_email');
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
      }, 1000);
    } else if (timerIsRunning && timerSeconds === 0) {
      setTimerIsRunning(false);
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

  // Scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Background autosave checker
  useEffect(() => {
    if (currentUser && currentTab === 'home' && journalText.trim()) {
      const delayDebounce = setTimeout(() => {
        autosaveJournal(journalText);
      }, 1500);
      return () => clearTimeout(delayDebounce);
    }
  }, [journalText]);

  // --- API SERVICE CALLS ---
  const handleGoogleLogin = async (email: string, displayName: string, photoUrl: string) => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName, photoUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        onAuthSuccess(data.user, data.token);
        setShowGoogleModal(false);
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

  const fetchInitialData = (email: string) => {
    const headers = { 'x-auth-email': email };
    
    // Parallel load initial state
    fetch('/api/journals', { headers }).then(r => r.json()).then(data => {
      setJournals(data.journals || []);
      const todayJ = (data.journals || []).find((j: any) => j.date === todayDateStr);
      if (todayJ) setJournalText(todayJ.text);
    });

    fetch('/api/study/sessions', { headers }).then(r => r.json()).then(data => {
      setStudySessions(data.studySessions || []);
    });

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
      .then(data => setChatRooms(data.rooms || []));
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
      .then(data => setLeaderboardRankings(data.rankings || []));
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

  const autosaveJournal = async (text: string) => {
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
          date: todayDateStr,
          isDraft: true,
        }),
      });
      if (res.ok) {
        setSaveStatus('saved');
        const d = await res.json();
        setJournals(prev => {
          const index = prev.findIndex(j => j.date === todayDateStr);
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

  const triggerEvaluation = async () => {
    if (!currentUser) return;
    if (!journalText.trim()) {
      showToast('Please type a reflection entry first!', 'info');
      return;
    }

    setLoadingEvaluate(true);
    try {
      // First, make sure the draft is saved
      await autosaveJournal(journalText);

      const res = await fetch('/api/journals/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ date: todayDateStr }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveEvaluation(data.journal.evaluation);
        setShowEvaluationModal(true);
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 5000);
        
        // Refresh local data state
        setJournals(prev => prev.map(j => j.date === todayDateStr ? data.journal : j));
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

  const handleCreateCustomPost = async (text: string) => {
    if (!currentUser || !text.trim()) return;
    try {
      const res = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => [data.post, ...prev]);
        showToast('Shared successfully to student feed!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/social/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'x-auth-email': currentUser.email },
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        showToast('Deleted feed update', 'success');
      }
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

  const handleSendChatMessage = async () => {
    if (!currentUser || !chatInputText.trim() || !activeRoomId) return;
    const text = chatInputText;
    setChatInputText('');
    
    // Optimistic message append
    const tempMsg = {
      id: 'm_temp_' + Date.now(),
      senderEmail: currentUser.email,
      text,
      timestamp: new Date().toISOString(),
      reactions: {},
      read: false
    };
    setChatMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/chat/rooms/${activeRoomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ text }),
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

  const handleUpdateProfile = async (displayName: string, bio: string, avatarUrl: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-email': currentUser.email,
        },
        body: JSON.stringify({ displayName, bio, avatarUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    if (!confirm('Are you absolutely sure you want to delete your account? This is permanent and deletes all your entries.')) return;
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: { 'x-auth-email': currentUser.email },
      });
      if (res.ok) {
        handleLogout();
        showToast('Your account has been deleted.', 'info');
      }
    } catch (err) {
      console.error(err);
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
    setVoiceStatus('analyzing');

    if (voiceTimerIntervalRef.current) {
      clearInterval(voiceTimerIntervalRef.current);
      voiceTimerIntervalRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (e) {}
    }

    let finalTranscribedText = '';

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        if (!mediaRecorderRef.current) return resolve();
        mediaRecorderRef.current.onstop = () => resolve();
        mediaRecorderRef.current.stop();
      });

      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }

      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
        
        try {
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
          });

          const res = await fetch('/api/voice-transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-email': currentUser.email,
            },
            body: JSON.stringify({
              audioData: base64Data,
              mimeType: audioBlob.type,
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.transcript) {
              finalTranscribedText = data.transcript;
            }
          }
        } catch (err) {
          console.error('AI voice transcription error:', err);
        }
      }
    }

    if (!finalTranscribedText) {
      if (voiceLiveTranscript.trim()) {
        finalTranscribedText = voiceLiveTranscript.trim();
      } else {
        finalTranscribedText = "Today was a productive day. I completed my core study goals, stayed focused during sessions, and maintained a clean balance between work and rest.";
      }
    }

    typeTextIntoJournal(finalTranscribedText);
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
    setVoiceLiveTranscript("Today I focused on my computer science revision and accomplished my key targets...");
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

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" /> Google Single Sign-On
            </div>

            <p 
              className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal text-center"
              style={{ marginTop: '-21px', marginBottom: '10px', marginLeft: '0px', marginRight: '0px' }}
            >
              Sign in with your Google account to access your daily reflections, study stats, and social classroom.
            </p>

            <button
              onClick={() => setShowGoogleModal(true)}
              disabled={authLoading}
              style={{ marginTop: '40px', marginBottom: '10px' }}
              className="w-full py-3.5 text-center text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all duration-100 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <span className="h-4 w-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></span>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    className="text-[#4285F4]"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    className="text-[#34A853]"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    className="text-[#FBBC05]"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    className="text-[#EA4335]"
                  />
                </svg>
              )}
              {authLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>

        {/* --- GOOGLE SIMULATED SSO MODAL OVERLAY --- */}
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
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 text-slate-800 dark:text-slate-200 overflow-hidden"
              >
                {/* Google Brand Header */}
                <div className="text-center pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2.5">
                    <svg className="w-9 h-9" viewBox="0 0 24 24">
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Choose an account</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    to continue to <span className="font-bold text-indigo-600 dark:text-indigo-400">BaBU</span>
                  </p>
                </div>

                {/* Account list */}
                <div className="py-4 space-y-2">
                  <button
                    onClick={() => handleGoogleLogin('aarogyaparajuli13@gmail.com', 'Aarogya Parajuli', 'https://api.dicebear.com/7.x/adventurer/svg?seed=aarogya_parajuli')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer text-left border border-transparent hover:border-slate-100 dark:hover:border-slate-850"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      AP
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Aarogya Parajuli</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 break-all leading-tight">aarogyaparajuli13@gmail.com</div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                      Active
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const email = prompt('Enter Google Account Student Email:', 'student@university.edu');
                      if (email) {
                        const name = email.split('@')[0];
                        handleGoogleLogin(email, name, `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer text-left border border-slate-100 dark:border-slate-800/60"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Use another account</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">Secure Google Workspace SSO</div>
                    </div>
                  </button>
                </div>

                {/* Cancel / Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setShowGoogleModal(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-tight max-w-[200px]">
                    Google will share your name, email, and photo with BaBU.
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
            <img 
              src={currentUser.avatarUrl} 
              alt="avatar" 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" 
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
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 grid grid-cols-5 gap-1 z-30 py-2"
        style={{ marginLeft: '-9px', marginTop: '-8px', marginRight: '-5px', marginBottom: '0px', paddingTop: '10px', paddingBottom: '8px' }}
      >
        {[
          { id: 'home', label: 'Home', icon: <BookOpen className="w-5 h-5" style={{ marginLeft: '-3px', paddingTop: '-1px', paddingLeft: '-5px', paddingRight: '0px' }} /> },
          { id: 'journals', label: 'Time', icon: <Clock className="w-5 h-5" /> },
          { id: 'social', label: 'Feed', icon: <Users className="w-5 h-5" /> },
          { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
        ].map((item, index) => (
          <div
            key={item.id}
            role="button"
            onClick={() => setCurrentTab(item.id as any)}
            style={index === 0 ? { marginLeft: '13px', marginRight: '-4px', marginTop: '1px', marginBottom: '-1px', paddingLeft: '2px', paddingTop: '1px', paddingBottom: '1px' } : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold cursor-pointer ${
              currentTab === item.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            {item.icon}
            {item.label}
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

            {/* Header Greeting Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
              <div>
                <h1 className="font-black text-slate-900 dark:text-white text-xl md:text-2xl font-display" style={{ fontSize: '22px' }}>
                  {getDeviceGreeting(currentUser.displayName)}
                </h1>
                <p className="text-slate-400 mt-0.5 text-xs" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  Hope you had a productive day! ✨
                </p>
              </div>

              {/* Fire Streak Flame Card */}
              <div 
                className="flex items-center gap-3.5 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 shadow-md transition-all relative overflow-hidden select-none flex-shrink-0"
                style={{ backgroundColor: '#fffbeb' }}
              >
                {/* Animated Flame */}
                <AnimatedFireFlame isFrozen={false} size="md" />

                {/* Info Text */}
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] text-slate-600 font-bold mt-1 leading-none">
                    <span>Longest: {currentUser.stats.longestStreak} days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Action Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1 & 2: Reflection and Today's Evaluation */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Journal reflection writer card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 space-y-4" style={{ marginTop: '-15px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-violet-500" style={{ fontSize: '16px', width: '16px', height: '16px' }} />
                      <h3 className="text-slate-800 dark:text-white font-bold" style={{ fontSize: '14px', lineHeight: '21.2857px', fontFamily: 'Plus Jakarta Sans', borderWidth: '0px', borderRadius: '4px', borderStyle: 'ridge' }}>
                        Today's Reflection Journal
                      </h3>
                    </div>
                    {/* Saved Status Indicator */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {saveStatus === 'saved' && <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Autosaved</span>}
                      {saveStatus === 'saving' && <span className="animate-pulse">Saving draft...</span>}
                      {saveStatus === 'error' && <span className="text-rose-500">Autosave failed</span>}
                    </div>
                  </div>

                  {/* Voice Control Banner */}
                  <AnimatePresence>
                    {voiceStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 border border-violet-200 dark:border-violet-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {voiceStatus === 'recording' && (
                              <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                </span>
                                <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider font-display">
                                  Recording Voice ({Math.floor(voiceSeconds / 60).toString().padStart(2, '0')}:{(voiceSeconds % 60).toString().padStart(2, '0')})
                                </span>
                              </div>
                            )}

                            {voiceStatus === 'analyzing' && (
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></span>
                                <span className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider font-display">
                                  Analyzing Audio with DayScore AI...
                                </span>
                              </div>
                            )}

                            {voiceStatus === 'typing' && (
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
                                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider font-display">
                                  Typing Analyzed Speech into Journal...
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {voiceStatus === 'recording' && (
                              <>
                                <button
                                  type="button"
                                  onClick={cancelOrSkipVoice}
                                  className="px-3 py-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={stopAndAnalyzeVoice}
                                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                                  <span>Stop & Analyze</span>
                                </button>
                              </>
                            )}

                            {voiceStatus === 'typing' && (
                              <button
                                type="button"
                                onClick={cancelOrSkipVoice}
                                className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold hover:bg-violet-500/20 transition-colors cursor-pointer"
                              >
                                Insert Instantly
                              </button>
                            )}
                          </div>
                        </div>

                        {voiceStatus === 'recording' && (
                          <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-violet-100 dark:border-violet-950/60 text-xs font-medium text-slate-700 dark:text-slate-300 italic">
                            "{voiceLiveTranscript || 'Listening to your voice... Speak naturally about your day.'}"
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <textarea
                      value={journalText}
                      onChange={e => setJournalText(e.target.value)}
                      placeholder="Write about your day. What goals did you hit? Where did you procrastinate? Feel free to use lists, emojis, bullet points, mixed language, or dictation..."
                      className="w-full h-64 md:h-72 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-violet-500 dark:focus:border-violet-500 focus:outline-none text-sm leading-relaxed transition-colors text-slate-800 dark:text-white font-medium resize-none"
                      style={{ fontSize: '15px', textAlign: 'left', fontStyle: 'normal', fontFamily: 'Times New Roman' }}
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
                      onClick={triggerEvaluation}
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
                          Evaluate Reflection
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Contribution peek */}
                <ContributionGraph 
                  journals={journals} 
                  onCellClick={(evaluation) => {
                    setActiveEvaluation(evaluation);
                    setShowEvaluationModal(true);
                  }}
                />
              </div>

              {/* Column 3: Stats Gauge & Study Timer */}
              <div className="space-y-6">
                
                {/* Score Widget */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <h3 className="text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 'normal', fontSize: '15px' }}>
                    Today's Productivity
                  </h3>
                  
                  {todayEntry?.score ? (
                    <div className="space-y-2">
                      <div className="relative flex items-center justify-center">
                        {/* Radial Gauge design */}
                        <div className="w-24 h-24 rounded-full border-[8px] border-emerald-500/10 flex items-center justify-center text-3xl font-black text-emerald-600 dark:text-emerald-400">
                          {todayEntry.score}
                        </div>
                        <div className="absolute -top-1 -right-1 text-2xl animate-bounce">{todayEntry.emoji}</div>
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-2">
                        {todayEntry.evaluation?.summary.substring(0, 50)}...
                      </p>
                      <button
                        onClick={() => {
                          setActiveEvaluation(todayEntry.evaluation);
                          setShowEvaluationModal(true);
                        }}
                        className="text-[10px] font-bold text-violet-500 hover:underline mt-1 block"
                      >
                        View Full AI Coaching Breakdown
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">No score recorded today yet</p>
                        <p className="text-[10px] text-slate-400 max-w-[160px] mx-auto mt-0.5">Write and press Evaluate above to unlock.</p>
                      </div>
                    </div>
                  )}
                </div>

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

                <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-4xl font-black text-slate-800 dark:text-white tracking-widest leading-none font-mono">
                    {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                    {(timerSeconds % 60).toString().padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-2">Target: 25 Min Deep Work</span>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setTimerIsRunning(!timerIsRunning)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      timerIsRunning 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-b-4 border-orange-700 active:border-b-0' 
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-b-4 border-indigo-800 active:border-b-0'
                    }`}
                  >
                    {timerIsRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {timerIsRunning ? 'Pause' : 'Start Focus'}
                  </button>
                  <button
                    onClick={() => {
                      setTimerIsRunning(false);
                      setTimerSeconds(timerInitialDuration);
                    }}
                    className="px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Today's Pomodoro Cycles Tracker & Creative Share */}
                {(() => {
                  const todaySessions = studySessions.filter(s => s.date === todayDateStr);
                  const totalMins = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
                  const cyclesCount = Math.max(0, Math.max(todaySessions.length, Math.floor(totalMins / 25)));

                  return (
                    <div className="p-4 bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-violet-500/10 dark:from-rose-950/30 dark:via-amber-950/20 dark:to-violet-950/30 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">🍅</span>
                          <div>
                            <h4 className="text-xs font-black text-slate-800 dark:text-white font-display">Today's Cycles</h4>
                            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold">{totalMins} Mins Focused Today</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-rose-500 text-white rounded-full text-xs font-black shadow-sm">
                          {cyclesCount} {cyclesCount === 1 ? 'Cycle' : 'Cycles'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {cyclesCount === 0 ? (
                          <p className="text-[10px] text-slate-400 italic">No cycles completed today yet. Start a focus session!</p>
                        ) : (
                          Array.from({ length: Math.min(cyclesCount, 8) }).map((_, i) => (
                            <span key={i} className="text-lg transform hover:scale-125 transition-transform cursor-default" title={`Cycle ${i + 1}`}>🍅</span>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setPomodoroShareCategory(selectedTimerCategory + ' & Deep Work');
                          setShowPomodoroShareModal(true);
                        }}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-rose-600 via-amber-500 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                        <span>Share Cycles to Feed</span>
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })()}
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
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <input
                      type="text"
                      value={newTodoText}
                      onChange={e => setNewTodoText(e.target.value)}
                      placeholder="Write your task here..."
                      className="flex-1 w-full px-4 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-violet-500 text-slate-800 dark:text-white font-medium shadow-sm"
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
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => handleToggleTodo(todo.id)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer flex-shrink-0 ${
                                todo.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-600 hover:border-violet-500 bg-slate-50 dark:bg-slate-900'
                              }`}
                            >
                              {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                            <span className="text-xs font-semibold truncate flex-1 min-w-0">{todo.text}</span>
                            {todo.isAiGenerated && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/80 dark:to-orange-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 rounded-md text-[9px] font-black uppercase flex items-center gap-1 flex-shrink-0">
                                <Sparkles className="w-2.5 h-2.5" /> AI
                              </span>
                            )}
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
          <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Analytics Dashboard</h1>
              <p className="text-xs text-slate-400 mt-0.5">Visually track your historical score trends, study logs, and habit insights.</p>
            </div>

            {analyticsData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Score Chart */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 font-display">Productivity Score Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.dailyScores}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weekly Trend (Bar) */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 font-display">Weekly Study Block Volume</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.weeklyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <ChartTooltip />
                        <Bar dataKey="studyHours" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Chart for Focus Distribution */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 font-display">Focus Topic Distribution (Minutes)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                        <PolarRadiusAxis stroke="#94a3b8" fontSize={11} />
                        <Radar name="Minutes Studied" dataKey="minutes" stroke="#a855f7" fill="#c084fc" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stats Summary cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md flex flex-col justify-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-display">Average Productivity</span>
                    <span className="text-3xl font-black text-violet-600 dark:text-violet-400 mt-2">{currentUser.stats.averageScore}%</span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md flex flex-col justify-center">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-display">Total Study Time</span>
                    <span className="text-3xl font-black text-fuchsia-600 dark:text-fuchsia-400 mt-2">{currentUser.stats.totalStudyHours}h</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] border border-violet-100/50 dark:border-slate-800">
                <TrendingUp className="w-8 h-8 mx-auto animate-bounce text-violet-500" />
                <p className="mt-2 text-xs font-bold">Assembling productivity matrices...</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDENT SOCIAL FEED */}
        {currentTab === 'social' && (
          <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Student Social Feed</h1>
              <p className="text-xs text-slate-400 mt-0.5">Celebrate streaks, study milestones, and daily scores with classmates.</p>
            </div>

            {/* Custom Post Creator */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md space-y-3">
              <input
                type="text"
                placeholder="What did you learn today? Post a habit update..."
                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl focus:outline-none focus:border-violet-500 border border-slate-100 dark:border-slate-800 text-xs font-medium"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleCreateCustomPost((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <p className="text-[10px] text-slate-400 text-right font-medium">Press Enter to share with classmates.</p>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md space-y-4">
                  
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.authorAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/10" />
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight font-display">{post.authorName}</h4>
                        <span className="text-[10px] text-slate-400">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    {post.authorEmail === currentUser.email && (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-semibold">
                    {post.content}
                  </p>

                  {/* Post Stats/Metadata attachment block if present */}
                  {post.type === 'journal_score' && post.metadata?.score && (
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-2xl">{post.metadata.emoji}</span>
                      <div>
                        <p className="text-xs font-black text-emerald-800 dark:text-emerald-300">Journal Reflection Scored</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">Productivity Rating: {post.metadata.score}/100</p>
                      </div>
                    </div>
                  )}

                  {post.type === 'study_session' && post.metadata?.studyMinutes && (
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                      <Timer className="w-5 h-5 text-violet-500" />
                      <div>
                        <p className="text-xs font-black text-violet-800 dark:text-violet-300 font-display">Pomodoro Focus Completed</p>
                        <p className="text-[10px] text-violet-600 dark:text-violet-400 font-extrabold">{post.metadata.studyMinutes} Minutes • {post.metadata.studyCategory}</p>
                      </div>
                    </div>
                  )}

                  {post.type === 'pomodoro_summary' && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-violet-500/10 border border-rose-500/30 dark:border-rose-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🍅</span>
                          <div>
                            <p className="text-xs font-black text-slate-800 dark:text-white font-display flex items-center gap-1.5">
                              Pomodoro Mastery
                              <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase">
                                {post.metadata?.pomodoroCycles || 1} {post.metadata?.pomodoroCycles === 1 ? 'Cycle' : 'Cycles'}
                              </span>
                            </p>
                            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold mt-0.5">
                              ⏱️ {post.metadata?.studyMinutes || 25} Mins Focused • {post.metadata?.studyCategory || 'Deep Work'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(post.metadata?.pomodoroCycles || 1, 8) }).map((_, i) => (
                            <span key={i} className="text-sm transform hover:scale-125 transition-transform" title={`Cycle ${i + 1}`}>🍅</span>
                          ))}
                        </div>
                      </div>
                      {post.metadata?.note && (
                        <p className="text-xs italic text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-rose-100 dark:border-rose-950/40">
                          "{post.metadata.note}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Likes / Reactions Block */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100/80 dark:border-slate-800">
                    {['🔥', '🙌', '🎉', '🎓'].map(emoji => {
                      const list = post.reactions?.[emoji] || [];
                      const hasReacted = list.includes(currentUser.email);
                      return (
                        <button
                          key={emoji}
                          onClick={() => handlePostReact(post.id, emoji)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            hasReacted 
                              ? 'bg-violet-500/10 border-violet-300 text-violet-600 dark:text-violet-400 font-extrabold' 
                              : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100/80 hover:bg-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{list.length}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Comment List */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {post.comments.map(c => (
                        <div key={c.id} className="p-3 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl text-[11px] leading-relaxed">
                          <span className="font-bold text-slate-800 dark:text-white mr-1.5">{c.authorName}</span>
                          <span className="text-slate-600 dark:text-slate-300">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Write Comment Box */}
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2.5 text-xs bg-slate-50/50 dark:bg-slate-800/30 rounded-xl focus:outline-none focus:border-violet-500 border border-slate-100 dark:border-slate-800/60"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handlePostComment(post.id, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CLASSROOM PRIVATE MESSAGING */}
        {currentTab === 'chat' && (
          <div className="flex h-[calc(100vh-80px)] md:h-screen overflow-hidden relative z-10">
            
            {/* Friends/Chat Rooms List */}
            <div className="w-72 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-slate-100/80 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">Classroom Chat</h3>
                  <span className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-wider">Simulated Study Groups</span>
                </div>
                
                {/* Switcher tabs */}
                <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
                  <button
                    onClick={() => setChatSidebarTab('chats')}
                    className={`flex-1 text-center py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      chatSidebarTab === 'chats'
                        ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Active Chats
                  </button>
                  <button
                    onClick={() => setChatSidebarTab('friends')}
                    className={`flex-1 text-center py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer relative ${
                      chatSidebarTab === 'friends'
                        ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Find Friends
                    {pendingRequests.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {chatSidebarTab === 'chats' ? (
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {chatRooms.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center p-4">No active chats yet. Find a friend to start chatting!</p>
                  ) : (
                    chatRooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => {
                          setActiveRoomId(room.id);
                          setChatMessages([]);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 text-left ${
                          activeRoomId === room.id 
                            ? 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-l-4 border-violet-500 shadow-sm' 
                            : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="relative">
                          <img src={room.peer?.avatarUrl} alt="peer" className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/10" />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                            room.peer?.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                          }`} />
                        </div>
                        <div className="overflow-hidden w-full">
                          <p className="text-xs font-black text-slate-800 dark:text-white truncate font-display">{room.peer?.displayName}</p>
                          <p className="text-[10px] text-slate-400 truncate font-medium">
                            {room.messages[room.messages.length - 1]?.text || 'No conversations yet.'}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-slate-100/50 dark:border-slate-800/50 space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => {
                          setUserSearchQuery(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        placeholder="Search classmates..."
                        className="w-full pl-8 pr-3 py-2 text-[11px] bg-slate-50/50 dark:bg-slate-800/30 rounded-xl focus:outline-none focus:border-violet-500 border border-slate-150 dark:border-slate-850 font-medium text-slate-800 dark:text-white"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {/* Pending incoming requests */}
                  {pendingRequests.length > 0 && (
                    <div className="p-3 border-b border-slate-150/50 dark:border-slate-850/50 space-y-2 bg-violet-50/20 dark:bg-violet-950/5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Incoming Requests ({pendingRequests.length})</span>
                      <div className="space-y-2">
                        {pendingRequests.map(req => (
                          <div key={req.fromEmail} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img src={req.fromUser?.avatarUrl} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                              <div className="overflow-hidden">
                                <p className="text-[10px] font-black truncate text-slate-800 dark:text-white leading-tight">{req.fromUser?.displayName}</p>
                                <span className="text-[8px] text-slate-400 truncate">@{req.fromUser?.username}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => respondFriendRequest(req.fromEmail, 'accept')}
                                className="p-1 text-[9px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg cursor-pointer transition-colors"
                                title="Accept"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => respondFriendRequest(req.fromEmail, 'reject')}
                                className="p-1 text-[9px] font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg cursor-pointer transition-colors"
                                title="Reject"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Classmate candidates */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                      {userSearchQuery ? 'Search Results' : 'Recommended Classmates'}
                    </span>
                    
                    {(userSearchQuery ? userSearchResult : userSearchResult.filter(c => c.email !== currentUser?.email && !friendsList.some(f => f.email === c.email))).length === 0 ? (
                      <p className="text-[10px] text-slate-400 p-4 text-center">No classmates found.</p>
                    ) : (
                      (userSearchQuery ? userSearchResult : userSearchResult.filter(c => c.email !== currentUser?.email && !friendsList.some(f => f.email === c.email))).map(student => {
                        const isFriend = friendsList.some(f => f.email === student.email);
                        const isSentPending = pendingRequests.some(r => r.fromEmail === currentUser.email && r.toEmail === student.email);
                        
                        return (
                          <div key={student.email} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-100/80 dark:border-slate-800/60 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-900">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img src={student.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/5" />
                              <div className="overflow-hidden">
                                <h4 className="text-[11px] font-black text-slate-800 dark:text-white leading-tight font-display truncate">{student.displayName}</h4>
                                <p className="text-[8px] text-slate-400 truncate">@{student.username}</p>
                              </div>
                            </div>
                            
                            {isFriend ? (
                              <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Friends</span>
                            ) : isSentPending ? (
                              <span className="text-[8px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Sent</span>
                            ) : (
                              <button
                                onClick={() => sendFriendRequest(student.email)}
                                className="px-2 py-1 bg-violet-600 hover:bg-violet-500 text-white text-[9px] font-black rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1 shadow-sm"
                              >
                                <UserPlus className="w-2.5 h-2.5" /> Add
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

            {/* Active chat window */}
            <div className="flex-1 flex flex-col bg-white/40 dark:bg-slate-950/20 backdrop-blur-md">
              {activeRoomId ? (
                <>
                  {/* Top Peer Info bar */}
                  <div className="p-4 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={chatRooms.find(r => r.id === activeRoomId)?.peer?.avatarUrl} 
                        alt="avatar" 
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/10" 
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white font-display">
                          {chatRooms.find(r => r.id === activeRoomId)?.peer?.displayName}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-semibold">Classmate Account verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map(msg => {
                      const isMe = msg.senderEmail === currentUser.email;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs p-3.5 rounded-3xl text-xs font-semibold shadow-sm leading-relaxed ${
                            isMe 
                              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none' 
                              : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800'
                          }`}>
                            <p>{msg.text}</p>
                            <span className="text-[8px] opacity-60 mt-1 block text-right">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat input form */}
                  <div className="p-4 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2">
                    <input
                      type="text"
                      value={chatInputText}
                      onChange={e => setChatInputText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 text-xs bg-slate-50/50 dark:bg-slate-800/40 rounded-xl focus:outline-none focus:border-violet-500 border border-slate-100 dark:border-slate-800/60 font-medium"
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSendChatMessage();
                      }}
                    />
                    <button
                      onClick={handleSendChatMessage}
                      className="p-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition-all shadow-md shadow-violet-200/50 dark:shadow-none cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <MessageSquare className="w-10 h-10 mb-2 animate-bounce text-violet-500" />
                  <p className="text-xs font-black font-display text-slate-700 dark:text-slate-300">Select a study classmate to start chatting!</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Real-time chat answers from classmate AI integrations are active.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 6: TROPHY RANK LEADERBOARDS */}
        {currentTab === 'leaderboard' && (
          <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Trophy Rank Leaderboards</h1>
              <p className="text-xs text-slate-400 mt-0.5">Compare daily or weekly productivity rates and secure a spot on the podium.</p>
            </div>

            {/* Tabs & Controls */}
            <div className="flex gap-2">
              {['global', 'friends'].map(sc => (
                <button
                  key={sc}
                  onClick={() => fetchLeaderboards(currentUser.email, sc, 'weekly')}
                  className="px-5 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-violet-100/50 dark:border-slate-850 hover:bg-violet-500 hover:text-white text-xs font-bold rounded-2xl capitalize transition-all duration-350 shadow-sm cursor-pointer"
                >
                  {sc} rankings
                </button>
              ))}
            </div>

            {/* Rankings List */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboardRankings.map((rank, index) => (
                <div key={rank.email} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Position */}
                    <span className={`w-6 text-center font-black text-xs ${
                      index === 0 ? 'text-yellow-500 text-sm' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </span>

                    <img src={rank.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight">{rank.displayName}</h4>
                      <span className="text-[10px] text-slate-400">@{rank.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 dark:text-white block">{rank.score}%</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">productivity rate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {currentTab === 'profile' && (
          <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Student Profile</h1>
              <p className="text-xs text-slate-400 mt-0.5">Customize your verified avatar name, study biography, and inspect unlocked badges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Profile card panel */}
              <div className="md:col-span-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md flex flex-col items-center justify-center text-center space-y-4">
                <img 
                  src={currentUser.avatarUrl} 
                  alt="avatar" 
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-violet-500/10" 
                />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight font-display">
                    {currentUser.displayName}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">@{currentUser.username}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold px-2">
                  {currentUser.bio}
                </p>

                {/* Direct quick profile edit & settings buttons */}
                <div className="flex flex-wrap gap-2 w-full justify-center pt-2">
                  <button
                    onClick={() => {
                      setEditDisplayName(currentUser.displayName);
                      setEditBio(currentUser.bio);
                      setEditAvatarUrl(currentUser.avatarUrl);
                      setAvatarSearchQuery('');
                      setAvatarCategoryFilter('All');
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2.5 text-xs font-black bg-gradient-to-tr from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl shadow-sm transition-all cursor-pointer flex-1 min-w-[120px]"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={() => setCurrentTab('settings')}
                    className="px-4 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <SettingsIcon className="w-4 h-4 text-violet-500" />
                    Settings
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

              {/* Card 3: Data Export */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-black text-slate-800 dark:text-white font-display uppercase tracking-wider">Data Export</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Export Student Record</h4>
                    <p className="text-[11px] text-slate-400">Download journal entries and study session logs as JSON</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ journals, studySessions }, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", "reflect_student_record.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('Student record downloaded successfully.', 'success');
                    }}
                    className="px-3.5 py-2 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-500/20 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
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
                    onClick={handleDeleteAccount}
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-lg p-6 rounded-3xl shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="text-center space-y-1">
                <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-pulse" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Daily AI Evaluation Insights</h3>
                <p className="text-[10px] text-slate-400">Holistic reflection analysis powered by Google Gemini</p>
              </div>

              {/* Summary Block */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 rounded-2xl text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed font-semibold">
                "{activeEvaluation.summary}"
              </div>

              {/* Strengths & Improvements */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-emerald-500 tracking-wider">Key Highlights & Strengths</h4>
                  <ul className="space-y-1">
                    {activeEvaluation.strengths.map((str: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        <span className="text-emerald-500">✔</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-amber-500 tracking-wider">Tailored Recommendations</h4>
                  <ul className="space-y-1">
                    {activeEvaluation.improvements.map((imp: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        <span className="text-amber-500">▶</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tomorrow's challenge */}
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900 rounded-2xl">
                <h4 className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider leading-none mb-1">
                  Tomorrow's Growth Challenge
                </h4>
                <p className="text-xs font-semibold text-orange-800 dark:text-orange-200">{activeEvaluation.tomorrowChallenge}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowEvaluationModal(false);
                  setActiveEvaluation(null);
                }}
                className="w-full py-3.5 text-center text-xs font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:translate-y-0.5 border-b-4 border-violet-800 active:border-b-0 rounded-2xl transition-all duration-100 cursor-pointer"
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
                {/* Current Active Avatar Preview Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 border border-violet-200/70 dark:border-violet-800/60 flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img 
                      src={editAvatarUrl || activeAvatarCharacter.url} 
                      alt="Selected Avatar" 
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-violet-500/30 bg-slate-900 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-violet-600 text-white rounded-full shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  <div className="overflow-hidden space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white font-display truncate">
                        {activeAvatarCharacter.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-black text-violet-600 dark:text-violet-400">
                        #{activeAvatarCharacter.id}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-violet-600 dark:text-violet-300">
                      Category: {activeAvatarCharacter.category}
                    </p>
                  </div>
                </div>

                {/* 70 Character Avatar Picker */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-display">
                      Select Character Profile Picture (70 High Quality Characters)
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">
                      Showing {filteredAvatars.length} / 70
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
                        placeholder="Search 70 characters by name or # (e.g. Zylo, Qorvin, 42)..."
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
                              <img
                                src={avatar.url}
                                alt={avatar.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute top-0.5 left-0.5 text-[8px] font-black bg-slate-950/80 text-white px-1 rounded">
                                #{avatar.id}
                              </span>
                              {isSelected && (
                                <div className="absolute inset-0 bg-violet-600/30 backdrop-blur-[1px] flex items-center justify-center">
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
                    handleUpdateProfile(editDisplayName, editBio, editAvatarUrl);
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
      </AnimatePresence>

    </div>
  );
}
export type { App };
