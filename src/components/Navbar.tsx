import React from 'react';
import { Palmtree, Compass, ShieldCheck, Database, Search } from 'lucide-react';
import { DbConnectionStatus } from '../lib/db';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchClick: () => void;
  dbStatus?: DbConnectionStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSearchClick,
  dbStatus,
}) => {
  const isDbConnected = dbStatus?.connected ?? true;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-md mx-auto sm:max-w-5xl px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('explore')}
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Palmtree className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                BaliPass
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5">
              Tiket Resmi Bali • GlobalTix & InsForge
            </p>
          </div>
        </div>

        {/* Status indicators & Admin Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Cari Aktivitas Bali"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* InsForge Database Connection Badge */}
          <div
            onClick={() => setActiveTab('admin')}
            title={
              dbStatus
                ? `InsForge DB: ${dbStatus.baseUrl} (${dbStatus.productCount} Produk Bali, ${dbStatus.latencyMs}ms)`
                : 'InsForge PostgreSQL Connected'
            }
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-colors ${
              isDbConnected
                ? 'bg-emerald-50 border-emerald-200/80 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200/80 text-amber-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              InsForge DB {dbStatus ? `(${dbStatus.productCount} Produk • ${dbStatus.latencyMs}ms)` : 'Online'}
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-teal-50 rounded-full border border-teal-200/80 text-teal-800 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>GlobalTix Bali</span>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'explore' : 'admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center space-x-1.5 ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{activeTab === 'admin' ? 'Mode Customer' : 'Admin'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
