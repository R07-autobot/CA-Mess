import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Globe, 
  Compass, 
  BookOpen, 
  Brain, 
  FileText, 
  X, 
  ChevronRight, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Check, 
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Maximize2,
  Minimize2,
  Search
} from 'lucide-react';
import { PlannerState } from '../types/ca-study';

export interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  initialTopicQuery?: string | null;
  onNavigateTab: (tab: 'scheduler' | 'daily_roadmap' | 'syllabus' | 'analytics' | 'roadmap') => void;
  onOpenBacklogModal: () => void;
  onOpenLogModal: (dateStr?: string) => void;
  onLaunchDeepWork?: (slot: 'morning' | 'evening') => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  groundingSources?: { title: string; url: string }[];
  suggestedActions?: {
    label: string;
    actionType: 'tab' | 'backlog' | 'log' | 'deep_work';
    tabTarget?: 'scheduler' | 'daily_roadmap' | 'syllabus' | 'analytics' | 'roadmap';
    slotTarget?: 'morning' | 'evening';
  }[];
}

type AssistantMode = 'copilot' | 'research' | 'doubts' | 'mnemonics' | 'quick_tools';

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  state,
  initialTopicQuery,
  onNavigateTab,
  onOpenBacklogModal,
  onOpenLogModal,
  onLaunchDeepWork,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'model',
      text: `👋 **Hello CA Aspirant! I'm your CA Inter May 2027 AI Copilot & Research Mentor.**\n\nI'm tuned to your **rigid 5-hour protocol** (06:30-08:00 AM Theory + 20:00-00:00 Practical) and can assist you with:\n\n- 🧭 **Dashboard Guidance**: Navigating your Daily 5h Scheduler, Blueprint, Backlog Balancer, and Deep Work mode.\n- 🔍 **Live Web Research**: Searching latest ICAI RTP amendments, case laws, and statutory updates using Google Search grounding.\n- 📚 **Concept Breakdown & Doubts**: Mastering tricky sections, accounting standards, GST rules, or costing formulas.\n- 🧠 **Memory Mnemonics**: Crafting retention hooks for sections, SAs, and standards under working professional constraints.\n\nHow can I help you conquer today's study mission?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'View Today\'s Mission', actionType: 'tab', tabTarget: 'scheduler' },
        { label: 'Check Backlog Balancer', actionType: 'backlog' },
        { label: 'Daily Topic Blueprint', actionType: 'tab', tabTarget: 'daily_roadmap' },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [activeMode, setActiveMode] = useState<AssistantMode>('copilot');
  const [isCopiedId, setIsCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Quick Tools State
  const [quickToolType, setQuickToolType] = useState<'mnemonic' | 'section_breakdown' | 'case_law_format'>('mnemonic');
  const [quickToolInput, setQuickToolInput] = useState('');
  const [quickToolOutput, setQuickToolOutput] = useState('');
  const [isQuickToolLoading, setIsQuickToolLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Handle pre-filled initial topic query
  const handledInitialRef = useRef<string | null>(null);
  useEffect(() => {
    if (isOpen && initialTopicQuery && handledInitialRef.current !== initialTopicQuery) {
      handledInitialRef.current = initialTopicQuery;
      handleSendMessage(`Explain the key concepts, ICAI exam focus areas, and important sections or formulas for: "${initialTopicQuery}"`);
    }
    if (!isOpen) {
      handledInitialRef.current = null;
    }
  }, [isOpen, initialTopicQuery]);

  if (!isOpen) return null;

  // Retrieve today's date and topics for context
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPlan = state.dailyPlans[todayStr];
  const morningTopic = todayPlan?.morningTopic?.chapterTitle || 'Theory/Law Slot (06:30 - 08:00 AM)';
  const eveningTopic = todayPlan?.eveningTopic?.chapterTitle || 'Practical Problem Solving Slot (20:00 - 00:00)';

  // Calculate backlog hours
  const totalCompletedHours = Object.values(state.studyLogs).reduce(
    (acc, log) => acc + (log.morningHours || 0) + (log.eveningHours || 0),
    0
  );
  const totalTargetHours = Object.keys(state.studyLogs).length * state.backlogConfig.dailyTargetHours;
  const backlogHours = Math.max(0, totalTargetHours - totalCompletedHours);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Build history for context
    const historyPayload = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    // Detect actionable suggestions from user intent
    const lowerQuery = query.toLowerCase();
    const detectedActions: ChatMessage['suggestedActions'] = [];

    if (lowerQuery.includes('backlog') || lowerQuery.includes('behind') || lowerQuery.includes('missed')) {
      detectedActions.push({ label: 'Open Backlog Balancer', actionType: 'backlog' });
    }
    if (lowerQuery.includes('schedule') || lowerQuery.includes('timer') || lowerQuery.includes('5h') || lowerQuery.includes('today')) {
      detectedActions.push({ label: 'Open 5h Scheduler', actionType: 'tab', tabTarget: 'scheduler' });
    }
    if (lowerQuery.includes('deep work') || lowerQuery.includes('focus') || lowerQuery.includes('morning slot')) {
      detectedActions.push({ label: 'Start Morning Deep Work', actionType: 'deep_work', slotTarget: 'morning' });
      detectedActions.push({ label: 'Start Evening Deep Work', actionType: 'deep_work', slotTarget: 'evening' });
    }
    if (lowerQuery.includes('blueprint') || lowerQuery.includes('roadmap') || lowerQuery.includes('icai link') || lowerQuery.includes('youtube')) {
      detectedActions.push({ label: 'Go to Daily Topic Blueprint', actionType: 'tab', tabTarget: 'daily_roadmap' });
    }
    if (lowerQuery.includes('log') || lowerQuery.includes('hours') || lowerQuery.includes('track')) {
      detectedActions.push({ label: 'Log Study Hours', actionType: 'log' });
    }
    if (lowerQuery.includes('syllabus') || lowerQuery.includes('paper') || lowerQuery.includes('chapters')) {
      detectedActions.push({ label: 'Open ICAI Syllabus Tracker', actionType: 'tab', tabTarget: 'syllabus' });
    }

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          enableWebSearch,
          context: {
            currentDate: todayStr,
            dailyTargetHours: state.backlogConfig.dailyTargetHours,
            streakCount: state.streakCount,
            backlogHours,
            todayMorningTopic: morningTopic,
            todayEveningTopic: eveningTopic,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: data.groundingSources && data.groundingSources.length > 0 ? data.groundingSources : undefined,
        suggestedActions: detectedActions.length > 0 ? detectedActions : undefined,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      const errorMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Unable to complete AI request:** ${err?.message || 'Network connection error'}.\n\nPlease ensure your Gemini API key is configured in the AI Studio **Settings > Secrets** panel.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedActions']>[0]) => {
    if (action.actionType === 'tab' && action.tabTarget) {
      onNavigateTab(action.tabTarget);
      onClose();
    } else if (action.actionType === 'backlog') {
      onOpenBacklogModal();
      onClose();
    } else if (action.actionType === 'log') {
      onOpenLogModal();
      onClose();
    } else if (action.actionType === 'deep_work') {
      if (onLaunchDeepWork && action.slotTarget) {
        onLaunchDeepWork(action.slotTarget);
        onClose();
      } else {
        onNavigateTab('scheduler');
        onClose();
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopiedId(id);
    setTimeout(() => setIsCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear chat history with CA AI Copilot?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'model',
          text: `Chat cleared. Ready for your next query on ICAI syllabus, study scheduling, or web research!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleRunQuickTool = async () => {
    if (!quickToolInput.trim() || isQuickToolLoading) return;
    setIsQuickToolLoading(true);
    setQuickToolOutput('');

    try {
      const response = await fetch('/api/ai/quick-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: quickToolType,
          topic: quickToolInput.trim(),
        }),
      });

      const data = await response.json();
      setQuickToolOutput(data.result || 'No output generated.');
    } catch (err: any) {
      setQuickToolOutput(`Error: ${err.message || 'Failed to generate content'}`);
    } finally {
      setIsQuickToolLoading(false);
    }
  };

  const promptSuggestions = [
    {
      label: '🧭 Guide me through 5h schedule',
      query: 'Guide me through how the daily 5-hour protocol works in this app (morning 06:30-08:00 AM theory vs evening 20:00-00:00 practical) and how to manage work hours in between.',
      category: 'guide',
    },
    {
      label: '⚖️ How do I balance missed hours?',
      query: 'How does the Backlog Balancer in this dashboard calculate and auto-distribute missed study hours across weekend buffers?',
      category: 'guide',
    },
    {
      label: '🌐 Search latest ICAI RTP amendments',
      query: 'Search the web for the latest ICAI CA Intermediate May 2027 syllabus and study material announcements, RTP guidelines, and major recent amendments.',
      category: 'research',
    },
    {
      label: '📚 Explain Section 135 CSR (Law)',
      query: 'Explain Section 135 of Companies Act 2013 regarding Corporate Social Responsibility (CSR): net worth, turnover, profit thresholds, committee composition, and mandatory 2% expenditure calculation.',
      category: 'study',
    },
    {
      label: '🧠 Mnemonic for SA 500 Audit Evidence',
      query: 'Give me a powerful mnemonic to remember the characteristics of Sufficient Appropriate Audit Evidence (SA 500) and factors affecting reliability of audit evidence.',
      category: 'mnemonic',
    },
    {
      label: `🌅 Explain today's morning topic`,
      query: `Explain the key concepts and exam points for today's morning study slot: "${morningTopic}".`,
      category: 'today',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isExpanded 
            ? 'h-[96vh] max-w-6xl' 
            : 'h-[88vh] max-w-4xl'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  CA Inter AI Copilot & Research Mentor
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Dashboard Guide • Web Research Grounding • ICAI Exam Formatter</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Web Search Grounding */}
            <button
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                enableWebSearch
                  ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Google Search Grounding for real-time web research"
            >
              <Globe className={`w-3.5 h-3.5 ${enableWebSearch ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Web Grounding:</span>
              <span>{enableWebSearch ? 'ON' : 'OFF'}</span>
            </button>

            {/* Clear History */}
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer"
              title="Clear chat messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Expand / Minimize */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer hidden md:block"
              title={isExpanded ? 'Restore window size' : 'Expand window'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveMode('copilot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'copilot'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Dashboard Copilot</span>
            </button>

            <button
              onClick={() => setActiveMode('research')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'research'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Research & ICAI News</span>
            </button>

            <button
              onClick={() => setActiveMode('doubts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'doubts'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Syllabus & Concept Solver</span>
            </button>

            <button
              onClick={() => setActiveMode('quick_tools')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'quick_tools'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Mnemonics & Quick Tools</span>
            </button>
          </div>

          {/* Quick Context Pill */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            <span>Today: {todayStr}</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">Streak: {state.streakCount}d</span>
            <span className="text-slate-600">•</span>
            <span>Target: 5h</span>
          </div>
        </div>

        {/* Body Section */}
        {activeMode === 'quick_tools' ? (
          /* Specialized Quick Tools View */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-950/40">
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Specialized CA Memory & Drafting Tools</span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate high-retention mnemonics, structured law/audit section breakdowns, and ICAI 3-step model answer skeletons.
              </p>
            </div>

            {/* Tool Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setQuickToolType('mnemonic')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  quickToolType === 'mnemonic'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Memory Mnemonic Maker</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Acrostics & mental hooks for SA standards, penalty limits, and formula sets.
                </div>
              </button>

              <button
                onClick={() => setQuickToolType('section_breakdown')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  quickToolType === 'section_breakdown'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Section / Standard Deconstructor</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Thresholds, exceptions, penalty matrix, and ICAI exam trap alerts.
                </div>
              </button>

              <button
                onClick={() => setQuickToolType('case_law_format')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  quickToolType === 'case_law_format'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ICAI 3-Step Answer Drafter</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Provision + Facts Analysis + Conclusion structure for scoring full marks.
                </div>
              </button>
            </div>

            {/* Input Box for Quick Tool */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Enter Topic, Section, Standard, or Formula:</span>
                <span className="text-[10px] text-slate-500">e.g. "SA 505 External Confirmations" or "Sec 185 Loans to Directors"</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickToolInput}
                  onChange={(e) => setQuickToolInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunQuickTool()}
                  placeholder={
                    quickToolType === 'mnemonic'
                      ? 'e.g. SA 240 Auditor\'s responsibilities relating to fraud, or Overhead variances...'
                      : quickToolType === 'section_breakdown'
                      ? 'e.g. Section 135 CSR, Section 186 Loans & Investment, Section 115BAC...'
                      : 'e.g. Can a company declare dividend out of reserves when current year profits are inadequate?'
                  }
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleRunQuickTool}
                  disabled={isQuickToolLoading || !quickToolInput.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isQuickToolLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Quick Tool Output */}
            {quickToolOutput && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 relative animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {quickToolType.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => handleCopy('quick-output', quickToolOutput)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-all"
                  >
                    {isCopiedId === 'quick-output' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedId === 'quick-output' ? 'Copied' : 'Copy Output'}</span>
                  </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {quickToolOutput}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Main Interactive Chat Area */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950/40">
            {/* Quick Context Strip */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold text-[11px] border border-indigo-500/20">
                  Today's Protocol
                </span>
                <span className="text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
                  🌅 1.5h Theory (06:30-08:00) + 🌙 3.5h Practical (20:00-00:00)
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Backlog: <strong className="text-amber-400">{backlogHours.toFixed(1)}h</strong></span>
                <span>Streak: <strong className="text-emerald-400">{state.streakCount} days</strong></span>
              </div>
            </div>

            {/* Messages List */}
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.text}</div>

                      {/* Google Search Grounding Sources */}
                      {!isUser && message.groundingSources && message.groundingSources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700/80">
                          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                            <Search className="w-3 h-3 text-indigo-400" />
                            <span>Web Research Citations & Sources (Google Search Grounded):</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {message.groundingSources.slice(0, 5).map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-950 border border-slate-700 hover:border-indigo-400 text-[11px] text-indigo-300 hover:text-indigo-200 transition-all max-w-[280px] truncate"
                              >
                                <Globe className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                                <span className="truncate">{source.title || source.url}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Dashboard Action Buttons */}
                      {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700/80 flex flex-wrap gap-2">
                          {message.suggestedActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Metadata & Copy action */}
                    <div className={`flex items-center gap-2 text-[10px] text-slate-500 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span>{message.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(message.id, message.text)}
                          className="hover:text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {isCopiedId === message.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 font-bold text-xs">
                      YOU
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/90 text-slate-400 border border-slate-700/60 text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Researching ICAI syllabus & compiling model guidance...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Suggested Quick Prompts (Only in chat mode) */}
        {activeMode !== 'quick_tools' && (
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Suggestions:
            </span>
            {promptSuggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.query)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/70 hover:border-indigo-400/50 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar (Only in chat mode) */}
        {activeMode !== 'quick_tools' && (
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    enableWebSearch
                      ? 'Ask anything (e.g. "Explain Section 135 CSR" or "Search latest ICAI May 2027 amendments")...'
                      : 'Ask dashboard question or doubt...'
                  }
                  disabled={isLoading}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all pr-10"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg shadow-indigo-600/30"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Powered by Gemini 3.8 Flash • Server-side search grounded</span>
              </span>
              <span>ICAI New Scheme May 2027</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
