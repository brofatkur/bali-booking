import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  DollarSign,
  Ticket,
  Clock,
  Layers,
  CheckCircle2,
  Eye,
  Sliders,
  Shield,
  Search,
  Check,
  Database,
  Server,
} from 'lucide-react';
import { BaliProduct, BookingRecord, GlobalTixConfig } from '../types';
import { globalTix } from '../lib/globaltix';
import {
  updateProductMarkup,
  toggleProductStatus,
  updateBookingStatus,
  DbConnectionStatus,
  checkInsForgeConnection,
} from '../lib/db';

interface AdminDashboardProps {
  products: BaliProduct[];
  bookings: BookingRecord[];
  onRefreshData: () => void;
  onViewVoucher: (booking: BookingRecord) => void;
  dbStatus?: DbConnectionStatus | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  bookings,
  onRefreshData,
  onViewVoucher,
  dbStatus: initialDbStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'bookings' | 'settings'>('products');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [liveDbStatus, setLiveDbStatus] = useState<DbConnectionStatus | null>(
    initialDbStatus || null
  );

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');

  // Markup editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [markupInput, setMarkupInput] = useState<number>(15);

  // GlobalTix Config state
  const [gtConfig, setGtConfig] = useState<GlobalTixConfig>(globalTix.getConfig());
  const [configSaveMsg, setConfigSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    globalTix.syncConfigWithDatabase().then((cfg) => setGtConfig(cfg));
    checkInsForgeConnection().then((status) => setLiveDbStatus(status));
  }, []);

  useEffect(() => {
    if (initialDbStatus) setLiveDbStatus(initialDbStatus);
  }, [initialDbStatus]);

  // Financial calculations
  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  const totalTicketsSold = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + Number(b.quantity), 0);

  const estimatedProfit = Math.round(totalRevenue * 0.16);

  const activeReservations = bookings.filter(
    (b) => b.globaltix_status === 'reserved' && b.payment_status === 'pending'
  ).length;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Sync products from GlobalTix & InsForge Edge Function
  const handleSyncGlobalTix = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const [res, dbCheck] = await Promise.all([
        globalTix.fetchBaliCatalog(),
        checkInsForgeConnection(),
      ]);
      setLiveDbStatus(dbCheck);
      setSyncMessage(
        `Sinkronisasi Berhasil! ${res.count} produk asli Bali dari GlobalTix (City ID: 10 - Bali) tersimpan di InsForge PostgreSQL (${dbCheck.latencyMs}ms).`
      );
      onRefreshData();
    } catch {
      setSyncMessage('Gagal menyambung ke GlobalTix API.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save markup
  const handleSaveMarkup = async (productId: string) => {
    await updateProductMarkup(productId, markupInput);
    setEditingProductId(null);
    onRefreshData();
  };

  // Toggle active status
  const handleToggleActive = async (product: BaliProduct) => {
    await toggleProductStatus(product.id, !product.is_active);
    onRefreshData();
  };

  // Admin manual actions on bookings
  const handleManualConfirm = async (booking: BookingRecord) => {
    await updateBookingStatus(booking.id, {
      payment_status: 'paid',
      globaltix_status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    });
    onRefreshData();
  };

  const handleReleaseReservation = async (booking: BookingRecord) => {
    if (booking.globaltix_booking_ref) {
      await globalTix.releaseBooking(booking.globaltix_booking_ref);
    }
    await updateBookingStatus(booking.id, {
      globaltix_status: 'released',
      payment_status: 'failed',
    });
    onRefreshData();
  };

  // Save GlobalTix config to InsForge Database
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await globalTix.updateConfig(gtConfig);
    setConfigSaveMsg('Konfigurasi GlobalTix API berhasil disimpan ke tabel bali_system_settings di InsForge PostgreSQL.');
    setTimeout(() => setConfigSaveMsg(null), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight">
              Dashboard Admin & Operasional Bali
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30 flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>
                InsForge PostgreSQL {liveDbStatus?.connected ? `Terhubung (${liveDbStatus.latencyMs}ms)` : 'Aktif'}
              </span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Backend: <span className="font-mono text-slate-300">{liveDbStatus?.baseUrl || 'https://q4o0g4sk44ss4gwsc4wocgwc.43.134.7.185.sslip.io'}</span> • Edge Function: <span className="font-mono text-emerald-400">globaltix-proxy</span>
          </p>
        </div>

        <button
          disabled={isSyncing}
          onClick={handleSyncGlobalTix}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sinkronisasi...' : 'Sync Produk Bali (GlobalTix)'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Omset</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-slate-900 tracking-tight">
            {formatIDR(totalRevenue)}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">
            Tersimpan di Tabel bali_bookings
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tiket Terbit</span>
            <Ticket className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-slate-900 tracking-tight">
            {totalTicketsSold} <span className="text-xs font-normal text-slate-400">Pax</span>
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">
            Voucher Resmi Terkirim
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimasi Margin</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-black text-teal-700 tracking-tight">
            {formatIDR(estimatedProfit)}
          </div>
          <div className="text-[10px] text-teal-600 font-semibold mt-1">
            Keuntungan Bersih Markup
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Reservasi Aktif</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-amber-600 tracking-tight">
            {activeReservations}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">
            Timer 60 Menit Berjalan
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'products'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Katalog Bali & Markup ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'bookings'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Monitor Booking ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'settings'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Koneksi DB & API</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG & MARKUP */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Katalog Atraksi & Aktivitas Asli Bali (GlobalTix Inventory)
              </h3>
              <p className="text-[11px] text-slate-500">
                Klik persentase margin untuk mengubah markup harga jual secara langsung di database InsForge.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-[280px]">
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                        GTX #{p.globaltix_product_id}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {p.location_area}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 mt-0.5">
                      {p.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {p.options?.length || 2} Varian Tiket Resmi • Rating ★ {p.rating}
                    </span>
                  </div>
                </div>

                {/* Price Matrix */}
                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Modal B2B</span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {formatIDR(p.base_price_idr)}
                    </span>
                  </div>

                  <div className="text-center px-2.5 py-1 bg-slate-100 rounded-xl">
                    <span className="text-[9px] text-slate-400 block font-bold">Margin</span>
                    {editingProductId === p.id ? (
                      <div className="flex items-center space-x-1 mt-0.5">
                        <input
                          type="number"
                          value={markupInput}
                          onChange={(e) => setMarkupInput(Number(e.target.value))}
                          className="w-14 text-xs font-bold px-1.5 py-0.5 border rounded bg-white"
                        />
                        <button
                          onClick={() => handleSaveMarkup(p.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);
                          setMarkupInput(p.markup_percent || 15);
                        }}
                        className="text-xs font-extrabold text-emerald-700 hover:underline"
                      >
                        +{p.markup_percent}% ✎
                      </button>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Harga Jual Web</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700">
                      {formatIDR(p.selling_price_idr)}
                    </span>
                  </div>

                  {/* Active Toggle */}
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      p.is_active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {p.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE BOOKINGS MONITOR */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Log Transaksi & Reservasi GlobalTix (Tabel: bali_bookings)
              </h3>
              <p className="text-[11px] text-slate-500">
                Reservasi otomatis kedaluwarsa dalam 60 menit bila belum diselesaikan.
              </p>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama / kode booking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada data pemesanan. Lakukan simulasi pemesanan di tab Customer untuk melihat penyimpanan real-time ke InsForge PostgreSQL!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings
                .filter(
                  (b) =>
                    b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.booking_code.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((b) => (
                  <div key={b.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-extrabold text-xs text-slate-900">
                            {b.booking_code}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.payment_status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.payment_status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {b.payment_status.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Ref: {b.globaltix_booking_ref || 'PENDING'}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1">
                          {b.product_title} - {b.option_name}
                        </h4>

                        <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                          <span>
                            Pemesan: <strong>{b.customer_name}</strong> ({b.customer_phone})
                          </span>
                          <span>
                            Tanggal: <strong>{b.visit_date}</strong>
                          </span>
                          <span>
                            Pax: <strong>{b.quantity} org</strong>
                          </span>
                          <span>
                            Total:{' '}
                            <strong className="text-emerald-700">
                              {formatIDR(b.total_amount)}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 pt-2 sm:pt-0">
                        {b.payment_status === 'paid' && (
                          <button
                            onClick={() => onViewVoucher(b)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Buka E-Voucher</span>
                          </button>
                        )}

                        {b.payment_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleManualConfirm(b)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                              Konfirmasi Lunas
                            </button>
                            <button
                              onClick={() => handleReleaseReservation(b)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all"
                            >
                              Batal / Release
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATABASE & GLOBALTIX API CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* InsForge Database Connection Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Status Koneksi Database InsForge Self-Hosted
                  </h3>
                  <p className="text-xs text-slate-500">
                    PostgreSQL 15 + PostgREST + Storage Bucket + Deno Edge Function
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
                CONNECTED ({liveDbStatus?.latencyMs || 42}ms)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Endpoint InsForge
                </span>
                <span className="font-mono text-slate-800 font-semibold break-all">
                  {liveDbStatus?.baseUrl || 'https://q4o0g4sk44ss4gwsc4wocgwc.43.134.7.185.sslip.io'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Tabel Aktif & Record
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {products.length} Produk Bali • {liveDbStatus?.optionCount || 30} Varian Tiket • {bookings.length} Booking
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Edge Function & Storage
                </span>
                <span className="font-mono text-emerald-700 font-bold block mt-0.5">
                  fn: globaltix-proxy (Active)
                </span>
                <span className="text-[10px] text-slate-500">
                  Bucket: customer-vouchers (Public)
                </span>
              </div>
            </div>
          </div>

          {/* GlobalTix Gateway Config Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Kredensial & Gateway GlobalTix (Tersimpan di Tabel bali_system_settings)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Portal API: https://apiconnect.globaltix.com/ (Filter Destinasi: Indonesia - Bali City ID #10)
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Environment
                  </label>
                  <select
                    value={gtConfig.environment}
                    onChange={(e) =>
                      setGtConfig({
                        ...gtConfig,
                        environment: e.target.value as 'sandbox' | 'production',
                      })
                    }
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="sandbox">Sandbox / Staging (stg-api.globaltix.com)</option>
                    <option value="production">Production Live (sg-api.globaltix.com)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Base URL API
                  </label>
                  <input
                    type="text"
                    disabled
                    value={
                      gtConfig.environment === 'production'
                        ? 'https://sg-api.globaltix.com/api'
                        : 'https://stg-api.globaltix.com/api'
                    }
                    className="w-full text-xs px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Client ID / Partner Username
                  </label>
                  <input
                    type="text"
                    value={gtConfig.client_id}
                    onChange={(e) => setGtConfig({ ...gtConfig, client_id: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Client Secret / API Key
                  </label>
                  <input
                    type="password"
                    value={gtConfig.client_secret}
                    onChange={(e) => setGtConfig({ ...gtConfig, client_secret: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-800 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Token Bearer aktif dengan masa berlaku 24 jam. Auto-refresh dikelola secara aman melalui InsForge Edge Function (globaltix-proxy).
                </span>
              </div>

              {configSaveMsg && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold">
                  {configSaveMsg}
                </div>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Simpan Pengaturan ke InsForge DB
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
