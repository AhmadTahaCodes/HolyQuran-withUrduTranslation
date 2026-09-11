import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, BookOpen, Layers, Hash, ArrowRight, Sparkles, Sliders } from 'lucide-react';
import quranMeta from '../data/quran_meta.json';
import { toArabicNumerals } from '../utils/pageFallback';
import {
  TOTAL_PAGES,
  searchSurahs,
  searchJuzs,
  parseDirectPageNumber,
  parseAyahQuery,
  type SurahMeta,
  type JuzMeta
} from '../utils/searchIndex';

import type { Language } from '../utils/i18n';
import { translations } from '../utils/i18n';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (pageNumber: number, applyOffset?: boolean) => void;
  pageOffset?: number;
  onUpdatePageOffset?: (offset: number) => void;
  language?: Language;
}

const allSurahs = (quranMeta?.surahs || []) as SurahMeta[];
const allJuzs = (quranMeta?.juzs || []) as JuzMeta[];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPage,
  pageOffset = 0,
  onUpdatePageOffset,
  language = 'en'
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  // Filter Surahs using normalized index engine
  const matchingSurahs = useMemo(() => {
    return searchSurahs(query, allSurahs);
  }, [query]);

  // Filter Juz using normalized index engine
  const matchingJuz = useMemo(() => {
    return searchJuzs(query, allJuzs);
  }, [query]);

  // Check if query matches specific Ayah (e.g. "2:255", "18:10", "Yasin 58")
  const ayahMatch = useMemo(() => {
    return parseAyahQuery(query, allSurahs);
  }, [query]);

  // Direct page number jump validator
  const directPageNum = useMemo(() => {
    return parseDirectPageNumber(query);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85dvh]"
        dir={language === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* Search Input Bar Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-50 dark:bg-slate-950/70 sepia:bg-[#fbf5e6]">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2.5 rtl:mr-0 rtl:ml-2.5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white mr-1.5 rtl:mr-0 rtl:ml-1.5"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-2 py-0.5 text-[11px] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-lg transition-colors ml-1 rtl:ml-0 rtl:mr-1 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Optional Page Alignment Calibration Bar */}
        {onUpdatePageOffset && (
          <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-950/80 sepia:bg-[#f2e9d2] border-b border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>PDF Calibration:</span>
            </div>
            <div className="flex items-center space-x-1 font-mono">
              {[-2, -1, 0, 1, 2].map((val) => (
                <button
                  key={val}
                  onClick={() => onUpdatePageOffset(val)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    pageOffset === val
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 sepia:bg-[#dfd3b9] text-slate-700 dark:text-slate-400 hover:bg-slate-300'
                  }`}
                  title={`Calibrate page shift by ${val > 0 ? `+${val}` : val}`}
                >
                  {val > 0 ? `+${val}` : val}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {/* Ayah Match Result Banner */}
          {ayahMatch !== null && (
            <div
              onClick={() => {
                const targetPage = Math.max(1, Math.min(TOTAL_PAGES, ayahMatch.calculatedPage));
                onSelectPage(targetPage);
                onClose();
              }}
              className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500/15 cursor-pointer transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">
                    Surah {ayahMatch.surah.name_english} • <span className="text-emerald-600 dark:text-emerald-400">Ayah {ayahMatch.ayahNumber}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Target Page {ayahMatch.calculatedPage}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Go</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </div>
          )}

          {/* Direct Page Jump Banner */}
          {directPageNum !== null && (
            <div
              onClick={() => {
                const targetPage = Math.max(1, Math.min(TOTAL_PAGES, directPageNum));
                onSelectPage(targetPage);
                onClose();
              }}
              className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500/15 cursor-pointer transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">
                    Jump directly to Page {directPageNum}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Quran Page {directPageNum} of {TOTAL_PAGES}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Go</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </div>
          )}

          {/* Surah Matches */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1 mb-1.5">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Surahs ({matchingSurahs.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">114 Surahs</span>
            </div>

            {matchingSurahs.length === 0 ? (
              <div className="text-xs text-slate-400 italic p-3 text-center">
                {language === 'ur' ? 'کوئی سورت نہیں ملی' : `No Surahs match "${query}"`}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchingSurahs.slice(0, 12).map((surah) => (
                  <div
                    key={surah.id}
                    onClick={() => {
                      const targetPage = Math.max(1, Math.min(TOTAL_PAGES, surah.start_page));
                      onSelectPage(targetPage);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl hover:border-emerald-500/40 cursor-pointer transition-colors active:scale-[0.99] group shadow-xs"
                  >
                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 sepia:bg-[#dfd3b9] flex items-center justify-center text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        {surah.id}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] truncate">{surah.name_english}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{surah.name_translation}</div>
                      </div>
                    </div>

                    <div className="text-right rtl:text-left flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                      <div className="text-sm font-serif font-bold text-emerald-600 dark:text-emerald-400">{surah.name_arabic}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Pg {surah.start_page}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Juz Matches */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1 mb-1.5 pt-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Juz Parts ({matchingJuz.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">30 Juz</span>
            </div>

            {matchingJuz.length === 0 ? (
              <div className="text-xs text-slate-400 italic p-3 text-center">
                {language === 'ur' ? 'کوئی پارہ نہیں ملا' : `No Juz match "${query}"`}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchingJuz.slice(0, 10).map((juz) => {
                  const startSurah = allSurahs.find(s => s.id === juz.start_surah_id);
                  return (
                    <div
                      key={juz.juz_number}
                      onClick={() => {
                        const targetPage = Math.max(1, Math.min(TOTAL_PAGES, juz.start_page));
                        onSelectPage(targetPage);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl hover:border-amber-500/40 cursor-pointer transition-colors active:scale-[0.99] group shadow-xs"
                    >
                      <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
                          {juz.juz_number}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] truncate">
                            Juz {juz.juz_number} <span className="text-amber-600 dark:text-amber-400 font-semibold">({juz.name_english})</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Starts: {startSurah?.name_english}</div>
                        </div>
                      </div>

                      <div className="text-right rtl:text-left flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                        <div className="text-sm font-serif font-bold text-amber-600 dark:text-amber-400">الجُزْءُ {toArabicNumerals(juz.juz_number)}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Pg {juz.start_page}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
