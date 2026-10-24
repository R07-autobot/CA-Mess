import React, { useState } from 'react';
import { BacklogConfig, StudyLogEntry } from '../types/ca-study';
import { analyzeBacklog } from '../utils/backlogEngine';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Sliders, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';

interface BacklogBalancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyLogs: Record<string, StudyLogEntry>;
  config: BacklogConfig;
  onUpdateConfig: (newConfig: BacklogConfig) => void;
  onApplyBalancedPlan: (rebalancedPlanText: string) => void;
}

export const BacklogBalancerModal: React.FC<BacklogBalancerModalProps> = ({
  isOpen,
  onClose,
  studyLogs,
  config,
  onUpdateConfig,
  onApplyBalancedPlan,
}) => {
  const [localConfig, setLocalConfig] = useState<BacklogConfig>(config);
  const [showConfigSettings, setShowConfigSettings] = useState(false);
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const analysis = analyzeBacklog(studyLogs, localConfig);
  const { netDeficitHours, rebalancePlan, totalLoggedHours, expectedLoggedHours, daysLogged } = analysis;

  const handleApply = () => {
    onUpdateConfig(localConfig);
    onApplyBalancedPlan(rebalancePlan.explanation);
    setAppliedFeedback('Plan applied to upcoming daily slots!');
    setTimeout(() => {
      setAppliedFeedback(null);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Backlog Auto-Balancer Engine
            </h2>
            <p className="text-xs text-slate-400">
              Redistributes missed study hours smoothly without violating your rigid daily 5.5h working professional ceiling.
            </p>
          </div>
        </div>

        {/* Status Metrics Banner */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Logged Study</span>
            <span className="text-2xl font-black font-mono text-white mt-1 block">
              {totalLoggedHours}h
            </span>
            <span className="text-[10px] text-slate-500">Across {daysLogged} tracked days</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Target Expected</span>
            <span className="text-2xl font-black font-mono text-slate-300 mt-1 block">
              {expectedLoggedHours}h
            </span>
            <span className="text-[10px] text-slate-500">{localConfig.dailyTargetHours}h / day rigid protocol</span>
          </div>

          <div
            className={`p-3.5 rounded-xl border ${
              netDeficitHours > 0
                ? 'bg-amber-950/20 border-amber-500/30'
                : 'bg-emerald-950/20 border-emerald-500/30'
            }`}
          >
            <span className="text-[11px] font-medium block text-slate-300">Net Backlog</span>
            <span
              className={`text-2xl font-black font-mono mt-1 block ${
                netDeficitHours > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {netDeficitHours > 0 ? `-${netDeficitHours}h` : '0.0h'}
            </span>
            <span className="text-[10px] text-slate-400">
              {netDeficitHours > 0 ? 'Requires redistribution' : '100% on schedule!'}
            </span>
          </div>
        </div>

        {/* Dynamic Redistribution Proposal */}
        <div className="bg-gradient-to-r from-slate-950 to-indigo-950/30 rounded-xl p-4 border border-indigo-500/20 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Smart Recovery Calculation</h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {rebalancePlan.explanation}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800">
              <span className="text-slate-400 block font-medium">Upcoming Weekdays (Mon-Fri)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-white">
                  {rebalancePlan.adjustedWeekdayHours} hrs
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  (+{rebalancePlan.extraMinutesPerWeekday} mins)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Morning: 2h 30m + Evening: 2h {30 + rebalancePlan.extraMinutesPerWeekday}m
              </span>
            </div>

            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800">
              <span className="text-slate-400 block font-medium">Upcoming Weekends (Sat-Sun Buffer)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-white">
                  {rebalancePlan.adjustedWeekendHours} hrs
                </span>
                <span className="text-[11px] text-indigo-400 font-semibold">
                  (+{rebalancePlan.extraMinutesPerWeekend} mins)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Utilizes non-working weekend buffer
              </span>
            </div>
          </div>

          {/* Safety Cap Proof */}
          <div className="mt-3.5 flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Working Professional Safe:</strong> Maximum daily study load is restricted to{' '}
              <strong className="underline">{localConfig.maxDailyCap} hours</strong> to prevent burnout during full-time work.
            </span>
          </div>
        </div>

        {/* Toggle Configuration Settings */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setShowConfigSettings(!showConfigSettings)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showConfigSettings ? 'Hide Balancing Parameters' : 'Adjust Balancing Rules & Caps'}</span>
          </button>

          {showConfigSettings && (
            <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-4 text-xs animate-in slide-in-from-top-2">
              <div>
                <label className="block text-slate-400 mb-1">Daily Target Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="8"
                  value={localConfig.dailyTargetHours}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, dailyTargetHours: parseFloat(e.target.value) || 5 })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Max Daily Rigid Cap (Burnout Shield)</label>
                <input
                  type="number"
                  step="0.25"
                  min="5"
                  max="7"
                  value={localConfig.maxDailyCap}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, maxDailyCap: parseFloat(e.target.value) || 5.5 })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Weekend Buffer Extra Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="4"
                  value={localConfig.weekendBufferHours}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, weekendBufferHours: parseFloat(e.target.value) || 1.5 })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Redistribution Window (Days)</label>
                <input
                  type="number"
                  step="1"
                  min="3"
                  max="21"
                  value={localConfig.redistributionDays}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, redistributionDays: parseInt(e.target.value) || 7 })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <span className="text-xs text-slate-500">
            Auto-balances across active study calendar
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Apply Auto-Balanced Protocol</span>
            </button>
          </div>
        </div>

        {appliedFeedback && (
          <div className="mt-3 p-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs text-center border border-emerald-500/30 animate-in fade-in">
            {appliedFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
