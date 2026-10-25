import React, { useState, useEffect } from 'react';
import { Chapter, PlannerState, StudyLogEntry, BacklogConfig, AppTheme, TopicLinkReference, CourseLevel, CourseFilterType, AttemptPortion, ExamSession, AppFontFamily, UserPersona } from './types/ca-study';
import { 
  getDefaultState, 
  loadPlannerState, 
  savePlannerState, 
  getSampleState,
  getSelectedCourseLevel,
  setSelectedCourseLevel,
  changeAttemptPortionAndSession,
  applyPersonaToState,
  getUserPersona,
  updateCustomStudyHours
} from './utils/storage';
import { THEMES } from './utils/theme';
import { CountdownHeader } from './components/CountdownHeader';
import { DailyScheduler } from './components/DailyScheduler';
import { SyllabusTracker } from './components/SyllabusTracker';
import { AnalyticsAndStreaks } from './components/AnalyticsAndStreaks';
import { RevisionRoadmap } from './components/RevisionRoadmap';
import { BacklogBalancerModal } from './components/BacklogBalancerModal';
import { DailyLogModal } from './components/DailyLogModal';
import { DailyTopicRoadmap } from './components/DailyTopicRoadmap';
import { DashboardTodayMission } from './components/DashboardTodayMission';
import { AddTopicLinkModal } from './components/AddTopicLinkModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { CourseSelectionModal } from './components/CourseSelectionModal';
import { StudyHoursModal } from './components/StudyHoursModal';
import { CoursesDirectoryModal } from './components/CoursesDirectoryModal';
import { AttemptSelectionModal } from './components/AttemptSelectionModal';
import { GlobalProgressBottomBar } from './components/GlobalProgressBottomBar';
import { 
  CalendarDays, 
  BookOpenCheck, 
  BarChart3, 
  Compass, 
  Clock, 
  AlertTriangle, 
  Briefcase,
  ListTodo,
  Layers,
  Bot,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<PlannerState>(() => loadPlannerState());
  const [theme, setTheme] = useState<AppTheme>(() => state.theme || 'midnight');
  const [fontFamily, setFontStyle] = useState<AppFontFamily>(() => state.fontFamily || (state.theme === 'beige' ? 'playfair' : 'jakarta'));
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(() => !getSelectedCourseLevel());
  const [isStudyHoursModalOpen, setIsStudyHoursModalOpen] = useState(false);
  const [isAttemptModalOpen, setIsAttemptModalOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState<CourseFilterType>('all');
  const [isCoursesDirectoryOpen, setIsCoursesDirectoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'scheduler' | 'daily_roadmap' | 'syllabus' | 'analytics' | 'roadmap'>('scheduler');
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | null>(null);
  const [logModalDate, setLogModalDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeepWorkActive, setIsDeepWorkActive] = useState(false);
  const [globalLinkModal, setGlobalLinkModal] = useState<{
    date: string;
    slot: 'morning' | 'evening';
    chapterTitle: string;
    links: TopicLinkReference[];
  } | null>(null);

  const handleSelectAttempt = (newPortion: AttemptPortion, newSession: ExamSession) => {
    const updated = changeAttemptPortionAndSession(state, newPortion, newSession);
    setState(updated);
    const isFnd = updated.courseLevel === 'foundation';
    const portionLabel =
      newPortion === 'both'
        ? (isFnd ? 'Both Modules (4 Papers)' : 'Both Groups (6 Papers)')
        : newPortion === 'group1'
        ? (isFnd ? 'Module 1 Only' : 'Group 1 Only')
        : (isFnd ? 'Module 2 Only' : 'Group 2 Only');
    const sessionLabel = newSession === 'nov_2027' ? 'Nov 2027' : 'May 2027';
    showToast(`Roadmap & Schedule updated: ${sessionLabel} • ${portionLabel}`);
  };

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    savePlannerState(state);
  }, [state]);

  const showToast = (msg: string) => {
    // Suppress notifications completely during active Deep Work Session
    if (isDeepWorkActive) return;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateChapterMilestone = (
    chapterId: string,
    milestoneKey: keyof Chapter['milestones'],
    value: any
  ) => {
    setState((prev) => {
      const chapter = prev.chapters[chapterId];
      if (!chapter) return prev;

      const updatedChapter: Chapter = {
        ...chapter,
        milestones: {
          ...chapter.milestones,
          [milestoneKey]: value,
          lastStudiedDate: new Date().toISOString().split('T')[0],
        },
      };

      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: updatedChapter,
        },
      };
    });
  };

  const handleUpdateChapterNotes = (chapterId: string, notes: string) => {
    setState((prev) => {
      const chapter = prev.chapters[chapterId];
      if (!chapter) return prev;
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...chapter,
            milestones: {
              ...chapter.milestones,
              notes,
            },
          },
        },
      };
    });
    showToast('Chapter notes updated');
  };

  const handleSaveLog = (log: StudyLogEntry) => {
    setState((prev) => {
      const updatedLogs = {
        ...prev.studyLogs,
        [log.date]: log,
      };

      // Recalculate streak
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 60; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const entry = updatedLogs[dStr];
        if (entry && (entry.morningHours + entry.eveningHours) >= prev.backlogConfig.dailyTargetHours * 0.8) {
          streak++;
        } else if (i === 0) {
          // If today is not finished yet, don't break streak if yesterday was completed
          continue;
        } else {
          break;
        }
      }

      return {
        ...prev,
        studyLogs: updatedLogs,
        streakCount: streak,
        lastActiveDate: log.date,
      };
    });
    showToast(`Study hours logged for ${log.date}`);
  };

  const handleSelectCourseLevel = (
    level: CourseLevel, 
    persona?: UserPersona,
    customHours?: {
      morningFrom: string;
      morningTo: string;
      eveningFrom: string;
      eveningTo: string;
      breakMinutes: number;
    }
  ) => {
    setSelectedCourseLevel(level);
    const chosenPersona = persona || state.userPersona || getUserPersona();
    let loaded = loadPlannerState(level);
    if (chosenPersona) {
      loaded = applyPersonaToState(loaded, chosenPersona);
    }
    if (customHours) {
      loaded = updateCustomStudyHours(
        loaded,
        customHours.morningFrom,
        customHours.morningTo,
        customHours.eveningFrom,
        customHours.eveningTo,
        customHours.breakMinutes
      );
    }
    setState(loaded);
    setIsCourseModalOpen(false);
    const label =
      level === 'foundation'
        ? 'CA Foundation'
        : level === 'final'
        ? 'CA Final'
        : 'CA Intermediate';
    const personaLabel =
      chosenPersona === 'student'
        ? 'Student Schedule'
        : 'Working Professional';
    const hoursLabel = loaded.backlogConfig.dailyTargetHours;
    showToast(`Active: ${label} • ${personaLabel} (${hoursLabel}h/day: ${loaded.morningStartTime || '06:30'}-${loaded.morningEndTime || '08:00'} & ${loaded.eveningStartTime || '20:00'}-${loaded.eveningEndTime || '00:00'})`);
  };

  const handleSaveStudyHours = (
    morningFrom: string,
    morningTo: string,
    eveningFrom: string,
    eveningTo: string,
    eveningBreakMinutes: number
  ) => {
    const updated = updateCustomStudyHours(
      state,
      morningFrom,
      morningTo,
      eveningFrom,
      eveningTo,
      eveningBreakMinutes
    );
    setState(updated);
    setIsStudyHoursModalOpen(false);
    showToast(
      `Study hours updated: Morning ${morningFrom}-${morningTo} • Evening ${eveningFrom}-${eveningTo} (${updated.backlogConfig.dailyTargetHours}h/day total)`
    );
  };

  const handleTogglePersona = (newPersona: UserPersona) => {
    const updated = applyPersonaToState(state, newPersona);
    setState(updated);
    const label =
      newPersona === 'student'
        ? 'Student Schedule (8 Hours/Day)'
        : 'Working Professional Protocol (5 Hours/Day)';
    showToast(`Study track updated: ${label}`);
  };

  const handleLoadSampleData = () => {
    const courseName =
      state.courseLevel === 'foundation'
        ? 'CA Foundation'
        : state.courseLevel === 'final'
        ? 'CA Final'
        : 'CA Intermediate';
    if (confirm(`Load realistic sample study logs and progress for ${courseName}? Current local data will be replaced.`)) {
      const sample = getSampleState(state.courseLevel);
      setState(sample);
      showToast(`Loaded sample ${courseName} study progress`);
    }
  };

  const handleResetData = () => {
    const courseName =
      state.courseLevel === 'foundation'
        ? 'CA Foundation'
        : state.courseLevel === 'final'
        ? 'CA Final'
        : 'CA Intermediate';
    if (confirm(`Reset all ${courseName} chapters, progress, and study logs to fresh baseline?`)) {
      const fresh = getDefaultState(state.courseLevel);
      setState(fresh);
      showToast(`Reset ${courseName} to fresh syllabus tracking`);
    }
  };

  const handleImportState = (imported: PlannerState) => {
    setState(imported);
    showToast('Imported study plan backup successfully');
  };

  const handleUpdateBacklogConfig = (newConfig: BacklogConfig) => {
    setState((prev) => ({
      ...prev,
      backlogConfig: newConfig,
    }));
  };

  const handleApplyBalancedPlan = (rebalancedPlanText: string) => {
    showToast('Auto-Balanced schedule active across upcoming slots');
  };

  const handleOpenLogModal = (dateStr?: string) => {
    setLogModalDate(dateStr || new Date().toISOString().split('T')[0]);
    setIsLogModalOpen(true);
  };

  const handleUpdateTopicSpentMinutes = (date: string, slot: 'morning' | 'evening', spentMinutes: number) => {
    setState((prev) => {
      const plan = prev.dailyPlans[date];
      if (!plan) return prev;
      const topicKey = slot === 'morning' ? 'morningTopic' : 'eveningTopic';
      return {
        ...prev,
        dailyPlans: {
          ...prev.dailyPlans,
          [date]: {
            ...plan,
            [topicKey]: {
              ...plan[topicKey],
              spentMinutes,
            },
          },
        },
      };
    });
  };

  const handleToggleTopicCompleted = (date: string, slot: 'morning' | 'evening', isCompleted: boolean) => {
    setState((prev) => {
      const plan = prev.dailyPlans[date];
      if (!plan) return prev;
      const topicKey = slot === 'morning' ? 'morningTopic' : 'eveningTopic';
      return {
        ...prev,
        dailyPlans: {
          ...prev.dailyPlans,
          [date]: {
            ...plan,
            [topicKey]: {
              ...plan[topicKey],
              isCompleted,
            },
          },
        },
      };
    });
    showToast(isCompleted ? 'Topic marked as completed!' : 'Topic status updated');
  };

  const handleUpdateTopicNotes = (date: string, slot: 'morning' | 'evening', userNotes: string) => {
    setState((prev) => {
      const plan = prev.dailyPlans[date];
      if (!plan) return prev;
      const topicKey = slot === 'morning' ? 'morningTopic' : 'eveningTopic';
      return {
        ...prev,
        dailyPlans: {
          ...prev.dailyPlans,
          [date]: {
            ...plan,
            [topicKey]: {
              ...plan[topicKey],
              userNotes,
            },
          },
        },
      };
    });
    showToast('Topic notes saved');
  };

  const handleSaveTopicLinks = (date: string, slot: 'morning' | 'evening', links: TopicLinkReference[]) => {
    setState((prev) => {
      const plan = prev.dailyPlans[date];
      if (!plan) return prev;
      const topicKey = slot === 'morning' ? 'morningTopic' : 'eveningTopic';
      return {
        ...prev,
        dailyPlans: {
          ...prev.dailyPlans,
          [date]: {
            ...plan,
            [topicKey]: {
              ...plan[topicKey],
              links,
            },
          },
        },
      };
    });
    showToast('References & lecture links saved');
  };

  const handleSelectFont = (newFont: AppFontFamily) => {
    setFontStyle(newFont);
    setState((prev) => ({
      ...prev,
      fontFamily: newFont,
    }));
    const label = newFont === 'playfair' ? 'Playfair Display' : newFont === 'fraunces' ? 'Fraunces' : 'Plus Jakarta Sans';
    showToast(`Typography set to ${label}`);
  };

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    let updatedFont = fontFamily;
    if (newTheme === 'beige' && fontFamily === 'jakarta') {
      updatedFont = 'playfair';
      setFontStyle('playfair');
    }
    setState((prev) => ({
      ...prev,
      theme: newTheme,
      fontFamily: updatedFont,
    }));
    showToast(`Theme switched to ${THEMES[newTheme]?.name || newTheme}`);
  };

  const handleToggleSubtopic = (date: string, slot: 'morning' | 'evening', subtopicTitle: string) => {
    setState((prev) => {
      const plan = prev.dailyPlans[date];
      if (!plan) return prev;
      const topicKey = slot === 'morning' ? 'morningTopic' : 'eveningTopic';
      const topic = plan[topicKey];
      const prevSubtopics = topic.completedSubtopics || [];
      const isAlreadyChecked = prevSubtopics.includes(subtopicTitle);
      const nextSubtopics = isAlreadyChecked
        ? prevSubtopics.filter((st) => st !== subtopicTitle)
        : [...prevSubtopics, subtopicTitle];

      const allDone = topic.subtopics.length > 0 && topic.subtopics.every((st) => nextSubtopics.includes(st));

      return {
        ...prev,
        dailyPlans: {
          ...prev.dailyPlans,
          [date]: {
            ...plan,
            [topicKey]: {
              ...topic,
              completedSubtopics: nextSubtopics,
              isCompleted: allDone ? true : topic.isCompleted,
            },
          },
        },
      };
    });
  };

  return (
    <div
      data-theme={theme}
      data-font={fontFamily}
      className={`min-h-screen ${THEMES[theme]?.containerClass || 'bg-slate-950 text-slate-100'} ${
        fontFamily === 'playfair' ? 'font-playfair' : fontFamily === 'fraunces' ? 'font-fraunces' : 'font-jakarta'
      } flex flex-col pb-14 transition-colors duration-300`}
    >
      {/* Toast Notification (Suppressed during Deep Work Session) */}
      {!isDeepWorkActive && toastMessage && (
        <div className="fixed bottom-22 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-xl border border-indigo-400/30 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Countdown & Capacity Engine Header */}
      <CountdownHeader
        state={state}
        courseFilter={courseFilter}
        onSelectCourseFilter={setCourseFilter}
        onOpenCoursesDirectory={() => setIsCoursesDirectoryOpen(true)}
        onOpenCourseModal={() => setIsCourseModalOpen(true)}
        onTogglePersona={handleTogglePersona}
        onOpenStudyHoursModal={() => setIsStudyHoursModalOpen(true)}
        onSelectAttempt={handleSelectAttempt}
        onOpenAttemptModal={() => setIsAttemptModalOpen(true)}
        onOpenBacklogModal={() => setIsBacklogModalOpen(true)}
        onOpenLogModal={() => handleOpenLogModal()}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetData}
        onImportState={handleImportState}
      />

      {/* Navigation Tabs Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-2.5">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('scheduler')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'scheduler'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Daily 5h Scheduler</span>
            </button>

            <button
              onClick={() => setActiveTab('daily_roadmap')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'daily_roadmap'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>Daily Topic Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'syllabus'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>ICAI Syllabus Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Streaks & Heatmap</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>May 2027 Roadmap</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pl-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local Storage Auto-Saved</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'scheduler' && (
          <div className="space-y-8">
            {/* Top Mission Board directly on Dashboard */}
            <DashboardTodayMission
              state={state}
              onUpdateTopicSpentMinutes={handleUpdateTopicSpentMinutes}
              onToggleTopicCompleted={handleToggleTopicCompleted}
              onToggleSubtopic={handleToggleSubtopic}
              onOpenSchedulerForDate={() => {}}
              onOpenAddLinkModal={(date, slot) => {
                const plan = state.dailyPlans[date];
                if (plan) {
                  const topic = slot === 'morning' ? plan.morningTopic : plan.eveningTopic;
                  setGlobalLinkModal({
                    date,
                    slot,
                    chapterTitle: topic.chapterTitle,
                    links: topic.links || [],
                  });
                }
              }}
              onLaunchDeepWork={(slot) => {
                setIsDeepWorkActive(true);
              }}
              onAskAIAboutTopic={(topicTitle) => {
                setAiInitialQuery(topicTitle);
                setIsAIAssistantOpen(true);
              }}
            />

            {/* Daily 5-Hour Block Scheduler */}
            <DailyScheduler
              state={state}
              onUpdateChapterMilestone={handleUpdateChapterMilestone}
              onUpdateChapterNotes={handleUpdateChapterNotes}
              onSaveLog={handleSaveLog}
              onOpenLogModal={handleOpenLogModal}
              onOpenBacklogModal={() => setIsBacklogModalOpen(true)}
              onDeepWorkActiveChange={(active) => setIsDeepWorkActive(active)}
            />
          </div>
        )}

        {activeTab === 'daily_roadmap' && (
          <DailyTopicRoadmap
            state={state}
            globalCourseFilter={courseFilter}
            onUpdateTopicSpentMinutes={handleUpdateTopicSpentMinutes}
            onToggleTopicCompleted={handleToggleTopicCompleted}
            onToggleSubtopic={handleToggleSubtopic}
            onSaveTopicLinks={handleSaveTopicLinks}
            onUpdateTopicNotes={handleUpdateTopicNotes}
            onSelectDayForScheduler={(date) => {
              setActiveTab('scheduler');
            }}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusTracker
            state={state}
            onUpdateChapterMilestone={handleUpdateChapterMilestone}
            onUpdateChapterNotes={handleUpdateChapterNotes}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsAndStreaks state={state} />}

        {activeTab === 'roadmap' && <RevisionRoadmap />}
      </main>

      {/* Backlog Auto-Balancer Modal */}
      <BacklogBalancerModal
        isOpen={isBacklogModalOpen}
        onClose={() => setIsBacklogModalOpen(false)}
        studyLogs={state.studyLogs}
        config={state.backlogConfig}
        onUpdateConfig={handleUpdateBacklogConfig}
        onApplyBalancedPlan={handleApplyBalancedPlan}
      />

      {/* Daily Hours Logger Modal */}
      <DailyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        dateStr={logModalDate}
        existingLog={state.studyLogs[logModalDate]}
        chapters={state.chapters}
        onSaveLog={handleSaveLog}
        onTriggerBacklog={() => setIsBacklogModalOpen(true)}
        dailyTargetHours={state.backlogConfig.dailyTargetHours}
        morningSlotHours={state.backlogConfig.morningSlotHours}
        eveningSlotHours={state.backlogConfig.eveningSlotHours}
      />

      {/* Global Add / Edit Topic Link Reference Modal */}
      {globalLinkModal && (
        <AddTopicLinkModal
          isOpen={Boolean(globalLinkModal)}
          onClose={() => setGlobalLinkModal(null)}
          dateStr={globalLinkModal.date}
          slot={globalLinkModal.slot}
          chapterTitle={globalLinkModal.chapterTitle}
          currentLinks={globalLinkModal.links}
          onSaveLinks={(updatedLinks) => {
            handleSaveTopicLinks(globalLinkModal.date, globalLinkModal.slot, updatedLinks);
            setGlobalLinkModal(null);
          }}
        />
      )}

      {/* CA Inter AI Copilot & Research Mentor Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => {
          setIsAIAssistantOpen(false);
          setAiInitialQuery(null);
        }}
        state={state}
        initialTopicQuery={aiInitialQuery}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenBacklogModal={() => setIsBacklogModalOpen(true)}
        onOpenLogModal={(dateStr) => handleOpenLogModal(dateStr)}
        onLaunchDeepWork={(slot) => {
          // Switch to scheduler where deep work interface is situated
          setActiveTab('scheduler');
        }}
      />

      {/* Persistent Floating CA AI Copilot Trigger Button */}
      {!isDeepWorkActive && (
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="fixed bottom-16 sm:bottom-14 right-4 sm:right-6 z-40 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/40 border border-indigo-400/40 flex items-center gap-2.5 sm:gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="Open CA Inter AI Copilot & Web Research Mentor"
        >
          <div className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="font-extrabold flex items-center gap-1.5">
              <span>Ask CA AI Copilot</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            </span>
            <span className="text-[10px] text-indigo-200/90 font-medium hidden md:inline">
              Web Research • Doubts • Guides
            </span>
          </div>
        </button>
      )}

      {/* Course Stream Selection Modal (CA Foundation vs CA Inter vs CA Final) */}
      <CourseSelectionModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        currentLevel={state.courseLevel}
        currentPersona={state.userPersona || 'working_professional'}
        morningStartTime={state.morningStartTime}
        morningEndTime={state.morningEndTime}
        eveningStartTime={state.eveningStartTime}
        eveningEndTime={state.eveningEndTime}
        eveningBreakMinutes={state.eveningBreakMinutes}
        onSelectLevel={handleSelectCourseLevel}
      />

      {/* Dedicated Study Hours Modal (Morning From-To & Evening From-To) */}
      <StudyHoursModal
        isOpen={isStudyHoursModalOpen}
        onClose={() => setIsStudyHoursModalOpen(false)}
        state={state}
        onSaveHours={handleSaveStudyHours}
      />

      {/* Attempt & Portion Selection Modal */}
      <AttemptSelectionModal
        isOpen={isAttemptModalOpen}
        onClose={() => setIsAttemptModalOpen(false)}
        courseLevel={state.courseLevel}
        currentPortion={state.attemptPortion || 'both'}
        currentSession={state.examSession || 'may_2027'}
        onConfirm={handleSelectAttempt}
      />

      {/* Curated Courses Directory Modal (Free & Paid Courses) */}
      <CoursesDirectoryModal
        isOpen={isCoursesDirectoryOpen}
        onClose={() => setIsCoursesDirectoryOpen(false)}
        currentLevel={state.courseLevel}
        initialFilter={courseFilter}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
        currentFont={fontFamily}
        onSelectFont={handleSelectFont}
      />

      {/* Persistent Global Progress & Status Dock (Bottom Percentage & Theme Selection) */}
      <GlobalProgressBottomBar
        state={state}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onSelectToday={() => setActiveTab('scheduler')}
        onToggleTopicCompleted={handleToggleTopicCompleted}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 pb-14 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {state.courseLevel === 'foundation'
              ? 'CA Foundation'
              : state.courseLevel === 'final'
              ? 'CA Final'
              : 'CA Intermediate'}{' '}
            May 2027 Study Planner & Tracker • Tailored for Working Students (5h/day)
          </span>
          <span className="font-mono text-slate-400">
            Day 1: Oct 26, 2026 • Exam Date: May 1, 2027 • ICAI New Scheme
          </span>
        </div>
      </footer>
    </div>
  );
}
