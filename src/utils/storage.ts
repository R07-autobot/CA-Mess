import { INITIAL_CHAPTERS } from '../data/icaiSyllabus';
import { generateInitialDailySchedule } from '../data/dailyStudySchedule';
import { Chapter, PlannerState, StudyLogEntry } from '../types/ca-study';
import { generateTopicResources, cleanTopicTitle } from './topicResources';

const STORAGE_KEY = 'ca_inter_may_2027_planner_v1';

export function getDefaultState(): PlannerState {
  const chaptersMap: Record<string, Chapter> = {};
  INITIAL_CHAPTERS.forEach((ch) => {
    chaptersMap[ch.id] = { ...ch, milestones: { ...ch.milestones } };
  });

  return {
    version: 1,
    startDate: '2026-10-26',
    examDate: '2027-05-01',
    theme: 'midnight',
    chapters: chaptersMap,
    studyLogs: {},
    dailyPlans: generateInitialDailySchedule('2026-10-26'),
    backlogConfig: {
      dailyTargetHours: 5.0,
      morningSlotHours: 1.5,
      eveningSlotHours: 3.5,
      maxDailyCap: 5.5,
      weekendBufferHours: 1.5,
      redistributionDays: 7,
    },
    streakCount: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    morningSlotTime: '06:30 - 08:00 (1.5h)',
    eveningSlotTime: '20:00 - 00:00 (3.5h)',
  };
}

export function loadPlannerState(): PlannerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultState();
    }
    const parsed = JSON.parse(raw) as PlannerState;
    if (!parsed.theme) parsed.theme = 'midnight';
    // Merge any missing chapters if syllabus updated
    INITIAL_CHAPTERS.forEach((ch) => {
      if (!parsed.chapters[ch.id]) {
        parsed.chapters[ch.id] = ch;
      }
    });
    // Ensure Day 1 starts from 26-Oct-26
    const firstPlanDate = Object.keys(parsed.dailyPlans || {})[0];
    if (
      !parsed.dailyPlans ||
      Object.keys(parsed.dailyPlans).length === 0 ||
      firstPlanDate !== '2026-10-26' ||
      parsed.startDate !== '2026-10-26'
    ) {
      parsed.dailyPlans = generateInitialDailySchedule('2026-10-26');
      parsed.startDate = '2026-10-26';
    } else {
      // Migrate allocatedMinutes and ensure links have topic-specific redirectable Free and Paid resources
      Object.entries(parsed.dailyPlans).forEach(([_, p]) => {
        if (p.morningTopic) {
          if (!p.morningTopic.allocatedMinutes || p.morningTopic.allocatedMinutes === 150) {
            p.morningTopic.allocatedMinutes = 90;
          }
          const cleanMorning = cleanTopicTitle(p.morningTopic.chapterTitle);
          const hasTopicSpecificLinks = p.morningTopic.links?.some((l) => l.title.includes(cleanMorning));
          const userCustom = (p.morningTopic.links || []).filter((l) => l.id?.startsWith('custom_') || l.id?.startsWith('link_user_'));

          if (!hasTopicSpecificLinks || !p.morningTopic.links || p.morningTopic.links.length === 0) {
            const topicLinks = generateTopicResources(
              p.morningTopic.paperShortName,
              p.morningTopic.paperCode,
              p.morningTopic.chapterTitle,
              p.morningTopic.subtopics
            );
            p.morningTopic.links = [...topicLinks, ...userCustom];
          } else {
            p.morningTopic.links.forEach((l) => {
              if (!l.costType) l.costType = 'free';
            });
          }
        }

        if (p.eveningTopic) {
          if (!p.eveningTopic.allocatedMinutes || p.eveningTopic.allocatedMinutes === 150) {
            p.eveningTopic.allocatedMinutes = 210;
          }
          const cleanEvening = cleanTopicTitle(p.eveningTopic.chapterTitle);
          const hasTopicSpecificLinks = p.eveningTopic.links?.some((l) => l.title.includes(cleanEvening));
          const userCustom = (p.eveningTopic.links || []).filter((l) => l.id?.startsWith('custom_') || l.id?.startsWith('link_user_'));

          if (!hasTopicSpecificLinks || !p.eveningTopic.links || p.eveningTopic.links.length === 0) {
            const topicLinks = generateTopicResources(
              p.eveningTopic.paperShortName,
              p.eveningTopic.paperCode,
              p.eveningTopic.chapterTitle,
              p.eveningTopic.subtopics
            );
            p.eveningTopic.links = [...topicLinks, ...userCustom];
          } else {
            p.eveningTopic.links.forEach((l) => {
              if (!l.costType) l.costType = 'free';
            });
          }
        }
      });
    }

    // Migrate slot hours to new 1.5h / 3.5h user schedule
    if (!parsed.backlogConfig || parsed.backlogConfig.morningSlotHours === 2.5) {
      parsed.backlogConfig = {
        ...parsed.backlogConfig,
        dailyTargetHours: 5.0,
        morningSlotHours: 1.5,
        eveningSlotHours: 3.5,
        maxDailyCap: parsed.backlogConfig?.maxDailyCap || 5.5,
        weekendBufferHours: parsed.backlogConfig?.weekendBufferHours ?? 1.5,
        redistributionDays: parsed.backlogConfig?.redistributionDays || 7,
      };
    }
    parsed.morningSlotTime = '06:30 - 08:00 (1.5h)';
    parsed.eveningSlotTime = '20:00 - 00:00 (3.5h)';

    return parsed;
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    return getDefaultState();
  }
}

export function savePlannerState(state: PlannerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}

/**
 * Generates rich realistic sample progress for a working CA student
 * (Several chapters marked with Lectures Done, ICAI SM Solved, RTPs, and a few days of logs with a slight backlog)
 */
export function getSampleState(): PlannerState {
  const base = getDefaultState();

  // Mark some chapters with progress
  const sampleCompletedChapterIds = [
    'p1_ch2', // AS 1, 2, 3
    'p1_ch3', // AS 10, 11, 12, 13, 16
    'p2_ch2', // Prospectus
    'p2_ch3', // Share Capital
    'p2_ch6', // Management & Admin
    'p3_ch1', // DT Basics & Residential Status
    'p3_ch2', // DT Salaries
    'p3_ch11', // GST Supply & Charge
    'p4_ch2', // Costing Material
    'p4_ch3', // Costing Employee Cost
    'p4_ch5', // ABC Costing
    'p5_ch1', // Audit Scope & SQC 1
    'p6_ch3', // FM Ratio Analysis
    'p6_ch4', // FM Cost of Capital
    'p6_ch10', // SM Intro
  ];

  sampleCompletedChapterIds.forEach((id, idx) => {
    if (base.chapters[id]) {
      base.chapters[id].milestones.lectureDone = true;
      base.chapters[id].milestones.icaiSmDone = true;
      if (idx % 2 === 0) {
        base.chapters[id].milestones.rtpPyqDone = true;
        base.chapters[id].milestones.revisionCount = 1;
      }
      if (idx === 0 || idx === 3) {
        base.chapters[id].milestones.revised2x = true;
        base.chapters[id].milestones.revisionCount = 2;
      }
    }
  });

  // Generate 14 days of realistic logs up to today
  const today = new Date();
  const logs: Record<string, StudyLogEntry> = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Simulate busy days where work ran late (e.g. month-end or audit)
    let morningH = 2.5;
    let eveningH = 2.5;
    let notes = '';

    if (i === 1) {
      // Yesterday office emergency
      morningH = 2.5;
      eveningH = 0.5;
      notes = 'Client audit deadline ran late; had to cut evening Costing session short.';
    } else if (i === 4) {
      // Travel day
      morningH = 2.0;
      eveningH = 1.5;
      notes = 'Office commute delay. Completed 1 pomodoro of Corporate Law.';
    } else if (i === 7) {
      // Weekend catchup
      morningH = 2.5;
      eveningH = 3.0;
      notes = 'Sunday extra marathon: Finished AS 10 & 16 numericals.';
    }

    const total = morningH + eveningH;
    logs[dateStr] = {
      id: `log_${dateStr}`,
      date: dateStr,
      morningHours: morningH,
      eveningHours: eveningH,
      morningChapterId: 'p2_ch6',
      eveningChapterId: 'p1_ch3',
      morningNotes: 'Section 96 to 105 meetings provisions and quorum revisions.',
      eveningNotes: notes || 'Solved 6 comprehensive illustration problems from ICAI SM.',
      completedPomodoros: Math.round(total / 0.8),
      status: total >= 5.0 ? 'met_goal' : total >= 2.5 ? 'partial' : 'missed',
    };
  }

  base.studyLogs = logs;
  base.streakCount = 6;

  return base;
}

export function exportStateAsJSON(state: PlannerState): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CA_Inter_May_2027_Study_Plan_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
