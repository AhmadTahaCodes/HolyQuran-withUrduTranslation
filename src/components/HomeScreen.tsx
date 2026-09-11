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
    <div className={`w-full h-full overflow-y-auto max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn pb-28 sm:pb-16 text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] ${language === 'ur' ? 'font-urdu' : ''}`}>
      {/* Top Greeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-serif font-semibold text-emerald-600 dark:text-emerald-400">
            {t.greeting}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.welcome},{' '}
            <span className="text-emerald-600 dark:text-emerald-400">{userName || 'Reader'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 sepia:text-[#78664f] mt-0.5">
            {language === 'ur'
              ? 'اللہ تعالیٰ آپ کی تلاوت کو قبول فرمائے اور باعثِ رحمت بنائے'
              : 'May your Quran reading bring peace, guidance, and illumination'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenOffline}
            className="p-2.5 text-slate-600 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] hover:scale-105 active:scale-90 rounded-2xl transition-all border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] ios-press"
            title={language === 'ur' ? 'آف لائن صفحات کا ذخیرہ' : 'Offline Storage & Cache'}
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2.5 text-slate-600 dark:text-slate-300 sepia:text-[#2d2417] hover:bg-slate-200 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] hover:scale-105 active:rotate-90 active:scale-90 rounded-2xl transition-all duration-200 border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] ios-press"
            title={t.settings}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PWA Home Screen Install Banner (When Installable) */}
      {canInstall && onInstallApp && (
        <div className="flex items-center justify-between p-4 rounded-3xl bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-transparent border border-emerald-500/30 hover-lift ios-card-press shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
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
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-90 ios-press flex-shrink-0"
          >
            {t.installApp}
          </button>
        </div>
      )}

      {/* Continue Reading Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-2xl shadow-emerald-950/30 border border-emerald-500/30 hover-lift ios-card-press">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-md">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.continueReading}</span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif flex items-center gap-2">
                <span>{currentMeta.pageNumber === 1 ? 'Cover' : currentMeta.surah.name_english}</span>
                {currentMeta.pageNumber > 1 && (
                  <span className="text-emerald-400 font-normal">({currentMeta.surah.name_arabic})</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-mono">
                {t.page} {activePage} {t.ofPages} {TOTAL_PAGES} • {t.juz} {currentMeta.juzNumber}
              </p>
            </div>

            {/* Reading Progress Indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>{language === 'ur' ? 'تلاوت شدہ تناسب' : 'Quran Progress'}</span>
                <span>
                  {language === 'ur' ? `${toArabicNumerals(progressPercent)}٪` : `${progressPercent}%`}
                </span>
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
            className="flex items-center justify-center space-x-2.5 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.03] active:scale-95 flex-shrink-0 active:shadow-sm select-none"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>
              {language === 'ur' ? `صفحہ ${toArabicNumerals(activePage)} کھولیں` : `Open Quran Page ${activePage}`}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl hover:border-emerald-500/40 hover:bg-emerald-500/5 hover-lift ios-card-press transition-all group select-none cursor-pointer shadow-sm"
        >
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-active:scale-90 transition-transform duration-200 mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold">{t.totalSurahs}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {language === 'ur' ? 'سورتوں کی فہرست' : 'Surah Index'}
          </span>
        </button>

        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl hover:border-amber-500/40 hover:bg-amber-500/5 hover-lift ios-card-press transition-all group select-none cursor-pointer shadow-sm"
        >
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 group-active:scale-90 transition-transform duration-200 mb-2">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold">{t.totalJuz}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {language === 'ur' ? 'پاروں کی فہرست' : 'Juz Index'}
          </span>
        </button>

        <button
          onClick={onOpenBookmarks}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl hover:border-blue-500/40 hover:bg-blue-500/5 hover-lift ios-card-press transition-all group select-none cursor-pointer shadow-sm"
        >
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-active:scale-90 transition-transform duration-200 mb-2">
            <BookmarkIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold">{t.bookmarks}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {totalBookmarks} {t.savedPins}
          </span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center text-center p-4 bg-slate-100 dark:bg-slate-900/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl hover:border-teal-500/40 hover:bg-teal-500/5 hover-lift ios-card-press transition-all group select-none cursor-pointer shadow-sm"
        >
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 group-active:scale-90 transition-transform duration-200 mb-2">
            <Search className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold">{t.search}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] font-mono mt-0.5">
            {language === 'ur' ? 'آیت، سورت یا صفحہ' : 'Surah, Ayah & Page'}
          </span>
        </button>
      </div>

      {/* 7 Traditional Manzils (Weekly Reading Cycle) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              {language === 'ur' ? 'ہفتہ وار ۷ منازل' : '7 Traditional Manzils (Weekly Quran Cycle)'}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">1 Manzil/Day</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {MANZILS.map((m) => (
            <button
              key={m.manzil}
              onClick={() => onOpenReader(m.page)}
              className="flex flex-col items-center p-2.5 bg-slate-100 dark:bg-slate-900/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl hover:border-emerald-500/50 hover-lift active:scale-95 transition-all text-center"
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
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            {t.quickJump}
          </h2>
          <button
            onClick={onOpenDrawer}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 hover:translate-x-1 transition-transform"
          >
            <span>{t.viewAllSurahs}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURED_SURAHS.map((s) => (
            <div
              key={s.id}
              onClick={() => onOpenReader(s.page)}
              className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-slate-900/80 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl hover:border-emerald-500/50 hover-lift cursor-pointer transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 transition-all flex-shrink-0 shadow-sm">
                  {s.id}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{s.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f] truncate">{s.desc}</div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-base font-serif font-bold text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">{s.arabic}</div>
                <div className="text-[10px] text-slate-400 font-mono">{t.page} {s.page}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
