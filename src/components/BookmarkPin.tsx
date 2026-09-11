import React from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import type { Bookmark } from '../db/database';

interface BookmarkPinProps {
  bookmark: Bookmark;
  onClick: (e: React.MouseEvent) => void;
}

export const BookmarkPin: React.FC<BookmarkPinProps> = ({ bookmark, onClick }) => {
  const topPercent = Math.max(2, Math.min(95, bookmark.yRatio * 100));
  const leftPercent = Math.max(2, Math.min(95, bookmark.xRatio * 100));
  const pinColor = bookmark.color || '#059669';

  return (
    <div
      onClick={onClick}
      style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group select-none"
      title={`Bookmark Note: ${bookmark.note || 'No note'} (Surah ${bookmark.surahName})`}
    >
      {/* Quiet, Jewel-Like Bookmark Pin Badge */}
      <div
        className="relative flex items-center justify-center w-6 h-6 rounded-full shadow-md border-2 border-white/90 dark:border-slate-900 transition-transform duration-150 ease-out group-hover:scale-110 active:scale-[0.96] ring-1 ring-black/10"
        style={{ backgroundColor: pinColor }}
      >
        <BookmarkIcon className="w-3 h-3 fill-white stroke-white" />
      </div>

      {/* Hover Tooltip Preview */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-40 pointer-events-none animate-fadeIn">
        <div className="px-2.5 py-1.5 bg-slate-950/95 dark:bg-slate-900/95 text-slate-100 border border-slate-800 rounded-xl shadow-xl text-xs whitespace-nowrap max-w-xs font-sans">
          <div className="font-semibold text-emerald-400">Page {bookmark.pageNumber} • {bookmark.surahName}</div>
          {bookmark.note && <div className="text-slate-300 text-[11px] truncate max-w-[200px]">{bookmark.note}</div>}
        </div>
        <div className="w-2 h-2 bg-slate-950 dark:bg-slate-900 border-r border-b border-slate-800 rotate-45 -mt-1" />
      </div>
    </div>
  );
};

export default BookmarkPin;
