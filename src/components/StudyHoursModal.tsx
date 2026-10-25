import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Sun, 
  Moon, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Sliders, 
  GraduationCap, 
  Briefcase,
  Zap,
  ArrowRight
} from 'lucide-react';
import { calculateSlotDuration, STUDY_HOUR_PRESETS, PresetSlot } from '../utils/timeSlots';
import { PlannerState } from '../types/ca-study';

interface StudyHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  onSaveHours: (
    morningFrom: string, 
    morningTo: string, 
    eveningFrom: string, 
    eveningTo: string, 
    eveningBreakMinutes: number
  ) => void;
}

export const StudyHoursModal: React.FC<StudyHoursModalProps> = ({
  isOpen,
  onClose,
  state,
  onSaveHours,
}) => {
  const isStudentDefault = state.userPersona === 'student';
  
  const [morningFrom, setMorningFrom] = useState<string>(
    state.morningStartTime || (isStudentDefault ? '07:00' : '06:30')
  );
  const [morningTo, setMorningTo] = useState<string>(
    state.morningEndTime || (isStudentDefault ? '11:00' : '08:00')
  );
  const [eveningFrom, setEveningFrom] = useState<string>(
    state.eveningStartTime || (isStudentDefault ? '16:30' : '20:00')
  );
  const [eveningTo, setEveningTo] = useState<string>(
    state.eveningEndTime || (isStudentDefault ? '20:30' : '00:00')
  );
  const [includeBreak, setIncludeBreak] = useState<boolean>(
    (state.eveningBreakMinutes ?? (isStudentDefault ? 0 : 30)) > 0
  );

  if (!isOpen) return null;

  const breakMins = includeBreak ? 30 : 0;
  const morningDuration = calculateSlotDuration(morningFrom, morningTo, 0);
  const eveningDuration = calculateSlotDuration(eveningFrom, eveningTo, breakMins);
  const totalDailyHours = Number((morningDuration.hours + eveningDuration.hours).toFixed(1));

  const applyPreset = (preset: PresetSlot) => {
    setMorningFrom(preset.morningFrom);
    setMorningTo(preset.morningTo);
    setEveningFrom(preset.eveningFrom);
    setEveningTo(preset.eveningTo);
    setIncludeBreak(preset.eveningBreakMinutes > 0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveHours(morningFrom, morningTo, eveningFrom, eveningTo, breakMins);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Custom Routine Configurator</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Select Your Daily Study Hours
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Customize your <strong>Morning (From – To)</strong> and <strong>Evening (From – To)</strong> study windows. Schedules, timers, and roadmap targets recalculate to your exact hours.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 bg-slate-900">
          
          {/* Quick Preset Selector */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              ⚡ Quick 1-Click Study Presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STUDY_HOUR_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    morningFrom === p.morningFrom &&
                    morningTo === p.morningTo &&
                    eveningFrom === p.eveningFrom &&
                    eveningTo === p.eveningTo
                      ? 'bg-indigo-600/25 border-indigo-500 ring-1 ring-indigo-500/40 text-white shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      {p.userPersona === 'student' ? (
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{p.name}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Morning {p.morningFrom}–{p.morningTo} • Evening {p.eveningFrom}–{p.eveningTo}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Pickers: Morning & Evening */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            
            {/* 1. MORNING SLOT PICKER */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Morning Slot</h3>
                    <span className="text-[10px] text-slate-400">Theory, Concepts & Laws</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {morningDuration.hours} Hours ({morningDuration.minutes}m)
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Morning From (Start Time):
                  </label>
                  <input
                    type="time"
                    required
                    value={morningFrom}
                    onChange={(e) => setMorningFrom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Recommended: 06:30 AM (Working) or 07:00 AM (Student)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Morning To (End Time):
                  </label>
                  <input
                    type="time"
                    required
                    value={morningTo}
                    onChange={(e) => setMorningTo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Recommended: 08:00 AM (Working) or 11:00 AM (Student)</span>
                </div>
              </div>
            </div>

            {/* 2. EVENING SLOT PICKER */}
            <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl p-4 sm:p-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Evening Slot</h3>
                    <span className="text-[10px] text-slate-400">Practical & Numerical Mastery</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {eveningDuration.hours} Hours ({eveningDuration.minutes}m)
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Evening From (Start Time):
                  </label>
                  <input
                    type="time"
                    required
                    value={eveningFrom}
                    onChange={(e) => setEveningFrom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Recommended: 20:00 (08:00 PM) or 16:30 (04:30 PM)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Evening To (End Time):
                  </label>
                  <input
                    type="time"
                    required
                    value={eveningTo}
                    onChange={(e) => setEveningTo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Recommended: 00:00 (Midnight) or 20:30 (08:30 PM)</span>
                </div>

                {/* Optional Break Checkbox */}
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeBreak}
                    onChange={(e) => setIncludeBreak(e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-700"
                  />
                  <span>Deduct 30m dinner & eye refreshment break</span>
                </label>
              </div>
            </div>

          </div>

          {/* Total Summary Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Calculated Daily Study Capacity:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {totalDailyHours} Hours / Day
                </span>
                <span className="text-xs text-slate-400">
                  ({morningDuration.hours}h Morning + {eveningDuration.hours}h Evening)
                </span>
              </div>
            </div>

            <div className="text-right">
              {totalDailyHours >= 7.5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <GraduationCap className="w-3.5 h-3.5" /> High-Intensity Student Pace
                </span>
              ) : totalDailyHours >= 4.5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Briefcase className="w-3.5 h-3.5" /> Optimal Working Pro Protocol
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" /> Low Study Capacity (&lt;4.5h)
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-action-button="primary"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Apply Study Hours ({totalDailyHours}h)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
