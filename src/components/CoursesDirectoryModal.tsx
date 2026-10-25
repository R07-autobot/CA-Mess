import React, { useState, useMemo } from 'react';
import { CourseFilterType, CourseLevel, CuratedCourse } from '../types/ca-study';
import { CURATED_COURSES } from '../data/curatedCourses';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Gift, 
  ShoppingBag, 
  X, 
  GraduationCap, 
  Award, 
  Filter,
  Compass,
  Star,
  Check
} from 'lucide-react';

interface CoursesDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: CourseLevel;
  initialFilter?: CourseFilterType;
}

export const CoursesDirectoryModal: React.FC<CoursesDirectoryModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  initialFilter = 'all',
}) => {
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'all'>(currentLevel);
  const [costFilter, setCostFilter] = useState<CourseFilterType>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  // Update levelFilter if currentLevel changes when opening
  React.useEffect(() => {
    setLevelFilter(currentLevel);
  }, [currentLevel, isOpen]);

  React.useEffect(() => {
    setCostFilter(initialFilter);
  }, [initialFilter, isOpen]);

  const filteredCourses = useMemo(() => {
    return CURATED_COURSES.filter((course) => {
      if (levelFilter !== 'all' && course.level !== levelFilter) return false;
      if (costFilter !== 'all' && course.costType !== costFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesPaper = course.paperName.toLowerCase().includes(q);
        const matchesFaculty = course.facultyOrOrg.toLowerCase().includes(q);
        const matchesTag = course.tag.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        return matchesTitle || matchesPaper || matchesFaculty || matchesTag || matchesDesc;
      }
      return true;
    });
  }, [levelFilter, costFilter, searchQuery]);

  if (!isOpen) return null;

  const freeCount = CURATED_COURSES.filter((c) => (levelFilter === 'all' || c.level === levelFilter) && c.costType === 'free').length;
  const paidCount = CURATED_COURSES.filter((c) => (levelFilter === 'all' || c.level === levelFilter) && c.costType === 'paid').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-start justify-between relative">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Curated ICAI Courses & Study Material Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Free & Paid Courses Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Hand-picked official ICAI BoS resources, YouTube revision fast-tracks, top faculty batches, and test series.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Level Switch Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setLevelFilter('all')}
              data-selection-button="level-filter"
              data-selected={levelFilter === 'all'}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                levelFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm is-selected'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setLevelFilter('foundation')}
              data-selection-button="level-filter"
              data-selected={levelFilter === 'foundation'}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                levelFilter === 'foundation'
                  ? 'bg-emerald-600 text-white shadow-sm is-selected'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>CA Foundation</span>
            </button>
            <button
              onClick={() => setLevelFilter('intermediate')}
              data-selection-button="level-filter"
              data-selected={levelFilter === 'intermediate'}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                levelFilter === 'intermediate'
                  ? 'bg-indigo-600 text-white shadow-sm is-selected'
                  : 'text-slate-400 hover:text-indigo-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>CA Inter</span>
            </button>
            <button
              onClick={() => setLevelFilter('final')}
              data-selection-button="level-filter"
              data-selected={levelFilter === 'final'}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                levelFilter === 'final'
                  ? 'bg-purple-600 text-white shadow-sm is-selected'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>CA Final</span>
            </button>
          </div>

          {/* Cost Filter (Free vs Paid Dropdown / Buttons) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setCostFilter('all')}
                data-selection-button="cost-filter"
                data-selected={costFilter === 'all'}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  costFilter === 'all'
                    ? 'bg-slate-700 text-white shadow-sm is-selected'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({freeCount + paidCount})
              </button>
              <button
                onClick={() => setCostFilter('free')}
                data-selection-button="cost-filter"
                data-selected={costFilter === 'free'}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  costFilter === 'free'
                    ? 'bg-emerald-600 text-white shadow-sm is-selected'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-emerald-300" />
                <span>Free ({freeCount})</span>
              </button>
              <button
                onClick={() => setCostFilter('paid')}
                data-selection-button="cost-filter"
                data-selected={costFilter === 'paid'}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  costFilter === 'paid'
                    ? 'bg-amber-600 text-white shadow-sm is-selected'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Paid ({paidCount})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-900 flex-1">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold">No courses match your filter criteria.</p>
              <button
                onClick={() => {
                  setLevelFilter('all');
                  setCostFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer hover:bg-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-black/40"
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            c.level === 'foundation'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : c.level === 'final'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {c.level === 'foundation' ? 'Foundation' : c.level === 'final' ? 'CA Final' : 'CA Inter'}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {c.paperCode}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {c.costType === 'free' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <Gift className="w-3 h-3" />
                            {c.priceEstimate || 'Free'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <ShoppingBag className="w-3 h-3" />
                            {c.priceEstimate || 'Paid'}
                          </span>
                        )}
                        {c.badge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {c.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {c.title}
                    </h3>

                    <div className="text-xs text-indigo-400 font-medium mt-1 flex items-center gap-2">
                      <span>{c.facultyOrOrg}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{c.paperName}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Features list */}
                    <div className="mt-3.5 space-y-1.5 border-t border-slate-800/80 pt-3">
                      {c.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Format: <strong className="text-slate-200">{c.format}</strong>
                    </span>

                    <a
                      href={c.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{c.costType === 'free' ? 'Access Free Course' : 'View Course Details'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-5 flex-wrap gap-2">
          <span>
            Showing <strong>{filteredCourses.length}</strong> verified courses & material links for ICAI New Scheme.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
