import React, { useState, useMemo } from 'react';
import { Chapter, ChapterCategory, Paper, PaperGroup, PlannerState } from '../types/ca-study';
import { ICAI_PAPERS } from '../data/icaiSyllabus';
import { CA_FINAL_PAPERS } from '../data/icaiFinalSyllabus';
import { CA_FOUNDATION_PAPERS } from '../data/icaiFoundationSyllabus';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Check, 
  FileText, 
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ExternalLink,
  Youtube,
  ShoppingBag,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/audio';

interface SyllabusTrackerProps {
  state: PlannerState;
  onUpdateChapterMilestone: (chapterId: string, milestoneKey: keyof Chapter['milestones'], value: any) => void;
  onUpdateChapterNotes?: (chapterId: string, notes: string) => void;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  state,
  onUpdateChapterMilestone,
  onUpdateChapterNotes,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<PaperGroup | 'all'>('all');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<ChapterCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);

  const chapters = useMemo(() => Object.values(state.chapters), [state.chapters]);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return chapters.filter((ch) => {
      if (selectedGroup !== 'all' && ch.group !== selectedGroup) return false;
      if (selectedPaperId !== 'all' && ch.paperId !== selectedPaperId) return false;
      if (categoryFilter !== 'all' && ch.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ch.title.toLowerCase().includes(query);
        const matchesPaper = ch.paperId.toLowerCase().includes(query);
        const matchesNotes = ch.milestones.notes?.toLowerCase().includes(query);
        return matchesTitle || matchesPaper || matchesNotes;
      }
      return true;
    });
  }, [chapters, selectedGroup, selectedPaperId, categoryFilter, searchQuery]);

  // Calculate paper-wise progress
  const getPaperProgress = (paperId: string) => {
    const paperChapters = chapters.filter((c) => c.paperId === paperId);
    if (!paperChapters.length) return 0;
    // Each chapter has 4 milestones: lecture (25%), sm (35%), rtp (25%), rev2x (15%)
    const totalPoints = paperChapters.length * 100;
    const earnedPoints = paperChapters.reduce((sum, ch) => {
      let pts = 0;
      if (ch.milestones.lectureDone) pts += 25;
      if (ch.milestones.icaiSmDone) pts += 35;
      if (ch.milestones.rtpPyqDone) pts += 25;
      if (ch.milestones.revised2x) pts += 15;
      return sum + pts;
    }, 0);
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  // Group progress
  const g1Chapters = chapters.filter((c) => c.group === 1);
  const g2Chapters = chapters.filter((c) => c.group === 2);

  const getGroupCompletionPct = (groupChapters: Chapter[]) => {
    if (!groupChapters.length) return 0;
    const completedLectures = groupChapters.filter((c) => c.milestones.lectureDone && c.milestones.icaiSmDone).length;
    return Math.round((completedLectures / groupChapters.length) * 100);
  };

  const handleMilestoneToggle = (chapterId: string, key: keyof Chapter['milestones'], currValue: any) => {
    const newValue = !currValue;
    onUpdateChapterMilestone(chapterId, key, newValue);

    // If marking revised2x or icaiSmDone, celebrate!
    if (newValue && (key === 'revised2x' || key === 'icaiSmDone')) {
      playChime('milestone_unlocked');
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    }
  };

  const incrementRevision = (chapter: Chapter) => {
    const current = chapter.milestones.revisionCount || 0;
    const nextCount = (current + 1) % 4; // cycles 0 -> 1 -> 2 -> 3 -> 0
    onUpdateChapterMilestone(chapter.id, 'revisionCount', nextCount);
    onUpdateChapterMilestone(chapter.id, 'revised2x', nextCount >= 2);
    if (nextCount >= 2) {
      playChime('milestone_unlocked');
    }
  };

  const activePapers = useMemo(() => {
    if (state.courseLevel === 'foundation') return CA_FOUNDATION_PAPERS;
    if (state.courseLevel === 'final') return CA_FINAL_PAPERS;
    return ICAI_PAPERS;
  }, [state.courseLevel]);

  const courseTitle =
    state.courseLevel === 'foundation'
      ? 'CA Foundation'
      : state.courseLevel === 'final'
      ? 'CA Final'
      : 'CA Inter';

  const g1Subtitle =
    state.courseLevel === 'foundation'
      ? 'P1: Accounting & P2: Business Laws'
      : state.courseLevel === 'final'
      ? 'FR (Ind AS), AFM, Adv Audit & Ethics'
      : 'Adv Accounting, Law, Tax';

  const g2Subtitle =
    state.courseLevel === 'foundation'
      ? 'P3: Quantitative Aptitude & P4: Economics'
      : state.courseLevel === 'final'
      ? 'Direct Tax, IDT (GST/Customs), IBS'
      : 'Costing, Audit, FM/SM';

  const g1Label = state.courseLevel === 'foundation' ? 'Module 1 (P1, P2)' : 'Group 1 (P1, P2, P3)';
  const g2Label = state.courseLevel === 'foundation' ? 'Module 2 (P3, P4)' : 'Group 2 (P4, P5, P6)';

  const isGroup1Active = state.attemptPortion === 'both' || state.attemptPortion === 'group1';
  const isGroup2Active = state.attemptPortion === 'both' || state.attemptPortion === 'group2';

  const overallReadinessPct =
    state.attemptPortion === 'group1'
      ? getGroupCompletionPct(g1Chapters)
      : state.attemptPortion === 'group2'
      ? getGroupCompletionPct(g2Chapters)
      : Math.round((getGroupCompletionPct(g1Chapters) + getGroupCompletionPct(g2Chapters)) / 2);

  const overallLabel =
    state.attemptPortion === 'group1'
      ? (state.courseLevel === 'foundation' ? 'Module 1 Target Readiness' : 'Group 1 Target Readiness')
      : state.attemptPortion === 'group2'
      ? (state.courseLevel === 'foundation' ? 'Module 2 Target Readiness' : 'Group 2 Target Readiness')
      : (state.courseLevel === 'foundation' ? 'All 4 Papers Overall' : 'Both Groups Overall');

  const activePapersCount =
    state.attemptPortion === 'group1' || state.attemptPortion === 'group2'
      ? (state.courseLevel === 'foundation' ? 2 : 3)
      : activePapers.length;

  return (
    <div className="space-y-6">
      {/* Group Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">{overallLabel}</span>
              {state.attemptPortion !== 'both' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Targeted
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-white">
                {overallReadinessPct}%
              </span>
              <span className="text-xs text-slate-400">Readiness</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {courseTitle} • {activePapersCount} Active Papers • {state.attemptPortion === 'both' ? 'Both Groups' : state.attemptPortion === 'group1' ? 'Group 1' : 'Group 2'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            {state.courseLevel === 'foundation' ? <Compass className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
          </div>
        </div>

        {/* Group 1 Progress */}
        <div
          onClick={() => {
            setSelectedGroup(1);
            setSelectedPaperId('all');
          }}
          className={`rounded-2xl p-4 border transition-all cursor-pointer ${
            selectedGroup === 1 ? 'bg-slate-900 border-indigo-500/50 ring-1 ring-indigo-500/30' : 'bg-slate-900/70 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-indigo-400">{g1Label}</span>
              {!isGroup1Active && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-500 border border-slate-700">
                  Not in Attempt
                </span>
              )}
            </div>
            <span className="text-xs font-mono font-bold text-white">{getGroupCompletionPct(g1Chapters)}%</span>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-1 truncate" title={g1Subtitle}>{g1Subtitle}</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isGroup1Active
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                  : 'bg-slate-600 opacity-60'
              }`}
              style={{ width: `${getGroupCompletionPct(g1Chapters)}%` }}
            />
          </div>
        </div>

        {/* Group 2 Progress */}
        <div
          onClick={() => {
            setSelectedGroup(2);
            setSelectedPaperId('all');
          }}
          className={`rounded-2xl p-4 border transition-all cursor-pointer ${
            selectedGroup === 2 ? 'bg-slate-900 border-indigo-500/50 ring-1 ring-indigo-500/30' : 'bg-slate-900/70 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-indigo-400">{g2Label}</span>
              {!isGroup2Active && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-500 border border-slate-700">
                  Not in Attempt
                </span>
              )}
            </div>
            <span className="text-xs font-mono font-bold text-white">{getGroupCompletionPct(g2Chapters)}%</span>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-1 truncate" title={g2Subtitle}>{g2Subtitle}</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isGroup2Active
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : 'bg-slate-600 opacity-60'
              }`}
              style={{ width: `${getGroupCompletionPct(g2Chapters)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Paper Tabs Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Paper Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedGroup('all');
              setSelectedPaperId('all');
            }}
            data-selection-button="paper-pill"
            data-selected={selectedPaperId === 'all' && selectedGroup === 'all'}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedPaperId === 'all' && selectedGroup === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 is-selected'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All {activePapers.length} Papers
          </button>

          {activePapers.map((paper) => {
            const isSelected = selectedPaperId === paper.id;
            const progress = getPaperProgress(paper.id);
            return (
              <button
                key={paper.id}
                onClick={() => {
                  setSelectedPaperId(paper.id);
                  setSelectedGroup(paper.group);
                }}
                data-selection-button="paper-pill"
                data-selected={isSelected}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 is-selected'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{paper.code}: {paper.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {progress}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & ABC Analysis Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chapters, AS, SAs, Sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Filter className="w-3.5 h-3.5" /> ABC Weightage:
            </span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['all', 'A', 'B', 'C'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  data-selection-button="abc-filter"
                  data-selected={categoryFilter === cat}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white is-selected'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : `Cat ${cat}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Grid / Table View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <span>Showing {filteredChapters.length} Chapters</span>
          <span className="hidden sm:inline">
            Legend: [Lecture] 25% • [ICAI SM] 35% • [RTP/PYQ] 25% • [Revised 2x] 15%
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredChapters.map((ch) => {
            const paper = activePapers.find((p) => p.id === ch.paperId);
            const isAllDone = ch.milestones.lectureDone && ch.milestones.icaiSmDone && ch.milestones.rtpPyqDone && ch.milestones.revised2x;

            return (
              <div
                key={ch.id}
                className={`bg-slate-900/90 border rounded-2xl p-4 transition-all duration-200 hover:border-slate-700 ${
                  isAllDone
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left: Chapter details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {paper?.shortName}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ch.category === 'A'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : ch.category === 'B'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Category {ch.category} (High Yield)
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          ch.type === 'theory'
                            ? 'bg-amber-500/10 text-amber-300'
                            : ch.type === 'practical'
                            ? 'bg-blue-500/10 text-blue-300'
                            : 'bg-purple-500/10 text-purple-300'
                        }`}
                      >
                        {ch.type === 'theory' ? 'Morning Theory' : ch.type === 'practical' ? 'Evening Practical' : 'Hybrid'}
                      </span>
                      {ch.weightageEstimate && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {ch.weightageEstimate}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {ch.estimatedHours}h
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                      {ch.title}
                    </h4>

                    {/* 1-Click Topic Resources (Free & Paid) */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Resources:</span>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('ICAI BoS ' + courseTitle + ' ' + (paper?.shortName || courseTitle) + ' ' + ch.title + ' Study Material PDF')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 transition-colors"
                        title={`Free Official ICAI Study Material for "${ch.title}"`}
                      >
                        <BookOpen className="w-2.5 h-2.5" />
                        <span>Free ICAI SM</span>
                        <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
                      </a>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(courseTitle + ' ' + (paper?.shortName || courseTitle) + ' ' + ch.title + ' marathon revision lecture')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 transition-colors"
                        title={`Free YouTube Lecture for "${ch.title}"`}
                      >
                        <Youtube className="w-2.5 h-2.5" />
                        <span>Free Video</span>
                        <ExternalLink className="w-2.5 h-2.5 text-red-400" />
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent('Taxmann Scanner ' + courseTitle + ' ' + (paper?.shortName || courseTitle) + ' ' + ch.title + ' Cracker')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 transition-colors"
                        title={`Paid Exam Scanner for "${ch.title}"`}
                      >
                        <ShoppingBag className="w-2.5 h-2.5" />
                        <span>Paid Scanner</span>
                        <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                      </a>
                    </div>

                    {ch.milestones.notes && (
                      <p className="text-xs text-indigo-300/90 italic bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 inline-block">
                        📝 {ch.milestones.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: The 4 Core Checkboxes */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {/* 1. Lecture Done */}
                    <button
                      type="button"
                      onClick={() => handleMilestoneToggle(ch.id, 'lectureDone', ch.milestones.lectureDone)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        ch.milestones.lectureDone
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                      title="Lecture / First reading completed"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          ch.milestones.lectureDone
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'border-slate-600 bg-transparent'
                        }`}
                      >
                        {ch.milestones.lectureDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>Lecture</span>
                    </button>

                    {/* 2. ICAI SM Solved */}
                    <button
                      type="button"
                      onClick={() => handleMilestoneToggle(ch.id, 'icaiSmDone', ch.milestones.icaiSmDone)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        ch.milestones.icaiSmDone
                          ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                      title="All ICAI Study Material Illustrations & Back Questions Solved"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          ch.milestones.icaiSmDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-600 bg-transparent'
                        }`}
                      >
                        {ch.milestones.icaiSmDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>ICAI SM</span>
                    </button>

                    {/* 3. RTP/PYQ Done */}
                    <button
                      type="button"
                      onClick={() => handleMilestoneToggle(ch.id, 'rtpPyqDone', ch.milestones.rtpPyqDone)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        ch.milestones.rtpPyqDone
                          ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                      title="Revision Test Papers & Past 5 Exam Questions Done"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          ch.milestones.rtpPyqDone
                            ? 'bg-cyan-500 border-cyan-500 text-white'
                            : 'border-slate-600 bg-transparent'
                        }`}
                      >
                        {ch.milestones.rtpPyqDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>RTP / PYQ</span>
                    </button>

                    {/* 4. Revised 2x (with interactive multi-revision counter) */}
                    <button
                      type="button"
                      onClick={() => incrementRevision(ch)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        ch.milestones.revised2x
                          ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                      title="Click to cycle revision count: 0x -> 1x -> 2x -> 3x"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          ch.milestones.revised2x
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'border-slate-600 bg-transparent'
                        }`}
                      >
                        {ch.milestones.revised2x && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>Revised {ch.milestones.revisionCount || 0}x</span>
                    </button>

                    {/* Notes Trigger */}
                    <button
                      type="button"
                      onClick={() => setEditingNotesId(editingNotesId === ch.id ? null : ch.id)}
                      className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                      title="Add Chapter Note"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Notes Editor */}
                {editingNotesId === ch.id && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={ch.milestones.notes || ''}
                      placeholder="Add key formulas, tricky questions, or Section numbers..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateChapterNotes?.(ch.id, (e.target as HTMLInputElement).value);
                          setEditingNotesId(null);
                        }
                      }}
                      onBlur={(e) => {
                        onUpdateChapterNotes?.(ch.id, e.target.value);
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={() => setEditingNotesId(null)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
