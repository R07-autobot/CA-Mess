import { AppTheme, AppFontFamily } from '../types/ca-study';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  tagline: string;
  accentHex: string;
  previewBg: string;
  badgeClass: string;
  containerClass: string;
  cardClass: string;
  navClass: string;
  textClass: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Slate',
    tagline: 'Deep space obsidian with electric indigo & violet accents',
    accentHex: '#6366f1',
    previewBg: 'bg-slate-950 border-indigo-500',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    containerClass: 'bg-slate-950 text-slate-100',
    cardClass: 'bg-slate-900 border-slate-800',
    navClass: 'bg-slate-900/90 border-slate-800',
    textClass: 'text-white',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Professional',
    tagline: 'ICAI green legacy with deep forest charcoal & mint glow',
    accentHex: '#10b981',
    previewBg: 'bg-emerald-950 border-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    containerClass: 'bg-[#02150f] text-emerald-50',
    cardClass: 'bg-[#06241b] border-emerald-900/60',
    navClass: 'bg-[#051f17]/90 border-emerald-900/60',
    textClass: 'text-emerald-100',
  },
  navy: {
    id: 'navy',
    name: 'Sapphire Executive',
    tagline: 'Big 4 corporate night navy with ice blue & cyan aura',
    accentHex: '#0284c7',
    previewBg: 'bg-blue-950 border-cyan-400',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    containerClass: 'bg-[#030e24] text-sky-50',
    cardClass: 'bg-[#08183a] border-blue-900/60',
    navClass: 'bg-[#061533]/90 border-blue-900/60',
    textClass: 'text-sky-100',
  },
  amber: {
    id: 'amber',
    name: 'Cyberpunk Amber',
    tagline: 'High-contrast nocturnal focus with warm copper & gold glow',
    accentHex: '#f59e0b',
    previewBg: 'bg-amber-950 border-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    containerClass: 'bg-[#120a03] text-amber-50',
    cardClass: 'bg-[#211406] border-amber-900/60',
    navClass: 'bg-[#1a0f05]/90 border-amber-900/60',
    textClass: 'text-amber-100',
  },
  paper: {
    id: 'paper',
    name: 'Executive Daylight',
    tagline: 'Clean paper-slate daylight theme for bright study sessions',
    accentHex: '#4f46e5',
    previewBg: 'bg-slate-100 border-slate-400',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    containerClass: 'bg-slate-100 text-slate-900',
    cardClass: 'bg-white border-slate-300 shadow-sm text-slate-800',
    navClass: 'bg-white/95 border-slate-300 text-slate-800 shadow-sm',
    textClass: 'text-slate-900',
  },
  beige: {
    id: 'beige',
    name: 'Editorial Beige & Pitch Black',
    tagline: 'Warm unbleached ivory & deep inky pitch-black with prestigious editorial typography',
    accentHex: '#18181b',
    previewBg: 'bg-[#F2ECE0] border-[#18181b]',
    badgeClass: 'bg-[#18181b] text-[#FAF7F2] border-[#18181b]',
    containerClass: 'bg-[#F8F5EE] text-[#121212] theme-beige',
    cardClass: 'bg-white border-[#E2DDD0] shadow-sm text-[#18181b]',
    navClass: 'bg-[#F2ECE0]/95 border-[#E2DDD0] text-[#18181b] shadow-sm',
    textClass: 'text-[#121212]',
  },
};

export interface FontOption {
  id: AppFontFamily;
  name: string;
  styleLabel: string;
  className: string;
  sample: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'playfair',
    name: 'Playfair Display (Editorial Serif)',
    styleLabel: 'Prestigious Serif',
    className: 'font-playfair',
    sample: 'Chartered Accountants & ICAI New Scheme',
    description: 'High-contrast luxury serif inspired by classical printing — matches beige & pitch black flawlessly.',
  },
  {
    id: 'fraunces',
    name: 'Fraunces (Old-Style Bookish)',
    styleLabel: 'Literary Book Serif',
    className: 'font-fraunces',
    sample: 'Advanced Auditing & Professional Ethics',
    description: 'Warm, elegant bookish serif reminiscent of classical financial journals and statutory casebooks.',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans (Modern Clean)',
    styleLabel: 'Modern Grotesque',
    className: 'font-jakarta',
    sample: 'Daily 5-Hour Protocol & Velocity Balancer',
    description: 'Sharp, ultra-legible contemporary sans serif designed for data density and nocturnal focus.',
  },
];
