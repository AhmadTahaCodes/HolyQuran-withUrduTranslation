import React, { useState } from 'react';
import { X, Save, Trash2, Pin } from 'lucide-react';
import type { Bookmark } from '../db/database';
import { getPageMetadata } from '../utils/pageFallback';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageNumber: number;
  yRatio: number;
  xRatio: number;
  existingBookmark?: Bookmark | null;
  onSave: (note: string, color: string) => void;
  onDelete?: (id: number) => void;
}

const PALETTE = [
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Purple', hex: '#9333ea' }
];

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  pageNumber,
  yRatio,
  xRatio,
  existingBookmark,
  onSave,
  onDelete
}) => {
  const meta = getPageMetadata(pageNumber);
  const [note, setNote] = useState(existingBookmark?.note || '');
  const [selectedColor, setSelectedColor] = useState(existingBookmark?.color || '#059669');

  // Track props to synchronize state when editing a different bookmark
  const [prevBookmark, setPrevBookmark] = useState(existingBookmark);
  if (existingBookmark !== prevBookmark) {
    setPrevBookmark(existingBookmark);
    setNote(existingBookmark?.note || '');
    setSelectedColor(existingBookmark?.color || '#059669');
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(note, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#fbf5e6]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Pin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">
                {existingBookmark ? 'Edit Bookmark Note' : 'Add Coordinate Bookmark'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">
                Page {pageNumber} • Surah {meta.surah.name_english} ({meta.surah.name_arabic})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors flex items-center justify-center active:scale-[0.97]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Relative Position Badge */}
          <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] rounded-xl text-slate-700 dark:text-slate-300 sepia:text-[#2d2417] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9]">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Position: Y={Math.round(yRatio * 100)}% • X={Math.round(xRatio * 100)}%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">Juz {meta.juzNumber}</span>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] mb-1.5">
              Pin Color Tag
            </label>
            <div className="flex items-center space-x-2.5">
              {PALETTE.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  className={`w-7 h-7 rounded-full transition-all duration-150 active:scale-[0.96] flex items-center justify-center ${
                    selectedColor === c.hex
                      ? 'scale-110 ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-sm'
                      : 'hover:scale-105 opacity-75'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="bookmarkNoteInput" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 sepia:text-[#78664f] mb-1.5">
              Personal Reflection / Note (Optional)
            </label>
            <textarea
              id="bookmarkNoteInput"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your note, reflection, or recitation marker..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 sepia:bg-[#fffdf7] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl text-slate-900 dark:text-slate-100 sepia:text-[#2d2417] text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            {existingBookmark && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (existingBookmark.id) onDelete(existingBookmark.id);
                  onClose();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors active:scale-[0.97]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Pin</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 sepia:text-[#78664f] hover:bg-slate-100 dark:hover:bg-slate-800 sepia:hover:bg-[#f2e9d2] rounded-xl transition-colors active:scale-[0.97]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors active:scale-[0.97]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Pin</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;
