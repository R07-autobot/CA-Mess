import React, { useEffect, useState } from 'react';
import { getExamCountdown, calculateCapacityMetrics, CountdownStats, CapacityMetrics } from '../utils/backlogEngine';
import { PlannerState, CourseFilterType, AttemptPortion, ExamSession, UserPersona } from '../types/ca-study';
import { CoursesDropdown } from './CoursesDropdown';
import { AttemptDropdown } from './AttemptDropdown';
import { 
  Calendar, 
  Clock, 
  Flame, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Briefcase, 
  RotateCcw,
  Download,
  Upload,
  Bot,
  Palette,
  ChevronDown,
  GraduationCap,
  Layers,
  Target,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { exportStateAsJSON } from '../utils/storage';

interface CountdownHeaderProps {
  state: PlannerState;
  courseFilter: CourseFilterType;
  onSelectCourseFilter: (filter: CourseFilterType) => void;
  onOpenCoursesDirectory: () => void;
  onOpenCourseModal: () => void;
  onTogglePersona?: (persona: UserPersona) => void;
  onOpenStudyHoursModal?: () => void;
  onSelectAttempt: (portion: AttemptPortion, session: ExamSession) => void;
  onOpenAttemptModal: () => void;
  onOpenBacklogModal: () => void;
  onOpenLogModal: () => void;
  onOpenAIAssistant: () => void;
  onOpenThemeModal: () => void;
  onLoadSampleData: () => void;
  onResetData: () => void;
  onImportState: (state: PlannerState) => void;
}

export const CountdownHeader: React.FC<CountdownHeaderProps> = ({
  state,
  courseFilter,
  onSelectCourseFilter,
  onOpenCoursesDirectory,
  onOpenCourseModal,
  onTogglePersona,
  onOpenStudyHoursModal,
  onSelectAttempt,
  onOpenAttemptModal,
  onOpenBacklogModal,
  onOpenLogModal,
  onOpenAIAssistant,
  onOpenThemeModal,
  onLoadSampleData,
  onResetData,
  onImportState,
}) => {
  const [countdown, setCountdown] = useState<CountdownStats>(() => getExamCountdown(state.examDate));
  const [capacity, setCapacity] = useState<CapacityMetrics>(() =>
    calculateCapacityMetrics(
      state.chapters,
      state.studyLogs,
      state.examDate,
      state.backlogConfig.dailyTargetHours,
      state.attemptPortion || 'both'
    )
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getExamCountdown(state.examDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.examDate]);

  useEffect(() => {
    setCapacity(
      calculateCapacityMetrics(
        state.chapters,
        state.studyLogs,
        state.examDate,
        state.backlogConfig.dailyTargetHours,
        state.attemptPortion || 'both'
      )
    );
  }, [state.chapters, state.studyLogs, state.examDate, state.backlogConfig.dailyTargetHours, state.attemptPortion]);

  const allPlans = Object.values(state.dailyPlans || {});
  const totalTopics = allPlans.length * 2;
  const completedTopics = allPlans.reduce(
    (acc, plan) => acc + (plan.morningTopic?.isCompleted ? 1 : 0) + (plan.eveningTopic?.isCompleted ? 1 : 0),
    0
  );
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayPlan = state.dailyPlans?.[todayStr] || allPlans[0];
  const todayCompletedCount = (todayPlan?.morningTopic?.isCompleted ? 1 : 0) + (todayPlan?.eveningTopic?.isCompleted ? 1 : 0);
  const todayPercentage = Math.round((todayCompletedCount / 2) * 100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.chapters) {
          onImportState(parsed);
        }
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const isStudent = state.userPersona === 'student';
  const morningStart = state.morningStartTime || (isStudent ? '07:00' : '06:30');
  const morningEnd = state.morningEndTime || (isStudent ? '11:00' : '08:00');
  const eveningStart = state.eveningStartTime || (isStudent ? '16:30' : '20:00');
  const eveningEnd = state.eveningEndTime || (isStudent ? '20:30' : '00:00');
  const morningHours = state.backlogConfig.morningSlotHours ?? (isStudent ? 4.0 : 1.5);
  const eveningHours = state.backlogConfig.eveningSlotHours ?? (isStudent ? 4.0 : 3.5);
  const dailyTargetHours = state.backlogConfig.dailyTargetHours ?? (isStudent ? 8.0 : 5.0);

  return (
    <header className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 pb-6 pt-5 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl tracking-tighter">
            CA
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                {state.courseLevel === 'foundation'
                  ? `CA Foundation ${state.examSession === 'nov_2027' ? 'Nov 2027' : 'May 2027'}`
                  : state.courseLevel === 'final'
                  ? `CA Final ${state.examSession === 'nov_2027' ? 'Nov 2027' : 'May 2027'}`
                  : `CA Intermediate ${state.examSession === 'nov_2027' ? 'Nov 2027' : 'May 2027'}`}
              </h1>

              {/* Course Switcher Trigger Pill */}
              <button
                onClick={onOpenCourseModal}
                data-dropdown-trigger="course-level"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Switch curriculum between CA Foundation, CA Intermediate, and CA Final"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {state.courseLevel === 'foundation'
                    ? 'CA Foundation'
                    : state.courseLevel === 'final'
                    ? 'CA Final'
                    : 'CA Inter'}
                </span>
                <ChevronDown className="w-3 h-3 text-indigo-300" />
              </button>

              {/* Student (8h) vs Working Professional (5h) Switcher Pill */}
              <button
                onClick={() => {
                  if (onTogglePersona) {
                    onTogglePersona(isStudent ? 'working_professional' : 'student');
                  } else {
                    onOpenCourseModal();
                  }
                }}
                data-dropdown-trigger="user-persona"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 border ${
                  isStudent
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                }`}
                title="Click to toggle between Student (8 Hours) and Working Professional (5 Hours)"
              >
                {isStudent ? (
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{isStudent ? 'Students (8h/day)' : 'Working Pro (5h/day)'}</span>
                <span className="text-[10px] opacity-70">⚙</span>
              </button>

              {/* Study Hours Configuration Pill (Morning From-To & Evening From-To) */}
              {onOpenStudyHoursModal && (
                <button
                  onClick={onOpenStudyHoursModal}
                  data-dropdown-trigger="study-hours"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 border bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/40"
                  title="Configure Morning (From-To) & Evening (From-To) Study Hours"
                >
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    {dailyTargetHours}h/day: M({morningStart}-{morningEnd}) • E({eveningStart}-{eveningEnd})
                  </span>
                  <Sliders className="w-3 h-3 text-sky-300 opacity-80" />
                </button>
              )}

              {/* Active Portion Pill Button */}
              <button
                onClick={onOpenAttemptModal}
                data-dropdown-trigger="active-portion"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 border ${
                  state.attemptPortion === 'both'
                    ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/40'
                    : state.attemptPortion === 'group1'
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/40'
                    : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/40'
                }`}
                title="Click to configure Target Attempt & Portion"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {state.attemptPortion === 'group1'
                    ? (state.courseLevel === 'foundation' ? 'Module 1 Only' : 'Group 1 Only')
                    : state.attemptPortion === 'group2'
                    ? (state.courseLevel === 'foundation' ? 'Module 2 Only' : 'Group 2 Only')
                    : (state.courseLevel === 'foundation' ? 'Both Modules (4 Papers)' : 'Both Groups (6 Papers)')}
                </span>
                <span className="text-[10px] opacity-70">⚙</span>
              </button>

              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Day 1: 26-Oct-26
              </span>
            </div>
            
            {/* Dynamic Profile Subtitle with Morning & Evening Hours */}
            <div 
              onClick={onOpenStudyHoursModal}
              className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap cursor-pointer group hover:text-slate-200 transition-colors"
              title="Click to customize Morning and Evening study hours"
            >
              {isStudent ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dedicated Student Schedule</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Working Professional Protocol</span>
                </>
              )}
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-300 font-medium group-hover:text-sky-300 transition-colors flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <Sun className="w-3 h-3 inline" />
                  <span>Morning {morningStart}-{morningEnd} ({morningHours}h)</span>
                </span>
                <span className="text-slate-600">+</span>
                <span className="inline-flex items-center gap-1 text-indigo-300">
                  <Moon className="w-3 h-3 inline" />
                  <span>Evening {eveningStart}-{eveningEnd} ({eveningHours}h)</span>
                </span>
                <span className="text-slate-400 font-semibold bg-slate-800/80 px-1.5 py-0.5 rounded text-[11px]">
                  {dailyTargetHours}h/day Total
                </span>
                <span className="text-[10px] text-sky-400 opacity-80 group-hover:opacity-100 underline decoration-dotted">
                  Change Hours
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Study Hours Quick Action Button */}
          {onOpenStudyHoursModal && (
            <button
              onClick={onOpenStudyHoursModal}
              className="px-3 py-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-sky-200 border border-sky-600/40 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              title="Configure Study Hours (Morning From-To & Evening From-To)"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Study Hours</span>
            </button>
          )}

          {/* Quick Attempt & Portion Dropdown */}
          <AttemptDropdown
            courseLevel={state.courseLevel}
            attemptPortion={state.attemptPortion || 'both'}
            examSession={state.examSession || 'may_2027'}
            onSelectAttempt={onSelectAttempt}
            onOpenDetailedModal={onOpenAttemptModal}
          />

          {/* Free & Paid Courses Dropdown */}
          <CoursesDropdown
            currentFilter={courseFilter}
            onSelectFilter={onSelectCourseFilter}
            onOpenDirectoryModal={onOpenCoursesDirectory}
            currentLevel={state.courseLevel}
          />

          <button
            onClick={onOpenAIAssistant}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-indigo-400/30"
            title="Ask AI Copilot for dashboard guidance, ICAI doubts, and web research"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
            <span>AI Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>

          <button
            onClick={onOpenThemeModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Select App Theme (Midnight, Emerald, Sapphire, Amber, Paper Light)"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme</span>
          </button>

          <button
            onClick={onOpenLogModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Log Hours</span>
          </button>

          <button
            onClick={onOpenBacklogModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Auto-distribute missed hours across upcoming buffers"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Backlog Balancer</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <button
            onClick={onLoadSampleData}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
            title="Load realistic progress to explore the app"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Sample</span>
          </button>

          <button
            onClick={() => exportStateAsJSON(state)}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 text-xs transition-all cursor-pointer"
            title="Export Backup JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <label
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 text-xs transition-all cursor-pointer"
            title="Import Backup JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onResetData}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/50 text-xs transition-all cursor-pointer"
            title="Reset All Progress to Fresh"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Completion Status Bar (Percentage Meter) */}
      <div 
        data-focus-section="completion-status"
        className="max-w-7xl mx-auto mt-4 bg-slate-950/80 border border-indigo-500/25 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Overall Roadmap Topic Mastery:
              </span>
              <span className="text-base font-black font-mono text-emerald-400">
                {overallPercentage}%
              </span>
              <span className="text-xs text-slate-400">
                ({completedTopics} of {totalTopics} topics ticked)
              </span>
            </div>
            <div className="w-48 sm:w-64 md:w-80 h-2 bg-slate-900 rounded-full overflow-hidden mt-1.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800/80 pt-2 md:pt-0">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Today's Session Status:
            </span>
            <div className="flex items-center gap-1.5 md:justify-end">
              <span className={`text-sm font-black font-mono ${todayPercentage === 100 ? 'text-emerald-400' : todayPercentage === 50 ? 'text-amber-400' : 'text-slate-400'}`}>
                {todayPercentage}% Complete
              </span>
              <span className="text-[11px] text-slate-400">
                ({todayCompletedCount}/2 Sessions Ticked)
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
            Day 1: 26-Oct-26
          </span>
        </div>
      </div>

      {/* Countdown & Capacity Engine Dashboard Cards */}
      <div className="max-w-7xl mx-auto mt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Countdown Box */}
        <div 
          data-focus-section="countdown-box"
          className="col-span-2 bg-gradient-to-br from-indigo-950/60 to-slate-900/90 rounded-2xl p-4 border border-indigo-500/20 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs font-medium text-indigo-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Target: May 1, 2027
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px]">
              09:00 AM IST
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 text-center">
            <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-white">
                {countdown.daysRemaining}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Days</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-indigo-300">
                {Math.floor((countdown.hoursRemainingTotal % 24))}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Hours</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-slate-200">
                {Math.floor((countdown.minutesRemainingTotal % 60))}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Mins</span>
            </div>
            <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black font-mono text-amber-400">
                {Math.floor((countdown.secondsRemainingTotal % 60))}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Secs</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{countdown.workingDays} Workdays</span>
            <span>{countdown.weekends} Weekend Days</span>
          </div>
        </div>

        {/* Capacity Engine Card */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Capacity</span>
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {countdown.totalCapacityHours}
              </span>
              <span className="text-xs text-slate-400 font-medium">hrs</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60">
            <p className="text-[11px] text-slate-400">
              Based on <span className="text-emerald-300 font-semibold">5.0h/day</span> rigid baseline
            </p>
          </div>
        </div>

        {/* Hours Logged & Progress */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Hours Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-blue-400">
                {capacity.hoursCompleted}
              </span>
              <span className="text-xs text-slate-400">/ {capacity.totalSyllabusHours}h</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Coverage</span>
              <span className="font-semibold text-slate-200">{capacity.completionRatePct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, capacity.completionRatePct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Velocity & Pacing Status */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Required Pace</span>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-white">
                {capacity.requiredDailyVelocity}
              </span>
              <span className="text-xs text-slate-400">h / day</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                capacity.status === 'ahead' || capacity.status === 'on_track'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {capacity.status === 'ahead' && 'Ahead of Curve'}
              {capacity.status === 'on_track' && 'Rigid Track On'}
              {capacity.status === 'needs_attention' && 'Pacing Catch-up'}
              {capacity.status === 'critical' && 'Deficit Alert'}
            </span>
            <span className="text-[10px] text-slate-500">Cap: 5.5h</span>
          </div>
        </div>

        {/* Working Professional Consistency Streak */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Study Streak</span>
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-orange-400">
                {state.streakCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">days in a row</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60">
            <p className="text-[11px] text-slate-400 truncate">
              {state.streakCount > 0 ? '🔥 Habit locked in!' : 'Start today’s 5h block'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
