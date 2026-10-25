import React, { useState, useRef, useEffect } from 'react';
import { AttemptPortion, ExamSession, CourseLevel } from '../types/ca-study';
import { Layers, Calendar, ChevronDown, Check, Sparkles, BookOpen } from 'lucide-react';

interface AttemptDropdownProps {
  courseLevel: CourseLevel;
  attemptPortion: AttemptPortion;
  examSession: ExamSession;
  onSelectAttempt: (portion: AttemptPortion, session: ExamSession) => void;
  onOpenDetailedModal?: () => void;
}

export const AttemptDropdown: React.FC<AttemptDropdownProps> = ({
  courseLevel,
  attemptPortion,
  examSession,
  onSelectAttempt,
  onOpenDetailedModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFoundation = courseLevel === 'foundation';
  const group1Label = isFoundation ? 'Module 1 (P1 & P2)' : 'Group 1 (P1, P2, P3)';
  const group2Label = isFoundation ? 'Module 2 (P3 & P4)' : 'Group 2 (P4, P5, P6)';
  const bothLabel = isFoundation ? 'Both Modules (4 Papers)' : 'Both Groups (6 Papers)';

  const sessionLabel =
    examSession === 'nov_2027'
      ? 'Nov 2027'
      : examSession === 'jan_2027'
      ? 'Jan 2027'
      : examSession === 'sept_2027'
      ? 'Sept 2027'
      : 'May 2027';

  const portionShortLabel =
    attemptPortion === 'both'
      ? isFoundation ? 'Both Modules' : 'Both Groups'
      : attemptPortion === 'group1'
      ? isFoundation ? 'Module 1 Only' : 'Group 1 Only'
      : isFoundation ? 'Module 2 Only' : 'Group 2 Only';

  const portionColor =
    attemptPortion === 'both'
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      : attemptPortion === 'group1'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : 'bg-blue-500/15 text-blue-300 border-blue-500/30';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-dropdown-trigger="attempt"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${portionColor} hover:bg-opacity-25 focus:outline-none focus:ring-2 focus:ring-amber-500/40`}
        title="Change Exam Attempt & Portion"
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="font-bold">{sessionLabel}</span>
        <span className="opacity-40">•</span>
        <span>{portionShortLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          data-dropdown-menu="attempt"
          role="menu"
          className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 z-50 p-2 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="px-3 py-2 pb-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Attempt & Portion
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-bold">
                {courseLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Selecting a portion dynamically tailors your Daily Schedule & Syllabus Tracker.
            </p>
          </div>

          {/* Portion Options */}
          <div className="py-2 space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
              Select Portion
            </div>

            {/* Both Groups */}
            <button
              onClick={() => {
                onSelectAttempt('both', examSession);
                setIsOpen(false);
              }}
              data-dropdown-item="both"
              data-selected={attemptPortion === 'both'}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                attemptPortion === 'both'
                  ? 'bg-amber-500/20 text-amber-200 font-medium border border-amber-500/40 is-selected'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div>
                <div className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{bothLabel}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isFoundation ? 'Papers 1, 2, 3, 4 • ~350h Total' : 'Papers 1 to 6 • ~700h Total'}
                </div>
              </div>
              {attemptPortion === 'both' && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            </button>

            {/* Group 1 Only */}
            <button
              onClick={() => {
                onSelectAttempt('group1', examSession);
                setIsOpen(false);
              }}
              data-dropdown-item="group1"
              data-selected={attemptPortion === 'group1'}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                attemptPortion === 'group1'
                  ? 'bg-emerald-500/20 text-emerald-200 font-medium border border-emerald-500/40 is-selected'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div>
                <div className="font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{group1Label} Only</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isFoundation ? 'Accounts + Laws • ~175h' : 'Adv Acc, Law & Tax • ~350h'}
                </div>
              </div>
              {attemptPortion === 'group1' && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            </button>

            {/* Group 2 Only */}
            <button
              onClick={() => {
                onSelectAttempt('group2', examSession);
                setIsOpen(false);
              }}
              data-dropdown-item="group2"
              data-selected={attemptPortion === 'group2'}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                attemptPortion === 'group2'
                  ? 'bg-blue-500/20 text-blue-200 font-medium border border-blue-500/40 is-selected'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div>
                <div className="font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{group2Label} Only</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isFoundation ? 'QA Maths + Economics • ~175h' : 'Costing, Audit & FM-SM / IDT-IBS • ~350h'}
                </div>
              </div>
              {attemptPortion === 'group2' && <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />}
            </button>
          </div>

          {/* Target Exam Session */}
          <div className="py-2 space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
              Exam Session
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-2">
              <button
                onClick={() => {
                  onSelectAttempt(attemptPortion, 'may_2027');
                  setIsOpen(false);
                }}
                data-dropdown-session="may_2027"
                data-selected={examSession === 'may_2027'}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                  examSession === 'may_2027'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 is-selected'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                May 2027
              </button>
              <button
                onClick={() => {
                  onSelectAttempt(attemptPortion, 'nov_2027');
                  setIsOpen(false);
                }}
                data-dropdown-session="nov_2027"
                data-selected={examSession === 'nov_2027'}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                  examSession === 'nov_2027'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 is-selected'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                Nov 2027
              </button>
            </div>
          </div>

          {/* Footer Action */}
          {onOpenDetailedModal && (
            <div className="pt-2 px-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenDetailedModal();
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-amber-400 hover:text-amber-300 text-center transition-colors border border-slate-700/60 flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                Customize Attempt Strategy...
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
