import React from 'react';
import { Home, BookOpen, Layers, Search, Bookmark as BookmarkIcon } from 'lucide-react';
import type { ActiveView } from '../hooks/useReaderState';
import type { Language } from '../utils/i18n';
import { translations } from '../utils/i18n';

interface MobileNavbarProps {
  activeTab: ActiveView;
  onSelectTab: (tab: ActiveView) => void;
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  language?: Language;
  isZenMode?: boolean;
  bookmarkCount?: number;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenDrawer,
  onOpenSearch,
  language = 'en',
  isZenMode = false,
  bookmarkCount = 0
}) => {
  if (isZenMode) return null;

  const t = translations[language];

  const tabs = [
    {
      id: 'home',
      label: t.home,
      icon: Home,
      isActive: activeTab === 'home',
      onClick: () => onSelectTab('home')
    },
    {
      id: 'reader',
      label: t.read,
      icon: BookOpen,
      isActive: activeTab === 'reader',
      onClick: () => onSelectTab('reader')
    },
    {
      id: 'index',
      label: t.index,
      icon: Layers,
      isActive: false,
      onClick: onOpenDrawer
    },
    {
      id: 'search',
      label: t.search,
      icon: Search,
      isActive: false,
      onClick: onOpenSearch
    },
    {
      id: 'bookmarks',
      label: t.bookmarks,
      icon: BookmarkIcon,
      isActive: activeTab === 'bookmarks',
      onClick: () => onSelectTab('bookmarks'),
      badge: bookmarkCount
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-slate-950/95 sepia:bg-[#fbf5e6]/95 border-t border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] backdrop-blur-md px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] flex items-center justify-around shadow-sm transition-colors select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={tab.onClick}
            className="relative flex-1 flex flex-col items-center justify-center py-1 group active:scale-[0.96] transition-transform duration-150 ease-out select-none focus:outline-none cursor-pointer"
            title={tab.label}
          >
            {/* Icon Pill Capsule */}
            <div
              className={`relative flex items-center justify-center px-3.5 py-1 rounded-full transition-colors duration-150 ${
                tab.isActive
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 sepia:text-[#78664f] hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />

              {/* Bookmark Counter Badge */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 h-3.5 min-w-[15px] flex items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Tab Label */}
            <span
              className={`text-[10px] transition-colors duration-150 mt-0.5 leading-none ${
                tab.isActive
                  ? 'font-bold text-emerald-600 dark:text-emerald-400'
                  : 'font-medium text-slate-500 dark:text-slate-400 sepia:text-[#78664f]'
              }`}
            >
              {tab.label}
            </span>

            {/* Indicator Dot */}
            <span
              className={`w-1 h-1 rounded-full transition-all duration-200 mt-0.5 ${
                tab.isActive
                  ? 'bg-emerald-600 dark:bg-emerald-400 opacity-100 scale-100'
                  : 'bg-transparent opacity-0 scale-50'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNavbar;
