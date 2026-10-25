import React, { useState } from 'react';
import { AttemptPortion, ExamSession, CourseLevel } from '../types/ca-study';
import { X, Layers, Calendar, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Clock, Target, Sparkles, ShieldCheck } from 'lucide-react';

interface AttemptSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseLevel: CourseLevel;
  currentPortion: AttemptPortion;
  currentSession: ExamSession;
  onConfirm: (portion: AttemptPortion, session: ExamSession) => void;
}

export const AttemptSelectionModal: React.FC<AttemptSelectionModalProps> = ({
  isOpen,
  onClose,
  courseLevel,
  currentPortion,
  currentSession,
  onConfirm,
}) => {
  const [selectedPortion, setSelectedPortion] = useState<AttemptPortion>(currentPortion);
  const [selectedSession, setSelectedSession] = useState<ExamSession>(currentSession);

  if (!isOpen) return null;

  const isFoundation = courseLevel === 'foundation';
  const isFinal = courseLevel === 'final';

  const levelName = isFoundation
    ? 'CA Foundation'
    : isFinal
    ? 'CA Final'
    : 'CA Intermediate';

  // Paper breakdowns
  const group1Papers = isFoundation
    ? [
        { code: 'Paper 1', name: 'Accounting', type: 'Practical • 100M' },
        { code: 'Paper 2', name: 'Business Laws', type: 'Subjective Legal • 100M' },
      ]
    : isFinal
    ? [
        { code: 'Paper 1', name: 'Financial Reporting (Ind AS)', type: 'Comprehensive Practical • 100M' },
        { code: 'Paper 2', name: 'Advanced Financial Management (AFM)', type: 'Quantitative Valuation • 100M' },
        { code: 'Paper 3', name: 'Advanced Auditing & Professional Ethics', type: 'Standards & Statutory • 100M' },
      ]
    : [
        { code: 'Paper 1', name: 'Advanced Accounting', type: 'Comprehensive Practical • 100M' },
        { code: 'Paper 2', name: 'Corporate & Other Laws', type: 'Subjective Legal • 100M' },
        { code: 'Paper 3', name: 'Taxation (DT + GST)', type: 'Dual Practical & Law • 100M' },
      ];

  const group2Papers = isFoundation
    ? [
        { code: 'Paper 3', name: 'Quantitative Aptitude (Maths/LR/Stats)', type: 'MCQ Computational • 100M' },
        { code: 'Paper 4', name: 'Business Economics', type: 'MCQ Analytical • 100M' },
      ]
    : isFinal
    ? [
        { code: 'Paper 4', name: 'Direct Tax Laws & International Taxation', type: 'Statutory Practical • 100M' },
        { code: 'Paper 5', name: 'Indirect Tax Laws (GST & Customs)', type: 'Statutory Case Laws • 100M' },
        { code: 'Paper 6', name: 'Integrated Business Solutions (IBS)', type: 'Multi-disciplinary Case Study • 100M' },
      ]
    : [
        { code: 'Paper 4', name: 'Cost and Management Accounting', type: 'Computational Decision Making • 100M' },
        { code: 'Paper 5', name: 'Auditing and Ethics', type: 'Standards & Statutory • 100M' },
        { code: 'Paper 6', name: 'Financial Management & Strategic Management', type: 'Numerical & Analytical • 100M' },
      ];

  const handleApply = () => {
    onConfirm(selectedPortion, selectedSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 divide-y divide-slate-800">
        {/* Top Header */}
        <div className="pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Layers className="w-3.5 h-3.5" />
                Attempt & Portion Configurator
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                {levelName}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Select Your Target Attempt & Syllabus Portion
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Switching your attempt automatically tailors the <strong className="text-slate-200">5-Hour Daily Protocol</strong> (Morning Theory + Evening Practical), <strong className="text-slate-200">Overall Exam Readiness</strong> metrics, and <strong className="text-slate-200">Backlog Capacity Balancer</strong> to your exact target portion.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Exam Session Selection */}
        <div className="py-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              1. Choose Target Exam Session
            </h3>
            <span className="text-xs text-slate-400">ICAI 2027 Examination Timetable</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'may_2027' as ExamSession, label: 'May 2027', desc: 'Primary Spring Cycle', targetDate: 'May 1, 2027' },
              { id: 'nov_2027' as ExamSession, label: 'Nov 2027', desc: 'Autumn Cycle', targetDate: 'Nov 1, 2027' },
              ...(isFoundation
                ? [
                    { id: 'jan_2027' as ExamSession, label: 'Jan 2027', desc: 'Winter Session', targetDate: 'Jan 15, 2027' },
                    { id: 'sept_2027' as ExamSession, label: 'Sept 2027', desc: 'Monsoon Session', targetDate: 'Sept 15, 2027' },
                  ]
                : []),
            ].map((sess) => {
              const isSelected = selectedSession === sess.id;
              return (
                <button
                  key={sess.id}
                  data-selection-button="session"
                  data-selected={isSelected}
                  onClick={() => setSelectedSession(sess.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/30 is-selected'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                      {sess.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="text-xs text-slate-400">{sess.desc}</div>
                  <div className="text-[11px] text-amber-400/80 font-mono mt-1.5">{sess.targetDate}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Attempt Portion Selection (Both vs Single Group) */}
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              2. Choose Your Attempt Portion
            </h3>
            <span className="text-xs text-amber-400 font-medium">Daily Schedule Adapts Instantly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Both Groups */}
            <div
              onClick={() => setSelectedPortion('both')}
              data-selection-card="portion"
              data-selected={selectedPortion === 'both'}
              className={`p-5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedPortion === 'both'
                  ? 'bg-amber-950/20 border-amber-500/70 ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/40 is-selected'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Comprehensive
                  </span>
                  {selectedPortion === 'both' ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600" />
                  )}
                </div>

                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {isFoundation ? 'Both Modules (All 4 Papers)' : 'Both Groups (All 6 Papers)'}
                </h4>

                <p className="text-xs text-slate-400 mb-4">
                  Full qualification attempt. Interleaves theoretical and practical papers across both groups every single week.
                </p>

                {/* Specs */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Syllabus Volume:
                    </span>
                    <span className="font-semibold text-white">{isFoundation ? '~350h' : '~700h'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-amber-400" /> Target Daily Study:
                    </span>
                    <span className="font-semibold text-emerald-400">5.0h Protocol</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Set-off Benefit:
                    </span>
                    <span className="font-semibold text-amber-300">Enabled (Group 1 + 2)</span>
                  </div>
                </div>

                {/* Papers Included */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Papers Included:
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-3">
                    {group1Papers.map((p) => p.name).join(', ')}, {group2Papers.map((p) => p.name).join(', ')}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400/90 font-medium">
                Best for Rank Aspirants & Full Pass
              </div>
            </div>

            {/* Card 2: Group 1 Only */}
            <div
              onClick={() => setSelectedPortion('group1')}
              data-selection-card="portion"
              data-selected={selectedPortion === 'group1'}
              className={`p-5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedPortion === 'group1'
                  ? 'bg-emerald-950/20 border-emerald-500/70 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/40 is-selected'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    High-Focus
                  </span>
                  {selectedPortion === 'group1' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600" />
                  )}
                </div>

                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {isFoundation ? 'Module 1 Only' : 'Group 1 Only'}
                </h4>

                <p className="text-xs text-slate-400 mb-4">
                  100% focus on {isFoundation ? 'Module 1 (Accounting + Law)' : 'Group 1 (Accounts, Law & Tax)'}. Drops out-of-portion topics from daily plan.
                </p>

                {/* Specs */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> Syllabus Volume:
                    </span>
                    <span className="font-semibold text-emerald-300">{isFoundation ? '~175h (50%)' : '~350h (50%)'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-emerald-400" /> Daily Load:
                    </span>
                    <span className="font-semibold text-emerald-400">Deep Focus (3.5-5h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Minimum Target:
                    </span>
                    <span className="font-semibold text-emerald-300">{isFoundation ? '100 / 200 Marks' : '150 / 300 Marks'}</span>
                  </div>
                </div>

                {/* Papers Included */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isFoundation ? 'Module 1 Papers (2):' : 'Group 1 Papers (3):'}
                  </div>
                  <div className="space-y-1">
                    {group1Papers.map((p) => (
                      <div key={p.code} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/50 border border-slate-800">
                        <span className="font-medium text-slate-200">{p.code}: {p.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{p.type.split('•')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400/90 font-medium">
                Ideal for Articleship & Working Students
              </div>
            </div>

            {/* Card 3: Group 2 Only */}
            <div
              onClick={() => setSelectedPortion('group2')}
              data-selection-card="portion"
              data-selected={selectedPortion === 'group2'}
              className={`p-5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                selectedPortion === 'group2'
                  ? 'bg-blue-950/20 border-blue-500/70 ring-2 ring-blue-500/30 shadow-lg shadow-blue-950/40 is-selected'
                  : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    High-Focus
                  </span>
                  {selectedPortion === 'group2' ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600" />
                  )}
                </div>

                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  {isFoundation ? 'Module 2 Only' : 'Group 2 Only'}
                </h4>

                <p className="text-xs text-slate-400 mb-4">
                  100% focus on {isFoundation ? 'Module 2 (QA + Economics)' : isFinal ? 'Group 2 (DT, IDT & IBS)' : 'Group 2 (Costing, Audit & FM-SM)'}. Excludes Group 1 papers.
                </p>

                {/* Specs */}
                <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" /> Syllabus Volume:
                    </span>
                    <span className="font-semibold text-blue-300">{isFoundation ? '~175h (50%)' : '~350h (50%)'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-blue-400" /> Daily Load:
                    </span>
                    <span className="font-semibold text-blue-400">Deep Focus (3.5-5h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Minimum Target:
                    </span>
                    <span className="font-semibold text-blue-300">{isFoundation ? '100 / 200 Marks' : '150 / 300 Marks'}</span>
                  </div>
                </div>

                {/* Papers Included */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isFoundation ? 'Module 2 Papers (2):' : 'Group 2 Papers (3):'}
                  </div>
                  <div className="space-y-1">
                    {group2Papers.map((p) => (
                      <div key={p.code} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/50 border border-slate-800">
                        <span className="font-medium text-slate-200">{p.code}: {p.name}</span>
                        <span className="text-[10px] text-blue-400 font-mono">{p.type.split('•')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-blue-400/90 font-medium">
                Best if Group 1 is Cleared or Focus Strategy
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Impact Banner */}
        <div className="py-4">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-amber-300">Portion Adaptability Guarantee:</span>
              <p>
                When you click <strong className="text-white">Apply & Update Roadmap</strong>, the system will regenerate your daily 5-hour study protocol from Oct 26, 2026 to your target date. All morning theory slots and evening practical blocks will cycle <em className="text-amber-200">exclusively</em> through the papers of your selected portion.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Apply & Update Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
