import React, { useState } from 'react';
import { CourseLevel, UserPersona } from '../types/ca-study';
import { calculateSlotDuration } from '../utils/timeSlots';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Briefcase,
  X,
  Compass,
  Check,
  Zap,
  Target,
  Sun,
  Moon,
  Sliders
} from 'lucide-react';

interface CourseSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentLevel: CourseLevel | null;
  currentPersona?: UserPersona;
  morningStartTime?: string;
  morningEndTime?: string;
  eveningStartTime?: string;
  eveningEndTime?: string;
  eveningBreakMinutes?: number;
  onSelectLevel: (
    level: CourseLevel, 
    persona: UserPersona,
    customHours?: {
      morningFrom: string;
      morningTo: string;
      eveningFrom: string;
      eveningTo: string;
      breakMinutes: number;
    }
  ) => void;
}

export const CourseSelectionModal: React.FC<CourseSelectionModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  currentPersona = 'working_professional',
  morningStartTime,
  morningEndTime,
  eveningStartTime,
  eveningEndTime,
  eveningBreakMinutes,
  onSelectLevel,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(currentPersona);
  const isStudent = selectedPersona === 'student';

  const [morningFrom, setMorningFrom] = useState<string>(
    morningStartTime || (isStudent ? '07:00' : '06:30')
  );
  const [morningTo, setMorningTo] = useState<string>(
    morningEndTime || (isStudent ? '11:00' : '08:00')
  );
  const [eveningFrom, setEveningFrom] = useState<string>(
    eveningStartTime || (isStudent ? '16:30' : '20:00')
  );
  const [eveningTo, setEveningTo] = useState<string>(
    eveningEndTime || (isStudent ? '20:30' : '00:00')
  );
  const [includeBreak, setIncludeBreak] = useState<boolean>(
    (eveningBreakMinutes ?? (isStudent ? 0 : 30)) > 0
  );

  if (!isOpen) return null;

  const isInitialLaunch = !currentLevel;

  const breakMins = includeBreak ? 30 : 0;
  const morningDur = calculateSlotDuration(morningFrom, morningTo, 0);
  const eveningDur = calculateSlotDuration(eveningFrom, eveningTo, breakMins);
  const totalHours = Number((morningDur.hours + eveningDur.hours).toFixed(1));

  const handleSelectPersonaTrack = (persona: UserPersona) => {
    setSelectedPersona(persona);
    if (persona === 'student') {
      setMorningFrom('07:00');
      setMorningTo('11:00');
      setEveningFrom('16:30');
      setEveningTo('20:30');
      setIncludeBreak(false);
    } else {
      setMorningFrom('06:30');
      setMorningTo('08:00');
      setEveningFrom('20:00');
      setEveningTo('00:00');
      setIncludeBreak(true);
    }
  };

  const handleLaunch = (level: CourseLevel) => {
    onSelectLevel(level, selectedPersona, {
      morningFrom,
      morningTo,
      eveningFrom,
      eveningTo,
      breakMinutes: breakMins,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-scaleIn text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900 border-b border-slate-800 text-center relative">
          {!isInitialLaunch && onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ICAI New Scheme • May 2027 & Nov 2027</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Configure Your CA Study Cockpit
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-2 leading-relaxed">
            Choose your <strong>Daily Profile</strong>, customize your <strong>Morning & Evening Study Hours (From – To)</strong>, and launch your <strong>Course Level</strong>.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 bg-slate-900">
          
          {/* STEP 1: Select Profile (Students 8h vs Working Professionals 5h) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Step 1: Select Your Daily Profile</span>
              </span>
              <span className="text-[11px] font-semibold text-indigo-300">
                Selected Protocol: <strong className="text-white">{isStudent ? 'Student (8h default)' : 'Working Pro (5h default)'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option A: Full-time Student (8 Hours) */}
              <div
                onClick={() => handleSelectPersonaTrack('student')}
                data-selection-card="user-persona"
                data-selected={selectedPersona === 'student'}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                  selectedPersona === 'student'
                    ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/25 shadow-lg is-selected'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${
                        selectedPersona === 'student'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Full-Time Student</span>
                        </h4>
                        <span className="text-[11px] text-slate-400">Dedicated Exam Aspirant</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                      selectedPersona === 'student'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      8 Hours / Day
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                    Structured for candidates with no office or articleship commitments. High-intensity double-block deep focus sessions.
                  </p>
                </div>

                <div className="mt-3.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>8.0h Default Schedule</span>
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    selectedPersona === 'student'
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}>
                    {selectedPersona === 'student' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Option B: Working Professional (5 Hours) */}
              <div
                onClick={() => handleSelectPersonaTrack('working_professional')}
                data-selection-card="user-persona"
                data-selected={selectedPersona === 'working_professional'}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                  selectedPersona === 'working_professional'
                    ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-500 ring-2 ring-amber-500/25 shadow-lg is-selected'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${
                        selectedPersona === 'working_professional'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Working Professional</span>
                        </h4>
                        <span className="text-[11px] text-slate-400">Articleship & Job Holders</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                      selectedPersona === 'working_professional'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      5 Hours / Day
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                    Engineered for candidates balancing 9-to-6 office schedules or articleship. Prevents burnout with rigid sustainable caps.
                  </p>
                </div>

                <div className="mt-3.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>5.0h Default Schedule</span>
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    selectedPersona === 'working_professional'
                      ? 'bg-amber-500 border-amber-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}>
                    {selectedPersona === 'working_professional' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* STEP 2: Configure Study Hours (From - To) */}
          <div className="space-y-3 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Step 2: Select Study Hours (Morning & Evening From – To)</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Total: {totalHours} Hours / Day
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Morning Slot From - To */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Sun className="w-4 h-4" />
                    <span>Morning Slot (Theory & Laws)</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {morningDur.hours}h ({morningDur.minutes}m)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      From (Start):
                    </label>
                    <input
                      type="time"
                      value={morningFrom}
                      onChange={(e) => setMorningFrom(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      To (End):
                    </label>
                    <input
                      type="time"
                      value={morningTo}
                      onChange={(e) => setMorningTo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Evening Slot From - To */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                    <Moon className="w-4 h-4" />
                    <span>Evening Slot (Practical & Problems)</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {eveningDur.hours}h ({eveningDur.minutes}m)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      From (Start):
                    </label>
                    <input
                      type="time"
                      value={eveningFrom}
                      onChange={(e) => setEveningFrom(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      To (End):
                    </label>
                    <input
                      type="time"
                      value={eveningTo}
                      onChange={(e) => setEveningTo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={includeBreak}
                    onChange={(e) => setIncludeBreak(e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-700"
                  />
                  <span>Deduct 30m break for dinner / eye rest</span>
                </label>
              </div>
            </div>
          </div>

          {/* STEP 3: Select Course Level (Foundation, Inter, Final) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Step 3: Select Your ICAI Course Level</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Click any level to launch with <strong className="text-white">{totalHours} Hours/Day</strong> ({morningFrom}–{morningTo} & {eveningFrom}–{eveningTo})
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* 1. CA FOUNDATION CARD */}
              <div 
                onClick={() => handleLaunch('foundation')}
                data-selection-card="course-level"
                data-selected={currentLevel === 'foundation'}
                className={`flex flex-col justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group hover:scale-[1.01] relative ${
                  currentLevel === 'foundation'
                    ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30 is-selected'
                    : 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900'
                }`}
              >
                {currentLevel === 'foundation' && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Level
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      4 Papers • 400 Marks
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mt-3.5 group-hover:text-emerald-300 transition-colors">
                    CA Foundation
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ICAI New Scheme • Entry-Level Benchmark
                  </p>

                  {/* Papers Breakdown */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Curriculum Papers:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span><strong>Paper 1:</strong> Accounting (100M)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span><strong>Paper 2:</strong> Business Laws (100M)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span><strong>Paper 3:</strong> Quantitative Aptitude (100M)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        <span><strong>Paper 4:</strong> Business Economics (100M)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    data-action-button="primary"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-emerald-600/30 cursor-pointer"
                  >
                    <span>Launch Foundation ({totalHours}h/day)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* 2. CA INTERMEDIATE CARD */}
              <div 
                onClick={() => handleLaunch('intermediate')}
                data-selection-card="course-level"
                data-selected={currentLevel === 'intermediate'}
                className={`flex flex-col justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group hover:scale-[1.01] relative ${
                  currentLevel === 'intermediate'
                    ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30 is-selected'
                    : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900'
                }`}
              >
                {currentLevel === 'intermediate' && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Level
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      6 Papers • 600 Marks
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mt-3.5 group-hover:text-indigo-300 transition-colors">
                    CA Intermediate
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ICAI New Scheme • Group 1 & Group 2
                  </p>

                  {/* Papers Breakdown */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Curriculum Papers:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span><strong>P1:</strong> Adv Accounting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span><strong>P2:</strong> Corporate & Other Laws</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span><strong>P3:</strong> Taxation (DT & GST)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span><strong>P4:</strong> Cost & Mgmt Accounting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span><strong>P5:</strong> Auditing and Ethics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        <span><strong>P6:</strong> FM and Strategic Mgmt</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    data-action-button="primary"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-indigo-600/30 cursor-pointer"
                  >
                    <span>Launch Intermediate ({totalHours}h/day)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* 3. CA FINAL CARD */}
              <div 
                onClick={() => handleLaunch('final')}
                data-selection-card="course-level"
                data-selected={currentLevel === 'final'}
                className={`flex flex-col justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group hover:scale-[1.01] relative ${
                  currentLevel === 'final'
                    ? 'bg-gradient-to-b from-purple-950/40 to-slate-900 border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30 is-selected'
                    : 'bg-slate-950/70 border-slate-800 hover:border-purple-500/60 hover:bg-slate-900'
                }`}
              >
                {currentLevel === 'final' && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Level
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      6 Papers • 600 Marks
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mt-3.5 group-hover:text-purple-300 transition-colors">
                    CA Final
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ICAI New Scheme • The Pinnacle Exam
                  </p>

                  {/* Papers Breakdown */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Curriculum Papers:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span><strong>P1:</strong> Financial Reporting (Ind AS)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span><strong>P2:</strong> Adv Financial Mgmt (AFM)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span><strong>P3:</strong> Adv Auditing & Ethics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span><strong>P4:</strong> Direct Tax & Int. Tax</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span><strong>P5:</strong> Indirect Tax Laws (GST)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        <span><strong>P6:</strong> Integrated Business (IBS)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    data-action-button="primary"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-purple-600/30 cursor-pointer"
                  >
                    <span>Launch CA Final ({totalHours}h/day)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2 flex-wrap">
          <span>You can adjust your Morning and Evening study hours anytime by clicking <strong>Study Hours</strong> in the top header.</span>
        </div>
      </div>
    </div>
  );
};
