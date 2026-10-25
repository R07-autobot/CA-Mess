import React, { useState } from 'react';
import { Chapter, StudyLogEntry } from '../types/ca-study';
import { 
  X, 
  Clock, 
  Sun, 
  Moon, 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  existingLog?: StudyLogEntry;
  chapters: Record<string, Chapter>;
  onSaveLog: (log: StudyLogEntry) => void;
  onTriggerBacklog: () => void;
  dailyTargetHours?: number;
  morningSlotHours?: number;
  eveningSlotHours?: number;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  existingLog,
  chapters,
  onSaveLog,
  onTriggerBacklog,
  dailyTargetHours = 5.0,
  morningSlotHours = 1.5,
  eveningSlotHours = 3.5,
}) => {
  const [morningHours, setMorningHours] = useState<number>(existingLog?.morningHours ?? morningSlotHours);
  const [eveningHours, setEveningHours] = useState<number>(existingLog?.eveningHours ?? eveningSlotHours);
  const [morningChapterId, setMorningChapterId] = useState<string>(
    existingLog?.morningChapterId || 'p2_ch6'
  );
  const [eveningChapterId, setEveningChapterId] = useState<string>(
    existingLog?.eveningChapterId || 'p1_ch3'
  );
  const [morningNotes, setMorningNotes] = useState<string>(existingLog?.morningNotes || '');
  const [eveningNotes, setEveningNotes] = useState<string>(existingLog?.eveningNotes || '');
  const [pomodoros, setPomodoros] = useState<number>(existingLog?.completedPomodoros ?? (dailyTargetHours >= 8 ? 8 : 5));

  if (!isOpen) return null;

  const total = Number((morningHours + eveningHours).toFixed(2));
  const deficit = Math.max(0, dailyTargetHours - total);
  const isGoalMet = total >= dailyTargetHours;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: StudyLogEntry = {
      id: existingLog?.id || `log_${dateStr}`,
      date: dateStr,
      morningHours,
      eveningHours,
      morningChapterId,
      eveningChapterId,
      morningNotes,
      eveningNotes,
      completedPomodoros: pomodoros,
      status: total >= dailyTargetHours ? 'met_goal' : total >= dailyTargetHours * 0.5 ? 'partial' : 'missed',
    };

    onSaveLog(entry);

    if (isGoalMet) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {}
    }

    onClose();
  };

  const chapterList = Object.values(chapters);
  const theoryChapters = chapterList.filter((c) => c.type === 'theory' || c.paperId === 'p2_corp_law' || c.paperId === 'p5_audit');
  const practicalChapters = chapterList.filter((c) => c.type === 'practical' || c.paperId === 'p1_adv_acc' || c.paperId === 'p4_costing' || c.paperId === 'p6_fm_sm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100 p-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Daily 5-Hour Study Logger</h2>
            <p className="text-xs text-slate-400">
              Date: <span className="font-semibold text-slate-200">{dateStr}</span> • Rigid 2.5h Morning + 2.5h Evening split
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {/* Total Overview & Target Meter */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Logged Today</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-3xl font-black font-mono ${isGoalMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {total}h
                </span>
                <span className="text-xs text-slate-400">/ 5.0h Target</span>
              </div>
            </div>

            <div className="text-right">
              {isGoalMet ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5h Goal Met!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <AlertCircle className="w-3.5 h-3.5" /> {deficit.toFixed(1)}h Deficit
                </span>
              )}
              {deficit > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerBacklog();
                  }}
                  className="block mt-1 text-[11px] text-amber-400 hover:text-amber-300 underline text-right cursor-pointer"
                >
                  Auto-Balance Deficit →
                </button>
              )}
            </div>
          </div>

          {/* Morning Slot Block */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Sun className="w-4 h-4" />
                <span>Morning Focus Slot</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Target: {morningSlotHours}h</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hours Studied:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(morningSlotHours + 1.5, 4.0)}
                    step="0.25"
                    value={morningHours}
                    onChange={(e) => setMorningHours(parseFloat(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="font-mono font-bold text-white text-base min-w-[50px] text-right">
                    {morningHours.toFixed(2)}h
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[0, morningSlotHours * 0.5, morningSlotHours * 0.75, morningSlotHours].map((val) => {
                    const rounded = Number(val.toFixed(2));
                    return (
                      <button
                        type="button"
                        key={rounded}
                        onClick={() => setMorningHours(rounded)}
                        className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                          morningHours === rounded
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {rounded === morningSlotHours ? `${rounded}h (Target)` : `${rounded}h`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Chapter Studied:</label>
                <select
                  value={morningChapterId}
                  onChange={(e) => setMorningChapterId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                >
                  <optgroup label="Theory & Law (Recommended for Morning)">
                    {theoryChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category} - {c.weightageEstimate})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Chapters">
                    {practicalChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Notes (e.g. Covered Sec 96 AGM, Quorum & Proxy rules)"
                  value={morningNotes}
                  onChange={(e) => setMorningNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Evening Slot: 3.5h Practical Focus */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                <Moon className="w-4 h-4" />
                <span>Evening Focus Slot</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Target: {eveningSlotHours}h</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hours Studied:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(eveningSlotHours + 2.0, 5.0)}
                    step="0.25"
                    value={eveningHours}
                    onChange={(e) => setEveningHours(parseFloat(e.target.value))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="font-mono font-bold text-white text-base min-w-[50px] text-right">
                    {eveningHours.toFixed(2)}h
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[0, eveningSlotHours * 0.5, eveningSlotHours * 0.75, eveningSlotHours].map((val) => {
                    const rounded = Number(val.toFixed(2));
                    return (
                      <button
                        type="button"
                        key={rounded}
                        onClick={() => setEveningHours(rounded)}
                        className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                          eveningHours === rounded
                            ? 'bg-blue-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {rounded === eveningSlotHours ? `${rounded}h (Target)` : `${rounded}h`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Chapter Studied:</label>
                <select
                  value={eveningChapterId}
                  onChange={(e) => setEveningChapterId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                >
                  <optgroup label="Practical & Numerical (Recommended for Evening)">
                    {practicalChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category} - {c.weightageEstimate})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Chapters">
                    {theoryChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Notes (e.g. Solved 7 illustrations from ICAI SM Chapter 4)"
                  value={eveningNotes}
                  onChange={(e) => setEveningNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Pomodoros Count */}
          <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400">Pomodoro focus cycles completed today:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPomodoros(Math.max(0, pomodoros - 1))}
                className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer font-bold"
              >
                -
              </button>
              <span className="font-mono font-bold text-white min-w-[20px] text-center">{pomodoros}</span>
              <button
                type="button"
                onClick={() => setPomodoros(pomodoros + 1)}
                className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Study Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
