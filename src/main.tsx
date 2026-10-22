import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unknown runtime error' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('BaliPass Application Error:', error, errorInfo);
  }

  handleReset = async () => {
    try {
      localStorage.removeItem('cached_bali_products');
      localStorage.removeItem('cached_bali_bookings');
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-black text-xl">
              🌴
            </div>
            <h1 className="text-lg font-extrabold text-slate-900">
              Memperbarui Aplikasi BaliPass
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Terdeteksi pembaruan versi aplikasi atau data cache lama ({this.state.errorMessage}). Silakan klik tombol di bawah untuk memuat ulang versi terbaru.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all"
            >
              Bersihkan Cache & Muat Ulang Sekarang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
