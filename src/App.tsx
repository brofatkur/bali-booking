import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Zap,
  Compass,
  AlertCircle,
  RefreshCw,
  QrCode,
  Calendar,
  Users,
  Database,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketVoucherModal } from './components/TicketVoucherModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BaliProduct, BaliCategory, BaliProductOption, BookingRecord } from './types';
import {
  fetchProducts,
  fetchCategories,
  fetchBookings,
  checkInsForgeConnection,
  DbConnectionStatus,
} from './lib/db';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('explore'); // 'explore' | 'search' | 'tickets' | 'admin'

  // Data
  const [products, setProducts] = useState<BaliProduct[]>([]);
  const [categories, setCategories] = useState<BaliCategory[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [dbStatus, setDbStatus] = useState<DbConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<BaliProduct | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    product: BaliProduct;
    option: BaliProductOption;
    visitDate: string;
    pax: number;
  } | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<BookingRecord | null>(null);

  // Bali popular regions matching real GlobalTix Bali attractions
  const baliRegions = [
    'all',
    'Kuta',
    'Canggu',
    'Ubud',
    'Gianyar',
    'Uluwatu',
    'Nusa Penida',
    'Tanjung Benoa',
    'Kintamani',
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [p, c, b, status] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBookings(),
        checkInsForgeConnection(),
      ]);
      setProducts(p);
      setCategories(c);
      setBookings(b);
      setDbStatus(status);
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (!product.is_active) return false;

    if (selectedCategory !== 'all' && product.category_slug !== selectedCategory) {
      return false;
    }

    if (selectedArea !== 'all') {
      if (!product.location_area.toLowerCase().includes(selectedArea.toLowerCase())) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchLoc = product.location_area.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }

    return true;
  });

  const handleStartBooking = (
    product: BaliProduct,
    option: BaliProductOption,
    visitDate: string,
    pax: number
  ) => {
    setSelectedProduct(null);
    setCheckoutData({ product, option, visitDate, pax });
  };

  const handleBookingSuccess = (savedBooking: BookingRecord) => {
    setCheckoutData(null);
    setBookings((prev) => [savedBooking, ...prev]);
    setSelectedVoucher(savedBooking);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-8 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchClick={() => setActiveTab('search')}
        dbStatus={dbStatus}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* TAB 1: EXPLORE / HOME */}
        {activeTab === 'explore' && (
          <div className="max-w-md mx-auto sm:max-w-5xl px-4 py-4 space-y-5">
            {/* Hero Mobile Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-emerald-900 via-teal-800 to-emerald-700 text-white p-5 sm:p-7 shadow-xl shadow-teal-900/10">
              <div className="relative z-10 max-w-sm sm:max-w-lg">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-emerald-200 border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Official GlobalTix Bali Inventory</span>
                  </span>
                  {dbStatus?.connected && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/30 backdrop-blur-md rounded-full text-[11px] font-semibold text-white border border-emerald-400/30">
                      <Database className="w-3 h-3 text-emerald-300" />
                      <span>InsForge Live ({products.length} Atraksi)</span>
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  Tiket Resmi Atraksi, Beach Club & Tur Bali
                </h2>
                <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed">
                  Waterbom Bali, Taman Safari, GWK Cultural Park, Atlas & Finns Beach Club, Nusa Penida, hingga ATV Ubud — konfirmasi instan ber-barcode resmi.
                </p>

                {/* Instant Search Bar on Hero */}
                <div className="mt-4 relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Waterbom, Taman Safari, GWK, Atlas, ATV Ubud..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-2xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
                  />
                </div>
              </div>

              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/30 rounded-full blur-2xl" />
            </div>

            {/* Region Location Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Filter Destinasi Bali</span>
                </h3>
                {selectedArea !== 'all' && (
                  <button
                    onClick={() => setSelectedArea('all')}
                    className="text-[11px] text-emerald-700 font-semibold"
                  >
                    Reset Wilayah
                  </button>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                {baliRegions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedArea(region)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedArea === region
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white border border-slate-200/90 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {region === 'all' ? '🌴 Semua Area Bali' : region}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div>
              <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Semua Kategori ({products.filter((p) => p.is_active).length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-bold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Feed */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Katalog Aktivitas & Atraksi Bali
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Menampilkan {filteredProducts.length} produk resmi GlobalTix dari database InsForge
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1 transition-colors shadow-sm"
                  title="Muat Ulang dari Database InsForge"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
                  <span className="hidden sm:inline">Refresh DB</span>
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">
                    Memuat katalog Bali dari InsForge PostgreSQL...
                  </span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">
                    Aktivitas Tidak Ditemukan
                  </h4>
                  <p className="text-xs text-slate-500">
                    Coba ganti filter wilayah atau kata kunci pencarian Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedArea('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Tampilkan Semua ({products.length} Produk)
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 p-4 bg-emerald-50/70 border border-emerald-100 rounded-3xl grid grid-cols-3 gap-2 text-center">
              <div>
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-900 block">Mitra Resmi</span>
                <span className="text-[9px] text-slate-500">GlobalTix API B2B</span>
              </div>
              <div>
                <Zap className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-900 block">Barcode Instan</span>
                <span className="text-[9px] text-slate-500">Scan di Pintu Masuk</span>
              </div>
              <div>
                <Compass className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-900 block">Database Live</span>
                <span className="text-[9px] text-slate-500">InsForge Self-Hosted</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEARCH */}
        {activeTab === 'search' && (
          <div className="max-w-md mx-auto sm:max-w-3xl px-4 py-4 space-y-4">
            <h2 className="text-lg font-black text-slate-900">
              Cari Atraksi & Aktivitas Bali
            </h2>

            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Ketik nama atraksi (Waterbom, Safari, GWK, Atlas, Finns, ATV)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            {/* Popular tags */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 block">Pencarian Terpopuler di Bali:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Waterbom',
                  'Taman Safari',
                  'GWK',
                  'Atlas Beach Club',
                  'Finns',
                  'Bali Zoo',
                  'Bird Park',
                  'ATV Ubud',
                  'Nusa Penida',
                  'Kecak Uluwatu',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setActiveTab('explore');
                    }}
                    className="px-3 py-1 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 text-xs font-semibold rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Instant Search Results */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Hasil Pencarian ({filteredProducts.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TICKETS / VOUCHERS */}
        {activeTab === 'tickets' && (
          <div className="max-w-md mx-auto sm:max-w-2xl px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Tiket & E-Voucher Saya
                </h2>
                <p className="text-xs text-slate-500">
                  Tersimpan di database InsForge & memori offline ponsel Anda.
                </p>
              </div>
              <Ticket className="w-6 h-6 text-emerald-600" />
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-sm text-slate-700">Belum Ada Tiket</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Anda belum memiliki pemesanan aktif. Pilih atraksi atau aktivitas Bali favorit Anda dan selesaikan pemesanan.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Mulai Eksplorasi Bali
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedVoucher(booking)}
                    className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-slate-900">
                        {booking.booking_code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          booking.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.payment_status === 'paid'
                          ? 'TIKET RESMI TERBIT'
                          : 'MENUNGGU PEMBAYARAN'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {booking.product_title}
                    </h4>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{booking.visit_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{booking.quantity} Pax</span>
                      </span>
                      <span className="font-extrabold text-emerald-700">
                        {formatIDR(booking.total_amount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end text-[11px] font-bold text-emerald-700 pt-1">
                      <span className="flex items-center space-x-1">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Buka QR Barcode Tiket</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            products={products}
            bookings={bookings}
            onRefreshData={loadData}
            onViewVoucher={(b) => setSelectedVoucher(b)}
            dbStatus={dbStatus}
          />
        )}
      </main>

      {/* Floating Bottom Nav for Mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingCount={bookings.filter((b) => b.payment_status === 'paid').length}
      />

      {/* MODAL 1: Product Detail View */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onStartBooking={handleStartBooking}
      />

      {/* MODAL 2: 2-Phase Reservation & Checkout */}
      {checkoutData && (
        <CheckoutModal
          product={checkoutData.product}
          option={checkoutData.option}
          visitDate={checkoutData.visitDate}
          pax={checkoutData.pax}
          onClose={() => setCheckoutData(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* MODAL 3: E-Ticket Offline Voucher */}
      <TicketVoucherModal
        booking={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
      />
    </div>
  );
};

export default App;
