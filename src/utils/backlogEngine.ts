import { BacklogConfig, Chapter, StudyLogEntry } from '../types/ca-study';

export interface CountdownStats {
  targetDate: Date;
  daysRemaining: number;
  hoursRemainingTotal: number;
  minutesRemainingTotal: number;
  secondsRemainingTotal: number;
  totalDays: number;
  workingDays: number;
  weekends: number;
  totalCapacityHours: number;
  formattedTarget: string;
}

export interface CapacityMetrics {
  totalSyllabusHours: number;
  hoursCompleted: number;
  hoursRemaining: number;
  totalCapacityHours: number;
  capacityUtilizationPct: number;
  completionRatePct: number;
  daysRemaining: number;
  requiredDailyVelocity: number; // hours/day needed
  baselineVelocity: number;      // 5.0 hours/day baseline
  velocityDeficit: number;
  status: 'ahead' | 'on_track' | 'needs_attention' | 'critical';
}

export interface BacklogAnalysis {
  totalLoggedHours: number;
  expectedLoggedHours: number;
  netDeficitHours: number; // positive means backlog!
  daysLogged: number;
  averageDailyHours: number;
  rebalancePlan: {
    daysToRecover: number;
    extraMinutesPerWeekday: number;
    extraMinutesPerWeekend: number;
    adjustedWeekdayHours: number;
    adjustedWeekendHours: number;
    maxDailyCapViolated: boolean;
    explanation: string;
  };
}

/**
 * Calculates countdown from now to May 1, 2027 09:00 AM IST
 */
export function getExamCountdown(targetDateStr: string = '2027-05-01'): CountdownStats {
  const now = new Date();
  const target = new Date(`${targetDateStr}T09:00:00`);
  const diffMs = Math.max(0, target.getTime() - now.getTime());

  const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursRemainingTotal = Math.floor(diffMs / (1000 * 60 * 60));
  const minutesRemainingTotal = Math.floor(diffMs / (1000 * 60));
  const secondsRemainingTotal = Math.floor(diffMs / 1000);

  // Count working days (Mon-Fri) vs weekends (Sat-Sun)
  let workingDays = 0;
  let weekends = 0;
  const temp = new Date(now.getTime());
  while (temp <= target) {
    const day = temp.getDay();
    if (day === 0 || day === 6) {
      weekends++;
    } else {
      workingDays++;
    }
    temp.setDate(temp.getDate() + 1);
  }

  // 5 hours/day baseline
  const totalCapacityHours = daysRemaining * 5;

  return {
    targetDate: target,
    daysRemaining,
    hoursRemainingTotal,
    minutesRemainingTotal,
    secondsRemainingTotal,
    totalDays: daysRemaining,
    workingDays,
    weekends,
    totalCapacityHours,
    formattedTarget: target.toLocaleDateString('en-IN', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

/**
 * Calculates syllabus capacity and velocity metrics based on attempt portion (Both Groups, Group 1 Only, or Group 2 Only)
 */
export function calculateCapacityMetrics(
  chapters: Record<string, Chapter>,
  studyLogs: Record<string, StudyLogEntry>,
  examDateStr: string = '2027-05-01',
  baselineDaily: number = 5,
  portion: 'both' | 'group1' | 'group2' = 'both'
): CapacityMetrics {
  const allChapters = Object.values(chapters);
  const chapterList = allChapters.filter((ch) => {
    if (portion === 'group1') return ch.group === 1;
    if (portion === 'group2') return ch.group === 2;
    return true;
  });
  const totalSyllabusHours = chapterList.reduce((acc, ch) => acc + ch.estimatedHours, 0);

  // Hours completed calculated from study logs
  const logEntries = Object.values(studyLogs);
  const hoursCompleted = logEntries.reduce((acc, entry) => acc + (entry.morningHours + entry.eveningHours), 0);

  const hoursRemaining = Math.max(0, totalSyllabusHours - hoursCompleted);
  const countdown = getExamCountdown(examDateStr);
  const daysRemaining = Math.max(1, countdown.daysRemaining);

  const totalCapacityHours = daysRemaining * baselineDaily;
  const capacityUtilizationPct = totalCapacityHours > 0
    ? Math.min(100, (hoursRemaining / totalCapacityHours) * 100)
    : 100;

  const completionRatePct = totalSyllabusHours > 0
    ? Math.min(100, (hoursCompleted / totalSyllabusHours) * 100)
    : 0;

  // Required daily study hours to finish syllabus + 2 revisions
  const requiredDailyVelocity = Number((hoursRemaining / daysRemaining).toFixed(2));
  const velocityDeficit = Number((requiredDailyVelocity - baselineDaily).toFixed(2));

  let status: 'ahead' | 'on_track' | 'needs_attention' | 'critical' = 'on_track';
  if (requiredDailyVelocity <= baselineDaily * 0.85) {
    status = 'ahead';
  } else if (requiredDailyVelocity <= baselineDaily) {
    status = 'on_track';
  } else if (requiredDailyVelocity <= baselineDaily * 1.15) {
    status = 'needs_attention';
  } else {
    status = 'critical';
  }

  return {
    totalSyllabusHours,
    hoursCompleted: Number(hoursCompleted.toFixed(1)),
    hoursRemaining: Number(hoursRemaining.toFixed(1)),
    totalCapacityHours,
    capacityUtilizationPct: Number(capacityUtilizationPct.toFixed(1)),
    completionRatePct: Number(completionRatePct.toFixed(1)),
    daysRemaining,
    requiredDailyVelocity,
    baselineVelocity: baselineDaily,
    velocityDeficit,
    status,
  };
}

/**
 * Backlog Auto-balancer
 * Calculates deficit from missed study hours and redistributes safely across upcoming days
 * strictly capping the daily load to prevent working professional burnout!
 */
export function analyzeBacklog(
  studyLogs: Record<string, StudyLogEntry>,
  config: BacklogConfig
): BacklogAnalysis {
  const logEntries = Object.values(studyLogs);
  const daysLogged = logEntries.length;

  const totalLoggedHours = logEntries.reduce(
    (acc, entry) => acc + (entry.morningHours + entry.eveningHours),
    0
  );

  // Expected hours is daysLogged * dailyTargetHours (5h)
  const expectedLoggedHours = daysLogged * config.dailyTargetHours;
  const netDeficitHours = Math.max(0, expectedLoggedHours - totalLoggedHours);
  const averageDailyHours = daysLogged > 0 ? Number((totalLoggedHours / daysLogged).toFixed(1)) : 0;

  // Rebalancing algorithm
  // Max extra hours allowable per day = config.maxDailyCap - config.dailyTargetHours (e.g. 5.5 - 5.0 = 0.5 hr / 30 mins)
  const maxExtraDaily = Math.max(0.1, config.maxDailyCap - config.dailyTargetHours);
  const maxWeekendExtra = config.weekendBufferHours; // e.g. 1.5 extra on weekends

  // Calculate rebalance across redistributionDays (e.g. 7 days)
  const daysToRecover = config.redistributionDays;
  // Estimate ~5 weekdays and 2 weekend days in standard 7 day window
  const weekdaysInWindow = Math.round((daysToRecover * 5) / 7);
  const weekendDaysInWindow = daysToRecover - weekdaysInWindow;

  let extraMinutesPerWeekday = 0;
  let extraMinutesPerWeekend = 0;
  let maxDailyCapViolated = false;

  if (netDeficitHours > 0) {
    // Distribute heavier on weekends first (working professional has more bandwidth on weekend)
    const weekendCatchupCapacity = weekendDaysInWindow * maxWeekendExtra;
    const remainingDeficitAfterWeekends = Math.max(0, netDeficitHours - weekendCatchupCapacity);

    // Weekday extra hours
    const weekdayExtraHours = weekdaysInWindow > 0 ? remainingDeficitAfterWeekends / weekdaysInWindow : 0;

    if (weekdayExtraHours > maxExtraDaily) {
      maxDailyCapViolated = true;
      extraMinutesPerWeekday = Math.round(maxExtraDaily * 60);
      extraMinutesPerWeekend = Math.round(maxWeekendExtra * 60);
    } else {
      extraMinutesPerWeekday = Math.round(weekdayExtraHours * 60);
      extraMinutesPerWeekend = Math.round(
        Math.min(maxWeekendExtra, (netDeficitHours - weekdayExtraHours * weekdaysInWindow) / (weekendDaysInWindow || 1)) * 60
      );
    }
  }

  const adjustedWeekdayHours = Number((config.dailyTargetHours + extraMinutesPerWeekday / 60).toFixed(2));
  const adjustedWeekendHours = Number((config.dailyTargetHours + extraMinutesPerWeekend / 60).toFixed(2));

  let explanation = '';
  if (netDeficitHours === 0) {
    explanation = 'Perfect streak! You have zero accumulated backlog. Keep up the rigid 5-hour daily protocol.';
  } else if (maxDailyCapViolated) {
    explanation = `Backlog is ${netDeficitHours.toFixed(1)} hrs. To safeguard your working schedule, it is capped at max ${config.maxDailyCap}h/day (+${extraMinutesPerWeekday}m on weekdays and +${extraMinutesPerWeekend}m on weekends) spanning over ${Math.ceil(netDeficitHours / (maxExtraDaily * 5 + maxWeekendExtra * 2) * 7)} days.`;
  } else {
    explanation = `Recovering ${netDeficitHours.toFixed(1)} hrs backlog smoothly over ${daysToRecover} days: adding +${extraMinutesPerWeekday} mins on weekdays and +${extraMinutesPerWeekend} mins on weekends, safely below your rigid ${config.maxDailyCap}h cap.`;
  }

  return {
    totalLoggedHours: Number(totalLoggedHours.toFixed(1)),
    expectedLoggedHours: Number(expectedLoggedHours.toFixed(1)),
    netDeficitHours: Number(netDeficitHours.toFixed(1)),
    daysLogged,
    averageDailyHours,
    rebalancePlan: {
      daysToRecover,
      extraMinutesPerWeekday,
      extraMinutesPerWeekend,
      adjustedWeekdayHours,
      adjustedWeekendHours,
      maxDailyCapViolated,
      explanation,
    },
  };
}
