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
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/85 dark:bg-slate-950/85 sepia:bg-[#fbf5e6]/85 border-t border-slate-200/80 dark:border-white/10 sepia:border-[#dfd3b9] backdrop-blur-2xl px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-colors select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={tab.onClick}
            className="relative flex-1 flex flex-col items-center justify-center py-0.5 group active:scale-85 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none focus:outline-none"
            title={tab.label}
          >
            {/* Apple iOS Signature Pill Capsule around Icon */}
            <div
              className={`relative flex items-center justify-center px-3.5 py-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                tab.isActive
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30 dark:ring-emerald-400/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-500 dark:text-slate-400 sepia:text-[#78664f] hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  tab.isActive
                    ? 'scale-110 -translate-y-0.5'
                    : 'scale-100 group-hover:scale-105'
                }`}
              />

              {/* Optional Bookmark Counter Badge */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[15px] h-3.5 flex items-center justify-center rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] shadow-sm animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Tab Label with iOS Fluid Typography */}
            <span
              className={`text-[10px] tracking-tight transition-all duration-200 mt-0.5 leading-none ${
                tab.isActive
                  ? 'font-bold text-emerald-600 dark:text-emerald-400 scale-105'
                  : 'font-medium text-slate-500 dark:text-slate-400 sepia:text-[#78664f]'
              }`}
            >
              {tab.label}
            </span>

            {/* Glowing Micro-Indicator Dot */}
            <span
              className={`w-1.5 h-1 rounded-full transition-all duration-300 ease-out mt-0.5 ${
                tab.isActive
                  ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] opacity-100 scale-100'
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
