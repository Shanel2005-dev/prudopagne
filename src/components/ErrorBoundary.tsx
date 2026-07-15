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
        <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm">
            <h1 className="text-xl font-extrabold text-gray-800 mb-2">Un problème d'affichage est survenu</h1>
            <p className="text-gray-500 mb-6">Rechargez la page pour continuer.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#9A3412] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#7C2D12] transition-colors inline-flex items-center gap-2"
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
