import React from 'react';
import { BookOpen, Layers, Bookmark as BookmarkIcon, Search, Play, User, Sparkles, HardDrive, Settings, ArrowRight } from 'lucide-react';
import { getPageMetadata } from '../utils/pageFallback';
import quranMeta from '../data/quran_meta.json';

interface HomeScreenProps {
  userName: string;
  activePage: number;
  onOpenReader: (page?: number) => void;
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenOffline: () => void;
  onOpenSettings: () => void;
  totalBookmarks: number;
}

const FEATURED_SURAHS = [
  { id: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', page: 1, desc: 'The Opening' },
  { id: 2, name: 'Al-Baqarah', arabic: 'البقرة', page: 2, desc: 'The Cow' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', page: 353, desc: 'The Cave' },
  { id: 36, name: 'Ya-Sin', arabic: 'يس', page: 529, desc: 'Ya-Sin' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', page: 638, desc: 'The Beneficent' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملك', page: 677, desc: 'The Sovereignty' }
];

const TOTAL_PAGES = quranMeta.total_pages || 728;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  activePage,
  onOpenReader,
  onOpenDrawer,
  onOpenSearch,
  onOpenBookmarks,
  onOpenOffline,
  onOpenSettings,
  totalBookmarks
}) => {
  const currentMeta = getPageMetadata(activePage);
  const progressPercent = Math.round((activePage / TOTAL_PAGES) * 100);

  return (
    <div className="w-full h-full overflow-y-auto max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn pb-24 sm:pb-12">
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-serif font-semibold text-emerald-600 dark:text-emerald-400">
            السَّلَامُ عَلَيْكُمْ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Welcome, <span className="text-emerald-600 dark:text-emerald-400">{userName || 'Reader'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            May your Quran reading bring peace and illumination
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-colors border border-slate-200 dark:border-slate-800"
          title="Open Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Continue Reading Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-2xl shadow-emerald-950/30 border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continue Reading</span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif flex items-center gap-2">
                <span>{currentMeta.surah.name_english}</span>
                <span className="text-emerald-400 font-normal">({currentMeta.surah.name_arabic})</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-mono">
                Page {activePage} of {TOTAL_PAGES} • Juz {currentMeta.juzNumber} • {currentMeta.surah.revelation_type}
              </p>
            </div>

            {/* Reading Progress Indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>Quran Progress</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => onOpenReader(activePage)}
            className="flex items-center justify-center space-x-2.5 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform active:scale-95 flex-shrink-0"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Open Quran Page {activePage}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
        >
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">114 Surahs</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Surah Index</span>
        </button>

        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group"
        >
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform mb-2">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">30 Juz / Para</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Juz Index</span>
        </button>

        <button
          onClick={onOpenBookmarks}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
        >
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-2">
            <BookmarkIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Bookmarks</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{totalBookmarks} Saved Pins</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-teal-500/40 hover:bg-teal-500/5 transition-all group"
        >
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform mb-2">
            <Search className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Search Quran</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Surah, Ayah & Page</span>
        </button>
      </div>

      {/* Featured / Quick Surah Jump Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Quick Jump Surahs
          </h2>
          <button
            onClick={onOpenDrawer}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All 114</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURED_SURAHS.map((s) => (
            <div
              key={s.id}
              onClick={() => onOpenReader(s.page)}
              className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-500/40 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 cursor-pointer transition-all group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                  {s.id}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{s.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{s.desc}</div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-base font-serif font-bold text-emerald-600 dark:text-emerald-400">{s.arabic}</div>
                <div className="text-[10px] text-slate-400 font-mono">Page {s.page}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
