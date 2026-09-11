import React from 'react';
import { BookOpen, Layers, Bookmark as BookmarkIcon, Search, Play, Sparkles, Settings, ArrowRight, Download, Calendar } from 'lucide-react';
import { getPageMetadata, toArabicNumerals } from '../utils/pageFallback';
import quranMeta from '../data/quran_meta.json';
import type { Language } from '../utils/i18n';
import { translations } from '../utils/i18n';

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
  language?: Language;
  canInstall?: boolean;
  onInstallApp?: () => void;
}

// 7 Traditional Manzils in Pakistani 16-line Mushaf
const MANZILS = [
  { manzil: 1, name: 'Manzil 1', urdu: 'منزل ۱', page: 2, desc: 'Al-Fatihah to An-Nisa' },
  { manzil: 2, name: 'Manzil 2', urdu: 'منزل ۲', page: 147, desc: 'Al-Maidah to At-Tawbah' },
  { manzil: 3, name: 'Manzil 3', urdu: 'منزل ۳', page: 249, desc: 'Yunus to An-Nahl' },
  { manzil: 4, name: 'Manzil 4', urdu: 'منزل ۴', page: 353, desc: 'Al-Isra to Al-Furqan' },
  { manzil: 5, name: 'Manzil 5', urdu: 'منزل ۵', page: 483, desc: 'Ash-Shuara to Ya-Sin' },
  { manzil: 6, name: 'Manzil 6', urdu: 'منزل ۶', page: 579, desc: 'As-Saffat to Al-Hujurat' },
  { manzil: 7, name: 'Manzil 7', urdu: 'منزل ۷', page: 677, desc: 'Qaf to An-Nas' }
];

const FEATURED_SURAHS = [
  { id: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', page: 2, desc: 'The Opening • ام القرآن' },
  { id: 2, name: 'Al-Baqarah', arabic: 'البقرة', page: 3, desc: 'The Cow • فسطاط القرآن' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', page: 353, desc: 'The Cave • جمعہ کی تلاوت' },
  { id: 36, name: 'Ya-Sin', arabic: 'يس', page: 529, desc: 'Ya-Sin • قلب القرآن' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', page: 638, desc: 'The Beneficent • عروس القرآن' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملك', page: 677, desc: 'The Sovereignty • تبارک' }
];

const TOTAL_PAGES = quranMeta.total_pages || 729;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  activePage,
  onOpenReader,
  onOpenDrawer,
  onOpenSearch,
  onOpenBookmarks,
  onOpenOffline,
  onOpenSettings,
  totalBookmarks,
  language = 'en',
  canInstall = false,
  onInstallApp
}) => {
  const currentMeta = getPageMetadata(activePage);
  const progressPercent = Math.round((activePage / TOTAL_PAGES) * 100);
  const t = translations[language];

  return (
    <div
      className={`w-full h-full overflow-y-auto max-w-4xl mx-auto px-4 py-5 sm:py-7 space-y-5 sm:space-y-6 animate-fadeIn pb-24 sm:pb-12 text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] ${language === 'ur' ? 'font-urdu' : ''
        }`}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
    >
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between gap-4">
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <div className="text-sm sm:text-base font-urdu font-bold text-emerald-600 dark:text-emerald-400 leading-snug">
            {t.greeting}
          </div>
          {language === 'ur' ? (
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-urdu mt-0.5">
              <span>{t.welcome}، </span>
              <bdi className="text-emerald-600 dark:text-emerald-400 font-sans">{userName || 'قاری'}</bdi>
            </h1>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              {t.welcome},{' '}
              <span className="text-emerald-600 dark:text-emerald-400">{userName || 'Reader'}</span>
            </h1>
          )}
          <p className={`text-xs sm:text-sm text-slate-500 dark:text-slate-400 sepia:text-[#78664f] mt-0.5 ${language === 'ur' ? 'font-urdu leading-relaxed' : ''}`}>
            {language === 'ur'
              ? 'اللہ تعالیٰ آپ کی تلاوت کو قبول فرمائے اور باعثِ رحمت بنائے'
              : 'May your Quran reading bring peace, guidance, and illumination'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenOffline}
            className="w-9 h-9 text-slate-600 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] flex items-center justify-center active:scale-[0.97]"
            title={language === 'ur' ? 'آف لائن صفحات کا ذخیرہ' : 'Offline Storage & Cache'}
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 text-slate-600 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] flex items-center justify-center active:scale-[0.97]"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PWA Home Screen Install Banner (When Installable) */}
      {canInstall && onInstallApp && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] sepia:bg-[#f2e9d2] border border-emerald-500/30 text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] shadow-xs">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white sepia:text-[#2d2417]">
                {language === 'ur' ? 'قرآن ایپ ہوم اسکرین پر انسٹال کریں' : 'Install Holy Quran to Home Screen'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">
                {language === 'ur' ? '۱۰۰٪ بغیر انٹرنیٹ (آف لائن) باآسانی مطالعہ کریں' : 'Read 100% offline anytime like a native mobile app'}
              </div>
            </div>
          </div>

          <button
            onClick={onInstallApp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors active:scale-[0.97] flex-shrink-0"
          >
            {t.installApp}
          </button>
        </div>
      )}

      {/* Continue Reading Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-7 shadow-xl shadow-emerald-950/20 border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-md">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>{t.continueReading}</span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif flex items-center gap-2">
                <span>{currentMeta.pageNumber === 1 ? 'Cover' : currentMeta.surah.name_english}</span>
                {currentMeta.pageNumber > 1 && (
                  <span className="text-emerald-400 font-normal">({currentMeta.surah.name_arabic})</span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                {t.page} {activePage} {t.ofPages} {TOTAL_PAGES} • {t.juz} {currentMeta.juzNumber}
              </p>
            </div>

            {/* Reading Progress Indicator */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>{language === 'ur' ? 'تلاوت شدہ تناسب' : 'Quran Progress'}</span>
                <span>
                  {language === 'ur' ? `${toArabicNumerals(progressPercent)}٪` : `${progressPercent}%`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
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
            className="flex items-center justify-center space-x-2 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex-shrink-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>
              {language === 'ur' ? `صفحہ ${toArabicNumerals(activePage)} کھولیں` : `Open Quran Page ${activePage}`}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center text-center p-3.5 sm:p-4 bg-white dark:bg-slate-900/80 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-colors active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">{t.totalSurahs}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {language === 'ur' ? 'سورتوں کی فہرست' : 'Surah Index'}
          </span>
        </button>

        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center text-center p-3.5 sm:p-4 bg-white dark:bg-slate-900/80 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-2xl hover:border-amber-500/40 hover:bg-amber-500/[0.02] transition-colors active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">{t.totalJuz}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {language === 'ur' ? 'پاروں کی فہرست' : 'Juz Index'}
          </span>
        </button>

        <button
          onClick={onOpenBookmarks}
          className="flex flex-col items-center text-center p-3.5 sm:p-4 bg-white dark:bg-slate-900/80 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-2xl hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-colors active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
            <BookmarkIcon className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">{t.bookmarks}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {totalBookmarks} {t.savedPins}
          </span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center text-center p-3.5 sm:p-4 bg-white dark:bg-slate-900/80 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-2xl hover:border-teal-500/40 hover:bg-teal-500/[0.02] transition-colors active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">{t.search}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {language === 'ur' ? 'آیت، سورت یا صفحہ' : 'Surah, Ayah & Page'}
          </span>
        </button>
      </div>

      {/* 7 Traditional Manzils (Weekly Reading Cycle) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 sepia:text-[#2d2417]">
              {language === 'ur' ? 'ہفتہ وار ۷ منازل' : '7 Traditional Manzils (Weekly Quran Cycle)'}
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">1 Manzil / Day</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {MANZILS.map((m) => (
            <button
              key={m.manzil}
              onClick={() => onOpenReader(m.page)}
              className="flex flex-col items-center p-2.5 bg-white dark:bg-slate-900/80 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-xl hover:border-emerald-500/40 transition-colors active:scale-[0.97] text-center"
              title={m.desc}
            >
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {language === 'ur' ? m.urdu : `M${m.manzil}`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                Pg {m.page}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured / Quick Surah Jump Section */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 sepia:text-[#2d2417]">
            {t.quickJump}
          </h2>
          <button
            onClick={onOpenDrawer}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>{t.viewAllSurahs}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {FEATURED_SURAHS.map((s) => (
            <div
              key={s.id}
              onClick={() => onOpenReader(s.page)}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900/80 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800/80 sepia:border-[#dfd3b9] rounded-2xl hover:border-emerald-500/40 cursor-pointer transition-colors active:scale-[0.99] group shadow-xs"
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {s.id}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">{s.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] truncate">{s.desc}</div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-2 rtl:mr-2 rtl:ml-0">
                <div className="text-sm sm:text-base font-serif font-bold text-emerald-600 dark:text-emerald-400">{s.arabic}</div>
                <div className="text-[10px] text-slate-400 font-mono">{t.page} {s.page}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Footer */}
      <footer className="pt-8 pb-4 mt-6 text-center border-t border-slate-200/70 dark:border-slate-800/70 sepia:border-[#dfd3b9]/70">
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 sepia:text-[#78664f] flex items-center justify-center gap-1.5">
          <span>Developed by Ahmad Taha with</span>
          <span className="text-rose-500 inline-block animate-pulse">❤️</span>
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 sepia:text-[#8c7b64] mt-1 font-serif">
          القرآن الكريم •  Offline Holy Quran
        </p>
      </footer>
    </div>
  );
};

export default HomeScreen;
