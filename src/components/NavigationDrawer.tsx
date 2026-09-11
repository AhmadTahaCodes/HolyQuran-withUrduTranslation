import React, { useState, useMemo } from 'react';
import { X, Search, BookOpen, Layers, Bookmark as BookmarkIcon, Hash, Trash2, Edit3, User, Sparkles, Check } from 'lucide-react';
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-10 transition-opacity animate-fadeIn"
      />

      {/* Slide-Over Drawer Container */}
      <div
        className="relative z-20 w-full max-w-md bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border-l border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] shadow-2xl flex flex-col h-full animate-slideLeft pt-[env(safe-area-inset-top,0px)] pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]"
        dir={language === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#fbf5e6]">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">
                {language === 'ur' ? 'قرآنی اشاریہ و فہرست' : 'Quran Index & Navigation'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono">
                {TOTAL_PAGES} Pages • 114 Surahs • 30 Juz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors flex items-center justify-center active:scale-[0.97]"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Greeting Banner */}
        <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 sepia:bg-[#f2e9d2] border-b border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-urdu font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                  السَّلَامُ عَلَيْكُمْ
                </div>
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center space-x-1.5 rtl:space-x-reverse mt-0.5">
                    <input
                      type="text"
                      autoFocus
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter name..."
                      className="px-2 py-0.5 text-xs bg-white dark:bg-slate-950 sepia:bg-[#fffdf7] border border-emerald-500 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg active:scale-95"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] truncate">
                      <span>{language === 'ur' ? 'خوش آمدید، ' : 'Welcome, '}</span>
                      <bdi className="text-emerald-600 dark:text-emerald-400">{userName || (language === 'ur' ? 'قاری' : 'Reader')}</bdi>
                    </h3>
                    <button
                      onClick={() => {
                        setTempName(userName || '');
                        setIsEditingName(true);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="Edit Name"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 hidden xs:block flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Jump & Quick Search Controls */}
        <div className="p-3 bg-slate-50/70 dark:bg-slate-950/50 sepia:bg-[#fbf5e6] border-b border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] space-y-2">
          {/* Direct Page Jump */}
          <form onSubmit={handlePageJump} className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <div className="relative flex-1">
              <Hash className="absolute left-2.5 top-2.5 rtl:left-auto rtl:right-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="number"
                min="1"
                max={TOTAL_PAGES}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder={language === 'ur' ? `صفحہ پر جائیں (۱ تا ${toArabicNumerals(TOTAL_PAGES)})...` : `Jump to Page (1 - ${TOTAL_PAGES})...`}
                className="w-full pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-1.5 bg-white dark:bg-slate-950 sepia:bg-[#fffdf7] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl text-slate-800 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs active:scale-[0.97]"
            >
              {language === 'ur' ? 'جائیں' : 'Go'}
            </button>
          </form>

          {/* Filter Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 rtl:left-auto rtl:right-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ur' ? 'سورت، پارہ یا نمبر تلاش کریں...' : 'Search Surah, Juz, or Number...'}
              className="w-full pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-1.5 bg-white dark:bg-slate-950 sepia:bg-[#fffdf7] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl text-slate-800 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-100 dark:bg-slate-950 sepia:bg-[#f2e9d2] p-1 gap-1 select-none">
          <button
            onClick={() => setActiveTab('surah')}
            className={`flex-1 flex items-center justify-center space-x-1 rtl:space-x-reverse py-1.5 rounded-xl text-xs font-medium transition-colors active:scale-[0.98] ${
              activeTab === 'surah'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'سورتیں' : 'Surahs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('juz')}
            className={`flex-1 flex items-center justify-center space-x-1 rtl:space-x-reverse py-1.5 rounded-xl text-xs font-medium transition-colors active:scale-[0.98] ${
              activeTab === 'juz'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'پارے' : 'Juz'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manzil')}
            className={`flex-1 flex items-center justify-center space-x-1 rtl:space-x-reverse py-1.5 rounded-xl text-xs font-medium transition-colors active:scale-[0.98] ${
              activeTab === 'manzil'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <span>{language === 'ur' ? 'منازل' : 'Manzil'}</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmark')}
            className={`flex-1 flex items-center justify-center space-x-1 rtl:space-x-reverse py-1.5 rounded-xl text-xs font-medium transition-colors active:scale-[0.98] ${
              activeTab === 'bookmark'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5" />
            <span>{language === 'ur' ? 'نشانات' : 'Saved'}</span>
          </button>
        </div>

        {/* Tab Content List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* SURAH LIST TAB */}
          {activeTab === 'surah' && (
            filteredSurahs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {language === 'ur' ? 'کوئی سورت نہیں ملی' : 'No Surahs found matching query'}
              </div>
            ) : (
              filteredSurahs.map((surah) => (
                <div
                  key={surah.id}
                  onClick={() => {
                    const targetPage = Math.max(1, Math.min(TOTAL_PAGES, surah.start_page));
                    onSelectPage(targetPage);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 sepia:hover:bg-[#f2e9d2] cursor-pointer transition-colors active:scale-[0.99] group ${
                    activePage >= surah.start_page && activePage <= surah.end_page
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 sepia:bg-[#f2e9d2] flex items-center justify-center text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      {surah.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] truncate">{surah.name_english}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 sepia:bg-[#f2e9d2] text-slate-500 dark:text-slate-400 font-mono flex-shrink-0">
                          {surah.revelation_type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{surah.name_translation}</div>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                    <div className="text-sm font-serif font-bold text-emerald-600 dark:text-emerald-400">{surah.name_arabic}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Pg {surah.start_page}</div>
                  </div>
                </div>
              ))
            )
          )}

          {/* JUZ LIST TAB */}
          {activeTab === 'juz' && (
            filteredJuz.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {language === 'ur' ? 'کوئی پارہ نہیں ملا' : 'No Juz found matching query'}
              </div>
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
                    className={`flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 sepia:hover:bg-[#f2e9d2] cursor-pointer transition-colors active:scale-[0.99] group ${
                      activePage >= juz.start_page && activePage <= juz.end_page
                        ? 'bg-amber-500/10 border border-amber-500/30'
                        : 'border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
                        {juz.juz_number}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] truncate">
                          Juz {juz.juz_number} <span className="text-amber-600 dark:text-amber-400 font-semibold">({juz.name_english})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Starts: {startSurah?.name_english}</div>
                      </div>
                    </div>

                    <div className="text-right rtl:text-left flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                      <div className="text-sm font-serif font-bold text-amber-600 dark:text-amber-400">الجُزْءُ {toArabicNumerals(juz.juz_number)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Pg {juz.start_page}-{juz.end_page}</div>
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
                className={`flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 sepia:hover:bg-[#f2e9d2] cursor-pointer transition-colors active:scale-[0.99] group ${
                  activePage >= m.page ? 'bg-teal-500/10 border border-teal-500/30' : 'border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xs font-mono font-bold text-teal-600 dark:text-teal-400 flex-shrink-0">
                    {m.manzil}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] truncate">
                      {language === 'ur' ? m.urdu : m.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{m.desc}</div>
                  </div>
                </div>

                <div className="text-right rtl:text-left flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                  <div className="text-xs font-bold text-teal-600 dark:text-teal-400 font-urdu">{m.startSurah}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pg {m.page}</div>
                </div>
              </div>
            ))
          )}

          {/* BOOKMARKS LIST TAB */}
          {activeTab === 'bookmark' && (
            bookmarks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {language === 'ur' ? 'ابھی کوئی نشان محفوظ نہیں ہے' : 'No bookmarks saved yet'}
              </div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9]"
                >
                  <div
                    onClick={() => {
                      onSelectPage(bm.pageNumber);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer min-w-0 mr-2 rtl:mr-0 rtl:ml-2"
                  >
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: bm.color || '#059669' }}
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">Pg {bm.pageNumber}</span>
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
                      <Trash2 className="w-3.5 h-3.5" />
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

export default NavigationDrawer;
