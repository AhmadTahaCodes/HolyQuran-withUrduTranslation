import React, { useState, useEffect } from 'react';
import { Download, HardDrive, Trash2, X } from 'lucide-react';
import { db } from '../db/database';
import { generateFallbackPageDataUrl } from '../utils/pageFallback';
import quranMeta from '../data/quran_meta.json';

import type { Language } from '../utils/i18n';

interface OfflineManagerProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

const TOTAL_PAGES = quranMeta.total_pages || 729;

export const OfflineManager: React.FC<OfflineManagerProps> = ({ isOpen, onClose, language = 'en' }) => {
  const [cachedCount, setCachedCount] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number }>({ current: 0, total: TOTAL_PAGES });
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);

  // Load count of offline cached pages from IndexedDB
  const refreshCacheCount = async () => {
    try {
      const count = await db.offlinePages.count();
      setCachedCount(count);
    } catch (e) {
      console.warn("Failed to read offline cache count:", e);
    }
  };

  useEffect(() => {
    let active = true;
    if (isOpen) {
      db.offlinePages.count().then((count) => {
        if (active) setCachedCount(count);
      }).catch((e) => console.warn("Failed to read offline cache count:", e));
    }
    return () => { active = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Download and cache page range into IndexedDB
  const handleDownloadRange = async (startPage: number, endPage: number) => {
    setIsDownloading(true);
    const total = endPage - startPage + 1;
    setDownloadProgress({ current: 0, total });

    for (let p = startPage; p <= endPage; p++) {
      try {
        const padded = String(p - 1).padStart(3, '0');
        const imgUrl = `/pages/page_${padded}.webp`;
        let dataUrl = '';

        try {
          const res = await fetch(imgUrl);
          if (res.ok) {
            const blob = await res.blob();
            dataUrl = await new Promise((resolve) => {
              const r = new FileReader();
              r.onloadend = () => resolve(r.result as string);
              r.readAsDataURL(blob);
            });
          } else {
            dataUrl = generateFallbackPageDataUrl(p);
          }
        } catch {
          dataUrl = generateFallbackPageDataUrl(p);
        }

        await db.offlinePages.put({
          pageNumber: p,
          dataUrlOrBlob: dataUrl,
          timestamp: Date.now()
        });

        setDownloadProgress(prev => ({ ...prev, current: prev.current + 1 }));
      } catch (err) {
        console.warn(`Failed to cache page ${p}:`, err);
      }
    }

    await refreshCacheCount();
    setIsDownloading(false);
  };

  // Clear offline cached pages
  const handleClearCache = async () => {
    if (confirm("Are you sure you want to clear all offline cached pages?")) {
      await db.offlinePages.clear();
      await refreshCacheCount();
    }
  };

  const activeSurahObj = quranMeta.surahs.find(s => s.id === selectedSurahId) || quranMeta.surahs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#fbf5e6]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {language === 'ur' ? 'آف لائن قرآنی صفحات' : 'Offline Reading Storage'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ur' ? 'بغیر انٹرنیٹ کے تلاوت کے لیے صفحات محفوظ کریں' : 'Cache page WebP images for 100% offline access'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Storage Summary Card */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ur' ? 'آف لائن محفوظ شدہ صفحات' : 'Pages Cached for Offline'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {cachedCount} / {TOTAL_PAGES} {language === 'ur' ? 'صفحات' : 'Pages'} ({Math.round((cachedCount / TOTAL_PAGES) * 100)}%)
              </div>
            </div>
            {cachedCount > 0 && (
              <button
                onClick={handleClearCache}
                className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'ur' ? 'صاف کریں' : 'Clear'}</span>
              </button>
            )}
          </div>

          {/* Progress Bar during download */}
          {isDownloading && (
            <div className="space-y-2 p-3 bg-emerald-50 dark:bg-slate-950/60 border border-emerald-500/30 rounded-xl">
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-medium">
                <span>Downloading page images...</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{downloadProgress.current} / {downloadProgress.total}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                  style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Cache Surah Selector */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Download Specific Surah for Offline Use:
            </label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              <select
                value={selectedSurahId}
                onChange={(e) => setSelectedSurahId(Number(e.target.value))}
                className="flex-1 w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs truncate focus:outline-none focus:border-emerald-500"
              >
                {quranMeta.surahs.map((s) => (
                  <option key={s.id} value={s.id}>
                    Surah {s.id}. {s.name_english} ({s.name_arabic}) - Pg {s.start_page} to {s.end_page}
                  </option>
                ))}
              </select>
              <button
                disabled={isDownloading}
                onClick={() => handleDownloadRange(activeSurahObj.start_page, activeSurahObj.end_page)}
                className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Cache Surah</span>
              </button>
            </div>
          </div>

          {/* Download Entire Mushaf Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              disabled={isDownloading}
              onClick={() => handleDownloadRange(1, TOTAL_PAGES)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Entire Mushaf ({TOTAL_PAGES} Pages)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
