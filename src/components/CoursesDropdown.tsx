import React, { useState, useRef, useEffect } from 'react';
import { CourseFilterType, CourseLevel } from '../types/ca-study';
import { 
  ChevronDown, 
  Gift, 
  ShoppingBag, 
  Layers, 
  ExternalLink, 
  BookOpen, 
  Sparkles,
  Check
} from 'lucide-react';

interface CoursesDropdownProps {
  currentFilter: CourseFilterType;
  onSelectFilter: (filter: CourseFilterType) => void;
  onOpenDirectoryModal: () => void;
  currentLevel: CourseLevel;
}

export const CoursesDropdown: React.FC<CoursesDropdownProps> = ({
  currentFilter,
  onSelectFilter,
  onOpenDirectoryModal,
  currentLevel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getLabel = () => {
    switch (currentFilter) {
      case 'free':
        return 'Courses: Free Only';
      case 'paid':
        return 'Courses: Paid Only';
      default:
        return 'Courses: Free & Paid';
    }
  };

  const getIcon = () => {
    switch (currentFilter) {
      case 'free':
        return <Gift className="w-3.5 h-3.5 text-emerald-400" />;
      case 'paid':
        return <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-dropdown-trigger="courses"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-sm active:scale-95 ${
          currentFilter === 'free'
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
            : currentFilter === 'paid'
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
            : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700/80 hover:border-slate-600'
        }`}
        title="Filter and browse Free and Paid Courses"
      >
        {getIcon()}
        <span>{getLabel()}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          data-dropdown-menu="courses"
          role="menu"
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 animate-fadeIn text-white"
        >
          <div className="px-3.5 py-2 border-b border-slate-800/80">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Filter Course Resources
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Affects study roadmap and resource links for {currentLevel === 'foundation' ? 'CA Foundation' : currentLevel === 'final' ? 'CA Final' : 'CA Inter'}.
            </p>
          </div>

          <div className="p-1.5 space-y-1">
            {/* 1. All */}
            <button
              onClick={() => {
                onSelectFilter('all');
                setIsOpen(false);
              }}
              data-dropdown-item="all"
              data-selected={currentFilter === 'all'}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentFilter === 'all'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 is-selected'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-left">
                  <div className="font-bold">All Courses (Free & Paid)</div>
                  <div className="text-[10px] text-slate-400">Show all available ICAI & faculty resources</div>
                </div>
              </div>
              {currentFilter === 'all' && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
            </button>

            {/* 2. Free */}
            <button
              onClick={() => {
                onSelectFilter('free');
                setIsOpen(false);
              }}
              data-dropdown-item="free"
              data-selected={currentFilter === 'free'}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentFilter === 'free'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 is-selected'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="font-bold text-emerald-300">Free Courses Only</div>
                  <div className="text-[10px] text-slate-400">ICAI BoS, Live Virtual Classes & YouTube</div>
                </div>
              </div>
              {currentFilter === 'free' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
            </button>

            {/* 3. Paid */}
            <button
              onClick={() => {
                onSelectFilter('paid');
                setIsOpen(false);
              }}
              data-dropdown-item="paid"
              data-selected={currentFilter === 'paid'}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentFilter === 'paid'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/30 is-selected'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="font-bold text-amber-300">Paid Courses Only</div>
                  <div className="text-[10px] text-slate-400">Batches, Scanners & Mentored Test Series</div>
                </div>
              </div>
              {currentFilter === 'paid' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>
          </div>

          {/* Directory Link */}
          <div className="p-1.5 border-t border-slate-800/80">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenDirectoryModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-white" />
                <span>Browse Full Courses Directory</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
