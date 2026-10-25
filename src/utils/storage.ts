import { INITIAL_CHAPTERS } from '../data/icaiSyllabus';
import { CA_FINAL_CHAPTERS } from '../data/icaiFinalSyllabus';
import { CA_FOUNDATION_CHAPTERS } from '../data/icaiFoundationSyllabus';
import { generateInitialDailySchedule } from '../data/dailyStudySchedule';
import { generateInitialDailyFinalSchedule } from '../data/dailyFinalSchedule';
import { generateInitialDailyFoundationSchedule } from '../data/dailyFoundationSchedule';
import { Chapter, PlannerState, StudyLogEntry, CourseLevel, AttemptPortion, ExamSession, UserPersona } from '../types/ca-study';
import { generateTopicResources, cleanTopicTitle } from './topicResources';
import { calculateSlotDuration } from './timeSlots';

export const STORAGE_KEY_FOUNDATION = 'ca_foundation_may_2027_planner_v1';
export const STORAGE_KEY_INTER = 'ca_inter_may_2027_planner_v1';
export const STORAGE_KEY_FINAL = 'ca_final_may_2027_planner_v1';
export const COURSE_LEVEL_KEY = 'ca_selected_course_level';
export const ATTEMPT_PORTION_KEY = 'ca_selected_attempt_portion';
export const EXAM_SESSION_KEY = 'ca_selected_exam_session';
export const USER_PERSONA_KEY = 'ca_selected_user_persona';

export function getUserPersona(): UserPersona {
  try {
    const val = localStorage.getItem(USER_PERSONA_KEY);
    if (val === 'student' || val === 'working_professional') return val;
  } catch (e) {}
  return 'working_professional';
}

export function setUserPersona(persona: UserPersona): void {
  try {
    localStorage.setItem(USER_PERSONA_KEY, persona);
  } catch (e) {}
}

export function updateCustomStudyHours(
  state: PlannerState,
  morningFrom: string,
  morningTo: string,
  eveningFrom: string,
  eveningTo: string,
  eveningBreakMinutes: number = 0
): PlannerState {
  const morningDur = calculateSlotDuration(morningFrom, morningTo, 0);
  const eveningDur = calculateSlotDuration(eveningFrom, eveningTo, eveningBreakMinutes);
  const totalHours = Number((morningDur.hours + eveningDur.hours).toFixed(1));

  const updatedPlans = { ...state.dailyPlans };
  Object.keys(updatedPlans).forEach((key) => {
    const p = updatedPlans[key];
    if (p) {
      updatedPlans[key] = {
        ...p,
        morningTopic: p.morningTopic
          ? { ...p.morningTopic, allocatedMinutes: morningDur.minutes }
          : p.morningTopic,
        eveningTopic: p.eveningTopic
          ? { ...p.eveningTopic, allocatedMinutes: eveningDur.minutes }
          : p.eveningTopic,
      };
    }
  });

  return {
    ...state,
    morningStartTime: morningFrom,
    morningEndTime: morningTo,
    eveningStartTime: eveningFrom,
    eveningEndTime: eveningTo,
    eveningBreakMinutes,
    morningSlotTime: morningDur.formattedRange,
    eveningSlotTime: eveningDur.formattedRange,
    backlogConfig: {
      ...state.backlogConfig,
      dailyTargetHours: totalHours,
      morningSlotHours: morningDur.hours,
      eveningSlotHours: eveningDur.hours,
      maxDailyCap: Math.max(totalHours + 1.0, 5.5),
    },
    dailyPlans: updatedPlans,
  };
}

export function applyPersonaToState(state: PlannerState, persona: UserPersona): PlannerState {
  const isStudent = persona === 'student';
  const dailyTargetHours = isStudent ? 8.0 : 5.0;
  const morningSlotHours = isStudent ? 4.0 : 1.5;
  const eveningSlotHours = isStudent ? 4.0 : 3.5;
  const maxDailyCap = isStudent ? 9.0 : 5.5;
  const morningStartTime = isStudent ? '07:00' : '06:30';
  const morningEndTime = isStudent ? '11:00' : '08:00';
  const eveningStartTime = isStudent ? '16:30' : '20:00';
  const eveningEndTime = isStudent ? '20:30' : '00:00';
  const eveningBreakMinutes = isStudent ? 0 : 30;

  const morningSlotTime = isStudent ? '07:00 - 11:00 (4.0h)' : '06:30 - 08:00 (1.5h)';
  const eveningSlotTime = isStudent ? '16:30 - 20:30 (4.0h)' : '20:00 - 00:00 (3.5h)';
  const morningAllocated = isStudent ? 240 : 90;
  const eveningAllocated = isStudent ? 240 : 210;

  setUserPersona(persona);

  const updatedPlans = { ...state.dailyPlans };
  Object.keys(updatedPlans).forEach((key) => {
    const p = updatedPlans[key];
    if (p) {
      updatedPlans[key] = {
        ...p,
        morningTopic: p.morningTopic
          ? {
              ...p.morningTopic,
              allocatedMinutes: morningAllocated,
            }
          : p.morningTopic,
        eveningTopic: p.eveningTopic
          ? {
              ...p.eveningTopic,
              allocatedMinutes: eveningAllocated,
            }
          : p.eveningTopic,
      };
    }
  });

  return {
    ...state,
    userPersona: persona,
    morningStartTime,
    morningEndTime,
    eveningStartTime,
    eveningEndTime,
    eveningBreakMinutes,
    morningSlotTime,
    eveningSlotTime,
    backlogConfig: {
      ...state.backlogConfig,
      dailyTargetHours,
      morningSlotHours,
      eveningSlotHours,
      maxDailyCap,
    },
    dailyPlans: updatedPlans,
  };
}

export function getSelectedCourseLevel(): CourseLevel | null {
  try {
    const val = localStorage.getItem(COURSE_LEVEL_KEY);
    if (val === 'foundation' || val === 'intermediate' || val === 'final') return val;
  } catch (e) {}
  return null;
}

export function setSelectedCourseLevel(level: CourseLevel): void {
  try {
    localStorage.setItem(COURSE_LEVEL_KEY, level);
  } catch (e) {}
}

export function getSelectedAttemptPortion(): AttemptPortion {
  try {
    const val = localStorage.getItem(ATTEMPT_PORTION_KEY);
    if (val === 'both' || val === 'group1' || val === 'group2') return val;
  } catch (e) {}
  return 'both';
}

export function setSelectedAttemptPortion(portion: AttemptPortion): void {
  try {
    localStorage.setItem(ATTEMPT_PORTION_KEY, portion);
  } catch (e) {}
}

export function getSelectedExamSession(): ExamSession {
  try {
    const val = localStorage.getItem(EXAM_SESSION_KEY);
    if (val === 'may_2027' || val === 'nov_2027' || val === 'jan_2027' || val === 'sept_2027') return val;
  } catch (e) {}
  return 'may_2027';
}

export function setSelectedExamSession(session: ExamSession): void {
  try {
    localStorage.setItem(EXAM_SESSION_KEY, session);
  } catch (e) {}
}

export function getTargetExamDate(session: ExamSession): string {
  switch (session) {
    case 'nov_2027':
      return '2027-11-01';
    case 'jan_2027':
      return '2027-01-15';
    case 'sept_2027':
      return '2027-09-15';
    case 'may_2027':
    default:
      return '2027-05-01';
  }
}

export function getDefaultState(
  level: CourseLevel = 'intermediate',
  portion: AttemptPortion = 'both',
  session: ExamSession = 'may_2027',
  persona: UserPersona = getUserPersona()
): PlannerState {
  const chaptersMap: Record<string, Chapter> = {};
  const chaptersList =
    level === 'foundation'
      ? CA_FOUNDATION_CHAPTERS
      : level === 'final'
      ? CA_FINAL_CHAPTERS
      : INITIAL_CHAPTERS;

  chaptersList.forEach((ch) => {
    chaptersMap[ch.id] = { ...ch, milestones: { ...ch.milestones } };
  });

  const examDate = getTargetExamDate(session);

  const dailyPlans =
    level === 'foundation'
      ? generateInitialDailyFoundationSchedule('2026-10-26', examDate, portion)
      : level === 'final'
      ? generateInitialDailyFinalSchedule('2026-10-26', examDate, portion)
      : generateInitialDailySchedule('2026-10-26', examDate, portion);

  const isStudent = persona === 'student';
  const dailyTargetHours = isStudent ? 8.0 : 5.0;
  const morningSlotHours = isStudent ? 4.0 : 1.5;
  const eveningSlotHours = isStudent ? 4.0 : 3.5;
  const maxDailyCap = isStudent ? 9.0 : 5.5;
  const morningSlotTime = isStudent ? '07:00 - 11:00 (4.0h)' : '06:30 - 08:00 (1.5h)';
  const eveningSlotTime = isStudent ? '16:30 - 20:30 (4.0h)' : '20:00 - 00:00 (3.5h)';
  const morningMinutes = isStudent ? 240 : 90;
  const eveningMinutes = isStudent ? 240 : 210;

  // Apply allocated minutes to topics
  Object.values(dailyPlans).forEach((p) => {
    if (p.morningTopic) p.morningTopic.allocatedMinutes = morningMinutes;
    if (p.eveningTopic) p.eveningTopic.allocatedMinutes = eveningMinutes;
  });

  return {
    version: 1,
    courseLevel: level,
    userPersona: persona,
    attemptPortion: portion,
    examSession: session,
    startDate: '2026-10-26',
    examDate,
    theme: 'midnight',
    fontFamily: 'jakarta',
    chapters: chaptersMap,
    studyLogs: {},
    dailyPlans,
    backlogConfig: {
      dailyTargetHours,
      morningSlotHours,
      eveningSlotHours,
      maxDailyCap,
      weekendBufferHours: isStudent ? 2.0 : 1.5,
      redistributionDays: 7,
    },
    streakCount: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    morningSlotTime,
    eveningSlotTime,
    morningStartTime: isStudent ? '07:00' : '06:30',
    morningEndTime: isStudent ? '11:00' : '08:00',
    eveningStartTime: isStudent ? '16:30' : '20:00',
    eveningEndTime: isStudent ? '20:30' : '00:00',
    eveningBreakMinutes: isStudent ? 0 : 30,
  };
}

export function loadPlannerState(targetLevel?: CourseLevel): PlannerState {
  try {
    const level = targetLevel || getSelectedCourseLevel() || 'intermediate';
    const storageKey =
      level === 'foundation'
        ? STORAGE_KEY_FOUNDATION
        : level === 'final'
        ? STORAGE_KEY_FINAL
        : STORAGE_KEY_INTER;
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return getDefaultState(level);
    }
    const parsed = JSON.parse(raw) as PlannerState;
    if (!parsed.courseLevel) parsed.courseLevel = level;
    if (!parsed.theme) parsed.theme = 'midnight';
    if (!parsed.fontFamily) parsed.fontFamily = parsed.theme === 'beige' ? 'playfair' : 'jakarta';

    const persona = parsed.userPersona || getUserPersona();
    parsed.userPersona = persona;

    // Merge any missing chapters if syllabus updated
    const chaptersList =
      level === 'foundation'
        ? CA_FOUNDATION_CHAPTERS
        : level === 'final'
        ? CA_FINAL_CHAPTERS
        : INITIAL_CHAPTERS;
    chaptersList.forEach((ch) => {
      if (!parsed.chapters[ch.id]) {
        parsed.chapters[ch.id] = ch;
      }
    });

    if (!parsed.attemptPortion) parsed.attemptPortion = getSelectedAttemptPortion() || 'both';
    if (!parsed.examSession) parsed.examSession = getSelectedExamSession() || 'may_2027';

    // Ensure Day 1 starts from 26-Oct-26
    const firstPlanDate = Object.keys(parsed.dailyPlans || {})[0];
    if (
      !parsed.dailyPlans ||
      Object.keys(parsed.dailyPlans).length === 0 ||
      firstPlanDate !== '2026-10-26' ||
      parsed.startDate !== '2026-10-26'
    ) {
      const examDate = getTargetExamDate(parsed.examSession);
      parsed.dailyPlans =
        level === 'foundation'
          ? generateInitialDailyFoundationSchedule('2026-10-26', examDate, parsed.attemptPortion)
          : level === 'final'
          ? generateInitialDailyFinalSchedule('2026-10-26', examDate, parsed.attemptPortion)
          : generateInitialDailySchedule('2026-10-26', examDate, parsed.attemptPortion);
      parsed.startDate = '2026-10-26';
      parsed.examDate = examDate;
    }

    const isStudent = persona === 'student';
    const expectedMorningMins = isStudent ? 240 : 90;
    const expectedEveningMins = isStudent ? 240 : 210;

    // Migrate allocatedMinutes and ensure links have topic-specific redirectable Free and Paid resources
    Object.entries(parsed.dailyPlans).forEach(([_, p]) => {
      if (p.morningTopic) {
        p.morningTopic.allocatedMinutes = expectedMorningMins;
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
        p.eveningTopic.allocatedMinutes = expectedEveningMins;
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

    // Configure slot hours and targets based on custom times or persona defaults
    if (parsed.morningStartTime && parsed.morningEndTime && parsed.eveningStartTime && parsed.eveningEndTime) {
      const morningDur = calculateSlotDuration(parsed.morningStartTime, parsed.morningEndTime, 0);
      const eveningDur = calculateSlotDuration(parsed.eveningStartTime, parsed.eveningEndTime, parsed.eveningBreakMinutes || 0);
      parsed.morningSlotTime = morningDur.formattedRange;
      parsed.eveningSlotTime = eveningDur.formattedRange;
      parsed.backlogConfig = {
        ...parsed.backlogConfig,
        dailyTargetHours: Number((morningDur.hours + eveningDur.hours).toFixed(1)),
        morningSlotHours: morningDur.hours,
        eveningSlotHours: eveningDur.hours,
        maxDailyCap: Math.max(Number((morningDur.hours + eveningDur.hours).toFixed(1)) + 1.0, 5.5),
        weekendBufferHours: isStudent ? 2.0 : 1.5,
        redistributionDays: parsed.backlogConfig?.redistributionDays || 7,
      };
    } else {
      parsed.morningStartTime = isStudent ? '07:00' : '06:30';
      parsed.morningEndTime = isStudent ? '11:00' : '08:00';
      parsed.eveningStartTime = isStudent ? '16:30' : '20:00';
      parsed.eveningEndTime = isStudent ? '20:30' : '00:00';
      parsed.eveningBreakMinutes = isStudent ? 0 : 30;
      parsed.morningSlotTime = isStudent ? '07:00 - 11:00 (4.0h)' : '06:30 - 08:00 (1.5h)';
      parsed.eveningSlotTime = isStudent ? '16:30 - 20:30 (4.0h)' : '20:00 - 00:00 (3.5h)';
      parsed.backlogConfig = {
        dailyTargetHours: isStudent ? 8.0 : 5.0,
        morningSlotHours: isStudent ? 4.0 : 1.5,
        eveningSlotHours: isStudent ? 4.0 : 3.5,
        maxDailyCap: isStudent ? 9.0 : 5.5,
        weekendBufferHours: isStudent ? 2.0 : 1.5,
        redistributionDays: parsed.backlogConfig?.redistributionDays || 7,
      };
    }

    return parsed;
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    return getDefaultState(targetLevel || 'intermediate');
  }
}

export function savePlannerState(state: PlannerState): void {
  try {
    const storageKey =
      state.courseLevel === 'foundation'
        ? STORAGE_KEY_FOUNDATION
        : state.courseLevel === 'final'
        ? STORAGE_KEY_FINAL
        : STORAGE_KEY_INTER;
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.setItem(COURSE_LEVEL_KEY, state.courseLevel);
    if (state.attemptPortion) setSelectedAttemptPortion(state.attemptPortion);
    if (state.examSession) setSelectedExamSession(state.examSession);
    if (state.userPersona) setUserPersona(state.userPersona);
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}

export function changeAttemptPortionAndSession(
  state: PlannerState,
  newPortion: AttemptPortion,
  newSession: ExamSession = state.examSession || 'may_2027'
): PlannerState {
  const examDate = getTargetExamDate(newSession);

  const newDailyPlans =
    state.courseLevel === 'foundation'
      ? generateInitialDailyFoundationSchedule(state.startDate || '2026-10-26', examDate, newPortion)
      : state.courseLevel === 'final'
      ? generateInitialDailyFinalSchedule(state.startDate || '2026-10-26', examDate, newPortion)
      : generateInitialDailySchedule(state.startDate || '2026-10-26', examDate, newPortion);

  const isStudent = state.userPersona === 'student';
  const morningMinutes = isStudent ? 240 : 90;
  const eveningMinutes = isStudent ? 240 : 210;

  Object.values(newDailyPlans).forEach((p) => {
    if (p.morningTopic) p.morningTopic.allocatedMinutes = morningMinutes;
    if (p.eveningTopic) p.eveningTopic.allocatedMinutes = eveningMinutes;
  });

  const updated: PlannerState = {
    ...state,
    attemptPortion: newPortion,
    examSession: newSession,
    examDate,
    dailyPlans: newDailyPlans,
  };

  savePlannerState(updated);
  return updated;
}

/**
 * Generates rich realistic sample progress for a working CA student
 */
export function getSampleState(level: CourseLevel = 'intermediate'): PlannerState {
  const base = getDefaultState(level);

  if (level === 'foundation') {
    const sampleFoundationChapterIds = [
      'fnd_p1_ch2', // Accounting Process & Rectification
      'fnd_p1_ch3', // BRS
      'fnd_p1_ch7', // Final Accounts Sole Proprietor
      'fnd_p2_ch2', // Indian Contract Act
      'fnd_p2_ch3', // Sale of Goods Act
      'fnd_p2_ch6', // Companies Act
      'fnd_p3_ch4', // TVM
      'fnd_p3_ch8', // LR
      'fnd_p3_ch10', // Central Tendency & Dispersion
      'fnd_p4_ch2', // Theory of Demand & Supply
      'fnd_p4_ch5', // National Income
    ];

    sampleFoundationChapterIds.forEach((id, idx) => {
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

    const today = new Date();
    const logs: Record<string, StudyLogEntry> = {};

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      let morningH = 1.5;
      let eveningH = 3.5;
      let notes = '';

      if (i === 1) {
        morningH = 1.5;
        eveningH = 1.0;
        notes = 'College project submission; reviewed Contract Act Sec 10 & 25 on mobile.';
      } else if (i === 4) {
        morningH = 1.0;
        eveningH = 2.0;
        notes = 'Commute delay. Completed 1 pomodoro of BRS adjusted cash book.';
      } else if (i === 7) {
        morningH = 2.0;
        eveningH = 3.5;
        notes = 'Sunday extra marathon: Finished TVM Annuity calculator drills and solved 40 MCQs.';
      }

      const total = morningH + eveningH;
      logs[dateStr] = {
        id: `log_${dateStr}`,
        date: dateStr,
        morningHours: morningH,
        eveningHours: eveningH,
        morningChapterId: 'fnd_p2_ch2',
        eveningChapterId: 'fnd_p3_ch4',
        morningNotes: 'Section 10 essentials and Balfour v Balfour case study.',
        eveningNotes: notes || 'Solved 15 TVM exercises on Casio calculator.',
        completedPomodoros: Math.round(total / 0.8),
        status: total >= 5.0 ? 'met_goal' : total >= 2.5 ? 'partial' : 'missed',
      };
    }

    base.studyLogs = logs;
    base.streakCount = 6;
    return base;
  }

  if (level === 'final') {
    const sampleFinalChapterIds = [
      'final_fr_ch2', // Ind AS 1, 8, 10
      'final_fr_ch3', // Ind AS 16, 38
      'final_fr_ch5', // Ind AS 115
      'final_afm_ch4', // Portfolio
      'final_afm_ch7', // Forex
      'final_audit_ch1', // SQC 1
      'final_audit_ch9', // Ethics
      'final_dt_ch2', // PGBP
      'final_dt_ch7', // Transfer Pricing
      'final_idt_ch2', // Place of Supply
      'final_idt_ch4', // ITC
    ];

    sampleFinalChapterIds.forEach((id, idx) => {
      if (base.chapters[id]) {
        base.chapters[id].milestones.lectureDone = true;
        base.chapters[id].milestones.icaiSmDone = true;
        if (idx % 2 === 0) {
          base.chapters[id].milestones.rtpPyqDone = true;
          base.chapters[id].milestones.revisionCount = 1;
        }
        if (idx === 0 || idx === 2) {
          base.chapters[id].milestones.revised2x = true;
          base.chapters[id].milestones.revisionCount = 2;
        }
      }
    });

    const today = new Date();
    const logs: Record<string, StudyLogEntry> = {};

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      let morningH = 1.5;
      let eveningH = 3.5;
      let notes = '';

      if (i === 1) {
        morningH = 1.5;
        eveningH = 1.0;
        notes = 'Articleship client filing emergency. Reviewed Professional Ethics on mobile.';
      } else if (i === 5) {
        morningH = 1.0;
        eveningH = 2.0;
        notes = 'Commute delay. Completed 1.5h of Ind AS 115 Revenue.';
      } else if (i === 7) {
        morningH = 2.0;
        eveningH = 3.5;
        notes = 'Sunday catchup: Completed Forex arbitrage & Money Market hedge questions.';
      }

      const total = morningH + eveningH;
      logs[dateStr] = {
        id: `log_${dateStr}`,
        date: dateStr,
        morningHours: morningH,
        eveningHours: eveningH,
        morningChapterId: 'final_audit_ch9',
        eveningChapterId: 'final_fr_ch5',
        morningNotes: 'First Schedule Clauses 1 to 8 review.',
        eveningNotes: notes || 'Solved 6 comprehensive illustration problems from ICAI Final FR SM.',
        completedPomodoros: Math.round(total / 0.8),
        status: total >= 5.0 ? 'met_goal' : total >= 2.5 ? 'partial' : 'missed',
      };
    }

    base.studyLogs = logs;
    base.streakCount = 6;
    return base;
  }

  // Intermediate sample
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

  const today = new Date();
  const logs: Record<string, StudyLogEntry> = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    let morningH = 1.5;
    let eveningH = 3.5;
    let notes = '';

    if (i === 1) {
      morningH = 1.5;
      eveningH = 1.0;
      notes = 'Client audit deadline ran late; had to cut evening Costing session short.';
    } else if (i === 4) {
      morningH = 1.5;
      eveningH = 1.5;
      notes = 'Office commute delay. Completed 1 pomodoro of Corporate Law.';
    } else if (i === 7) {
      morningH = 2.0;
      eveningH = 3.5;
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
  const prefix =
    state.courseLevel === 'foundation'
      ? 'CA_Foundation'
      : state.courseLevel === 'final'
      ? 'CA_Final'
      : 'CA_Inter';
  a.download = `${prefix}_May_2027_Study_Plan_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
