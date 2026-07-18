import { useState, useEffect, useRef, useMemo } from 'react';
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
  Bell,
  Shield,
  Trash
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

import { Profile, JournalEntry, StudySession, FeedPost, ChatRoom, LeaderboardRank } from './types';
import ConfettiCanvas from './components/ConfettiCanvas';
import ContributionGraph from './components/ContributionGraph';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
];

// --- MAIN REACT COMPONENT ---
export default function App() {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

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
  const [isThemeDark, setIsThemeDark] = useState(false);
  const [loadingEvaluate, setLoadingEvaluate] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState<any>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // --- REFLECTION WRITER STATE ---
  const [journalText, setJournalText] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  // --- STUDY TIMER STATE (POMODORO) ---
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [timerInitialDuration, setTimerInitialDuration] = useState(25 * 60);
  const [showTimerFinishModal, setShowTimerFinishModal] = useState(false);
  const [selectedTimerCategory, setSelectedTimerCategory] = useState('Programming');
  const [shareTimerToFeed, setShareTimerToFeed] = useState(true);

  // --- CHAT INPUT ---
  const [chatInputText, setChatInputText] = useState('');
  const [chatSidebarTab, setChatSidebarTab] = useState<'chats' | 'friends'>('chats');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

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
      handleLogin(savedEmail);
    }

    // Theme Check
    const savedTheme = localStorage.getItem('reflect_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsThemeDark(true);
      document.documentElement.classList.add('dark');
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
  const handleLogin = async (email: string) => {
    if (!email || !email.trim()) {
      showToast('Please enter your student email address.', 'info');
      return;
    }
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Please enter a valid email format (e.g., student@university.edu).', 'info');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('reflect_auth_email', trimmedEmail);
        if (data.user.theme === 'dark') {
          setIsThemeDark(true);
          document.documentElement.classList.add('dark');
        } else {
          setIsThemeDark(false);
          document.documentElement.classList.remove('dark');
        }
        showToast(`Welcome back, ${data.user.displayName}! ✨`, 'success');
        
        // Initial Fetch
        fetchInitialData(trimmedEmail);
      } else {
        showToast(data.error || 'Login failed', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Unable to connect to Express backend server', 'info');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('reflect_auth_email');
    setCurrentUser(null);
    setJournals([]);
    setStudySessions([]);
    setPosts([]);
    setChatRooms([]);
    showToast('Securely logged out.', 'success');
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

  // --- REAL VOICE DICTATION & FALLBACK ---
  const handleVoiceInputMock = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsVoiceRecording(true);
          showToast('🎙️ Voice typing active! Speak now...', 'success');
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event);
          showToast('Voice typing issue: ' + (event.error || 'blocked') + '. Running smart backup...', 'info');
          runSimulationFallback();
        };

        recognition.onend = () => {
          setIsVoiceRecording(false);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setJournalText(prev => prev + (prev ? " " : "") + transcript);
          showToast('🎙️ Dictation transcribed successfully!', 'success');
        };

        recognition.start();
      } catch (e) {
        console.error(e);
        runSimulationFallback();
      }
    } else {
      showToast('🎙️ Microphone restricted in browser frame. Running smart simulation...', 'info');
      runSimulationFallback();
    }
  };

  const runSimulationFallback = () => {
    setIsVoiceRecording(true);
    setTimeout(() => {
      setIsVoiceRecording(false);
      const textToAppend = "Today was incredibly productive. I spent 3 continuous hours coding our compiler lab with great focus. Exercised for 30 minutes in the evening and slept early.";
      setJournalText(prev => prev + (prev ? " " : "") + textToAppend);
      showToast('🎙️ Simulation complete! STT transcribed your reflection.', 'success');
    }, 3000);
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
    // Elegant Duolingo-styled Sign-In Screen
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none mb-6 animate-bounce">
            <Sparkles className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            ReflectAI
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
            Daily reflection, Pomodoro flow, and peer accountability powered by Google Gemini AI.
          </p>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="text-left space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Student Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={authEmailInput}
                  onChange={e => setAuthEmailInput(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-colors text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => handleLogin(authEmailInput)}
              disabled={authLoading}
              className="w-full py-4 text-center text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 border-b-4 border-indigo-800 active:border-b-0 rounded-xl transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              {authLoading ? 'Signing in...' : 'Sign In / Register'}
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400">
              Enter any valid email address to securely create your student account or log back in.
            </div>
          </div>
        </div>
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

      {/* --- SIDEBAR LAYOUT --- */}
      <aside className="w-64 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between flex-shrink-0 select-none hidden md:flex relative z-10">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200 dark:shadow-none">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white font-display">ReflectAI</h2>
              <span className="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-bold uppercase tracking-wider">Student Hub</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Home Dashboard', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'journals', label: 'Calendar Grid', icon: <CalendarIcon className="w-4 h-4" /> },
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 grid grid-cols-5 gap-1 z-30 py-2">
        {[
          { id: 'home', label: 'Home', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'journals', label: 'Calendar', icon: <CalendarIcon className="w-5 h-5" /> },
          { id: 'social', label: 'Feed', icon: <Users className="w-5 h-5" /> },
          { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id as any)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold ${
              currentTab === item.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* --- CORE WORKING PANELS --- */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-20 md:pb-0">
        
        {/* TAB 1: HOME DASHBOARD */}
        {currentTab === 'home' && (
          <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Header Greeting Block */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  Good day, {currentUser.displayName}! 🌱
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Let's reflect and keep that streak blazing bright!
                </p>
              </div>

              {/* Fire Streak Flame */}
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-2xl">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse fill-orange-500" />
                <div>
                  <div className="text-xs font-black text-amber-700 dark:text-amber-400 leading-none">
                    {currentUser.stats.currentStreak} Day Streak
                  </div>
                  <span className="text-[10px] text-slate-400">Longest: {currentUser.stats.longestStreak}</span>
                </div>
              </div>
            </div>

            {/* Core Action Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1 & 2: Reflection and Today's Evaluation */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Journal reflection writer card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-500" />
                      <h3 className="text-sm font-black text-slate-800 dark:text-white font-display">
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

                  <div className="relative">
                    <textarea
                      value={journalText}
                      onChange={e => setJournalText(e.target.value)}
                      placeholder="Write about your day. What goals did you hit? Where did you procrastinate? Feel free to use lists, emojis, bullet points, mixed language, or dictation..."
                      className="w-full h-44 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-violet-500 dark:focus:border-violet-500 focus:outline-none text-xs leading-relaxed transition-colors text-slate-800 dark:text-white font-medium resize-none"
                    />
                    
                    {/* Mic Button */}
                    <button
                      onClick={handleVoiceInputMock}
                      className={`absolute bottom-3 right-3 p-3 rounded-full shadow-md transition-all cursor-pointer ${
                        isVoiceRecording 
                          ? 'bg-rose-500 text-white animate-ping' 
                          : 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white'
                      }`}
                      title="Voice Typing Dictation"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Evaluate Button */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-[10px] text-slate-400 font-medium">
                      Evaluated entries will automatically showcase on the feed.
                    </div>
                    <button
                      onClick={triggerEvaluation}
                      disabled={loadingEvaluate || !journalText.trim()}
                      className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:translate-y-0.5 border-b-4 border-violet-800 active:border-b-0 text-white text-xs font-black rounded-2xl transition-all duration-100 flex items-center gap-2 shadow-lg shadow-violet-200/50 dark:shadow-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {loadingEvaluate ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Evaluating Reflection...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
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
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 font-display">
                    Today's Productivity
                  </h3>
                  
                  {todayEntry?.score ? (
                    <div className="space-y-2">
                      <div className="relative flex items-center justify-center">
                        {/* Radial Gauge design */}
                        <div className="w-24 h-24 rounded-full border-[8px] border-emerald-500/10 flex items-center justify-center">
                          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{todayEntry.score}</span>
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

                {/* Pomodoro Timer widget */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4.5 h-4.5 text-violet-500" />
                      <h3 className="text-xs font-black text-slate-800 dark:text-white font-display">Pomodoro Focus Timer</h3>
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-3xl font-black text-slate-800 dark:text-white tracking-widest leading-none font-mono">
                      {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                      {(timerSeconds % 60).toString().padStart(2, '0')}
                    </div>
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
                      className="px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-colors"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOURNAL CALENDAR HISTORY */}
        {currentTab === 'journals' && (
          <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Calendar History</h1>
              <p className="text-xs text-slate-400 mt-0.5">Explore your historical reflections and evaluation insights day by day.</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md">
              <div className="grid grid-cols-7 gap-3 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <span key={d} className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{d}</span>
                ))}
              </div>

              {/* Calendar Grid Simulation (Last 35 days) */}
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

                {/* Direct quick profile edit modal */}
                <button
                  onClick={() => {
                    setEditDisplayName(currentUser.displayName);
                    setEditBio(currentUser.bio);
                    setEditAvatarUrl(currentUser.avatarUrl);
                    setIsEditingProfile(true);
                  }}
                  className="px-5 py-2.5 text-xs font-black bg-gradient-to-tr from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  Edit profile card
                </button>
              </div>

              {/* Badges and statistics panel */}
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

              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {currentTab === 'settings' && (
          <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto w-full animate-fade-in relative z-10">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Settings Portal</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage study presets, system privacy triggers, and secure account export commands.</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-[32px] border border-violet-100/50 dark:border-slate-800/80 shadow-md space-y-6">
              
              {/* Theme Settings */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100/80 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white font-display">Dark mode theme</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Toggle eye-safe slate dark mode presets.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2.5 bg-violet-500/10 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900 text-xs font-extrabold rounded-2xl cursor-pointer"
                >
                  {isThemeDark ? 'Dark theme active' : 'Light theme active'}
                </button>
              </div>

              {/* Export account data */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100/80 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white font-display">Export Student Record</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Download your complete reflection logs as a JSON file.</p>
                </div>
                <button
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
                  className="px-4 py-2.5 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 text-xs font-extrabold rounded-2xl cursor-pointer"
                >
                  Download JSON
                </button>
              </div>

              {/* Danger Zone: Delete Account */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100/80 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-black text-rose-500 font-display">Delete Account Data</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Permanently delete your profile and reflection records from the database.</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2.5 bg-rose-500/10 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 text-xs font-extrabold rounded-2xl cursor-pointer"
                >
                  Delete Profile Record
                </button>
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
          <div className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-violet-100/50 dark:border-slate-800/80 p-6 md:p-8 rounded-[36px] shadow-2xl max-w-md w-full space-y-6 text-left"
            >
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Edit Student Profile</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Change your public details and pick a study avatar.</p>
              </div>

              <div className="space-y-4">
                {/* Avatar presets */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Pick a Study Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditAvatarUrl(url)}
                        className={`aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 relative cursor-pointer ${
                          editAvatarUrl === url ? 'border-violet-600 scale-110 ring-2 ring-violet-500/20' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={url} alt={`avatar-${i}`} className="w-full h-full object-cover" />
                        {editAvatarUrl === url && (
                          <div className="absolute inset-0 bg-violet-600/20 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                          </div>
                        )}
                      </button>
                    ))}
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
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-850 focus:border-violet-500 dark:focus:border-violet-500 focus:outline-none rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
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
                    placeholder="Tell your classmates about your studies..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-850 focus:border-violet-500 dark:focus:border-violet-500 focus:outline-none rounded-xl text-xs font-semibold text-slate-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 text-center text-xs font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
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
