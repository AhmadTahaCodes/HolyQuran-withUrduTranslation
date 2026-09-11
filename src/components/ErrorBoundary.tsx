import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Quran App error:', error, errorInfo);
  }

  private handleReset = () => {
    window.location.hash = '#home';
    window.location.reload();
  };

  private handleClearAndReload = () => {
    try {
      localStorage.removeItem('quran_pwa_active_state');
    } catch {
      // ignore
    }
    window.location.hash = '#home';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-primary,#090d16)] text-[var(--text-main,#f8fafc)] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 sepia:bg-[#fffdf5] border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100 sepia:text-[#2d2417]">
                القرآن الكريم • The Holy Quran
              </h1>
              <p className="text-sm font-urdu text-slate-700 dark:text-slate-300 sepia:text-[#453725]" dir="rtl">
                معذرت، کوئی عارضی مسئلہ پیش آیا ہے۔ آپ کا تمام آف لائن ڈیٹا اور بک مارکس محفوظ ہیں۔
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 sepia:text-[#78664f]">
                A display glitch occurred. Your offline bookmarks and recitation progress remain completely safe.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/80 sepia:bg-[#f5ecda] rounded-xl border border-slate-200 dark:border-slate-800 sepia:border-[#dfd3b9] text-left overflow-x-auto text-[11px] font-mono text-rose-500 dark:text-rose-400 max-h-28">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs transition-colors shadow-sm active:scale-[0.98]"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>

              <button
                onClick={this.handleClearAndReload}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 sepia:bg-[#f2e9d2] hover:bg-slate-200 dark:hover:bg-slate-700 sepia:hover:bg-[#ebdcc0] text-slate-800 dark:text-slate-200 sepia:text-[#2d2417] rounded-2xl font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 sepia:border-[#dfd3b9] active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset & Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
