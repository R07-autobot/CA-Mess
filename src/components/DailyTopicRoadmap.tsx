import React, { useState, useMemo } from 'react';
import { DayPlan, PlannerState, ScheduledTopic, TopicExecutionFramework, TopicLinkReference } from '../types/ca-study';
import { AddTopicLinkModal } from './AddTopicLinkModal';
import { AIFlashcardsModal } from './AIFlashcardsModal';
import { getSubtopicRedirectUrl, generateTopicResources } from '../utils/topicResources';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Search, 
  Filter, 
  Sun, 
  Moon, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ArrowRight,
  Layers,
  Award,
  Zap,
  Bookmark,
  Plus,
  Youtube,
  Scale,
  FileText,
  BrainCircuit,
  Flame,
  ShieldCheck,
  ShoppingBag,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/audio';

interface DailyTopicRoadmapProps {
  state: PlannerState;
  globalCourseFilter?: 'all' | 'free' | 'paid';
  onUpdateTopicSpentMinutes: (date: string, slot: 'morning' | 'evening', spentMinutes: number) => void;
  onToggleTopicCompleted: (date: string, slot: 'morning' | 'evening', isCompleted: boolean) => void;
  onToggleSubtopic?: (date: string, slot: 'morning' | 'evening', subtopicTitle: string) => void;
  onSaveTopicLinks?: (date: string, slot: 'morning' | 'evening', links: TopicLinkReference[]) => void;
  onSelectDayForScheduler?: (date: string) => void;
  onLaunchDeepWorkForTopic?: (topic: ScheduledTopic) => void;
  onUpdateTopicNotes?: (date: string, slot: 'morning' | 'evening', notes: string) => void;
}

const MONTHS_NAV = [
  { label: 'All (Full Roadmap)', key: 'all' },
  { label: 'Oct 2026', key: '2026-10' },
  { label: 'Nov 2026', key: '2026-11' },
  { label: 'Dec 2026', key: '2026-12' },
  { label: 'Jan 2027', key: '2027-01' },
  { label: 'Feb 2027', key: '2027-02' },
  { label: 'Mar 2027', key: '2027-03' },
  { label: 'Apr 2027', key: '2027-04' },
  { label: 'May 2027', key: '2027-05' },
];

export const DailyTopicRoadmap: React.FC<DailyTopicRoadmapProps> = ({
  state,
  globalCourseFilter,
  onUpdateTopicSpentMinutes,
  onToggleTopicCompleted,
  onToggleSubtopic,
  onSaveTopicLinks,
  onSelectDayForScheduler,
  onLaunchDeepWorkForTopic,
  onUpdateTopicNotes,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedPaper, setSelectedPaper] = useState<string>('all');
  const [resourceTierFilter, setResourceTierFilter] = useState<'all' | 'free' | 'paid'>(globalCourseFilter || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  React.useEffect(() => {
    if (globalCourseFilter) {
      setResourceTierFilter(globalCourseFilter);
    }
  }, [globalCourseFilter]);
  const [activeLinkModal, setActiveLinkModal] = useState<{
    date: string;
    slot: 'morning' | 'evening';
    chapterTitle: string;
    links: TopicLinkReference[];
  } | null>(null);
  const [flashcardTopic, setFlashcardTopic] = useState<{ topic: ScheduledTopic; date: string } | null>(null);

  // Convert dailyPlans dictionary to sorted array by date
  const dayPlansList = useMemo(() => {
    const plans = Object.values(state.dailyPlans || {});
    return plans.sort((a, b) => a.date.localeCompare(b.date));
  }, [state.dailyPlans]);

  // Aggregate totals
  const totalAllocatedMinutes = useMemo(() => {
    return dayPlansList.reduce(
      (acc, d) => acc + d.morningTopic.allocatedMinutes + d.eveningTopic.allocatedMinutes,
      0
    );
  }, [dayPlansList]);

  const totalSpentMinutes = useMemo(() => {
    return dayPlansList.reduce(
      (acc, d) => acc + (d.morningTopic.spentMinutes || 0) + (d.eveningTopic.spentMinutes || 0),
      0
    );
  }, [dayPlansList]);

  const completedTopicsCount = useMemo(() => {
    return dayPlansList.reduce(
      (acc, d) => acc + (d.morningTopic.isCompleted ? 1 : 0) + (d.eveningTopic.isCompleted ? 1 : 0),
      0
    );
  }, [dayPlansList]);

  const totalTopicsCount = dayPlansList.length * 2;

  // Filter day plans
  const filteredPlans = useMemo(() => {
    return dayPlansList.filter((plan) => {
      if (selectedMonth !== 'all' && !plan.date.startsWith(selectedMonth)) return false;
      if (selectedPhase !== 'all' && !plan.phase.includes(selectedPhase)) return false;

      if (selectedPaper !== 'all') {
        const morningMatches = plan.morningTopic.paperCode.toLowerCase().includes(selectedPaper.toLowerCase()) || plan.morningTopic.paperShortName.toLowerCase().includes(selectedPaper.toLowerCase());
        const eveningMatches = plan.eveningTopic.paperCode.toLowerCase().includes(selectedPaper.toLowerCase()) || plan.eveningTopic.paperShortName.toLowerCase().includes(selectedPaper.toLowerCase());
        if (!morningMatches && !eveningMatches) return false;
      }

      if (statusFilter !== 'all' && plan.status !== statusFilter) return false;

      if (resourceTierFilter === 'free') {
        const morningHasFree = (plan.morningTopic.links || []).some((l) => (l.costType || 'free') === 'free');
        const eveningHasFree = (plan.eveningTopic.links || []).some((l) => (l.costType || 'free') === 'free');
        if (!morningHasFree && !eveningHasFree) return false;
      } else if (resourceTierFilter === 'paid') {
        const morningHasPaid = (plan.morningTopic.links || []).some((l) => l.costType === 'paid');
        const eveningHasPaid = (plan.eveningTopic.links || []).some((l) => l.costType === 'paid');
        if (!morningHasPaid && !eveningHasPaid) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSummary = plan.summaryTarget.toLowerCase().includes(query);
        const matchesMorning = 
          plan.morningTopic.chapterTitle.toLowerCase().includes(query) ||
          plan.morningTopic.subtopics.some((s) => s.toLowerCase().includes(query)) ||
          plan.morningTopic.resources.bareActOrStd.toLowerCase().includes(query);
        const matchesEvening = 
          plan.eveningTopic.chapterTitle.toLowerCase().includes(query) ||
          plan.eveningTopic.subtopics.some((s) => s.toLowerCase().includes(query)) ||
          plan.eveningTopic.resources.bareActOrStd.toLowerCase().includes(query);
        return matchesSummary || matchesMorning || matchesEvening;
      }

      return true;
    });
  }, [dayPlansList, selectedMonth, selectedPhase, selectedPaper, statusFilter, searchQuery, resourceTierFilter]);

  const handleToggle = (date: string, slot: 'morning' | 'evening', currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    onToggleTopicCompleted(date, slot, nextStatus);
    if (nextStatus) {
      playChime('milestone_unlocked');
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }
  };

  const adjustMinutes = (date: string, slot: 'morning' | 'evening', currentMins: number, delta: number) => {
    const newMins = Math.max(0, currentMins + delta);
    onUpdateTopicSpentMinutes(date, slot, newMins);
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

  const openAddLink = (date: string, slot: 'morning' | 'evening', chapterTitle: string, links: TopicLinkReference[] = []) => {
    setActiveLinkModal({
      date,
      slot,
      chapterTitle,
      links,
    });
  };

  const renderSegregatedLinks = (
    links: TopicLinkReference[] = [],
    date: string,
    slot: 'morning' | 'evening',
    chapterTitle: string,
    accentColor: 'amber' | 'blue',
    paperShortName: string = 'CA Inter',
    paperCode: string = 'Paper'
  ) => {
    const resolvedLinks = links && links.length > 0
      ? links
      : generateTopicResources(paperShortName, paperCode, chapterTitle);

    const freeLinks = resolvedLinks.filter((l) => (l.costType || 'free') === 'free');
    const paidLinks = resolvedLinks.filter((l) => l.costType === 'paid');

    const showFree = resourceTierFilter === 'all' || resourceTierFilter === 'free';
    const showPaid = resourceTierFilter === 'all' || resourceTierFilter === 'paid';

    return (
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-300">Topic Study Resources:</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold inline-flex items-center gap-1">
              <Gift className="w-2.5 h-2.5" /> {freeLinks.length} Free
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold inline-flex items-center gap-1">
              <ShoppingBag className="w-2.5 h-2.5" /> {paidLinks.length} Paid
            </span>
          </div>
          <button
            onClick={() => openAddLink(date, slot, chapterTitle, links)}
            className={`${
              accentColor === 'amber' ? 'text-amber-400 hover:text-amber-300' : 'text-blue-400 hover:text-blue-300'
            } text-[11px] flex items-center gap-1 cursor-pointer font-medium transition-colors`}
          >
            <Plus className="w-3 h-3" /> Add Link
          </button>
        </div>

        {/* Free Resources Section */}
        {showFree && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
              <Gift className="w-3 h-3 text-emerald-400" />
              <span>Free Resources (ICAI SM, Free YouTube, Bare Act)</span>
            </div>
            {freeLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {freeLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 text-[11px] text-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {renderLinkIcon(link.type)}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-emerald-100 group-hover:text-emerald-50">
                          {link.title}
                        </span>
                        {link.provider && (
                          <span className="text-[10px] text-slate-400 truncate">
                            {link.provider}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Free
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-300" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic pl-1">No free resources attached yet.</p>
            )}
          </div>
        )}

        {/* Paid Resources Section */}
        {showPaid && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 tracking-wider uppercase">
              <ShoppingBag className="w-3 h-3 text-amber-400" />
              <span>Paid Resources (Faculty Batches, Books, Test Series)</span>
            </div>
            {paidLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {paidLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-amber-950/20 hover:bg-amber-900/30 border border-amber-500/20 hover:border-amber-500/40 text-[11px] text-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {renderLinkIcon(link.type)}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-amber-100 group-hover:text-amber-50">
                          {link.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                          {link.provider && <span>{link.provider}</span>}
                          {link.provider && link.priceNote && <span>•</span>}
                          {link.priceNote && <span className="text-amber-300/90 font-mono">{link.priceNote}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Paid
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic pl-1">No paid faculty batch/book attached.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Day-by-Day Granular Roadmap Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">
                  Full Daily Practical Work Plan ({state.examSession === 'nov_2027' ? 'Nov 2027' : 'May 2027'})
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  state.attemptPortion === 'group1'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : state.attemptPortion === 'group2'
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {state.attemptPortion === 'group1'
                    ? (state.courseLevel === 'foundation' ? 'Module 1 Only' : 'Group 1 Only')
                    : state.attemptPortion === 'group2'
                    ? (state.courseLevel === 'foundation' ? 'Module 2 Only' : 'Group 2 Only')
                    : (state.courseLevel === 'foundation' ? 'Both Modules (4 Papers)' : 'Both Groups (6 Papers)')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {dayPlansList.length} Days Mapped
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Structured for <strong>realistic human memory retention</strong> with <strong>24h recall</strong>, <strong>Sunday Spaced Repetition Buffers</strong>, clickable YouTube/ICAI SM links, and 5-hour daily execution. All topics cycle exclusively through your selected attempt portion.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Topics Done</span>
              <span className="text-lg font-black font-mono text-emerald-400">
                {completedTopicsCount} <span className="text-xs text-slate-500">/ {totalTopicsCount}</span>
              </span>
            </div>
            <div className="h-7 w-[1px] bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Spent</span>
              <span className="text-lg font-black font-mono text-white">
                {(totalSpentMinutes / 60).toFixed(1)}h <span className="text-xs text-slate-500">/ {(totalAllocatedMinutes / 60).toFixed(0)}h</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Human Memory & Retention Protocol Banner */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Scientific Human Memory Retention Architecture
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Working professionals studying 5h/day cannot rely on a single reading. This plan integrates 4 retention loops:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] w-full md:w-auto">
          <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <strong className="text-amber-400 block">1. 24h Review</strong>
            <span>10m morning recall</span>
          </div>
          <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <strong className="text-emerald-400 block">2. Day 7 Spaced</strong>
            <span>Sunday buffer tests</span>
          </div>
          <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <strong className="text-blue-400 block">3. Month Mock</strong>
            <span>RTP speed drills</span>
          </div>
          <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <strong className="text-purple-400 block">4. 1.5-Day Polish</strong>
            <span>Exam marathon sheet</span>
          </div>
        </div>
      </div>

      {/* Month-by-Month Calendar Navigator Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MONTHS_NAV.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelectedMonth(m.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedMonth === m.key
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search specific section (Sec 96, AS 10, EOQ, SA 200, HRA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Phase Filter */}
          <div>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Study Phases</option>
              <option value="Foundation">Phase 1: Foundation & ICAI SM (Oct - Jan)</option>
              <option value="R1">Phase 2: R1 & RTPs/PYQ (Feb - Mar)</option>
              <option value="R2">Phase 3: R2 & Mock Tests (April)</option>
              <option value="Marathon">Phase 4: 1.5-Day Marathon (May)</option>
            </select>
          </div>

          {/* Paper Filter */}
          <div>
            <select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">
                {state.courseLevel === 'foundation' ? 'All 4 Papers' : 'All 6 Papers'}
              </option>
              {state.courseLevel === 'foundation' ? (
                <>
                  <option value="Accounting">Paper 1: Accounting</option>
                  <option value="Law">Paper 2: Business Laws</option>
                  <option value="QA">Paper 3: Quantitative Aptitude</option>
                  <option value="Economics">Paper 4: Business Economics</option>
                </>
              ) : state.courseLevel === 'final' ? (
                <>
                  <option value="FR">Paper 1: Financial Reporting</option>
                  <option value="AFM">Paper 2: Adv Financial Mgmt</option>
                  <option value="Audit">Paper 3: Adv Auditing & Ethics</option>
                  <option value="Direct Tax">Paper 4: Direct Tax & Int Tax</option>
                  <option value="IDT">Paper 5: Indirect Tax (GST)</option>
                  <option value="IBS">Paper 6: Integrated Business</option>
                </>
              ) : (
                <>
                  <option value="Adv Accounts">Paper 1: Advanced Accounting</option>
                  <option value="Law">Paper 2: Corporate & Other Laws</option>
                  <option value="Taxation">Paper 3: Taxation (DT & GST)</option>
                  <option value="Costing">Paper 4: Cost & Management Acc</option>
                  <option value="Audit">Paper 5: Auditing & Ethics</option>
                  <option value="FM">Paper 6: FM & SM</option>
                </>
              )}
            </select>
          </div>

          {/* Resource Tier Filter */}
          <div>
            <select
              value={resourceTierFilter}
              onChange={(e) => setResourceTierFilter(e.target.value as 'all' | 'free' | 'paid')}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-medium"
            >
              <option value="all">Resources: All (Free + Paid)</option>
              <option value="free">🟢 Free Resources Only</option>
              <option value="paid">💎 Paid Resources Only</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs flex-wrap gap-2">
          <span className="text-slate-400">
            Showing <strong className="text-white">{filteredPlans.length}</strong> planned study days ({filteredPlans.length * 2} sessions)
          </span>

          <div className="flex items-center gap-1.5">
            {(['all', 'in_progress', 'completed', 'upcoming'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                {st === 'all' ? 'All Days' : st === 'in_progress' ? 'Today / Active' : st === 'completed' ? 'Completed' : 'Upcoming'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Day by Day Plan Cards */}
      <div className="space-y-6">
        {filteredPlans.map((plan) => {
          const morningMinsAllocated = plan.morningTopic.allocatedMinutes;
          const morningMinsSpent = plan.morningTopic.spentMinutes || 0;
          const eveningMinsAllocated = plan.eveningTopic.allocatedMinutes;
          const eveningMinsSpent = plan.eveningTopic.spentMinutes || 0;
          const dayTotalSpentHours = Number(((morningMinsSpent + eveningMinsSpent) / 60).toFixed(1));
          const dayTotalAllocatedHours = Number(((morningMinsAllocated + eveningMinsAllocated) / 60).toFixed(1));

          return (
            <div
              key={plan.date}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all shadow-md ${
                plan.status === 'completed'
                  ? 'border-emerald-500/30'
                  : plan.status === 'in_progress'
                  ? 'border-indigo-500/60 ring-1 ring-indigo-500/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Day Header Bar */}
              <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-black text-xs font-mono flex items-center justify-center">
                      D{plan.dayNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white font-mono">{plan.date}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400">Week {plan.weekNumber}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] font-semibold text-indigo-400">{plan.phase}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{plan.summaryTarget}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Day Progress</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {dayTotalSpentHours}h / {dayTotalAllocatedHours}h Spent
                    </span>
                  </div>

                  {onSelectDayForScheduler && (
                    <button
                      onClick={() => onSelectDayForScheduler(plan.date)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                      title="Open this day in the Daily Scheduler"
                    >
                      <span>Load in Scheduler</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Day Body: Morning Slot & Evening Slot Cards */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 1. Morning Slot (Theory / Law Focus) */}
                <div className="bg-slate-950/70 border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Sun className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Morning Theory Slot ({morningMinsAllocated / 60}h)
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {plan.morningTopic.paperCode}: {plan.morningTopic.paperShortName}
                      </span>
                    </div>

                    {/* Chapter Title */}
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {plan.morningTopic.chapterTitle}
                      </h4>
                    </div>

                    {/* Specific Topics to Cover with 1-click launch links */}
                    <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                          🎯 Specific Topics to Cover Today:
                        </span>
                        <span className="text-[9px] text-slate-400">1-click launch</span>
                      </div>
                      <ul className="space-y-1.5">
                        {plan.morningTopic.subtopics.map((st, i) => {
                          const isDone = (plan.morningTopic.completedSubtopics || []).includes(st);
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
                                <span className={`font-medium truncate transition-colors ${
                                  isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-200 group-hover:text-white'
                                }`}>
                                  {st}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <a
                                  href={getSubtopicRedirectUrl(plan.morningTopic.paperShortName, st, 'youtube')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-semibold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                  title={`Watch YouTube lecture for "${st}"`}
                                >
                                  <Youtube className="w-2.5 h-2.5 text-red-400" />
                                  <span>Video</span>
                                </a>
                                <a
                                  href={getSubtopicRedirectUrl(plan.morningTopic.paperShortName, st, 'icai_sm')}
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

                    {/* Resources */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/70 space-y-1.5 text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        📚 Required ICAI Study Resources:
                      </span>
                      <div className="text-slate-300">
                        <strong className="text-slate-400 font-medium">Module & Pages:</strong>{' '}
                        <span className="text-indigo-300">{plan.morningTopic.resources.icaiSmModule}</span> ({plan.morningTopic.resources.pageRange})
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-400 font-medium">Illustrations:</strong>{' '}
                        <span className="text-emerald-300 font-mono font-medium">{plan.morningTopic.resources.illustrations}</span>
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-400 font-medium">RTP / PYQ Ref:</strong>{' '}
                        <span className="text-cyan-300">{plan.morningTopic.resources.rtpPyqRef}</span>
                      </div>
                    </div>

                    {/* Memory Retention Cue */}
                    {plan.morningTopic.memoryTechnique && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                        <BrainCircuit className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span><strong>Memory Protocol:</strong> {plan.morningTopic.memoryTechnique}</span>
                      </div>
                    )}

                    {/* Study Framework Badge & Steps */}
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-indigo-300 font-semibold text-[11px]">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> Framework: {plan.morningTopic.framework.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        {plan.morningTopic.framework.proTip}
                      </p>
                    </div>

                    {/* Clickable Attached Links Segregated by Free and Paid */}
                    {renderSegregatedLinks(
                      plan.morningTopic.links,
                      plan.date,
                      'morning',
                      plan.morningTopic.chapterTitle,
                      'amber',
                      plan.morningTopic.paperShortName,
                      plan.morningTopic.paperCode
                    )}
                  </div>

                  {/* Time Spent Controls & Checkbox */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Time Spent:</span>
                      <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
                        <button
                          onClick={() => adjustMinutes(plan.date, 'morning', morningMinsSpent, -15)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          -15m
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-amber-400">
                          {morningMinsSpent}m / {morningMinsAllocated}m
                        </span>
                        <button
                          onClick={() => adjustMinutes(plan.date, 'morning', morningMinsSpent, 15)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          +15m
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <button
                        onClick={() => setFlashcardTopic({ topic: plan.morningTopic, date: plan.date })}
                        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:to-indigo-500/25 text-purple-300 border border-purple-500/35 hover:border-purple-400/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                        title="AI generate 5-10 quick-fire revision flashcards for this topic"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>AI Flashcards</span>
                      </button>

                      {onLaunchDeepWorkForTopic && (
                        <button
                          onClick={() => onLaunchDeepWorkForTopic(plan.morningTopic)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                          title="Launch Deep Work locked session for this topic"
                        >
                          <Zap className="w-3 h-3" /> Focus
                        </button>
                      )}

                      <button
                        onClick={() => handleToggle(plan.date, 'morning', plan.morningTopic.isCompleted)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          plan.morningTopic.isCompleted
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{plan.morningTopic.isCompleted ? 'Completed' : 'Mark Done'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Evening Slot (Practical / Numerical Focus) */}
                <div className="bg-slate-950/70 border border-blue-500/20 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Moon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Evening Practical Slot ({eveningMinsAllocated / 60}h)
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {plan.eveningTopic.paperCode}: {plan.eveningTopic.paperShortName}
                      </span>
                    </div>

                    {/* Chapter Title */}
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {plan.eveningTopic.chapterTitle}
                      </h4>
                    </div>

                    {/* Specific Topics to Cover with 1-click launch links */}
                    <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
                          🎯 Specific Topics to Cover Today:
                        </span>
                        <span className="text-[9px] text-slate-400">1-click launch</span>
                      </div>
                      <ul className="space-y-1.5">
                        {plan.eveningTopic.subtopics.map((st, i) => {
                          const isDone = (plan.eveningTopic.completedSubtopics || []).includes(st);
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
                                <span className={`font-medium truncate transition-colors ${
                                  isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-200 group-hover:text-white'
                                }`}>
                                  {st}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <a
                                  href={getSubtopicRedirectUrl(plan.eveningTopic.paperShortName, st, 'youtube')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-semibold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                  title={`Watch YouTube lecture for "${st}"`}
                                >
                                  <Youtube className="w-2.5 h-2.5 text-red-400" />
                                  <span>Video</span>
                                </a>
                                <a
                                  href={getSubtopicRedirectUrl(plan.eveningTopic.paperShortName, st, 'icai_sm')}
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

                    {/* Resources */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/70 space-y-1.5 text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        📚 Required ICAI Study Resources:
                      </span>
                      <div className="text-slate-300">
                        <strong className="text-slate-400 font-medium">Module & Pages:</strong>{' '}
                        <span className="text-indigo-300">{plan.eveningTopic.resources.icaiSmModule}</span> ({plan.eveningTopic.resources.pageRange})
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-400 font-medium">Illustrations:</strong>{' '}
                        <span className="text-emerald-300 font-mono font-medium">{plan.eveningTopic.resources.illustrations}</span>
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-400 font-medium">RTP / PYQ Ref:</strong>{' '}
                        <span className="text-cyan-300">{plan.eveningTopic.resources.rtpPyqRef}</span>
                      </div>
                    </div>

                    {/* Memory Retention Cue */}
                    {plan.eveningTopic.memoryTechnique && (
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-300 bg-blue-500/10 px-2.5 py-1.5 rounded-lg border border-blue-500/20">
                        <BrainCircuit className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span><strong>Memory Protocol:</strong> {plan.eveningTopic.memoryTechnique}</span>
                      </div>
                    )}

                    {/* Study Framework Badge & Steps */}
                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-indigo-300 font-semibold text-[11px]">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-400" /> Framework: {plan.eveningTopic.framework.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        {plan.eveningTopic.framework.proTip}
                      </p>
                    </div>

                    {/* Clickable Attached Links Segregated by Free and Paid */}
                    {renderSegregatedLinks(
                      plan.eveningTopic.links,
                      plan.date,
                      'evening',
                      plan.eveningTopic.chapterTitle,
                      'blue',
                      plan.eveningTopic.paperShortName,
                      plan.eveningTopic.paperCode
                    )}
                  </div>

                  {/* Time Spent Controls & Checkbox */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Time Spent:</span>
                      <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
                        <button
                          onClick={() => adjustMinutes(plan.date, 'evening', eveningMinsSpent, -15)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          -15m
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-blue-400">
                          {eveningMinsSpent}m / {eveningMinsAllocated}m
                        </span>
                        <button
                          onClick={() => adjustMinutes(plan.date, 'evening', eveningMinsSpent, 15)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          +15m
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <button
                        onClick={() => setFlashcardTopic({ topic: plan.eveningTopic, date: plan.date })}
                        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:to-indigo-500/25 text-purple-300 border border-purple-500/35 hover:border-purple-400/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                        title="AI generate 5-10 quick-fire revision flashcards for this topic"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>AI Flashcards</span>
                      </button>

                      {onLaunchDeepWorkForTopic && (
                        <button
                          onClick={() => onLaunchDeepWorkForTopic(plan.eveningTopic)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                          title="Launch Deep Work locked session for this topic"
                        >
                          <Zap className="w-3 h-3" /> Focus
                        </button>
                      )}

                      <button
                        onClick={() => handleToggle(plan.date, 'evening', plan.eveningTopic.isCompleted)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          plan.eveningTopic.isCompleted
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{plan.eveningTopic.isCompleted ? 'Completed' : 'Mark Done'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Links Modal */}
      {activeLinkModal && (
        <AddTopicLinkModal
          isOpen={Boolean(activeLinkModal)}
          onClose={() => setActiveLinkModal(null)}
          dateStr={activeLinkModal.date}
          slot={activeLinkModal.slot}
          chapterTitle={activeLinkModal.chapterTitle}
          currentLinks={activeLinkModal.links}
          onSaveLinks={(updated) => {
            onSaveTopicLinks?.(activeLinkModal.date, activeLinkModal.slot, updated);
          }}
        />
      )}

      {/* AI Quick-Fire Revision Flashcards Modal */}
      {flashcardTopic && (
        <AIFlashcardsModal
          isOpen={Boolean(flashcardTopic)}
          onClose={() => setFlashcardTopic(null)}
          topic={flashcardTopic.topic}
          dateStr={flashcardTopic.date}
        />
      )}
    </div>
  );
};
