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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]"
        dir={language === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#fbf5e6]">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">{t.settings}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">Preferences & reading options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors flex items-center justify-center active:scale-[0.97]"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">
          {/* Theme Section (3 Themes: Dark, Sepia, Light) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] uppercase tracking-wider block">
              {t.theme}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme && setTheme('dark')}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-emerald-500 text-emerald-400 font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 mb-1" />
                <span className="text-[11px]">{t.themeDark}</span>
              </button>

              <button
                onClick={() => setTheme && setTheme('sepia')}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                  theme === 'sepia'
                    ? 'bg-[#f2e9d2] border-amber-600 text-amber-800 font-bold shadow-xs ring-1 ring-amber-600'
                    : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Coffee className="w-4 h-4 mb-1 text-amber-600" />
                <span className="text-[11px]">{t.themeSepia}</span>
              </button>

              <button
                onClick={() => setTheme && setTheme('light')}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                  theme === 'light'
                    ? 'bg-slate-100 border-emerald-600 text-emerald-700 font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4 mb-1 text-amber-500" />
                <span className="text-[11px]">{t.themeLight}</span>
              </button>
            </div>
          </div>

          {/* Bilingual Language Selection (English / Urdu) */}
          {onSetLanguage && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] uppercase tracking-wider block">
                Language / زبان
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSetLanguage('en')}
                  className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                    language === 'en'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-xs">English</span>
                </button>

                <button
                  onClick={() => onSetLanguage('ur')}
                  className={`flex items-center justify-center space-x-2 rtl:space-x-reverse p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                    language === 'ur'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold font-urdu">اردو (Urdu)</span>
                </button>
              </div>
            </div>
          )}

          {/* Reading Mode Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] uppercase tracking-wider block">
              {t.viewMode}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onViewModeChange('single')}
                className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                  viewMode === 'single'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <BookOpen className="w-4 h-4 mb-1" />
                <span className="text-[11px]">{t.viewSingle}</span>
              </button>

              <button
                onClick={() => onViewModeChange('dual')}
                className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                  viewMode === 'dual'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <Columns className="w-4 h-4 mb-1" />
                <span className="text-[11px]">{t.viewDual}</span>
              </button>

              <button
                onClick={() => onViewModeChange('continuous')}
                className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                  viewMode === 'continuous'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-slate-600 dark:text-slate-400'
                }`}
              >
                <AlignJustify className="w-4 h-4 mb-1" />
                <span className="text-[11px]">{t.viewContinuous}</span>
              </button>
            </div>
          </div>

          {/* Offline Storage Manager Action */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
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
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors active:scale-[0.97]"
            >
              Open
            </button>
          </div>

          {/* PWA Home Screen Install Action (If Available) */}
          {canInstall && onInstallApp && (
            <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
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
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors active:scale-[0.97]"
              >
                Install
              </button>
            </div>
          )}

          {/* Page Offset Calibration */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl">
            <div>
              <div className="text-xs font-bold">Calibration Offset</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">Fine-tune page alignment</div>
            </div>
            <div className="flex items-center space-x-1 font-mono">
              {[-1, 0, 1].map((val) => (
                <button
                  key={val}
                  onClick={() => onUpdatePageOffset(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    pageOffset === val
                      ? 'bg-emerald-600 text-white shadow-xs'
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
            <div className="space-y-1.5 p-3.5 bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl">
              <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 sepia:text-[#2d2417]">
                {language === 'ur' ? 'قاری کا نام' : 'Reader Profile Name'}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => onUpdateUserName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl text-xs text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Privacy Note Footer */}
          <div className="pt-1 flex items-center justify-center space-x-1.5 rtl:space-x-reverse text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Offline • All data is stored locally on your device</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
