import React from 'react';
import { X, Sun, Moon, BookOpen, Columns, AlignJustify, Sliders, HardDrive, User, Edit3, ShieldCheck } from 'lucide-react';
import type { ViewMode } from '../hooks/useReaderState';
import type { Theme } from '../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  pageOffset: number;
  onUpdatePageOffset: (offset: number) => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  onOpenOfflineManager: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  viewMode,
  onViewModeChange,
  pageOffset,
  onUpdatePageOffset,
  userName,
  onUpdateUserName,
  onOpenOfflineManager
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Application Settings</h3>
              <p className="text-xs text-slate-400">Personalize reading preferences & appearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Theme Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Appearance Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => theme !== 'dark' && onToggleTheme()}
                className={`flex items-center justify-center space-x-2.5 p-3.5 rounded-2xl border transition-all ${
                  theme === 'dark'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-bold shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-xs">Dark Midnight</span>
              </button>

              <button
                onClick={() => theme !== 'light' && onToggleTheme()}
                className={`flex items-center justify-center space-x-2.5 p-3.5 rounded-2xl border transition-all ${
                  theme === 'light'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-bold shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs">Light Parchment</span>
              </button>
            </div>
          </div>

          {/* Reading Mode Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Quran Reading View Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onViewModeChange('single')}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                  viewMode === 'single'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-5 h-5 mb-1" />
                <span className="text-[11px]">Single Page</span>
              </button>

              <button
                onClick={() => onViewModeChange('dual')}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                  viewMode === 'dual'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Columns className="w-5 h-5 mb-1" />
                <span className="text-[11px]">Dual Spread</span>
              </button>

              <button
                onClick={() => onViewModeChange('continuous')}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                  viewMode === 'continuous'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlignJustify className="w-5 h-5 mb-1" />
                <span className="text-[11px]">Continuous</span>
              </button>
            </div>
          </div>

          {/* PDF Page Offset Calibration */}
          <div className="space-y-2 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">PDF Page Alignment Shift</div>
                <div className="text-[11px] text-slate-400">Calibrate if your PDF has cover page offset</div>
              </div>
              <div className="flex items-center space-x-1 font-mono">
                {[-2, -1, 0, 1, 2].map((val) => (
                  <button
                    key={val}
                    onClick={() => onUpdatePageOffset(val)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      pageOffset === val
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {val > 0 ? `+${val}` : val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Storage & Offline Access */}
          <div className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Offline Storage Manager</div>
                <div className="text-[11px] text-slate-400">Manage cached PDF pages in IndexedDB</div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenOfflineManager();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-xl border border-slate-700/60 transition-colors"
            >
              Manage
            </button>
          </div>

          {/* Privacy Note Footer */}
          <div className="pt-2 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>All reading data & bookmarks are saved 100% locally on your device</span>
          </div>
        </div>
      </div>
    </div>
  );
};
