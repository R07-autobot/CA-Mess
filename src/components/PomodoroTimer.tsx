import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Check, 
  Clock, 
  Minimize2, 
  Maximize2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/audio';

interface PomodoroTimerProps {
  currentSlot: 'morning' | 'evening';
  activeSubjectName?: string;
  activeChapterTitle?: string;
  onLogStudyMinutes: (minutes: number, slot: 'morning' | 'evening') => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

type TimerMode = '50_10' | '25_5' | 'morning_90' | 'evening_210' | 'custom';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  currentSlot,
  activeSubjectName = 'Corporate Law (Theory)',
  activeChapterTitle = 'Management and Administration',
  onLogStudyMinutes,
  isMinimized = false,
  onToggleMinimize,
}) => {
  const initialMode: TimerMode = currentSlot === 'morning' ? 'morning_90' : 'evening_210';
  const initialDuration = currentSlot === 'morning' ? 90 * 60 : 210 * 60;

  const [mode, setMode] = useState<TimerMode>(initialMode);
  const [totalDuration, setTotalDuration] = useState<number>(initialDuration);
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);
  const [unloggedMinutes, setUnloggedMinutes] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const setTimerPreset = (preset: TimerMode) => {
    setIsRunning(false);
    setIsBreak(false);
    setMode(preset);
    let seconds = 50 * 60;
    if (preset === '25_5') seconds = 25 * 60;
    if (preset === 'morning_90') seconds = 90 * 60; // 1.5h Morning Slot (06:30 - 08:00)
    if (preset === 'evening_210') seconds = 210 * 60; // 3.5h Evening Block (08:00 - 12:00)
    if (preset === 'custom') seconds = 30 * 60;
    setTotalDuration(seconds);
    setTimeLeft(seconds);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isBreak, mode]);

  const handleSessionComplete = () => {
    setIsRunning(false);

    if (!isBreak) {
      // Completed a study focus session!
      const minutesFocused = Math.round(totalDuration / 60);
      setSessionsCompleted((prev) => prev + 1);
      setUnloggedMinutes((prev) => prev + minutesFocused);

      if (soundEnabled) {
        playChime('pomodoro_complete');
      }

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        // fallback
      }

      // Switch to break
      setIsBreak(true);
      const breakSecs = mode === '25_5' ? 5 * 60 : 10 * 60;
      setTotalDuration(breakSecs);
      setTimeLeft(breakSecs);
    } else {
      // Break is finished
      if (soundEnabled) {
        playChime('break_start');
      }
      setIsBreak(false);
      setTimerPreset(mode);
    }
  };

  const handleLogAccumulated = () => {
    if (unloggedMinutes > 0) {
      onLogStudyMinutes(unloggedMinutes, currentSlot);
      setUnloggedMinutes(0);
    }
  };

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(totalDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  if (isMinimized) {
    return (
      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-3 shadow-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-mono font-bold text-white text-sm">{formatTime(timeLeft)}</span>
          <span className="text-slate-400 truncate max-w-[140px]">
            {isBreak ? '☕ Break' : activeSubjectName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleStartPause}
            className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Expand Timer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      data-focus-section="pomodoro-timer"
      className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Focus Pomodoro Engine
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {currentSlot === 'morning' ? 'Morning Slot (Theory)' : 'Evening Slot (Practical)'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-sm">
              {activeSubjectName} • {activeChapterTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50 cursor-pointer transition-colors"
            title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50 cursor-pointer transition-colors"
              title="Minimize Timer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
        <button
          onClick={() => setTimerPreset('morning_90')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer truncate ${
            mode === 'morning_90'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
          title="Morning Slot: 1.5h (6:30 - 8:00 AM)"
        >
          🌅 Morning 1.5h
        </button>
        <button
          onClick={() => setTimerPreset('evening_210')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer truncate ${
            mode === 'evening_210'
              ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
          title="Evening Block: 3.5h (8:00 - 12:00 AM)"
        >
          🌙 Evening 3.5h
        </button>
        <button
          onClick={() => setTimerPreset('50_10')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer ${
            mode === '50_10'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          50 / 10 Focus
        </button>
        <button
          onClick={() => setTimerPreset('25_5')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all cursor-pointer ${
            mode === '25_5'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          25 / 5 Classic
        </button>
      </div>

      {/* Circular / Large Digital Display */}
      <div className="py-4 text-center">
        <div className="inline-block relative">
          <span
            className={`font-mono text-5xl sm:text-6xl font-black tracking-tight ${
              isBreak ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </span>
          <span
            className={`block mt-1 text-xs font-semibold uppercase tracking-wider ${
              isBreak ? 'text-emerald-400' : 'text-indigo-400'
            }`}
          >
            {isBreak ? '☕ Rejuvenation Break' : isRunning ? '⚡ In Deep Focus Block' : 'Ready to Study'}
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full max-w-xs mx-auto h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isBreak ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 cursor-pointer transition-all active:scale-95"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleStartPause}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Pause Block
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Focus
            </>
          )}
        </button>

        <button
          onClick={handleSessionComplete}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 cursor-pointer transition-all active:scale-95"
          title="Mark session as done & log"
        >
          <Check className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Quick Unlogged Minutes Sink */}
      {unloggedMinutes > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-200">
              Completed <strong className="text-white">{unloggedMinutes} mins</strong> focused!
            </span>
          </div>
          <button
            onClick={handleLogAccumulated}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer text-[11px] shadow-sm transition-all"
          >
            Log to Today's Hours
          </button>
        </div>
      )}

      {/* Footer Guidance for CA Working Professional */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          Sessions completed: <strong className="text-white ml-1">{sessionsCompleted}</strong>
        </span>
        <span>Target: 2.5h slot = 3 × 50m</span>
      </div>
    </div>
  );
};
