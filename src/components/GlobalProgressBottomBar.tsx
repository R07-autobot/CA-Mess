import React from 'react';
import { PlannerState } from '../types/ca-study';
import { 
  CheckCircle2, 
  Flame, 
  Palette, 
  TrendingUp, 
  Calendar, 
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';

interface GlobalProgressBottomBarProps {
  state: PlannerState;
  onOpenThemeModal: () => void;
  onSelectToday: () => void;
  onToggleTopicCompleted?: (date: string, slot: 'morning' | 'evening', isCompleted: boolean) => void;
}

export const GlobalProgressBottomBar: React.FC<GlobalProgressBottomBarProps> = ({
  state,
  onOpenThemeModal,
  onSelectToday,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPlan = state.dailyPlans?.[todayStr] || Object.values(state.dailyPlans || {})[0];

  // Calculate overall statistics across entire roadmap
  const allPlans = Object.values(state.dailyPlans || {});
  const totalTopics = allPlans.length * 2;
  const completedTopics = allPlans.reduce(
    (acc, plan) => acc + (plan.morningTopic?.isCompleted ? 1 : 0) + (plan.eveningTopic?.isCompleted ? 1 : 0),
    0
  );
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Calculate today's status
  const morningDone = todayPlan?.morningTopic?.isCompleted ?? false;
  const eveningDone = todayPlan?.eveningTopic?.isCompleted ?? false;
  const todayCompletedCount = (morningDone ? 1 : 0) + (eveningDone ? 1 : 0);
  const todayPercentage = Math.round((todayCompletedCount / 2) * 100);

  return (
    <aside 
      aria-label="Progress & Navigation Bar" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)] py-2 px-3 sm:px-6 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6 flex-wrap">
        
        {/* Left: Overall Roadmap Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Roadmap Status:
                </span>
                <span className="text-sm font-black font-mono text-indigo-400">
                  {overallPercentage}%
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline">
                  ({completedTopics} / {totalTopics} topics ticked)
                </span>
              </div>
              <div className="w-28 sm:w-36 md:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Today's 5-Hour Mission Status */}
        <div 
          onClick={onSelectToday}
          className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-slate-900 transition-colors"
          title="Jump to Today's Mission"
        >
          <div className={`p-1.5 rounded-lg border flex items-center justify-center ${
            todayPercentage === 100 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
              : todayPercentage === 50
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Today's Goal:
              </span>
              <span className={`text-sm font-black font-mono ${
                todayPercentage === 100 ? 'text-emerald-400' : todayPercentage === 50 ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {todayPercentage}%
              </span>
              <span className="text-[10px] text-slate-400">
                ({todayCompletedCount}/2 Sessions)
              </span>
            </div>
            <div className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  todayPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${todayPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Quick Theme Button & Day Counter */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-semibold px-2 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Day 1: <strong>26-Oct-26</strong></span>
          </div>

          {/* Theme Selector Trigger */}
          <button
            onClick={onOpenThemeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-indigo-500/60 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Switch study environment theme"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xs:inline">Theme</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
