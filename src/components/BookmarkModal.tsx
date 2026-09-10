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
  if (!isOpen) return null;

  const meta = getPageMetadata(pageNumber);
  const [note, setNote] = useState(existingBookmark?.note || '');
  const [selectedColor, setSelectedColor] = useState(existingBookmark?.color || '#059669');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(note, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Pin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {existingBookmark ? 'Edit Bookmark Note' : 'Add Coordinate Bookmark'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page {pageNumber} • Surah {meta.surah.name_english} ({meta.surah.name_arabic})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Relative Position Badge */}
          <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Relative Position: Y={Math.round(yRatio * 100)}% • X={Math.round(xRatio * 100)}%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">Juz {meta.juzNumber}</span>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Pin Color Tag</label>
            <div className="flex items-center space-x-3">
              {PALETTE.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                    selectedColor === c.hex ? 'scale-125 ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : 'hover:scale-110 opacity-70'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="bookmarkNoteInput" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Personal Reflection / Note (Optional)
            </label>
            <textarea
              id="bookmarkNoteInput"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your note, reflection, or recitation marker..."
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {existingBookmark && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (existingBookmark.id) onDelete(existingBookmark.id);
                  onClose();
                }}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Pin</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Pin</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
