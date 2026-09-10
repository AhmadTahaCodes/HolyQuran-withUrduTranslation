import React, { useState } from 'react';
import { User, Sparkles, Heart, Check, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onSaveName: (name: string) => void;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onSaveName,
  onClose
}) => {
  const [inputName, setInputName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      onSaveName(inputName.trim());
    } else {
      onSaveName('Reader');
    }
  };

  const handleSkip = () => {
    onSaveName('Reader');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/50 overflow-hidden relative">
        {/* Background Islamic Pattern Accent Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="p-6 sm:p-8 text-center space-y-5 relative z-10">
          {/* Top Decorative Icon Emblem */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-600/30 ring-4 ring-emerald-500/20">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          {/* Arabic & English Header */}
          <div className="space-y-1.5">
            <div className="text-xl sm:text-2xl font-serif font-bold text-amber-400 tracking-wide">
              السَّلَامُ عَلَيْكُمْ
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">
              Welcome to Al-Quran Digital
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Embark on a blessed Quran reading journey. Please tell us your name to personalize your reading index & bookmarks.
            </p>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                autoFocus
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter your name (e.g. Muhammad, Fatima)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 px-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98]"
              >
                <span>Begin Quran Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-slate-500 hover:text-slate-300 py-1 transition-colors"
              >
                Continue as Reader
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            <span>100% Offline • Private & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
