import { Component } from 'react';
import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-[#8B1E3F]/10 p-8 text-center max-w-sm">
            <h1 className="font-display text-xl text-[#1C1C1C] mb-2">Un problème d'affichage est survenu</h1>
            <p className="text-[#5A5A5A] mb-6">Rechargez la page pour continuer.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#8B1E3F] text-[#FFF9F3] px-5 py-3 rounded-full font-medium tracking-wide hover:bg-[#6E1732] transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={16} /> Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
