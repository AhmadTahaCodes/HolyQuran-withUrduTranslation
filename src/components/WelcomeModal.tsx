import React, { useState } from 'react';
import { User, Sparkles, Heart, ArrowRight, Smartphone, Download, CheckCircle2 } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface WelcomeModalProps {
  isOpen: boolean;
  initialName?: string;
  onSaveName: (name: string) => void;
  onClose: () => void;
  canInstall?: boolean;
  onInstallApp?: () => void;
  language?: Language;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  initialName = '',
  onSaveName,
  onClose,
  canInstall: _canInstall = false,
  onInstallApp,
  language = 'en'
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [inputName, setInputName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [installed, setInstalled] = useState(false);

  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = inputName.trim() || (isUrdu ? 'قاری' : 'Reader');
    setSavedName(finalName);
    onSaveName(finalName);
    setStep(2);
  };

  const handleSkipStep1 = () => {
    const defaultName = isUrdu ? 'قاری' : 'Reader';
    setSavedName(defaultName);
    onSaveName(defaultName);
    setStep(2);
  };

  const handleInstallClick = async () => {
    if (onInstallApp) {
      await onInstallApp();
      setInstalled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Step Indicator Badges */}
        <div className="pt-4 px-5 sm:px-6 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <div className="flex items-center space-x-2 rtl:space-x-reverse" dir={isUrdu ? 'rtl' : 'ltr'}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-colors ${
                step === 1 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-400'}>
              {isUrdu ? 'تعارف' : 'Profile'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-colors ${
                step === 2 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-400'}>
              {isUrdu ? 'ایپ انسٹال کریں' : 'Install App'}
            </span>
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            {step} / 2
          </span>
        </div>

        {/* STEP 1: Enter Name */}
        {step === 1 && (
          <div className="p-5 sm:p-7 text-center space-y-4 relative z-10 animate-fadeIn" dir={isUrdu ? 'rtl' : 'ltr'}>
            {/* Emblem */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>

            {/* Header */}
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-urdu font-bold text-emerald-600 dark:text-emerald-400">
                السَّلَامُ عَلَيْكُمْ
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">
                {isUrdu ? 'القرآن الکریم میں خوش آمدید' : 'Welcome to The Holy Quran'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {isUrdu
                  ? 'اپنے قرآنی سفر کا آغاز کریں۔ برائے مہربانی اپنا نام درج فرمائیں:'
                  : 'Embark on a blessed Quran reading journey. Please enter your name to personalize your reading index & bookmarks.'}
              </p>
            </div>

            {/* Form Input */}
            <form onSubmit={handleSubmitStep1} className="space-y-3.5 pt-1">
              <div className="relative">
                <User className="absolute left-3 top-2.5 rtl:left-auto rtl:right-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  autoFocus
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder={isUrdu ? 'اپنا نام درج کریں (مثلاً: طٰہٰ، محمد، فاطمہ)...' : 'Enter your name (e.g. Muhammad, Fatima)...'}
                  className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2.5 bg-slate-50 dark:bg-slate-950 sepia:bg-[#fffdf7] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl text-slate-900 dark:text-slate-100 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors active:scale-[0.98]"
                >
                  <span>{isUrdu ? 'اگلا مرحلہ' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={handleSkipStep1}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 py-0.5 transition-colors"
                >
                  {isUrdu ? 'بطور قاری جاری رکھیں' : 'Continue as Reader'}
                </button>
              </div>
            </form>

            {/* Footer Note */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>100% Offline • Private & Secure</span>
            </div>
          </div>
        )}

        {/* STEP 2: Install App on Your Phone */}
        {step === 2 && (
          <div className="p-5 sm:p-7 text-center space-y-4 relative z-10 animate-fadeIn" dir={isUrdu ? 'rtl' : 'ltr'}>
            {/* Emblem */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-md">
              <Smartphone className="w-7 h-7" />
            </div>

            {/* Header */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {isUrdu ? (
                  <span>
                    خوش آمدید، <bdi className="font-bold">{savedName}</bdi>!
                  </span>
                ) : (
                  <span>
                    Welcome, <span className="font-bold">{savedName}</span>!
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">
                {isUrdu ? 'اپنے موبائل پر ایپ انسٹال کریں' : 'Install App on Your Phone'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                {isUrdu
                  ? 'بغیر انٹرنیٹ اور بغیر وائی فائی کے کسی بھی وقت فوراً کھولنے اور پڑھنے کے لیے ایپ کو اپنے فون پر شامل فرمائیں۔'
                  : 'Install this app on your phone for instant, 100% offline access anytime — even without Wi-Fi or mobile data.'}
              </p>
            </div>

            {/* Benefits Card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-2xl text-left rtl:text-right space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{isUrdu ? 'بغیر وائی فائی (۱۰۰٪ آف لائن) فوراً کھلتی ہے' : 'Opens instantly without Wi-Fi (100% Offline)'}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{isUrdu ? 'موبائل ایپ کی طرح ہوم اسکرین پر براہ راست آئیکن' : 'Adds dedicated icon to your mobile Home Screen'}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{isUrdu ? 'فل اسکرین آرام دہ مطالعہ، بغیر براؤزر ایڈریس بار کے' : 'Full-screen immersion with zero browser address bar'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              {installed ? (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center justify-center space-x-2 rtl:space-x-reverse animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="font-bold">{isUrdu ? 'انسٹالیشن کا عمل شروع ہو چکا ہے!' : 'App installation started / added to home screen!'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isUrdu ? 'ایپ ابھی ڈاؤن لوڈ / انسٹال کریں' : 'Download / Install App Directly'}</span>
                </button>
              )}

              {/* Install Guidance (Always helpful for Android / iOS) */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 sepia:bg-[#f2e9d2] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-xl text-[11px] text-slate-500 dark:text-slate-400 space-y-1 text-left rtl:text-right">
                <p>
                  <strong className="text-emerald-600 dark:text-emerald-400">Android (Chrome):</strong>{' '}
                  {isUrdu ? 'اوپر دائیں مینیو (⋮) پر ٹیپ کریں اور "Install app" منتخب کریں۔' : 'Tap menu (⋮) and select "Install app".'}
                </p>
                <p>
                  <strong className="text-emerald-600 dark:text-emerald-400">iPhone (Safari):</strong>{' '}
                  {isUrdu ? 'نیچے شیئر بٹن (⎋) پر ٹیپ کریں اور "Add to Home Screen" منتخب کریں۔' : 'Tap Share (⎋) and select "Add to Home Screen".'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 sepia:bg-[#f2e9d2] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 sepia:text-[#2d2417] font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 sepia:border-[#dfd3b9] transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse active:scale-[0.98] cursor-pointer"
              >
                <span>{isUrdu ? 'قرآن مجید کا مطالعہ شروع کریں' : 'Continue to Holy Quran'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>

            {/* Footer Note */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>100% Offline • Standalone App</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeModal;
