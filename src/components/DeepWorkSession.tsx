import React, { useState, useEffect, useRef } from 'react';
import { Chapter, Paper } from '../types/ca-study';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  BellOff, 
  Lock, 
  Unlock, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  FileEdit, 
  Headphones, 
  ChevronRight, 
  X, 
  Sun, 
  Moon,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime, AmbientNoisePlayer } from '../utils/audio';

interface DeepWorkSessionProps {
  isOpen: boolean;
  onClose: (elapsedMinutes: number, slot: 'morning' | 'evening') => void;
  slot: 'morning' | 'evening';
  targetMinutes?: number;
  chapter: Chapter;
  paper?: Paper;
  onUpdateChapterMilestone: (chapterId: string, milestoneKey: keyof Chapter['milestones'], value: any) => void;
  onUpdateChapterNotes?: (chapterId: string, notes: string) => void;
}

const CA_QUOTES = [
  "The 'CA' prefix before your name isn't bought. It's earned one deep session at a time.",
  "Morning Theory locks in legal sections and core conceptual foundations.",
  "Evening Practical Grind builds calculation speed, working note mastery, and stamina.",
  "Your full-time competitors study casually. Your edge is unbroken razor focus.",
  "Every ICAI illustration solved tonight is 4 to 8 marks secured in the exam hall.",
  "Protect these study blocks with your life. Distractions can wait.",
  "Strict adherence to your daily study protocol beats exam-month panic every single time."
];

export const DeepWorkSession: React.FC<DeepWorkSessionProps> = ({
  isOpen,
  onClose,
  slot,
  targetMinutes,
  chapter,
  paper,
  onUpdateChapterMilestone,
  onUpdateChapterNotes,
}) => {
  const INITIAL_DURATION = targetMinutes ? targetMinutes * 60 : (slot === 'morning' ? 90 * 60 : 210 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_DURATION);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [ambientSound, setAmbientSound] = useState<'off' | 'brown' | 'binaural'>('off');
  const [scratchpad, setScratchpad] = useState<string>(chapter.milestones.notes || '');
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [sessionStyle, setSessionStyle] = useState<'flow' | 'intervals'>('intervals');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ambientPlayerRef = useRef<AmbientNoisePlayer | null>(null);

  // Initialize ambient player
  useEffect(() => {
    ambientPlayerRef.current = new AmbientNoisePlayer();
    return () => {
      ambientPlayerRef.current?.stop();
    };
  }, []);

  // Request fullscreen when opening
  useEffect(() => {
    if (isOpen) {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}

      // Rotate quotes every 45 seconds
      const quoteInterval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % CA_QUOTES.length);
      }, 45000);

      return () => {
        clearInterval(quoteInterval);
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch (e) {}
      };
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (isOpen && isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteSession();
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
  }, [isOpen, isRunning]);

  if (!isOpen) return null;

  const elapsedSeconds = INITIAL_DURATION - timeLeft;
  const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  const handleToggleAmbient = (type: 'brown' | 'binaural') => {
    if (ambientSound === type) {
      ambientPlayerRef.current?.stop();
      setAmbientSound('off');
    } else {
      ambientPlayerRef.current?.start(type, 0.04);
      setAmbientSound(type);
    }
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    ambientPlayerRef.current?.stop();
    playChime('pomodoro_complete');

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    // Save scratchpad
    if (scratchpad !== chapter.milestones.notes && onUpdateChapterNotes) {
      onUpdateChapterNotes(chapter.id, scratchpad);
    }

    onClose(elapsedMinutes, slot);
  };

  const handleEmergencyExit = () => {
    setIsRunning(false);
    ambientPlayerRef.current?.stop();
    if (scratchpad !== chapter.milestones.notes && onUpdateChapterNotes) {
      onUpdateChapterNotes(chapter.id, scratchpad);
    }
    onClose(elapsedMinutes, slot);
  };

  const formatHMS = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Interval breakdown customized for 1.5h Morning (90m) and 3.5h Evening (210m)
  const getIntervalStage = (secondsLeft: number) => {
    const elapsed = INITIAL_DURATION - secondsLeft;
    const mins = Math.floor(elapsed / 60);

    if (slot === 'morning') {
      // 90 minutes total (06:30 - 08:00 AM)
      if (mins < 40) {
        return { stage: 'Block 1: Bare Act Provisions & Statutory Keywords', phase: 'focus', remainingInStage: 40 - mins };
      } else if (mins < 45) {
        return { stage: 'Interval 1: 24h Active Recall & Hydration', phase: 'break', remainingInStage: 45 - mins };
      } else if (mins < 80) {
        return { stage: 'Block 2: Case Scenario Written Answer Drafting', phase: 'focus', remainingInStage: 80 - mins };
      } else {
        return { stage: 'Block 3: Pre-Work Keyword Audit & Memory Stamping', phase: 'focus', remainingInStage: 90 - mins };
      }
    } else {
      // 210 minutes total (08:00 - 11:30 PM / 12:00 AM)
      if (mins < 50) {
        return { stage: 'Block 1: Question Dissection & Primary Formats (50m)', phase: 'focus', remainingInStage: 50 - mins };
      } else if (mins < 60) {
        return { stage: 'Interval 1: Water & Cognitive Reset (10m)', phase: 'break', remainingInStage: 60 - mins };
      } else if (mins < 120) {
        return { stage: 'Block 2: Intensive Working Notes & Problem Grinding (60m)', phase: 'focus', remainingInStage: 120 - mins };
      } else if (mins < 130) {
        return { stage: 'Interval 2: Stretch & Eye Rest (10m)', phase: 'break', remainingInStage: 130 - mins };
      } else if (mins < 190) {
        return { stage: 'Block 3: ICAI RTP / PYQ Unseen Speed Drilling (60m)', phase: 'focus', remainingInStage: 190 - mins };
      } else {
        return { stage: 'Block 4: Day Wrap-Up, Mistake Journal & Sleep Prep (20m)', phase: 'focus', remainingInStage: 210 - mins };
      }
    }
  };

  const currentStage = getIntervalStage(timeLeft);
  const progressPct = ((INITIAL_DURATION - timeLeft) / INITIAL_DURATION) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar: DND Lock Status & Minimal Controls */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold tracking-wide">
            <Lock className="w-3.5 h-3.5" />
            <span>INTERFACE LOCKED • DEEP WORK MODE</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-medium">
            <BellOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Notifications Silenced</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Ambient Noise Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5 text-indigo-400" /> Focus Audio:
            </span>
            <button
              onClick={() => handleToggleAmbient('brown')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                ambientSound === 'brown' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Brown Noise
            </button>
            <button
              onClick={() => handleToggleAmbient('binaural')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                ambientSound === 'binaural' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              40Hz Binaural
            </button>
          </div>

          {/* Unlock / Exit Button */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Unlock Interface"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock</span>
          </button>
        </div>
      </div>

      {/* Main Focus Stage */}
      <div className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col justify-center items-center text-center">
        {/* Module & Chapter Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800">
            {slot === 'morning' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">Morning Power Slot (1.5h • 06:30 - 08:00 AM)</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-400">Evening Deep Grind (3.5h • 08:00 - 12:00 AM)</span>
              </>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">{paper?.code}: {paper?.shortName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400">Cat {chapter.category} ({chapter.weightageEstimate})</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight max-w-3xl leading-snug">
            {chapter.title}
          </h2>

          {/* Current Interval Phase */}
          {sessionStyle === 'intervals' && (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg text-xs bg-slate-900/90 border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${currentStage.phase === 'break' ? 'bg-emerald-400' : 'bg-indigo-400'} animate-pulse`} />
              <span className="text-slate-300 font-medium">{currentStage.stage}</span>
              <span className="text-slate-500 font-mono">({currentStage.remainingInStage}m remaining)</span>
            </div>
          )}
        </div>

        {/* Big Digital Clock Display */}
        <div className="my-4">
          <div className="font-mono text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-white drop-shadow-[0_0_35px_rgba(99,102,241,0.2)]">
            {formatHMS(timeLeft)}
          </div>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400 font-mono">
            <span>{slot === 'morning' ? '1.5-Hour Morning Slot (06:30 - 08:00)' : '3.5-Hour Evening Slot (08:00 - 12:00)'}</span>
            <span>•</span>
            <span>{Math.round(progressPct)}% Elapsed</span>
            <span>•</span>
            <span>{Math.round(elapsedSeconds / 60)} mins Studied</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto h-2 bg-slate-900 rounded-full mt-5 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Focus Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => setTimeLeft(INITIAL_DURATION)}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition-all active:scale-95"
            title="Reset 2.5h timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2.5 shadow-2xl transition-all cursor-pointer active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause Block
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Resume Deep Focus
              </>
            )}
          </button>

          <button
            onClick={handleCompleteSession}
            className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            title="Complete & Log Study Time"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Finish & Auto-Log</span>
          </button>
        </div>

        {/* Milestone Checkpoints Directly within the Deep Work View */}
        <div className="mt-8 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 max-w-xl w-full">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 text-left">
            Session Milestones for this Chapter:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onUpdateChapterMilestone(chapter.id, 'lectureDone', !chapter.milestones.lectureDone)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                chapter.milestones.lectureDone
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${chapter.milestones.lectureDone ? 'text-indigo-400' : 'text-slate-600'}`} />
              <span>Lecture</span>
            </button>

            <button
              onClick={() => onUpdateChapterMilestone(chapter.id, 'icaiSmDone', !chapter.milestones.icaiSmDone)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                chapter.milestones.icaiSmDone
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${chapter.milestones.icaiSmDone ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>ICAI SM</span>
            </button>

            <button
              onClick={() => onUpdateChapterMilestone(chapter.id, 'rtpPyqDone', !chapter.milestones.rtpPyqDone)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                chapter.milestones.rtpPyqDone
                  ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${chapter.milestones.rtpPyqDone ? 'text-cyan-400' : 'text-slate-600'}`} />
              <span>RTP / PYQ</span>
            </button>

            <button
              onClick={() => onUpdateChapterMilestone(chapter.id, 'revised2x', !chapter.milestones.revised2x)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                chapter.milestones.revised2x
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${chapter.milestones.revised2x ? 'text-purple-400' : 'text-slate-600'}`} />
              <span>Revised 2x</span>
            </button>
          </div>
        </div>

        {/* Quick In-Session Scratchpad for Working Notes & Section References */}
        <div className="mt-4 max-w-xl w-full">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-start gap-2">
            <FileEdit className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              placeholder="Session scratchpad: jot down tricky balance sheet adjustments, Section numbers, or doubts..."
              rows={2}
              className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Motivational CA Affirmation */}
      <div className="relative z-10 p-5 border-t border-slate-800/60 bg-slate-950/70 text-center">
        <p className="text-xs sm:text-sm font-medium text-slate-400 italic max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>"{CA_QUOTES[quoteIndex]}"</span>
        </p>
      </div>

      {/* Emergency Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Unlock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Unlock Deep Work Session?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have studied for <strong className="text-indigo-400">{elapsedMinutes} minutes</strong> so far. Would you like to log this study time before unlocking the interface?
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleCompleteSession}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
              >
                Log {elapsedMinutes}m & Unlock
              </button>

              <button
                onClick={handleEmergencyExit}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer transition-all"
              >
                Unlock Without Saving Hours
              </button>

              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
              >
                Resume Deep Work
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
