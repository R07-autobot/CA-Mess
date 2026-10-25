import React, { useState } from 'react';
import { DayPlan, PlannerState, ScheduledTopic, TopicLinkReference } from '../types/ca-study';
import { getSubtopicRedirectUrl } from '../utils/topicResources';
import { 
  Sun, 
  Moon, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Check,
  Zap, 
  Play, 
  Plus, 
  BookOpen, 
  Calendar, 
  ArrowRight,
  Youtube,
  FileText,
  Scale,
  BrainCircuit,
  Flame,
  Bot,
  ShoppingBag,
  Gift,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/audio';
import { AIFlashcardsModal } from './AIFlashcardsModal';

interface DashboardTodayMissionProps {
  state: PlannerState;
  onUpdateTopicSpentMinutes: (date: string, slot: 'morning' | 'evening', spentMinutes: number) => void;
  onToggleTopicCompleted: (date: string, slot: 'morning' | 'evening', isCompleted: boolean) => void;
  onToggleSubtopic?: (date: string, slot: 'morning' | 'evening', subtopicTitle: string) => void;
  onOpenSchedulerForDate: (date: string) => void;
  onOpenAddLinkModal: (date: string, slot: 'morning' | 'evening') => void;
  onLaunchDeepWork: (slot: 'morning' | 'evening') => void;
  onAskAIAboutTopic?: (topicTitle: string, slot: 'morning' | 'evening') => void;
}

export const DashboardTodayMission: React.FC<DashboardTodayMissionProps> = ({
  state,
  onUpdateTopicSpentMinutes,
  onToggleTopicCompleted,
  onToggleSubtopic,
  onOpenSchedulerForDate,
  onOpenAddLinkModal,
  onLaunchDeepWork,
  onAskAIAboutTopic,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [morningResourceTab, setMorningResourceTab] = useState<'all' | 'free' | 'paid'>('all');
  const [eveningResourceTab, setEveningResourceTab] = useState<'all' | 'free' | 'paid'>('all');
  const [todayFlashcardTopic, setTodayFlashcardTopic] = useState<{ topic: ScheduledTopic; date: string } | null>(null);

  const plan: DayPlan | undefined = state.dailyPlans?.[selectedDate] || state.dailyPlans?.[todayStr] || Object.values(state.dailyPlans || {})[0];

  if (!plan) return null;

  const morning = plan.morningTopic;
  const evening = plan.eveningTopic;

  const totalSpent = Number(((morning.spentMinutes + evening.spentMinutes) / 60).toFixed(1));
  const totalAllocated = Number(((morning.allocatedMinutes + evening.allocatedMinutes) / 60).toFixed(1));
  const isAllDone = morning.isCompleted && evening.isCompleted;

  const adjustMinutes = (slot: 'morning' | 'evening', currentMins: number, delta: number) => {
    const updated = Math.max(0, currentMins + delta);
    onUpdateTopicSpentMinutes(plan.date, slot, updated);
  };

  const handleToggle = (slot: 'morning' | 'evening', currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    onToggleTopicCompleted(plan.date, slot, nextStatus);
    if (nextStatus) {
      playChime('milestone_unlocked');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const renderLinkIcon = (type: TopicLinkReference['type']) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 text-red-400" />;
      case 'icai_sm':
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case 'bare_act':
        return <Scale className="w-3.5 h-3.5 text-purple-400" />;
      case 'paid_batch':
        return <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />;
      case 'paid_book':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      case 'test_series':
        return <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const isStudent = state.userPersona === 'student';

  return (
    <div 
      data-focus-section="today-mission"
      className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/30 border border-indigo-500/30 rounded-2xl p-5 shadow-xl my-6 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex-shrink-0">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {isStudent ? "Today's 8-Hour Study Mission" : "Today's 5-Hour Study Mission"}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Day {plan.dayNumber} of 191
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {plan.phase}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                isStudent
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                {isStudent ? '8h/day Student Track' : '5h/day Working Pro'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Wake Up: <strong className="text-amber-300">06:00 AM</strong></span>
              <span>•</span>
              <span>Morning: <strong className="text-slate-200">{state.morningSlotTime}</strong></span>
              <span>•</span>
              <span>Evening: <strong className="text-slate-200">{state.eveningSlotTime}</strong></span>
            </p>
          </div>
        </div>

        {/* Date Selector & Total Day Progress */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 mr-2">Tracked Today:</span>
            <span className={`font-mono font-bold text-sm ${isAllDone ? 'text-emerald-400' : 'text-amber-400'}`}>
              {totalSpent}h / {totalAllocated}h
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                const cur = new Date(selectedDate);
                cur.setDate(cur.getDate() - 1);
                setSelectedDate(cur.toISOString().split('T')[0]);
              }}
              className="px-2 py-0.5 text-slate-400 hover:text-white cursor-pointer font-bold"
              title="Previous Day"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-2 py-0.5 rounded cursor-pointer text-[11px] font-semibold ${
                selectedDate === todayStr ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                const cur = new Date(selectedDate);
                cur.setDate(cur.getDate() + 1);
                setSelectedDate(cur.toISOString().split('T')[0]);
              }}
              className="px-2 py-0.5 text-slate-400 hover:text-white cursor-pointer font-bold"
              title="Next Day"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Routine Timeline Breakdown Bar */}
      <div className="mt-4 bg-slate-950/80 rounded-xl p-3 border border-slate-800/90">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isStudent ? 'Full-Time Student Routine & Study Schedule' : 'Working Professional Daily Schedule Breakdown'}</span>
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
            isStudent 
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
              : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
          }`}>
            {isStudent ? 'Target 8.0h Total Study' : 'Rigid 5.0h Total Study'}
          </span>
        </div>
        
        {isStudent ? (
          /* Student 8-Hour Daily Schedule */
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">06:00 - 07:00 AM</span>
              <span className="font-semibold text-white text-[11px] block mt-0.5">⏰ Wake & Routine (1h)</span>
              <span className="text-[9px] text-slate-400">Exercise & Breakfast</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-emerald-500/40 ring-1 ring-emerald-500/30">
              <span className="text-[10px] text-emerald-300 font-bold block">07:00 - 11:00 AM</span>
              <span className="font-bold text-emerald-300 text-[11px] block mt-0.5">⚡ Session 1 (4.0h)</span>
              <span className="text-[9px] text-slate-300">Morning Deep Work Theory</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">11:00 AM - 04:30 PM</span>
              <span className="font-semibold text-slate-300 text-[11px] block mt-0.5">🥗 Lunch & Rest (5.5h)</span>
              <span className="text-[9px] text-slate-400">Meal, Power Nap & Light Rev</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-blue-500/40 ring-1 ring-blue-500/30">
              <span className="text-[10px] text-blue-300 font-bold block">04:30 - 08:30 PM</span>
              <span className="font-bold text-blue-300 text-[11px] block mt-0.5">🌙 Session 2 (4.0h)</span>
              <span className="text-[9px] text-slate-300">Practical & Problem Solving</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold block">08:30 - 11:00 PM</span>
              <span className="font-semibold text-slate-300 text-[11px] block mt-0.5">😴 Dinner & Rest (2.5h)</span>
              <span className="text-[9px] text-slate-400">Dinner & 7.5h Circadian Sleep</span>
            </div>
          </div>
        ) : (
          /* Working Professional 5-Hour Daily Schedule */
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-slate-900/90 rounded-lg p-2 border border-amber-500/20">
              <span className="text-[10px] text-amber-400 font-bold block">06:00 - 06:30 AM</span>
              <span className="font-semibold text-white text-[11px] block mt-0.5">⏰ Wake Up (30m)</span>
              <span className="text-[9px] text-slate-400">Hydration & Cold Splash</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-amber-500/40 ring-1 ring-amber-500/30">
              <span className="text-[10px] text-amber-300 font-bold block">06:30 - 08:00 AM</span>
              <span className="font-bold text-amber-300 text-[11px] block mt-0.5">⚡ Session 1 (1.5h)</span>
              <span className="text-[9px] text-slate-300">Morning Theory & Law</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block">08:00 AM - 08:00 PM</span>
              <span className="font-semibold text-slate-300 text-[11px] block mt-0.5">💼 Workday (12h)</span>
              <span className="text-[9px] text-slate-400">Job, Commute & Dinner</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-blue-500/40 ring-1 ring-blue-500/30">
              <span className="text-[10px] text-blue-300 font-bold block">08:00 - 12:00 AM</span>
              <span className="font-bold text-blue-300 text-[11px] block mt-0.5">🌙 Session 2 (3.5h)</span>
              <span className="text-[9px] text-slate-300">Practical & 30m break</span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold block">12:00 - 06:00 AM</span>
              <span className="font-semibold text-slate-300 text-[11px] block mt-0.5">😴 Sleep (6.0h)</span>
              <span className="text-[9px] text-slate-400">Consistent Circadian Rest</span>
            </div>
          </div>
        )}
      </div>

      {/* 2-Slot Practical Cards (Directly on Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Morning Slot Card */}
        <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Sun className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isStudent ? 'Morning Focus (4.0h • 07:00 - 11:00)' : 'Morning Theory (1.5h • 06:30 - 08:00)'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {morning.paperCode}: {morning.paperShortName}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white leading-snug">
                {morning.chapterTitle}
              </h3>
            </div>

            {/* Subtopics with 1-click direct redirectable links */}
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  🎯 Specific Daily Topics to Cover:
                </span>
                <span className="text-[9px] text-slate-400">1-click study launch</span>
              </div>
              <ul className="space-y-1.5">
                {morning.subtopics.map((st, i) => {
                  const isDone = (morning.completedSubtopics || []).includes(st);
                  return (
                    <li key={i} className="text-xs text-slate-300 flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800/40 transition-colors group">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (onToggleSubtopic) {
                              onToggleSubtopic(plan.date, 'morning', st);
                            }
                          }}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'border border-slate-600 hover:border-emerald-400 bg-slate-900/60'
                          }`}
                          title={isDone ? 'Mark incomplete' : 'Tick mark complete'}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                        </button>
                        <span className={`truncate font-medium transition-colors ${
                          isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {st}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={getSubtopicRedirectUrl(morning.paperShortName, st, 'youtube')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-semibold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          title={`Watch lecture for "${st}"`}
                        >
                          <Youtube className="w-2.5 h-2.5 text-red-400" />
                          <span>Video</span>
                        </a>
                        <a
                          href={getSubtopicRedirectUrl(morning.paperShortName, st, 'icai_sm')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-semibold text-blue-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/70 border border-blue-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          title={`ICAI Study Material PDF for "${st}"`}
                        >
                          <BookOpen className="w-2.5 h-2.5 text-blue-400" />
                          <span>ICAI SM</span>
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ICAI Resources Reference */}
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-300 font-medium">ICAI SM:</span> {morning.resources.icaiSmModule} ({morning.resources.pageRange}) •{' '}
              <span className="text-emerald-300 font-mono font-medium">{morning.resources.illustrations}</span>
            </div>

            {/* Human Memory Retention Protocol */}
            {morning.memoryTechnique && (
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate"><strong>Memory Cue:</strong> {morning.memoryTechnique}</span>
              </div>
            )}

            {/* Clickable Attached Links & Resources (Segregated Free vs Paid with Topic Names) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="text-white">Topic Study Resources:</span>
                  <span className="text-[10px] text-slate-400">
                    ({morning.links?.filter((l) => l.costType === 'free').length || 0} Free • {morning.links?.filter((l) => l.costType === 'paid').length || 0} Paid)
                  </span>
                </span>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setMorningResourceTab('all')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        morningResourceTab === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setMorningResourceTab('free')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-0.5 ${
                        morningResourceTab === 'free' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-emerald-300'
                      }`}
                    >
                      <Gift className="w-2.5 h-2.5" /> Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setMorningResourceTab('paid')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-0.5 ${
                        morningResourceTab === 'paid' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-amber-300'
                      }`}
                    >
                      <ShoppingBag className="w-2.5 h-2.5" /> Paid
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenAddLinkModal(plan.date, 'morning')}
                    className="text-indigo-400 hover:text-indigo-300 text-[11px] flex items-center gap-0.5 cursor-pointer ml-1"
                    title="Add or Edit Resources"
                  >
                    <Plus className="w-3 h-3" /> Edit
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {morning.links && morning.links.length > 0 ? (
                  morning.links
                    .filter((l) => morningResourceTab === 'all' || l.costType === morningResourceTab)
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-[11px] font-medium transition-all cursor-pointer group ${
                          link.costType === 'free'
                            ? 'bg-slate-900/90 hover:bg-slate-850 border-emerald-500/25 text-emerald-200 hover:border-emerald-400 hover:shadow-sm'
                            : 'bg-slate-900/90 hover:bg-slate-850 border-amber-500/25 text-amber-200 hover:border-amber-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                              link.costType === 'free'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {link.costType === 'free' ? 'FREE' : 'PAID'}
                          </span>
                          {renderLinkIcon(link.type)}
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-slate-100 group-hover:text-white font-semibold">
                              {link.title}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                              {link.provider && <span>{link.provider}</span>}
                              {link.provider && link.priceNote && <span>•</span>}
                              {link.priceNote && (
                                <span className={link.costType === 'paid' ? 'text-amber-300 font-mono' : 'text-emerald-300'}>
                                  {link.priceNote}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 ml-auto" />
                      </a>
                    ))
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No resources attached.</span>
                )}
              </div>
            </div>
          </div>

          {/* Time Tracking & Actions Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Time:</span>
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
                <button
                  onClick={() => adjustMinutes('morning', morning.spentMinutes, -15)}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  -15m
                </button>
                <span className="px-2 font-mono text-xs font-bold text-amber-400">
                  {morning.spentMinutes}m / {morning.allocatedMinutes}m
                </span>
                <button
                  onClick={() => adjustMinutes('morning', morning.spentMinutes, 15)}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  +15m
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => setTodayFlashcardTopic({ topic: morning, date: plan.date })}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:to-indigo-500/25 text-purple-300 border border-purple-500/35 hover:border-purple-400/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                title="AI generate 5-10 quick-fire revision flashcards for this topic"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>AI Flashcards</span>
              </button>

              {onAskAIAboutTopic && (
                <button
                  onClick={() => onAskAIAboutTopic(morning.chapterTitle, 'morning')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Ask CA AI Copilot to explain or research this topic"
                >
                  <Bot className="w-3 h-3 text-indigo-400" />
                  <span>Ask AI</span>
                </button>
              )}

              <button
                onClick={() => onLaunchDeepWork('morning')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Lock into full-screen distraction-free timer"
              >
                <Zap className="w-3 h-3" /> Lock {isStudent ? '4.0h' : '1.5h'}
              </button>

              <button
                onClick={() => handleToggle('morning', morning.isCompleted)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  morning.isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{morning.isCompleted ? 'Done' : 'Mark'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Evening Slot Card */}
        <div className="bg-slate-950/80 border border-blue-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isStudent ? 'Evening Focus (4.0h • 16:30 - 20:30)' : 'Evening Practical (3.5h • 20:00 - 00:00)'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {evening.paperCode}: {evening.paperShortName}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white leading-snug">
                {evening.chapterTitle}
              </h3>
            </div>

            {/* Subtopics with 1-click direct redirectable links */}
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                  🎯 Specific Daily Topics to Cover:
                </span>
                <span className="text-[9px] text-slate-400">1-click study launch</span>
              </div>
              <ul className="space-y-1.5">
                {evening.subtopics.map((st, i) => {
                  const isDone = (evening.completedSubtopics || []).includes(st);
                  return (
                    <li key={i} className="text-xs text-slate-300 flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800/40 transition-colors group">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (onToggleSubtopic) {
                              onToggleSubtopic(plan.date, 'evening', st);
                            }
                          }}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'border border-slate-600 hover:border-emerald-400 bg-slate-900/60'
                          }`}
                          title={isDone ? 'Mark incomplete' : 'Tick mark complete'}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                        </button>
                        <span className={`truncate font-medium transition-colors ${
                          isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {st}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={getSubtopicRedirectUrl(evening.paperShortName, st, 'youtube')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-semibold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          title={`Watch lecture for "${st}"`}
                        >
                          <Youtube className="w-2.5 h-2.5 text-red-400" />
                          <span>Video</span>
                        </a>
                        <a
                          href={getSubtopicRedirectUrl(evening.paperShortName, st, 'icai_sm')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-semibold text-blue-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/70 border border-blue-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          title={`ICAI Study Material PDF for "${st}"`}
                        >
                          <BookOpen className="w-2.5 h-2.5 text-blue-400" />
                          <span>ICAI SM</span>
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ICAI Resources Reference */}
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-300 font-medium">ICAI SM:</span> {evening.resources.icaiSmModule} ({evening.resources.pageRange}) •{' '}
              <span className="text-emerald-300 font-mono font-medium">{evening.resources.illustrations}</span>
            </div>

            {/* Human Memory Retention Protocol */}
            {evening.memoryTechnique && (
              <div className="flex items-center gap-1.5 text-[11px] text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                <BrainCircuit className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="truncate"><strong>Memory Cue:</strong> {evening.memoryTechnique}</span>
              </div>
            )}

            {/* Clickable Attached Links & Resources (Segregated Free vs Paid with Topic Names) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="text-white">Topic Study Resources:</span>
                  <span className="text-[10px] text-slate-400">
                    ({evening.links?.filter((l) => l.costType === 'free').length || 0} Free • {evening.links?.filter((l) => l.costType === 'paid').length || 0} Paid)
                  </span>
                </span>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setEveningResourceTab('all')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        eveningResourceTab === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setEveningResourceTab('free')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-0.5 ${
                        eveningResourceTab === 'free' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-emerald-300'
                      }`}
                    >
                      <Gift className="w-2.5 h-2.5" /> Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setEveningResourceTab('paid')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-0.5 ${
                        eveningResourceTab === 'paid' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-amber-300'
                      }`}
                    >
                      <ShoppingBag className="w-2.5 h-2.5" /> Paid
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenAddLinkModal(plan.date, 'evening')}
                    className="text-blue-400 hover:text-blue-300 text-[11px] flex items-center gap-0.5 cursor-pointer ml-1"
                    title="Add or Edit Resources"
                  >
                    <Plus className="w-3 h-3" /> Edit
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {evening.links && evening.links.length > 0 ? (
                  evening.links
                    .filter((l) => eveningResourceTab === 'all' || l.costType === eveningResourceTab)
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-[11px] font-medium transition-all cursor-pointer group ${
                          link.costType === 'free'
                            ? 'bg-slate-900/90 hover:bg-slate-850 border-emerald-500/25 text-emerald-200 hover:border-emerald-400 hover:shadow-sm'
                            : 'bg-slate-900/90 hover:bg-slate-850 border-amber-500/25 text-amber-200 hover:border-amber-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                              link.costType === 'free'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {link.costType === 'free' ? 'FREE' : 'PAID'}
                          </span>
                          {renderLinkIcon(link.type)}
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-slate-100 group-hover:text-white font-semibold">
                              {link.title}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                              {link.provider && <span>{link.provider}</span>}
                              {link.provider && link.priceNote && <span>•</span>}
                              {link.priceNote && (
                                <span className={link.costType === 'paid' ? 'text-amber-300 font-mono' : 'text-emerald-300'}>
                                  {link.priceNote}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 ml-auto" />
                      </a>
                    ))
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No resources attached.</span>
                )}
              </div>
            </div>
          </div>

          {/* Time Tracking & Actions Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Time:</span>
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
                <button
                  onClick={() => adjustMinutes('evening', evening.spentMinutes, -15)}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  -15m
                </button>
                <span className="px-2 font-mono text-xs font-bold text-blue-400">
                  {evening.spentMinutes}m / {evening.allocatedMinutes}m
                </span>
                <button
                  onClick={() => adjustMinutes('evening', evening.spentMinutes, 15)}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  +15m
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => setTodayFlashcardTopic({ topic: evening, date: plan.date })}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:to-indigo-500/25 text-purple-300 border border-purple-500/35 hover:border-purple-400/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                title="AI generate 5-10 quick-fire revision flashcards for this topic"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>AI Flashcards</span>
              </button>

              {onAskAIAboutTopic && (
                <button
                  onClick={() => onAskAIAboutTopic(evening.chapterTitle, 'evening')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Ask CA AI Copilot to explain or research this practical topic"
                >
                  <Bot className="w-3 h-3 text-indigo-400" />
                  <span>Ask AI</span>
                </button>
              )}

              <button
                onClick={() => onLaunchDeepWork('evening')}
                className="px-2.5 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Lock into full-screen distraction-free timer"
              >
                <Zap className="w-3 h-3" /> Lock {isStudent ? '4.0h' : '3.5h'}
              </button>

              <button
                onClick={() => handleToggle('evening', evening.isCompleted)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  evening.isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{evening.isCompleted ? 'Done' : 'Mark'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Quick-Fire Flashcards Modal */}
      {todayFlashcardTopic && (
        <AIFlashcardsModal
          isOpen={Boolean(todayFlashcardTopic)}
          onClose={() => setTodayFlashcardTopic(null)}
          topic={todayFlashcardTopic.topic}
          dateStr={todayFlashcardTopic.date}
        />
      )}
    </div>
  );
};
