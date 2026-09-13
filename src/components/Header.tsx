import React, { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, BookOpen, HardDrive, WifiOff, Search, Bookmark as BookmarkIcon, Home, Settings, Sun, Moon, Coffee, Download, MoreVertical, Globe } from 'lucide-react';
import { getPageMetadata } from '../utils/pageFallback';
import quranMeta from '../data/quran_meta.json';
import type { ViewMode, ActiveView } from '../hooks/useReaderState';
import type { Theme } from '../hooks/useTheme';
import type { Language } from '../utils/i18n';
import { translations } from '../utils/i18n';

interface HeaderProps {
  activePage: number;
  onPageChange: (page: number) => void;
  onOpenDrawer: () => void;
  onOpenSearchModal: () => void;
  onOpenOfflineManager: () => void;
  onOpenSettings: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isOnline: boolean;
  userName?: string;
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onSetTheme?: (theme: Theme) => void;
  language?: Language;
  onToggleLanguage?: () => void;
  canInstall?: boolean;
  onInstallApp?: () => void;
}

const TOTAL_PAGES = quranMeta.total_pages || 729;

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onPageChange,
  onOpenDrawer,
  onOpenSearchModal,
  onOpenOfflineManager,
  onOpenSettings,
  viewMode,
  isOnline,
  activeView,
  onSelectView,
  theme,
  onToggleTheme,
  onSetTheme,
  language = 'en',
  onToggleLanguage,
  canInstall = false,
  onInstallApp
}) => {
  const meta = getPageMetadata(activePage);
  const t = translations[language];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [prevView, setPrevView] = useState(activeView);

  // Close dropdown on view change without triggering cascading renders
  if (prevView !== activeView) {
    setPrevView(activeView);
    setIsDropdownOpen(false);
  }

  return (
    <>
      {/* Fast Transparent Backdrop for Outside Tap Dismissal */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default select-none"
          onClick={() => setIsDropdownOpen(false)}
          aria-hidden="true"
        />
      )}

      <header
        className="sticky top-0 z-50 w-full h-14 bg-white/95 dark:bg-slate-900/95 sepia:bg-[#fbf5e6]/95 border-b border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] backdrop-blur-md px-2.5 sm:px-4 flex items-center justify-between shadow-xs transition-colors duration-150 select-none pt-[env(safe-area-inset-top,0px)]"
      >
        {/* Left Section: Drawer Toggle & Animated App Logo */}
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0">
          {/* Navigation Drawer Menu Button */}
          <button
            onClick={onOpenDrawer}
            className="h-9 px-2.5 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors active:scale-[0.97] flex items-center space-x-1.5 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 flex-shrink-0"
            title="Open Quran Index (Surahs, Juz, Manzils)"
          >
            <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200 sepia:text-[#2d2417]">
              {t.index}
            </span>
          </button>

          {/* Brand Logo / Title (Hardware-Accelerated Fluid Collapse on Read page) */}
          <div
            className={`overflow-hidden transition-[max-width,opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[max-width,opacity,transform] flex items-center ${
              activeView === 'reader'
                ? 'max-w-0 opacity-0 -translate-x-2 scale-95 pointer-events-none'
                : 'max-w-xs opacity-100 translate-x-0 scale-100 pointer-events-auto'
            }`}
          >
            <button
              onClick={() => onSelectView('home')}
              className="flex items-center space-x-2 p-1 text-left rounded-xl hover:opacity-90 transition-opacity active:scale-[0.98] w-max flex-shrink-0"
              title="Go to Home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-serif font-bold text-xs shadow-sm flex-shrink-0">
                قرآن
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] leading-none truncate">
                  {language === 'ur' ? 'القرآن الکریم' : 'The Holy Quran'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-urdu leading-tight truncate">
                  مع اردو ترجمہ
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Center Section: Unified Segmented Navigation Tabs & Reader Controls */}
        <div className="flex items-center justify-center min-w-0 flex-1 px-1 sm:px-2">
          {/* Segmented Navigation Tabs (Desktop & Tablet) */}
          <div
            className={`${
              activeView === 'reader' ? 'hidden lg:flex' : 'hidden sm:flex'
            } items-center relative bg-slate-100 dark:bg-slate-950/80 sepia:bg-[#f2e9d2] p-1 rounded-2xl border border-slate-200 dark:border-slate-800/90 sepia:border-[#dfd3b9] text-xs shadow-xs select-none flex-shrink-0`}
          >
            {/* Fluid Sliding Background Indicator Pill */}
            <div
              className="absolute top-1 bottom-1 rounded-xl bg-emerald-600 shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none transform-gpu will-change-transform"
              style={{
                width: 'calc((100% - 8px) / 3)',
                transform: `translateX(${
                  activeView === 'home' ? '0%' : activeView === 'reader' ? '100%' : '200%'
                })`,
                left: '4px'
              }}
            />

            <button
              onClick={() => onSelectView('home')}
              className={`relative z-10 w-24 sm:w-28 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl font-medium transition-colors duration-150 active:scale-[0.98] ${
                activeView === 'home'
                  ? 'text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 sepia:text-[#78664f] hover:text-slate-900 dark:hover:text-white sepia:hover:text-[#2d2417]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.home}</span>
            </button>

            <button
              onClick={() => onSelectView('reader')}
              className={`relative z-10 w-24 sm:w-28 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl font-medium transition-colors duration-150 active:scale-[0.98] ${
                activeView === 'reader'
                  ? 'text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 sepia:text-[#78664f] hover:text-slate-900 dark:hover:text-white sepia:hover:text-[#2d2417]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.read}</span>
            </button>

            <button
              onClick={() => onSelectView('bookmarks')}
              className={`relative z-10 w-24 sm:w-28 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl font-medium transition-colors duration-150 active:scale-[0.98] ${
                activeView === 'bookmarks'
                  ? 'text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 sepia:text-[#78664f] hover:text-slate-900 dark:hover:text-white sepia:hover:text-[#2d2417]'
              }`}
            >
              <BookmarkIcon className="w-3.5 h-3.5" />
              <span>{t.bookmarks}</span>
            </button>
          </div>

          {/* Dynamic Surah & Page Controls for Reader View (Hardware Accelerated) */}
          <div
            className={`overflow-hidden min-w-0 transition-[max-width,opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[max-width,opacity,transform] flex items-center justify-center ${
              activeView === 'reader'
                ? 'max-w-[340px] opacity-100 scale-100 pointer-events-auto'
                : 'max-w-0 opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-xl px-1.5 py-0.5 whitespace-nowrap max-w-full flex-shrink-0">
              <button
                onClick={() => onPageChange(activePage + (viewMode === 'dual' ? 2 : 1))}
                disabled={activePage >= TOTAL_PAGES}
                className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-400 sepia:text-[#2d2417] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg disabled:opacity-25 transition-colors active:scale-[0.95] flex-shrink-0"
                title="Next Page (Left RTL)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectView('reader')}
                className="text-center min-w-0 px-1 max-w-[140px] sm:max-w-[200px] hover:opacity-85 transition-opacity cursor-pointer"
                title="Current Quran Page"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] truncate">
                  {activePage === 1 ? 'Cover' : meta.surah.name_english}{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-serif text-xs">
                    ({meta.surah.name_arabic})
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono whitespace-nowrap truncate">
                  Pg {activePage}/{TOTAL_PAGES} • Juz {meta.juzNumber}
                </div>
              </button>

              <button
                onClick={() => onPageChange(activePage - (viewMode === 'dual' ? 2 : 1))}
                disabled={activePage <= 1}
                className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-400 sepia:text-[#2d2417] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg disabled:opacity-25 transition-colors active:scale-[0.95] flex-shrink-0"
                title="Previous Page (Right RTL)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons & Responsive Mobile Dropdown */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 relative">
          {/* PWA Install Button (Desktop & Tablet) */}
          {canInstall && onInstallApp && (
            <button
              onClick={onInstallApp}
              className="hidden md:flex items-center space-x-1 px-2.5 h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors active:scale-[0.97]"
              title="Install Quran App to Home Screen"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.installApp}</span>
            </button>
          )}

          {/* Instant Search Button (Always visible) */}
          <button
            onClick={onOpenSearchModal}
            className="w-9 h-9 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] active:scale-[0.97]"
            title="Search Surah, Juz, or Page (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* On Read page on mobile: hide cramped inline buttons. On other pages or tablet/desktop: keep inline */}
          <div className={`items-center space-x-1 sm:space-x-1.5 ${
            activeView === 'reader' ? 'hidden sm:flex' : 'flex'
          }`}>
            {/* Bilingual Urdu / English Toggle */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="h-9 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] active:scale-[0.97]"
                title={language === 'en' ? 'اردو زبان میں دیکھیں' : 'Switch to English'}
              >
                {language === 'en' ? 'اردو' : 'EN'}
              </button>
            )}

            {/* 3-Way Theme Switcher (Dark -> Sepia -> Light) */}
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors duration-150 border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] active:scale-[0.97] flex items-center justify-center"
              title={`Theme: ${theme}. Click to switch theme (Dark / Sepia / Light)`}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-emerald-400" />
              ) : theme === 'sepia' ? (
                <Coffee className="w-4 h-4 text-amber-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="w-9 h-9 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors duration-150 border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] active:scale-[0.97] flex items-center justify-center"
              title="Application Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Offline Cache Status Badge */}
            <button
              onClick={onOpenOfflineManager}
              className="hidden sm:flex items-center space-x-1.5 h-9 px-2 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors active:scale-[0.97] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9]"
              title="Offline Storage & Download Manager"
            >
              <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {isOnline ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              )}
            </button>
          </div>

          {/* Mobile Overflow Dropdown Menu Button (Shows only when in Read view on mobile) */}
          <div className={activeView === 'reader' ? 'block sm:hidden' : 'hidden'}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(prev => !prev);
              }}
              className={`w-9 h-9 rounded-xl transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center border active:scale-[0.95] ${
                isDropdownOpen
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30'
                  : 'text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9]'
              }`}
              title="More Options"
            >
              <MoreVertical
                className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isDropdownOpen ? 'rotate-90' : 'rotate-0'
                }`}
              />
            </button>
          </div>

          {/* Floating Dropdown Menu Popover with GPU Spring Animation */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 bg-white/98 dark:bg-slate-900/98 sepia:bg-[#fffdf5]/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl shadow-2xl p-2.5 z-50 space-y-2 text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] origin-top-right animate-popIn"
              dir={language === 'ur' ? 'rtl' : 'ltr'}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Theme Selector Pill Bar */}
              <div className="p-1.5 bg-slate-100/90 dark:bg-slate-950/90 sepia:bg-[#f2e9d2]/90 rounded-xl">
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 sepia:text-[#78664f] px-1 py-0.5 uppercase tracking-wider">
                  {language === 'ur' ? 'طرزِ رنگ' : 'Theme'}
                </div>
                <div className="grid grid-cols-3 gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSetTheme) onSetTheme('dark');
                      else if (theme !== 'dark') onToggleTheme();
                    }}
                    className={`flex items-center justify-center space-x-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{language === 'ur' ? 'نائٹ' : 'Dark'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSetTheme) onSetTheme('sepia');
                      else if (theme !== 'sepia') onToggleTheme();
                    }}
                    className={`flex items-center justify-center space-x-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${
                      theme === 'sepia'
                        ? 'bg-[#dfd3b9] text-[#2d2417] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                    }`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{language === 'ur' ? 'سیپیا' : 'Sepia'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSetTheme) onSetTheme('light');
                      else if (theme !== 'light') onToggleTheme();
                    }}
                    className={`flex items-center justify-center space-x-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${
                      theme === 'light'
                        ? 'bg-white text-amber-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{language === 'ur' ? 'دن' : 'Light'}</span>
                  </button>
                </div>
              </div>

              {/* Language Toggle */}
              {onToggleLanguage && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleLanguage();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'en' ? 'Language' : 'زبان'}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                    {language === 'en' ? 'اردو' : 'English'}
                  </span>
                </button>
              )}

              {/* Settings Modal */}
              <button
                type="button"
                onClick={() => {
                  onOpenSettings();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] transition-colors active:scale-[0.98]"
              >
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{t.settings}</span>
              </button>

              {/* Offline Storage */}
              <button
                type="button"
                onClick={() => {
                  onOpenOfflineManager();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <HardDrive className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{language === 'ur' ? 'آف لائن ڈیٹا' : 'Offline Data'}</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </button>

              {/* Install App (if available) */}
              {canInstall && onInstallApp && (
                <button
                  type="button"
                  onClick={() => {
                    onInstallApp();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.installApp}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
