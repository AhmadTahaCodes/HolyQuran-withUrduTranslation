import React from 'react';
import { Menu, ChevronLeft, ChevronRight, BookOpen, HardDrive, WifiOff, Search, Bookmark as BookmarkIcon, Home, Settings, Sun, Moon, Coffee, Download } from 'lucide-react';
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
  language = 'en',
  onToggleLanguage,
  canInstall = false,
  onInstallApp
}) => {
  const meta = getPageMetadata(activePage);
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-16 bg-slate-100/95 dark:bg-slate-900/95 sepia:bg-[#fbf5e6]/95 border-b border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] backdrop-blur-md px-2 sm:px-4 flex items-center justify-between shadow-sm transition-colors">
      {/* Left Section: Branding & Main Navigation Drawer */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Navigation Drawer Menu Button */}
        <button
          onClick={onOpenDrawer}
          className="p-2 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors active:scale-95 flex items-center space-x-1.5"
          title="Open Quran Index (Surahs, Juz, Manzils)"
        >
          <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden lg:inline text-xs font-bold text-slate-800 dark:text-slate-200 sepia:text-[#2d2417]">
            {t.index}
          </span>
        </button>

        {/* Brand Logo / Title */}
        <button
          onClick={() => onSelectView('home')}
          className="flex items-center space-x-2 p-1 text-left rounded-xl hover:opacity-90 transition-opacity"
          title="Go to Home"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-serif font-bold text-xs shadow-md">
            قرآن
          </div>
          <div className="hidden sm:block min-w-0">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] leading-none">
              {language === 'ur' ? 'القرآن الکریم' : 'The Holy Quran'}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-urdu leading-tight">
              مع اردو ترجمہ
            </div>
          </div>
        </button>
      </div>

      {/* Center Section: Unified Animated Navigation Tabs & Dynamic Surah Controls */}
      <div className="flex items-center">
        {/* Animated Segmented Navigation Pills (Desktop & Tablet) */}
        <div className="hidden md:flex items-center relative bg-slate-200/90 dark:bg-slate-950/90 sepia:bg-[#f2e9d2] p-1 rounded-2xl border border-slate-300 dark:border-slate-800 sepia:border-[#dfd3b9] text-xs shadow-inner select-none flex-shrink-0">
          {/* Fluid Sliding Background Indicator Pill */}
          <div
            className="absolute top-1 bottom-1 rounded-xl bg-emerald-600 shadow-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
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
            className={`relative z-10 w-24 sm:w-28 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl font-medium transition-colors duration-200 active:scale-95 ${
              activeView === 'home'
                ? 'text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 sepia:text-[#78664f] hover:text-emerald-700 dark:hover:text-white sepia:hover:text-[#2d2417]'
            }`}
          >
            <Home className={`w-3.5 h-3.5 transition-transform duration-200 ${activeView === 'home' ? 'scale-110' : 'scale-100'}`} />
            <span>{t.home}</span>
          </button>

          <button
            onClick={() => onSelectView('reader')}
            className={`relative z-10 w-24 sm:w-28 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl font-medium transition-colors duration-200 active:scale-95 ${
              activeView === 'reader'
                ? 'text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 sepia:text-[#78664f] hover:text-emerald-700 dark:hover:text-white sepia:hover:text-[#2d2417]'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 transition-transform duration-200 ${activeView === 'reader' ? 'scale-110' : 'scale-100'}`} />
            <span>{t.read}</span>
          </button>

          <button
            onClick={() => onSelectView('bookmarks')}
            className={`relative z-10 w-24 sm:w-28 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl font-medium transition-colors duration-200 active:scale-95 ${
              activeView === 'bookmarks'
                ? 'text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 sepia:text-[#78664f] hover:text-emerald-700 dark:hover:text-white sepia:hover:text-[#2d2417]'
            }`}
          >
            <BookmarkIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${activeView === 'bookmarks' ? 'scale-110' : 'scale-100'}`} />
            <span>{t.bookmarks}</span>
          </button>
        </div>

        {/* Dynamic Surah & Page Controls (Smooth Animated Expand/Collapse: ONLY shows on Read page, collapses to 0px on Home & Bookmarks) */}
        <div
          className={`overflow-hidden min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center ${
            activeView === 'reader'
              ? 'max-w-[320px] opacity-100 scale-100 ml-1.5 sm:ml-2.5 pointer-events-auto'
              : 'max-w-0 opacity-0 scale-95 ml-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-200/90 dark:bg-slate-950/90 sepia:bg-[#f2e9d2] border border-slate-300 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-xl px-1.5 sm:px-2 py-1 shadow-inner whitespace-nowrap min-w-max">
            <button
              onClick={() => onPageChange(activePage + (viewMode === 'dual' ? 2 : 1))}
              disabled={activePage >= TOTAL_PAGES}
              className="p-1 text-slate-600 dark:text-slate-400 sepia:text-[#2d2417] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300/50 dark:hover:bg-slate-800/60 rounded-lg disabled:opacity-20 transition-all active:scale-90 flex-shrink-0"
              title="Next Page (Left RTL)"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => onSelectView('reader')}
              className="text-center min-w-0 px-1 max-w-[120px] sm:max-w-[190px] hover:opacity-85 transition-opacity cursor-pointer"
              title="Click to Open Quran Reader"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] truncate">
                {activePage === 1 ? 'Cover' : meta.surah.name_english}{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-serif text-xs">
                  ({meta.surah.name_arabic})
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono whitespace-nowrap">
                Pg {activePage}/{TOTAL_PAGES} • Juz {meta.juzNumber}
              </div>
            </button>

            <button
              onClick={() => onPageChange(activePage - (viewMode === 'dual' ? 2 : 1))}
              disabled={activePage <= 1}
              className="p-1 text-slate-600 dark:text-slate-400 sepia:text-[#2d2417] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-300/50 dark:hover:bg-slate-800/60 rounded-lg disabled:opacity-20 transition-all active:scale-90 flex-shrink-0"
              title="Previous Page (Right RTL)"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Section: Actions (Install, Search, Language, Theme, Settings) */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* PWA Install Button (When available) */}
        {canInstall && onInstallApp && (
          <button
            onClick={onInstallApp}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-90 animate-pulse ios-press"
            title="Install Quran App to Home Screen"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.installApp}</span>
          </button>
        )}

        {/* Instant Search Button (Ctrl+K) */}
        <button
          onClick={onOpenSearchModal}
          className="p-2 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] hover:scale-105 active:scale-90 rounded-xl transition-all flex items-center space-x-1 bg-slate-200/60 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-300 dark:border-slate-800 sepia:border-[#dfd3b9] ios-press"
          title="Search Surah, Juz, or Page (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden xl:inline text-xs font-medium">{t.search}</span>
        </button>

        {/* Bilingual Urdu / English Toggle */}
        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] hover:scale-105 active:scale-90 rounded-xl transition-all border border-slate-300 dark:border-slate-800 sepia:border-[#dfd3b9] ios-press"
            title={language === 'en' ? 'اردو زبان میں دیکھیں' : 'Switch to English'}
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>
        )}

        {/* 3-Way Theme Switcher (Dark -> Sepia -> Light) */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] hover:scale-105 active:rotate-45 active:scale-90 rounded-xl transition-all duration-200 ios-press"
          title={`Current: ${theme}. Click to switch theme (Dark / Sepia / Light)`}
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
          className="p-2 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] hover:scale-105 active:rotate-90 active:scale-90 rounded-xl transition-all duration-200 ios-press"
          title="Application Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Offline Cache Status Badge */}
        <button
          onClick={onOpenOfflineManager}
          className="hidden sm:flex items-center space-x-1 p-2 text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] hover:scale-105 active:scale-95 rounded-xl transition-all"
          title="Offline Storage & Download Manager"
        >
          <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {isOnline ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
