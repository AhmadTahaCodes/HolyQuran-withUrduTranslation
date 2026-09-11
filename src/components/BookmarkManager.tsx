import React, { useState, useMemo } from 'react';
import { X, Bookmark as BookmarkIcon, Search, Trash2, Edit3, Download, Upload, ExternalLink, Tag } from 'lucide-react';
import type { Bookmark } from '../db/database';
import { db } from '../db/database';

interface BookmarkManagerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSelectPage: (pageNumber: number) => void;
  onDeleteBookmark: (id: number) => void;
  onEditBookmark: (bookmark: Bookmark) => void;
  isPageView?: boolean;
}

const COLOR_FILTERS = [
  { name: 'All Colors', hex: 'all' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Purple', hex: '#9333ea' }
];

export const BookmarkManager: React.FC<BookmarkManagerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectPage,
  onDeleteBookmark,
  onEditBookmark,
  isPageView = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'page'>('newest');

  // Filtered & Sorted Bookmarks
  const processedBookmarks = useMemo(() => {
    return bookmarks
      .filter((bm) => {
        // Color filter
        if (colorFilter !== 'all' && bm.color !== colorFilter) return false;
        // Text search
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
          bm.note.toLowerCase().includes(q) ||
          bm.surahName.toLowerCase().includes(q) ||
          bm.pageNumber.toString() === q
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.timestamp - a.timestamp;
        if (sortBy === 'oldest') return a.timestamp - b.timestamp;
        return a.pageNumber - b.pageNumber;
      });
  }, [bookmarks, searchQuery, colorFilter, sortBy]);

  // Export Bookmarks to JSON File
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quran_bookmarks_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Bookmarks from JSON File
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported: Bookmark[] = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          for (const bm of imported) {
            delete bm.id; // Allow auto-increment ID
            await db.bookmarks.add(bm);
          }
          alert(`Successfully imported ${imported.length} bookmarks!`);
        }
      } catch (err) {
        console.warn("Bookmark import error:", err);
        alert("Invalid bookmark JSON backup file format.");
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen && !isPageView) return null;

  const content = (
    <div className={`w-full max-w-4xl bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl shadow-xl overflow-hidden flex flex-col ${isPageView ? 'min-h-[500px]' : 'max-h-[85vh]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-50 dark:bg-slate-950/50 sepia:bg-[#fbf5e6]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <BookmarkIcon className="w-6 h-6 fill-amber-500/20" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 sepia:text-[#2d2417]">Saved Bookmarks & Notes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">Total {bookmarks.length} coordinate pins saved locally</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Export & Import Buttons */}
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 sepia:bg-[#f2e9d2] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 sepia:text-[#2d2417] text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700/60 sepia:border-[#dfd3b9] transition-colors"
            title="Export Bookmarks as JSON Backup"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 sepia:bg-[#f2e9d2] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 sepia:text-[#2d2417] text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700/60 sepia:border-[#dfd3b9] transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          {!isPageView && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

        {/* Toolbar & Filters Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or Surahs..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Color Tag Filter */}
            <div className="flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400 hidden xs:inline" />
              <select
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                {COLOR_FILTERS.map(c => (
                  <option key={c.hex} value={c.hex}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="page">Sort: Page Number</option>
            </select>
          </div>
        </div>

        {/* Bookmarks List Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {processedBookmarks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <BookmarkIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No bookmarks found matching filters.<br />Right-click or long-press anywhere on a Quran page to pin one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {processedBookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl hover:border-emerald-500/40 transition-all group"
                >
                  <div>
                    {/* Top Row: Page badge & color indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: bm.color || '#059669' }}
                        />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Page {bm.pageNumber}</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">• Surah {bm.surahName}</span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        Y={Math.round(bm.yRatio * 100)}%
                      </span>
                    </div>

                    {/* Note Content */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/50 mb-3 italic">
                      {bm.note ? `"${bm.note}"` : <span className="text-slate-400">No text note attached</span>}
                    </p>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(bm.timestamp).toLocaleDateString()}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditBookmark(bm)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {bm.id && (
                        <button
                          onClick={() => onDeleteBookmark(bm.id!)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Pin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onSelectPage(bm.pageNumber);
                          if (!isPageView) {
                            onClose();
                          }
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors ml-1"
                      >
                        <span>Jump</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );

  if (isPageView) {
    return (
      <div className="w-full h-full overflow-y-auto max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 animate-fadeIn pb-24 sm:pb-12">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      {content}
    </div>
  );
};
