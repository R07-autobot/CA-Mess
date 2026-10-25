/**
 * Utility functions for calculating study hours from time intervals
 */

export interface TimeSlotDuration {
  hours: number;
  minutes: number;
  formattedRange: string;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

export function formatMinutesToTime(totalMins: number): string {
  const norm = ((totalMins % (24 * 60)) + (24 * 60)) % (24 * 60);
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = mStr ? mStr.padStart(2, '0') : '00';
  const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
  if (h === 0 || h === 24) h = 12;
  else if (h > 12) h -= 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
}

export function calculateSlotDuration(
  fromTime: string, 
  toTime: string, 
  breakMinutes: number = 0
): TimeSlotDuration {
  const fromMins = parseTimeToMinutes(fromTime);
  let toMins = parseTimeToMinutes(toTime);

  // If toTime is less than or equal to fromTime, it crosses midnight (e.g. 20:00 to 00:00 or 21:00 to 01:00)
  if (toMins <= fromMins) {
    toMins += 24 * 60;
  }

  const rawMinutes = Math.max(0, toMins - fromMins);
  const effectiveMinutes = Math.max(15, rawMinutes - breakMinutes);
  const hours = Number((effectiveMinutes / 60).toFixed(1));

  const formattedRange = `${fromTime} - ${toTime} (${hours}h)`;

  return {
    hours,
    minutes: effectiveMinutes,
    formattedRange,
  };
}

export interface PresetSlot {
  id: string;
  name: string;
  description: string;
  userPersona: 'student' | 'working_professional';
  morningFrom: string;
  morningTo: string;
  eveningFrom: string;
  eveningTo: string;
  eveningBreakMinutes: number;
}

export const STUDY_HOUR_PRESETS: PresetSlot[] = [
  {
    id: 'working_pro_standard',
    name: 'Working Professional Standard (5.0h)',
    description: 'Pre-office theory + post-office evening practical with 30m break',
    userPersona: 'working_professional',
    morningFrom: '06:30',
    morningTo: '08:00',
    eveningFrom: '20:00',
    eveningTo: '00:00',
    eveningBreakMinutes: 30, // 4.0h raw - 30m break = 3.5h evening
  },
  {
    id: 'working_pro_early_bird',
    name: 'Early Riser Working Professional (5.0h)',
    description: 'Heavy morning block before office rush (05:00-07:30) + relaxed evening',
    userPersona: 'working_professional',
    morningFrom: '05:00',
    morningTo: '07:30', // 2.5h
    eveningFrom: '20:00',
    eveningTo: '23:00', // 2.5h (with 30m break)
    eveningBreakMinutes: 30,
  },
  {
    id: 'student_full_time',
    name: 'Full-Time Student Standard (8.0h)',
    description: 'Double 4-hour deep work power blocks morning and evening',
    userPersona: 'student',
    morningFrom: '07:00',
    morningTo: '11:00', // 4.0h
    eveningFrom: '16:30',
    eveningTo: '20:30', // 4.0h
    eveningBreakMinutes: 0,
  },
  {
    id: 'student_night_owl',
    name: 'Student Night Owl (8.0h)',
    description: 'Mid-morning block + late night marathon grind',
    userPersona: 'student',
    morningFrom: '09:00',
    morningTo: '13:00', // 4.0h
    eveningFrom: '19:00',
    eveningTo: '23:00', // 4.0h
    eveningBreakMinutes: 0,
  },
];
