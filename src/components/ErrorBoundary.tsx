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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white font-serif">
                قرآن کریم • The Holy Quran
              </h1>
              <p className="text-sm text-slate-400">
                An unexpected display issue occurred while loading this view.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-rose-400 max-h-32">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs transition-colors shadow-lg active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>

              <button
                onClick={this.handleClearAndReload}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold text-xs transition-colors border border-slate-700 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset & Refresh</span>
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
