import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CraftLink App Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F5] dark:bg-[#0B0F17] text-stone-900 dark:text-stone-100 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#131B2A] border border-stone-200 dark:border-stone-800 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-[#C85A27] dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold font-serif">Something went wrong</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              We encountered a minor issue loading this craft component. Please refresh or return home.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-bold text-xs flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
              <a
                href="/"
                className="px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-2 border border-stone-200 dark:border-stone-700"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
