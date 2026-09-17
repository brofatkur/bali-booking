import React from 'react';
import { Compass, Search, Ticket, UserCheck } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  bookingCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            activeTab === 'explore'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Eksplor</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            activeTab === 'search'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Cari</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`relative flex flex-col items-center py-1 px-3 transition-colors ${
            activeTab === 'tickets'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className="relative">
            <Ticket className={`w-5 h-5 ${activeTab === 'tickets' ? 'stroke-[2.5]' : ''}`} />
            {bookingCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm animate-pulse">
                {bookingCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">Tiket Saya</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            activeTab === 'admin'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <UserCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Admin</span>
        </button>
      </div>
    </nav>
  );
};
