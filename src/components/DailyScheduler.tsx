import React, { useState } from 'react';
import { Chapter, Paper, PlannerState, StudyLogEntry } from '../types/ca-study';
import { ICAI_PAPERS } from '../data/icaiSyllabus';
import { PomodoroTimer } from './PomodoroTimer';
import { DeepWorkSession } from './DeepWorkSession';
import { 
  Sun, 
  Moon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
  Check,
  Lock,
  Zap,
  BellOff
} from 'lucide-react';

interface DailySchedulerProps {
  state: PlannerState;
  onUpdateChapterMilestone: (chapterId: string, milestoneKey: keyof Chapter['milestones'], value: any) => void;
  onUpdateChapterNotes?: (chapterId: string, notes: string) => void;
  onSaveLog: (log: StudyLogEntry) => void;
  onOpenLogModal: (dateStr?: string) => void;
  onOpenBacklogModal: () => void;
  onDeepWorkActiveChange?: (isActive: boolean) => void;
}

export const DailyScheduler: React.FC<DailySchedulerProps> = ({
  state,
  onUpdateChapterMilestone,
  onUpdateChapterNotes,
  onSaveLog,
  onOpenLogModal,
  onOpenBacklogModal,
  onDeepWorkActiveChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [activeSlot, setActiveSlot] = useState<'morning' | 'evening'>('morning');
  const [showTimer, setShowTimer] = useState<boolean>(true);
  const [timerMinimized, setTimerMinimized] = useState<boolean>(false);
  const [deepWorkSlot, setDeepWorkSlot] = useState<'morning' | 'evening' | null>(null);

  // Filter theory chapters (for morning) and practical chapters (for evening)
  const chaptersList = Object.values(state.chapters);
  const theoryCandidates = chaptersList.filter(
    (c) => c.type === 'theory' || c.paperId === 'p2_corp_law' || c.paperId === 'p5_audit'
  );
  const practicalCandidates = chaptersList.filter(
    (c) => c.type === 'practical' || c.paperId === 'p1_adv_acc' || c.paperId === 'p4_costing' || c.paperId === 'p6_fm_sm'
  );

  // Pick or auto-pair chapters for the date
  // We can pick incomplete Category A chapters first!
  const defaultMorning = theoryCandidates.find((c) => !c.milestones.lectureDone || !c.milestones.icaiSmDone) || theoryCandidates[0];
  const defaultEvening = practicalCandidates.find((c) => !c.milestones.lectureDone || !c.milestones.icaiSmDone) || practicalCandidates[0];

  const currentPlan = state.dailyPlans?.[selectedDate];
  const currentLog = state.studyLogs[selectedDate];

  const morningChapter = currentPlan?.morningTopic
    ? state.chapters[currentPlan.morningTopic.chapterId] || defaultMorning
    : state.chapters[currentLog?.morningChapterId || defaultMorning?.id] || defaultMorning;

  const eveningChapter = currentPlan?.eveningTopic
    ? state.chapters[currentPlan.eveningTopic.chapterId] || defaultEvening
    : state.chapters[currentLog?.eveningChapterId || defaultEvening?.id] || defaultEvening;

  const morningPaper = ICAI_PAPERS.find((p) => p.id === morningChapter?.paperId);
  const eveningPaper = ICAI_PAPERS.find((p) => p.id === eveningChapter?.paperId);

  const morningHours = currentLog?.morningHours ?? (currentPlan ? Number(((currentPlan.morningTopic.spentMinutes || 0) / 60).toFixed(1)) : 0);
  const eveningHours = currentLog?.eveningHours ?? (currentPlan ? Number(((currentPlan.eveningTopic.spentMinutes || 0) / 60).toFixed(1)) : 0);
  const totalLogged = morningHours + eveningHours;
  const dailyTarget = state.backlogConfig.dailyTargetHours;
  const isGoalMet = totalLogged >= dailyTarget;
  const deficit = Math.max(0, dailyTarget - totalLogged);

  const changeDateBy = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handlePomodoroLogMinutes = (minutes: number, slot: 'morning' | 'evening') => {
    const hoursToAdd = Number((minutes / 60).toFixed(2));
    const prev = state.studyLogs[selectedDate] || {
      id: `log_${selectedDate}`,
      date: selectedDate,
      morningHours: 0,
      eveningHours: 0,
      morningChapterId: morningChapter?.id,
      eveningChapterId: eveningChapter?.id,
      completedPomodoros: 0,
      status: 'partial' as const,
    };

    const updatedMorning = slot === 'morning' ? Number((prev.morningHours + hoursToAdd).toFixed(2)) : prev.morningHours;
    const updatedEvening = slot === 'evening' ? Number((prev.eveningHours + hoursToAdd).toFixed(2)) : prev.eveningHours;
    const updatedTotal = updatedMorning + updatedEvening;

    onSaveLog({
      ...prev,
      morningHours: updatedMorning,
      eveningHours: updatedEvening,
      completedPomodoros: prev.completedPomodoros + Math.max(1, Math.round(minutes / 45)),
      status: updatedTotal >= dailyTarget ? 'met_goal' : updatedTotal >= dailyTarget / 2 ? 'partial' : 'missed',
    });
  };

  const handleStartDeepWork = (slot: 'morning' | 'evening') => {
    setActiveSlot(slot);
    setDeepWorkSlot(slot);
    onDeepWorkActiveChange?.(true);
  };

  const handleEndDeepWork = (elapsedMinutes: number, slot: 'morning' | 'evening') => {
    setDeepWorkSlot(null);
    onDeepWorkActiveChange?.(false);
    if (elapsedMinutes > 0) {
      handlePomodoroLogMinutes(elapsedMinutes, slot);
    }
  };

  const activeChapter = activeSlot === 'morning' ? morningChapter : eveningChapter;
  const activePaper = activeSlot === 'morning' ? morningPaper : eveningPaper;
  const deepWorkChapter = deepWorkSlot === 'morning' ? morningChapter : eveningChapter;
  const deepWorkPaper = deepWorkSlot === 'morning' ? morningPaper : eveningPaper;

  return (
    <div className="space-y-6">
      {/* Date Navigator & Routine Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
            <button
              onClick={() => changeDateBy(-1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-white px-2 cursor-pointer focus:outline-none font-mono"
            />
            <button
              onClick={() => changeDateBy(1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Day's Total:</span>
            <span
              className={`font-mono font-bold text-sm ${
                isGoalMet ? 'text-emerald-400' : totalLogged > 0 ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {totalLogged.toFixed(1)}h / {dailyTarget}h
            </span>
          </div>

          <button
            onClick={() => onOpenLogModal(selectedDate)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Update Actual Hours</span>
          </button>

          {deficit > 0 && totalLogged > 0 && (
            <button
              onClick={onOpenBacklogModal}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Balance -{deficit.toFixed(1)}h Deficit</span>
            </button>
          )}
        </div>
      </div>

      {/* Deep Work Session Callout Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Deep Work Session Mode
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                <BellOff className="w-3 h-3" /> Notifications Silenced
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                1.5h Morning • 3.5h Evening
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Locks your screen into an immersive, distraction-free timer with ambient sound and autosaves your study hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleStartDeepWork('morning')}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
            title="Lock Morning Theory 1.5h Session (06:30 - 08:00 AM)"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Lock Morning (1.5h)</span>
          </button>

          <button
            onClick={() => handleStartDeepWork('evening')}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer active:scale-95"
            title="Lock Evening Practical 3.5h Session (08:00 - 12:00 AM)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Lock Evening (3.5h)</span>
          </button>
        </div>
      </div>

      {/* 2-Slot Grid: Morning Theory & Evening Practical */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Morning Slot Block */}
        <div
          onClick={() => setActiveSlot('morning')}
          className={`relative rounded-2xl p-5 border transition-all cursor-pointer ${
            activeSlot === 'morning'
              ? 'bg-slate-900 border-amber-500/40 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/30'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Morning Focus Slot</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Theory / Law
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {state.morningSlotTime} • Rigid 1.5h Capacity
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Logged</span>
              <span className="text-lg font-black font-mono text-amber-400">
                {morningHours.toFixed(1)} <span className="text-xs text-slate-500">/ 1.5h</span>
              </span>
            </div>
          </div>

          {/* Chapter Details */}
          <div className="mt-4 bg-slate-950/70 rounded-xl p-4 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-amber-400">
                {morningPaper?.code}: {morningPaper?.shortName}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                Category {morningChapter?.category} • {morningChapter?.weightageEstimate}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-100 leading-snug">
              {morningChapter?.title}
            </h4>

            {/* Granular Subtopics to Cover Today */}
            {currentPlan?.morningTopic && (
              <div className="mt-2.5 p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  🎯 Specific Topics to Cover Today:
                </span>
                <ul className="space-y-1">
                  {currentPlan.morningTopic.subtopics.map((st, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>

                {/* Resources */}
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-400">
                  <div>
                    <strong className="text-slate-300">ICAI Module:</strong> {currentPlan.morningTopic.resources.icaiSmModule} ({currentPlan.morningTopic.resources.pageRange})
                  </div>
                  <div>
                    <strong className="text-slate-300">Illustrations / Problems:</strong>{' '}
                    <span className="text-emerald-300 font-mono font-medium">{currentPlan.morningTopic.resources.illustrations}</span>
                  </div>
                </div>

                {/* Framework */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> {currentPlan.morningTopic.framework.name}
                  </span>
                  <span className="font-mono text-slate-400">
                    Spent: <strong className="text-amber-400">{currentPlan.morningTopic.spentMinutes || 0}m</strong> / {currentPlan.morningTopic.allocatedMinutes || 90}m
                  </span>
                </div>
              </div>
            )}

            {/* Micro milestones status */}
            <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={morningChapter?.milestones.lectureDone || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(morningChapter.id, 'lectureDone', e.target.checked)
                  }
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <span>Lecture Done</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={morningChapter?.milestones.icaiSmDone || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(morningChapter.id, 'icaiSmDone', e.target.checked)
                  }
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <span>ICAI SM Solved</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={morningChapter?.milestones.rtpPyqDone || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(morningChapter.id, 'rtpPyqDone', e.target.checked)
                  }
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <span>RTP / PYQ Done</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={morningChapter?.milestones.revised2x || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(morningChapter.id, 'revised2x', e.target.checked)
                  }
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
                />
                <span>Revised 2x</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="italic">💡 Fresh cognitive mind before morning commute.</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartDeepWork('morning');
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                title="Lock into full-screen distraction-free 1.5h mode"
              >
                <Lock className="w-3.5 h-3.5" /> Lock Deep Work (1.5h)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlot('morning');
                  setShowTimer(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Quick Focus
              </button>
            </div>
          </div>
        </div>

        {/* Evening Slot Block */}
        <div
          onClick={() => setActiveSlot('evening')}
          className={`relative rounded-2xl p-5 border transition-all cursor-pointer ${
            activeSlot === 'evening'
              ? 'bg-slate-900 border-blue-500/40 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/30'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Evening Focus Slot</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Practical / Numerical
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {state.eveningSlotTime} • Rigid 3.5h Capacity
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Logged</span>
              <span className="text-lg font-black font-mono text-blue-400">
                {eveningHours.toFixed(1)} <span className="text-xs text-slate-500">/ 3.5h</span>
              </span>
            </div>
          </div>

          {/* Chapter Details */}
          <div className="mt-4 bg-slate-950/70 rounded-xl p-4 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-blue-400">
                {eveningPaper?.code}: {eveningPaper?.shortName}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                Category {eveningChapter?.category} • {eveningChapter?.weightageEstimate}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-100 leading-snug">
              {eveningChapter?.title}
            </h4>

            {/* Granular Subtopics to Cover Today */}
            {currentPlan?.eveningTopic && (
              <div className="mt-2.5 p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
                  🎯 Specific Topics to Cover Today:
                </span>
                <ul className="space-y-1">
                  {currentPlan.eveningTopic.subtopics.map((st, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>

                {/* Resources */}
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-400">
                  <div>
                    <strong className="text-slate-300">ICAI Module:</strong> {currentPlan.eveningTopic.resources.icaiSmModule} ({currentPlan.eveningTopic.resources.pageRange})
                  </div>
                  <div>
                    <strong className="text-slate-300">Illustrations / Problems:</strong>{' '}
                    <span className="text-emerald-300 font-mono font-medium">{currentPlan.eveningTopic.resources.illustrations}</span>
                  </div>
                </div>

                {/* Framework */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-400" /> {currentPlan.eveningTopic.framework.name}
                  </span>
                  <span className="font-mono text-slate-400">
                    Spent: <strong className="text-blue-400">{currentPlan.eveningTopic.spentMinutes || 0}m</strong> / {currentPlan.eveningTopic.allocatedMinutes || 210}m
                  </span>
                </div>
              </div>
            )}

            {/* Micro milestones status */}
            <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eveningChapter?.milestones.lectureDone || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(eveningChapter.id, 'lectureDone', e.target.checked)
                  }
                  className="rounded text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-700"
                />
                <span>Lecture Done</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eveningChapter?.milestones.icaiSmDone || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(eveningChapter.id, 'icaiSmDone', e.target.checked)
                  }
                  className="rounded text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-700"
                />
                <span>ICAI SM Solved</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eveningChapter?.milestones.rtpPyqDone || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(eveningChapter.id, 'rtpPyqDone', e.target.checked)
                  }
                  className="rounded text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-700"
                />
                <span>RTP / PYQ Done</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eveningChapter?.milestones.revised2x || false}
                  onChange={(e) =>
                    onUpdateChapterMilestone(eveningChapter.id, 'revised2x', e.target.checked)
                  }
                  className="rounded text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-700"
                />
                <span>Revised 2x</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="italic">💡 Numerical problem-solving defeats post-work fatigue.</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartDeepWork('evening');
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                title="Lock into full-screen distraction-free 3.5h mode"
              >
                <Lock className="w-3.5 h-3.5" /> Lock Deep Work (3.5h)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlot('evening');
                  setShowTimer(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-blue-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Quick Focus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Built-in Pomodoro Focus Station */}
      {showTimer && (
        <div className="pt-2">
          <PomodoroTimer
            currentSlot={activeSlot}
            activeSubjectName={`${activePaper?.shortName || ''} (${activeSlot === 'morning' ? 'Theory' : 'Practical'})`}
            activeChapterTitle={activeChapter?.title}
            onLogStudyMinutes={handlePomodoroLogMinutes}
            isMinimized={timerMinimized}
            onToggleMinimize={() => setTimerMinimized(!timerMinimized)}
          />
        </div>
      )}

      {/* Deep Work Session Full-Screen Locked Mode */}
      {deepWorkSlot && deepWorkChapter && (
        <DeepWorkSession
          isOpen={Boolean(deepWorkSlot)}
          onClose={handleEndDeepWork}
          slot={deepWorkSlot}
          chapter={deepWorkChapter}
          paper={deepWorkPaper}
          onUpdateChapterMilestone={onUpdateChapterMilestone}
          onUpdateChapterNotes={onUpdateChapterNotes}
        />
      )}
    </div>
  );
};
