import React from 'react';
import { X, Sun, Moon, Coffee, BookOpen, Columns, AlignJustify, Sliders, HardDrive, Download, Languages, ShieldCheck } from 'lucide-react';
import type { ViewMode } from '../hooks/useReaderState';
import type { Theme } from '../hooks/useTheme';
import type { Language } from '../utils/i18n';
import { translations } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  setTheme?: (theme: Theme) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  pageOffset: number;
  onUpdatePageOffset: (offset: number) => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  onOpenOfflineManager: () => void;
  language?: Language;
  onSetLanguage?: (lang: Language) => void;
  canInstall?: boolean;
  onInstallApp?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  viewMode,
  onViewModeChange,
  pageOffset,
  onUpdatePageOffset,
  userName = '',
  onUpdateUserName,
  onOpenOfflineManager,
  language = 'en',
  onSetLanguage,
  canInstall = false,
  onInstallApp
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#fbf5e6]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">{t.settings}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">Preferences & reading options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">
          {/* Theme Section (3 Themes: Dark, Sepia, Light) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] uppercase tracking-wider block">
              {t.theme}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme && setTheme('dark')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-emerald-500 text-emerald-400 font-bold shadow'
                    : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">{t.themeDark}</span>
              </button>

              <button
                onClick={() => setTheme && setTheme('sepia')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  theme === 'sepia'
                    ? 'bg-[#f2e9d2] border-amber-600 text-amber-800 font-bold shadow ring-1 ring-amber-600'
                    : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Coffee className="w-4 h-4 mb-1 text-amber-600" />
                <span className="text-[11px] font-medium">{t.themeSepia}</span>
              </button>

              <button
                onClick={() => setTheme && setTheme('light')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  theme === 'light'
                    ? 'bg-slate-200 border-emerald-600 text-emerald-700 font-bold shadow'
                    : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4 mb-1 text-amber-500" />
                <span className="text-[11px] font-medium">{t.themeLight}</span>
              </button>
            </div>
          </div>

          {/* Bilingual Language Selection (English / Urdu) */}
          {onSetLanguage && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] uppercase tracking-wider block">
                Language / زبان
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSetLanguage('en')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-2xl border transition-all ${
                    language === 'en'
                      ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-xs">English</span>
                </button>

                <button
                  onClick={() => onSetLanguage('ur')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-2xl border transition-all ${
                    language === 'ur'
                      ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold font-urdu">اردو (Urdu)</span>
                </button>
              </div>
            </div>
          )}

          {/* Reading Mode Section */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] uppercase tracking-wider block">
              {t.viewMode}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onViewModeChange('single')}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                  viewMode === 'single'
                    ? 'bg-emerald-600/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <BookOpen className="w-5 h-5 mb-1" />
                <span className="text-[11px]">{t.viewSingle}</span>
              </button>

              <button
                onClick={() => onViewModeChange('dual')}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                  viewMode === 'dual'
                    ? 'bg-emerald-600/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Columns className="w-5 h-5 mb-1" />
                <span className="text-[11px]">{t.viewDual}</span>
              </button>

              <button
                onClick={() => onViewModeChange('continuous')}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                  viewMode === 'continuous'
                    ? 'bg-emerald-600/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <AlignJustify className="w-5 h-5 mb-1" />
                <span className="text-[11px]">{t.viewContinuous}</span>
              </button>
            </div>
          </div>

          {/* Offline Storage Manager Action */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-xs font-bold">{t.offline} Storage Manager</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">Download pages for 100% offline access</div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenOfflineManager();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
            >
              Open
            </button>
          </div>

          {/* PWA Home Screen Install Action (If Available) */}
          {canInstall && onInstallApp && (
            <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 sepia:bg-[#f2e9d2] border border-emerald-500/40 rounded-2xl">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white sepia:text-[#2d2417]">{t.installApp}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">Add to mobile home screen</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onInstallApp();
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                Install
              </button>
            </div>
          )}

          {/* Page Offset Calibration */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl">
            <div>
              <div className="text-xs font-bold">Calibration Offset</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">Fine-tune page alignment</div>
            </div>
            <div className="flex items-center space-x-1 font-mono">
              {[-1, 0, 1].map((val) => (
                <button
                  key={val}
                  onClick={() => onUpdatePageOffset(val)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    pageOffset === val
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-white dark:bg-slate-800 sepia:bg-[#fffdf5] text-slate-700 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {val > 0 ? `+${val}` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Reader Profile Name */}
          {onUpdateUserName && (
            <div className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl">
              <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 sepia:text-[#2d2417]">
                {language === 'ur' ? 'قاری کا نام' : 'Reader Profile Name'}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => onUpdateUserName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl text-xs text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Privacy Note Footer */}
          <div className="pt-1 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>All Quran data & bookmarks are stored 100% locally on your device</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
