import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, Layers, Bookmark as BookmarkIcon, Hash, Trash2, Edit3, User, Sparkles } from 'lucide-react';
import quranMeta from '../data/quran_meta.json';
import type { Bookmark } from '../db/database';
import { toArabicNumerals } from '../utils/pageFallback';
import {
  TOTAL_PAGES,
  searchSurahs,
  searchJuzs,
  type SurahMeta,
  type JuzMeta
} from '../utils/searchIndex';

import type { Language } from '../utils/i18n';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: number;
  onSelectPage: (pageNumber: number) => void;
  bookmarks: Bookmark[];
  onDeleteBookmark: (id: number) => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  pageOffset?: number;
  language?: Language;
}

const MANZIL_LIST = [
  { manzil: 1, name: 'Manzil 1', urdu: 'منزل ۱', page: 2, desc: 'Al-Fatihah to An-Nisa', startSurah: 'Al-Fatihah' },
  { manzil: 2, name: 'Manzil 2', urdu: 'منزل ۲', page: 147, desc: 'Al-Maidah to At-Tawbah', startSurah: 'Al-Ma\'idah' },
  { manzil: 3, name: 'Manzil 3', urdu: 'منزل ۳', page: 249, desc: 'Yunus to An-Nahl', startSurah: 'Yunus' },
  { manzil: 4, name: 'Manzil 4', urdu: 'منزل ۴', page: 353, desc: 'Al-Isra to Al-Furqan', startSurah: 'Al-Isra' },
  { manzil: 5, name: 'Manzil 5', urdu: 'منزل ۵', page: 483, desc: 'Ash-Shuara to Ya-Sin', startSurah: 'Ash-Shu\'ara' },
  { manzil: 6, name: 'Manzil 6', urdu: 'منزل ۶', page: 579, desc: 'As-Saffat to Al-Hujurat', startSurah: 'As-Saffat' },
  { manzil: 7, name: 'Manzil 7', urdu: 'منزل ۷', page: 677, desc: 'Qaf to An-Nas', startSurah: 'Qaf' }
];

const allSurahs = (quranMeta?.surahs || []) as SurahMeta[];
const allJuzs = (quranMeta?.juzs || []) as JuzMeta[];

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  onSelectPage,
  bookmarks,
  onDeleteBookmark,
  userName,
  onUpdateUserName,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'manzil' | 'bookmark'>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [jumpPageInput, setJumpPageInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName || '');

  // Filter Surahs based on search query using normalized index
  const filteredSurahs = useMemo(() => {
    return searchSurahs(searchQuery, allSurahs);
  }, [searchQuery]);

  // Filter Juz based on search query using normalized index
  const filteredJuz = useMemo(() => {
    return searchJuzs(searchQuery, allJuzs);
  }, [searchQuery]);

  // Direct Page Jump Submission
  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= TOTAL_PAGES) {
      const target = Math.max(1, Math.min(TOTAL_PAGES, p));
      onSelectPage(target);
      setJumpPageInput('');
      onClose();
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserName(tempName);
    setIsEditingName(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Dark Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-10 transition-opacity"
      />

      {/* Slide-Over Drawer Container */}
      <div className="relative z-20 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full animate-slideLeft">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Quran Index & Navigation</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{TOTAL_PAGES} Pages • 114 Surahs • 30 Juz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Welcome Greeting Banner (Personalized Card) */}
        <div className="p-4 bg-emerald-50/60 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 border-b border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0 shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-serif text-emerald-600 dark:text-emerald-400 font-medium tracking-wide">
                  السَّلَامُ عَلَيْكُمْ
                </div>
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center space-x-1.5 mt-0.5">
                    <input
                      type="text"
                      autoFocus
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter name..."
                      className="px-2 py-0.5 text-xs bg-white dark:bg-slate-950 border border-emerald-500 rounded text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      Welcome, <span className="text-emerald-600 dark:text-emerald-400">{userName || 'Reader'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setTempName(userName || '');
                        setIsEditingName(true);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="Edit Name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">May your Quran reading be blessed</p>
              </div>
            </div>

            <div className="p-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hidden xs:block flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Page Direct Jump Input & Search */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <form onSubmit={handlePageJump} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min="1"
                max={TOTAL_PAGES}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder={`Jump to Page (1 - ${TOTAL_PAGES})...`}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md active:scale-95"
            >
              Go
            </button>
          </form>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Surah, Juz, or Number (e.g. Yasin, 36)..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-100 dark:bg-slate-950/90 sepia:bg-[#f2e9d2] p-1.5 gap-1 select-none">
          <button
            onClick={() => setActiveTab('surah')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-[11px] font-medium transition-all active:scale-95 ${
              activeTab === 'surah'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'سورتیں' : 'Surahs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('juz')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-[11px] font-medium transition-all active:scale-95 ${
              activeTab === 'juz'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'پارے' : 'Juz'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manzil')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-[11px] font-medium transition-all active:scale-95 ${
              activeTab === 'manzil'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white'
            }`}
          >
            <span>{language === 'ur' ? 'منازل' : 'Manzil'}</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmark')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-[11px] font-medium transition-all active:scale-95 ${
              activeTab === 'bookmark'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-white'
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'نشانات' : 'Saved'}</span>
          </button>
        </div>

        {/* Tab Content List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-200 dark:divide-slate-800/40">
          {/* SURAH LIST TAB */}
          {activeTab === 'surah' && (
            filteredSurahs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No Surahs found matching query</div>
            ) : (
              filteredSurahs.map((surah) => (
                <div
                  key={surah.id}
                  onClick={() => {
                    const targetPage = Math.max(1, Math.min(TOTAL_PAGES, surah.start_page));
                    onSelectPage(targetPage);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group ${
                    activePage >= surah.start_page && activePage <= surah.end_page
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                      {surah.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{surah.name_english}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono flex-shrink-0">
                          {surah.revelation_type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{surah.name_translation}</div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-base font-serif font-bold text-emerald-600 dark:text-emerald-400">{surah.name_arabic}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Page {surah.start_page}</div>
                  </div>
                </div>
              ))
            )
          )}

          {/* JUZ LIST TAB */}
          {activeTab === 'juz' && (
            filteredJuz.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No Juz found matching query</div>
            ) : (
              filteredJuz.map((juz) => {
                const startSurah = allSurahs.find(s => s.id === juz.start_surah_id);
                return (
                  <div
                    key={juz.juz_number}
                    onClick={() => {
                      const targetPage = Math.max(1, Math.min(TOTAL_PAGES, juz.start_page));
                      onSelectPage(targetPage);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group ${
                      activePage >= juz.start_page && activePage <= juz.end_page
                        ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-500/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
                        J{juz.juz_number}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          Juz {juz.juz_number} <span className="text-amber-600 dark:text-amber-400 font-semibold">({juz.name_english})</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">Starts: {startSurah?.name_english}</div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-base font-serif font-bold text-amber-600 dark:text-amber-400">الجُزْءُ {toArabicNumerals(juz.juz_number)} ({juz.name_arabic})</div>
                      <div className="text-[10px] text-slate-400 font-mono">Pages {juz.start_page}-{juz.end_page}</div>
                    </div>
                  </div>
                );
              })
            )
          )}

          {/* MANZIL LIST TAB */}
          {activeTab === 'manzil' && (
            MANZIL_LIST.map((m) => (
              <div
                key={m.manzil}
                onClick={() => {
                  onSelectPage(m.page);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 sepia:hover:bg-[#f2e9d2] cursor-pointer transition-colors group ${
                  activePage >= m.page ? 'bg-teal-50/70 dark:bg-teal-500/10 border border-teal-500/30' : ''
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xs font-mono font-bold text-teal-600 dark:text-teal-400 flex-shrink-0">
                    M{m.manzil}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {language === 'ur' ? m.urdu : m.name}{' '}
                      <span className="text-teal-600 dark:text-teal-400 font-semibold font-urdu">({m.urdu})</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{m.desc}</div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-bold text-teal-600 dark:text-teal-400 font-urdu">{m.startSurah}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Page {m.page}</div>
                </div>
              </div>
            ))
          )}

          {/* BOOKMARKS LIST TAB */}
          {activeTab === 'bookmark' && (
            bookmarks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No bookmarks saved yet</div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div
                    onClick={() => {
                      onSelectPage(bm.pageNumber);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer min-w-0 mr-2"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: bm.color || '#059669' }}
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Page {bm.pageNumber}</span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">• {bm.surahName}</span>
                    </div>
                    {bm.note && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic truncate mt-0.5">"{bm.note}"</div>
                    )}
                  </div>

                  {bm.id && (
                    <button
                      onClick={() => onDeleteBookmark(bm.id!)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                      title="Delete Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
