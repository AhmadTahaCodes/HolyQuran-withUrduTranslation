import React from 'react';
import { Home, BookOpen, Layers, Search, Bookmark as BookmarkIcon, Settings } from 'lucide-react';

interface MobileNavbarProps {
  activeTab: 'home' | 'reader';
  onSelectTab: (tab: 'home' | 'reader') => void;
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenDrawer,
  onOpenSearch,
  onOpenBookmarks,
  onOpenSettings
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-slate-100/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-3 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center space-y-1 text-[11px] font-medium transition-colors ${
          activeTab === 'home' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('reader')}
        className={`flex flex-col items-center space-y-1 text-[11px] font-medium transition-colors ${
          activeTab === 'reader' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span>Read</span>
      </button>

      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <Layers className="w-5 h-5" />
        <span>Index</span>
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <Search className="w-5 h-5 text-emerald-500" />
        <span>Search</span>
      </button>

      <button
        onClick={onOpenBookmarks}
        className="flex flex-col items-center space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <BookmarkIcon className="w-5 h-5 text-amber-500" />
        <span>Saved</span>
      </button>
    </div>
  );
};
