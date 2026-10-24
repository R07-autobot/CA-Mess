export type PaperGroup = 1 | 2;

export type ChapterCategory = 'A' | 'B' | 'C'; // ICAI ABC Analysis (High, Medium, Low weightage)
export type SubjectType = 'theory' | 'practical' | 'hybrid';

export interface MilestoneProgress {
  lectureDone: boolean;
  icaiSmDone: boolean;    // ICAI Study Material Solved
  rtpPyqDone: boolean;     // Revision Test Paper & Past Year Questions
  revised2x: boolean;      // Completed at least 2 revisions
  revisionCount: number;   // 0, 1, 2, 3+
  notes?: string;
  lastStudiedDate?: string;
}

export interface Chapter {
  id: string;
  paperId: string;
  group: PaperGroup;
  title: string;
  category: ChapterCategory;
  type: SubjectType;
  estimatedHours: number;
  weightageEstimate?: string; // e.g. "12-16 marks"
  milestones: MilestoneProgress;
}

export interface Paper {
  id: string;
  code: string;
  name: string;
  shortName: string;
  group: PaperGroup;
  type: SubjectType;
  color: string;
  accentBg: string;
  iconName: string;
  description: string;
}

export interface StudyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  morningHours: number; // 0 to 4
  eveningHours: number; // 0 to 4
  morningChapterId?: string;
  eveningChapterId?: string;
  morningNotes?: string;
  eveningNotes?: string;
  completedPomodoros: number;
  status: 'met_goal' | 'partial' | 'missed';
}

export interface BacklogConfig {
  dailyTargetHours: number;      // 5 hours default
  morningSlotHours: number;      // 1.5 hours (6:30 AM - 8:00 AM)
  eveningSlotHours: number;      // 3.5 hours (8:00 PM - 12:00 AM with 30m break)
  maxDailyCap: number;           // 5.5 hours maximum rigid cap to avoid working professional burnout
  weekendBufferHours: number;    // Extra hours accommodated on weekend (e.g. 1.5h)
  redistributionDays: number;    // Spread deficit across next N days (default 7)
}

export interface TopicExecutionFramework {
  name: string;
  description: string;
  steps: string[];
  proTip: string;
}

export interface TopicResourceDetails {
  icaiSmModule: string;
  pageRange: string;
  illustrations: string;
  rtpPyqRef: string;
  bareActOrStd: string;
}

export type ResourceCostType = 'free' | 'paid';

export interface TopicLinkReference {
  id: string;
  title: string;
  type: 'icai_sm' | 'youtube' | 'bare_act' | 'notes' | 'paid_batch' | 'paid_book' | 'test_series' | 'other';
  costType: ResourceCostType; // 'free' | 'paid'
  provider?: string;          // e.g. "ICAI BoS", "YouTube Marathon", "BB Virtuals", "Aldine CA", "Taxmann"
  url: string;
  videoId?: string;           // YouTube video ID or search query
  priceNote?: string;         // e.g. "Free PDF on ICAI BoS", "Paid Fast-Track Batch", "Paid Practice Scanner"
}

export type AppTheme = 'midnight' | 'emerald' | 'navy' | 'amber' | 'paper';

export interface AIFlashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  keyTakeaway: string;
  examTip?: string;
}

export interface ScheduledTopic {
  id: string;
  slot: 'morning' | 'evening';
  paperCode: string;
  paperShortName: string;
  chapterId: string;
  chapterTitle: string;
  subtopics: string[];
  completedSubtopics?: string[]; // list of completed subtopic titles
  allocatedMinutes: number; // e.g. 150m (2.5h)
  spentMinutes: number;      // actual time spent on this specific topic
  resources: TopicResourceDetails;
  links?: TopicLinkReference[]; // clickable references: ICAI SM page/PDF, YouTube lecture ID, etc.
  framework: TopicExecutionFramework;
  memoryTechnique?: string; // Spaced repetition, Active Recall, Formula Interleaving
  isCompleted: boolean;
  userNotes?: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  phase: 'Phase 1: Foundation & ICAI SM' | 'Phase 2: R1 & RTPs/PYQ' | 'Phase 3: R2 & Mock Tests' | 'Phase 4: Exam Marathon';
  weekNumber: number;
  morningTopic: ScheduledTopic;
  eveningTopic: ScheduledTopic;
  status: 'upcoming' | 'in_progress' | 'completed' | 'deferred';
  summaryTarget: string;
}

export interface PlannerState {
  version: number;
  startDate?: string; // e.g. "2026-10-26"
  examDate: string; // "2027-05-01"
  theme?: AppTheme;
  chapters: Record<string, Chapter>;
  studyLogs: Record<string, StudyLogEntry>;
  dailyPlans: Record<string, DayPlan>; // keyed by date (YYYY-MM-DD)
  backlogConfig: BacklogConfig;
  streakCount: number;
  lastActiveDate: string;
  morningSlotTime: string; // e.g. "06:30 - 08:00"
  eveningSlotTime: string; // e.g. "20:00 - 00:00"
}


