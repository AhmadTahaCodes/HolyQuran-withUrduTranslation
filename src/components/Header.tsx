import React from 'react';
import { Menu, ChevronLeft, ChevronRight, BookOpen, HardDrive, AlignJustify, Columns, WifiOff, Search, Bookmark as BookmarkIcon, Home, Settings, Sun, Moon } from 'lucide-react';
import { getPageMetadata } from '../utils/pageFallback';
import quranMeta from '../data/quran_meta.json';
import type { ViewMode } from '../hooks/useReaderState';
import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  activePage: number;
  onPageChange: (page: number) => void;
  onOpenDrawer: () => void;
  onOpenSearchModal: () => void;
  onOpenBookmarkManager: () => void;
  onOpenOfflineManager: () => void;
  onOpenSettings: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isOnline: boolean;
  userName?: string;
  activeView: 'home' | 'reader';
  onSelectView: (view: 'home' | 'reader') => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const TOTAL_PAGES = quranMeta.total_pages || 728;

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onPageChange,
  onOpenDrawer,
  onOpenSearchModal,
  onOpenBookmarkManager,
  onOpenOfflineManager,
  onOpenSettings,
  viewMode,
  onViewModeChange,
  isOnline,
  userName,
  activeView,
  onSelectView,
  theme,
  onToggleTheme
}) => {
  const meta = getPageMetadata(activePage);

  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-16 bg-slate-100/90 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md px-2 sm:px-4 flex items-center justify-between shadow-sm transition-colors">
      {/* Left Section: Home Switcher, Menu & Search */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <button
          onClick={() => onSelectView(activeView === 'home' ? 'reader' : 'home')}
          className={`p-2 rounded-xl transition-colors active:scale-95 flex items-center space-x-1.5 ${
            activeView === 'home'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
          title={activeView === 'home' ? 'Switch to Quran Reader' : 'Go to Home Dashboard'}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline text-xs font-bold">Home</span>
        </button>

        <button
          onClick={onOpenDrawer}
          className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95 flex items-center space-x-1.5"
          title="Open Quran Index & Drawer"
        >
          <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
            Index
          </span>
        </button>

        <button
          onClick={onOpenSearchModal}
          className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95 flex items-center space-x-1.5 bg-slate-200/60 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800"
          title="Search Surah, Juz, or Page (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline text-xs text-slate-700 dark:text-slate-300 font-medium">Search</span>
        </button>
      </div>

      {/* Center Section: Active Page & Surah Info Badge (Reader View) */}
      {activeView === 'reader' ? (
        <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-200/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800/80 rounded-xl px-2 py-1 shadow-inner max-w-[55%] sm:max-w-none">
          <button
            onClick={() => onPageChange(activePage + (viewMode === 'dual' ? 2 : 1))}
            disabled={activePage >= TOTAL_PAGES}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-20 transition-colors active:scale-95 flex-shrink-0"
            title="Next Page (RTL Left)"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="text-center min-w-0 px-1">
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {meta.surah.name_english} <span className="text-emerald-600 dark:text-emerald-400 font-serif text-xs">({meta.surah.name_arabic})</span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
              Pg {activePage}/{TOTAL_PAGES} • Juz {meta.juzNumber}
            </div>
          </div>

          <button
            onClick={() => onPageChange(activePage - (viewMode === 'dual' ? 2 : 1))}
            disabled={activePage <= 1}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-20 transition-colors active:scale-95 flex-shrink-0"
            title="Previous Page (RTL Right)"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <span className="font-serif text-base font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
            الْقُرْآنُ الْكَرِيمُ
          </span>
        </div>
      )}

      {/* Right Section: Bookmarks, Theme Toggle & Settings */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        <button
          onClick={onOpenBookmarkManager}
          className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95"
          title="Open Bookmark Manager"
        >
          <BookmarkIcon className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95"
          title="Application Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Offline Manager */}
        <button
          onClick={onOpenOfflineManager}
          className="hidden sm:flex items-center space-x-1.5 p-2 sm:px-3 sm:py-1.5 bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700/60 transition-colors"
          title="Offline Storage Manager"
        >
          <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">Offline</span>
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
