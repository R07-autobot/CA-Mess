import React, { useState } from 'react';
import { AppTheme, AppFontFamily } from '../types/ca-study';
import { THEMES, ThemeConfig, FONT_OPTIONS } from '../utils/theme';
import { Palette, Check, X, Sparkles, Moon, Sun, Type, BookOpen, Feather } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  currentFont?: AppFontFamily;
  onSelectFont?: (font: AppFontFamily) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  currentFont = 'playfair',
  onSelectFont,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'typography'>('themes');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Study Environment & Aesthetic
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize your color palette and prestigious typography matching your reading style
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('themes')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'themes'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Color Palettes ({Object.keys(THEMES).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'typography'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Editorial Typography ({FONT_OPTIONS.length})</span>
          </button>
        </div>

        {/* Tab 1: Themes Grid */}
        {activeTab === 'themes' && (
          <div className="p-5 space-y-3 overflow-y-auto">
            {(Object.values(THEMES) as ThemeConfig[]).map((theme) => {
              const isSelected = currentTheme === theme.id;
              const isBeige = theme.id === 'beige';
              const isPaper = theme.id === 'paper';

              return (
                <div
                  key={theme.id}
                  data-selected={isSelected}
                  onClick={() => {
                    onSelectTheme(theme.id);
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? isBeige
                        ? 'bg-[#18181b] border-[#18181b] shadow-lg ring-2 ring-[#18181b]/30 text-[#FAF7F2] is-selected'
                        : 'bg-slate-850 border-indigo-500 shadow-md ring-1 ring-indigo-500/40 text-white is-selected'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Swatch Preview */}
                    <div className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-inner ${theme.previewBg}`}>
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm border border-black/20"
                        style={{ backgroundColor: theme.accentHex }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-sm transition-colors ${
                          isSelected && isBeige
                            ? 'text-[#121212] font-serif'
                            : 'group-hover:text-indigo-300'
                        }`}>
                          {theme.name}
                        </span>

                        {isBeige ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#18181b] text-[#FAF7F2] flex items-center gap-1 shadow-sm">
                            <Feather className="w-2.5 h-2.5 text-amber-300" /> Warm Editorial
                          </span>
                        ) : isPaper ? (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                            <Sun className="w-2.5 h-2.5" /> Light Mode
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-0.5">
                            <Moon className="w-2.5 h-2.5" /> Dark Mode
                          </span>
                        )}
                      </div>

                      <p className={`text-xs truncate mt-0.5 ${
                        isSelected && isBeige ? 'text-[#57534E]' : 'text-slate-400'
                      }`}>
                        {theme.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {isSelected ? (
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${
                        isBeige
                          ? 'bg-[#18181b] text-[#FAF7F2]'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 group-hover:text-slate-300 font-medium">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Typography / Matching Font Selection */}
        {activeTab === 'typography' && (
          <div className="p-5 space-y-3.5 overflow-y-auto">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Matching fonts elevate answer drafting and case-law reading with classical financial publication typography.
              </span>
            </div>

            {FONT_OPTIONS.map((font) => {
              const isSelected = currentFont === font.id;
              return (
                <div
                  key={font.id}
                  data-selected={isSelected}
                  onClick={() => onSelectFont?.(font.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-850 border-amber-500/80 shadow-md ring-1 ring-amber-500/30 is-selected'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {font.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {font.styleLabel}
                      </span>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 group-hover:text-slate-300 font-medium">
                        Select
                      </span>
                    )}
                  </div>

                  {/* Font Sample Text */}
                  <div className={`text-base sm:text-lg text-slate-100 my-2.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 ${font.className}`}>
                    "{font.sample}"
                  </div>

                  <p className="text-xs text-slate-400">
                    {font.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme & font preference auto-save and persist across sessions</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-colors shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
