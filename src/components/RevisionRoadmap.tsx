import React from 'react';
import { 
  Milestone, 
  CheckCircle2, 
  Calendar, 
  Award, 
  ShieldAlert, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';

export const RevisionRoadmap: React.FC = () => {
  const phases = [
    {
      phaseNumber: 1,
      title: 'First Comprehensive Run (Foundation & Concept Building)',
      timeframe: 'October 2026 – January 2027',
      targetCoverage: '100% Lectures + ICAI Study Material Illustrations',
      dailyAllocation: '5h / day (2.5h Morning Theory + 2.5h Evening Practical)',
      badge: 'Current Target',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      milestones: [
        'Watch lectures and make concise handwritten summary notes',
        'Solve 100% of ICAI SM Back Questions and In-chapter Illustrations in writing',
        'Tag tricky problems with ★ for Revision 1 (Do not re-solve all 100 questions)',
        'Maintain zero cumulative backlog via the Backlog Auto-Balancer',
      ],
    },
    {
      phaseNumber: 2,
      title: 'First Rigorous Revision + RTPs & Past 5 Years PYQ',
      timeframe: 'February 2027 – March 2027',
      targetCoverage: 'RTPs (Past 4 attempts) + ICAI Past Papers + Star-marked SM problems',
      dailyAllocation: '5h / day + 1.5h weekend buffers for mock papers',
      badge: 'High Yield Phase',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      milestones: [
        'Revise all Category A chapters first (70% weightage rule)',
        'Solve ICAI Revision Test Papers (RTP) under 3-hour exam pressure',
        'Prepare 1-page formula cheat sheets for FM, Costing & AS 10/16/20/22',
        'Verify SA 500 series and Companies Act Section numbers memory retention',
      ],
    },
    {
      phaseNumber: 3,
      title: 'Second Revision + ICAI Official MTPs (Mock Tests)',
      timeframe: 'April 2027',
      targetCoverage: '2 Full Mock Tests per paper (Series 1 & Series 2 ICAI MTPs)',
      dailyAllocation: '5h – 5.5h / day (Apply study leave from office if possible)',
      badge: 'Exam Simulation',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      milestones: [
        'Simulate 2:00 PM to 5:00 PM ICAI examination conditions on weekends',
        'Self-evaluate against ICAI suggested answers with step marking',
        'Complete second full pass of all 6 papers (Revise 2x checkbox completed)',
        'Audit presentation & working note disclosure polishing',
      ],
    },
    {
      phaseNumber: 4,
      title: '1.5-Day Marathon Mastery (Exam Execution)',
      timeframe: 'May 1 – May 15, 2027',
      targetCoverage: '36-Hour Rapid Revision Cycle Between Consecutive Papers',
      dailyAllocation: 'Exam Execution Protocol',
      badge: 'Chartered Triumph',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      milestones: [
        'Strictly follow pre-prepared 1.5-day schedule (Never touch new books)',
        'Day 1 evening (4h): Category A high-weightage chapters',
        'Day 2 full day (10h): Category B & C chapters + RTP MCQs',
        'Exam Day morning (3h): Formula sheets, AS/SA indices, and key sections',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Working Professional CA Intermediate Roadmap to May 2027
            </h2>
            <p className="text-xs text-slate-300">
              A disciplined, non-negotiable blueprint tailored for working 8–9 hours at office while securing both groups.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Phases Timeline */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <div
            key={phase.phaseNumber}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-800 text-indigo-400 font-black text-sm flex items-center justify-center font-mono">
                  {phase.phaseNumber}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">{phase.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {phase.timeframe}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${phase.badgeColor}`}>
                  {phase.badge}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 mb-4">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] font-medium">Core Target Coverage</span>
                <span className="text-white font-semibold mt-1 block">{phase.targetCoverage}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px] font-medium">Daily Study Allocation</span>
                <span className="text-indigo-300 font-semibold mt-1 block">{phase.dailyAllocation}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Non-Negotiable Execution Checkpoints:</span>
              <ul className="space-y-1.5">
                {phase.milestones.map((ms, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{ms}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CA Working Professional Golden Rules */}
      <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
          <ShieldAlert className="w-4 h-4" />
          <span>The Working Professional's CA Oath (Why 5 Hours Daily Beats 14 Hours Weekend Cramming)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <strong className="text-white block mb-1">1. Morning Theory Immunity</strong>
            <span>
              Never leave Corporate Law, SAs, or FEMA for evening after office. Your decision-making fatigue guarantees low retention. Morning 06:00 to 08:30 AM is sacred.
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <strong className="text-white block mb-1">2. Evening Pen-on-Paper Rule</strong>
            <span>
              Evening sessions must be numerical. Writing ledger accounts or calculating variance keeps adrenaline active and prevents sleepiness.
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <strong className="text-white block mb-1">3. Rigid Backlog Respect</strong>
            <span>
              When office emergency strikes, do not attempt a dangerous 8-hour sprint the next day. Trust the Backlog Balancer to smooth it over 7 days within your 5.5h cap.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
