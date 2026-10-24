import React from 'react';
import { PlannerState } from '../types/ca-study';
import { ICAI_PAPERS } from '../data/icaiSyllabus';
import { 
  Flame, 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Target,
  Clock
} from 'lucide-react';

interface AnalyticsAndStreaksProps {
  state: PlannerState;
}

export const AnalyticsAndStreaks: React.FC<AnalyticsAndStreaksProps> = ({ state }) => {
  const chapters = Object.values(state.chapters);
  const totalChapters = chapters.length;

  const lecturesCount = chapters.filter((c) => c.milestones.lectureDone).length;
  const icaiSmCount = chapters.filter((c) => c.milestones.icaiSmDone).length;
  const rtpPyqCount = chapters.filter((c) => c.milestones.rtpPyqDone).length;
  const revised2xCount = chapters.filter((c) => c.milestones.revised2x).length;

  // Last 35 days heatmap
  const today = new Date();
  const heatmapDays = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = state.studyLogs[dateStr];
    const hours = log ? log.morningHours + log.eveningHours : 0;
    heatmapDays.push({
      dateStr,
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayOfMonth: d.getDate(),
      hours,
    });
  }

  // Paper hours & chapter counts
  const paperStats = ICAI_PAPERS.map((paper) => {
    const paperChapters = chapters.filter((c) => c.paperId === paper.id);
    const completedChapters = paperChapters.filter((c) => c.milestones.icaiSmDone).length;
    const pct = paperChapters.length > 0 ? Math.round((completedChapters / paperChapters.length) * 100) : 0;

    // Estimate logged hours on this paper
    const paperLoggedHours = Object.values(state.studyLogs).reduce((acc, log) => {
      let h = 0;
      if (log.morningChapterId && state.chapters[log.morningChapterId]?.paperId === paper.id) {
        h += log.morningHours;
      }
      if (log.eveningChapterId && state.chapters[log.eveningChapterId]?.paperId === paper.id) {
        h += log.eveningHours;
      }
      return acc + h;
    }, 0);

    return {
      paper,
      totalChapters: paperChapters.length,
      completedChapters,
      pct,
      loggedHours: Number(paperLoggedHours.toFixed(1)),
    };
  });

  return (
    <div className="space-y-6">
      {/* Top 4 Milestone KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>Lectures Watched</span>
            <span className="text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
              {Math.round((lecturesCount / totalChapters) * 100)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white">{lecturesCount}</span>
            <span className="text-xs text-slate-500">/ {totalChapters}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(lecturesCount / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
            <span>ICAI SM Solved</span>
            <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
              {Math.round((icaiSmCount / totalChapters) * 100)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-400">{icaiSmCount}</span>
            <span className="text-xs text-slate-500">/ {totalChapters}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(icaiSmCount / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-medium">
            <span>RTP / PYQ Done</span>
            <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded font-mono">
              {Math.round((rtpPyqCount / totalChapters) * 100)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-cyan-400">{rtpPyqCount}</span>
            <span className="text-xs text-slate-500">/ {totalChapters}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${(rtpPyqCount / totalChapters) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-purple-400 font-medium">
            <span>Revised 2x Minimum</span>
            <span className="text-[10px] bg-purple-500/10 px-2 py-0.5 rounded font-mono">
              {Math.round((revised2xCount / totalChapters) * 100)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-purple-400">{revised2xCount}</span>
            <span className="text-xs text-slate-500">/ {totalChapters}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(revised2xCount / totalChapters) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 35-Day Consistency Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold text-white">
              Working Professional Consistency Grid (Past 35 Days)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>&lt;2h</span>
            <span className="w-3 h-3 rounded bg-slate-800 inline-block" />
            <span className="w-3 h-3 rounded bg-indigo-900/50 inline-block" />
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>5.0h+ Goal</span>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-7 md:grid-cols-7 gap-2">
          {heatmapDays.map((d) => {
            let bgColor = 'bg-slate-800/60 border-slate-800';
            let textColor = 'text-slate-500';

            if (d.hours >= 5.0) {
              bgColor = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
              textColor = 'text-slate-950';
            } else if (d.hours >= 3.5) {
              bgColor = 'bg-indigo-600 text-white font-semibold border-indigo-500';
              textColor = 'text-white';
            } else if (d.hours > 0) {
              bgColor = 'bg-indigo-900/60 text-indigo-200 border-indigo-700/50';
              textColor = 'text-indigo-200';
            }

            return (
              <div
                key={d.dateStr}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 ${bgColor}`}
                title={`${d.dateStr}: ${d.hours} hours logged`}
              >
                <span className="text-[10px] uppercase font-mono opacity-80">{d.dayOfWeek}</span>
                <span className="text-xs font-bold font-mono">{d.dayOfMonth}</span>
                <span className="text-[10px] font-mono mt-0.5">
                  {d.hours > 0 ? `${d.hours.toFixed(1)}h` : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 ICAI Papers Progress Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Subject Mastery & Hours Distribution</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paperStats.map(({ paper, totalChapters, completedChapters, pct, loggedHours }) => (
            <div
              key={paper.id}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{paper.code}</span>
                  <span className="text-slate-400 font-mono">{pct}% ICAI SM</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 truncate">{paper.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  {completedChapters} of {totalChapters} chapters completed
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> Logged Study:
                </span>
                <span className="font-mono font-bold text-indigo-300">{loggedHours} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
