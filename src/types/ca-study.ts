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

export type AppTheme = 'midnight' | 'emerald' | 'navy' | 'amber' | 'paper' | 'beige';
export type AppFontFamily = 'playfair' | 'fraunces' | 'jakarta';

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

export type UserPersona = 'student' | 'working_professional';

export type CourseLevel = 'foundation' | 'intermediate' | 'final';

export type AttemptPortion = 'both' | 'group1' | 'group2';

export type ExamSession = 'may_2027' | 'nov_2027' | 'jan_2027' | 'sept_2027';

export type CourseFilterType = 'all' | 'free' | 'paid';

export interface CuratedCourse {
  id: string;
  title: string;
  level: CourseLevel;
  paperCode: string; // e.g. 'P1', 'P2', 'P3', 'P4' or 'G1P1', 'G2P4'
  paperName: string;
  facultyOrOrg: string;
  costType: 'free' | 'paid';
  priceEstimate?: string; // e.g. "Free (ICAI Official)", "₹3,999", "₹7,500"
  tag: string; // 'ICAI Official' | 'YouTube Fast-Track' | 'Regular Batch' | 'Exam Scanner' | 'Test Series' | 'Revision Marathon'
  format: 'Video Classes' | 'PDF & Notes' | 'Test Series' | 'Practice Book' | 'Live Sessions';
  description: string;
  features: string[];
  externalUrl: string;
  badge?: string;
  rating?: number;
}

export interface PlannerState {
  version: number;
  courseLevel: CourseLevel;
  userPersona?: UserPersona;      // 'student' (8 hours) | 'working_professional' (5 hours)
  attemptPortion: AttemptPortion; // 'both' | 'group1' | 'group2'
  examSession: ExamSession;       // 'may_2027' | 'nov_2027'
  startDate?: string; // e.g. "2026-10-26"
  examDate: string; // "2027-05-01" or "2027-11-01"
  theme?: AppTheme;
  fontFamily?: AppFontFamily;
  chapters: Record<string, Chapter>;
  studyLogs: Record<string, StudyLogEntry>;
  dailyPlans: Record<string, DayPlan>; // keyed by date (YYYY-MM-DD)
  backlogConfig: BacklogConfig;
  streakCount: number;
  lastActiveDate: string;
  morningSlotTime: string; // e.g. "06:30 - 08:00 (1.5h)"
  eveningSlotTime: string; // e.g. "20:00 - 00:00 (3.5h)"
  morningStartTime?: string; // e.g. "06:30"
  morningEndTime?: string;   // e.g. "08:00"
  eveningStartTime?: string; // e.g. "20:00"
  eveningEndTime?: string;   // e.g. "00:00"
  eveningBreakMinutes?: number; // e.g. 30
}


