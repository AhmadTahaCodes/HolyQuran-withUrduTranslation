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
      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
      title={`Bookmark Note: ${bookmark.note || 'No note'} (Surah ${bookmark.surahName})`}
    >
      {/* Pulse effect circle */}
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-75"
        style={{ backgroundColor: pinColor }}
      />

      {/* Pin Badge */}
      <div
        className="relative flex items-center justify-center p-1.5 rounded-full shadow-lg border border-white/40 transform transition-transform group-hover:scale-125"
        style={{ backgroundColor: pinColor }}
      >
        <BookmarkIcon className="w-3.5 h-3.5 fill-white stroke-white" />
      </div>

      {/* Hover Tooltip Preview */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-40">
        <div className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs whitespace-nowrap max-w-xs text-slate-100 font-sans">
          <div className="font-semibold text-emerald-400">Page {bookmark.pageNumber} • {bookmark.surahName}</div>
          {bookmark.note && <div className="text-slate-300 text-[11px] truncate">{bookmark.note}</div>}
        </div>
        <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
      </div>
    </div>
  );
};
