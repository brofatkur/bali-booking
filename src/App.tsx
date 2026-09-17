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
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketVoucherModal } from './components/TicketVoucherModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BaliProduct, BaliCategory, BaliProductOption, BookingRecord } from './types';
import { fetchProducts, fetchCategories, fetchBookings } from './lib/db';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('explore'); // 'explore' | 'search' | 'tickets' | 'admin'

  // Data
  const [products, setProducts] = useState<BaliProduct[]>([]);
  const [categories, setCategories] = useState<BaliCategory[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
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

  // Bali popular regions
  const baliRegions = ['all', 'Ubud', 'Tanjung Benoa', 'Nusa Penida', 'Uluwatu', 'Kintamani'];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [p, c, b] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBookings(),
      ]);
      setProducts(p);
      setCategories(c);
      setBookings(b);
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
    // Only show active products for customers
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
    setSelectedProduct(null); // Close detail modal
    setCheckoutData({ product, option, visitDate, pax }); // Open checkout modal
  };

  const handleBookingSuccess = (savedBooking: BookingRecord) => {
    setCheckoutData(null); // Close checkout
    setBookings((prev) => [savedBooking, ...prev]);
    setSelectedVoucher(savedBooking); // Immediately open e-voucher
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
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* TAB 1: EXPLORE / HOME */}
        {activeTab === 'explore' && (
          <div className="max-w-md mx-auto sm:max-w-4xl px-4 py-4 space-y-5">
            {/* Hero Mobile Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-emerald-900 via-teal-800 to-emerald-700 text-white p-5 sm:p-7 shadow-xl shadow-teal-900/10">
              <div className="relative z-10 max-w-sm sm:max-w-md">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-emerald-200 mb-2 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Jaminan Tiket Resmi GlobalTix</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  Aktivitas & Wisata Paling Hits di Bali
                </h2>
                <p className="text-xs text-emerald-100/90 mt-1.5 leading-relaxed">
                  Konfirmasi instan, tiket resmi ber-barcode, dan garansi harga terbaik langsung masuk ke ponsel Anda.
                </p>

                {/* Instant Search Bar on Hero */}
                <div className="mt-4 relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari watersport, ATV Ubud, Batur, Kecak..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-2xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
                  />
                </div>
              </div>

              {/* Decorative gradient sphere */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/30 rounded-full blur-2xl" />
            </div>

            {/* Region Location Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Destinasi Populer Bali</span>
                </h3>
                {selectedArea !== 'all' && (
                  <button
                    onClick={() => setSelectedArea('all')}
                    className="text-[11px] text-emerald-700 font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
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
                    {region === 'all' ? '🌴 Semua Wilayah' : region}
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
                  Semua Kategori
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
                    Pilihan Aktivitas Terbaik
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {filteredProducts.length} aktivitas terverifikasi
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-400">Memuat aktivitas Bali...</span>
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
                    className="mt-2 px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Lihat Semua
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
                <span className="text-[10px] font-bold text-slate-900 block">Tiket Resmi</span>
                <span className="text-[9px] text-slate-500">GlobalTix B2B</span>
              </div>
              <div>
                <Zap className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-900 block">Barcode Instan</span>
                <span className="text-[9px] text-slate-500">Tanpa Antre</span>
              </div>
              <div>
                <Compass className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-900 block">PWA Offline</span>
                <span className="text-[9px] text-slate-500">Bisa Dibuka Tanpa Kuota</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEARCH */}
        {activeTab === 'search' && (
          <div className="max-w-md mx-auto sm:max-w-2xl px-4 py-4 space-y-4">
            <h2 className="text-lg font-black text-slate-900">
              Cari Aktivitas Wisata
            </h2>

            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Ketik nama aktivitas, atraksi, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            {/* Popular tags */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 block">Pencarian Populer:</span>
              <div className="flex flex-wrap gap-1.5">
                {['ATV Ubud', 'Watersport Tanjung Benoa', 'Gunung Batur', 'Nusa Penida', 'Kecak Uluwatu', 'Snorkeling'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setActiveTab('explore');
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full"
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
                  Tersimpan di PWA dan dapat dibuka saat di lokasi tanpa internet.
                </p>
              </div>
              <Ticket className="w-6 h-6 text-emerald-600" />
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-sm text-slate-700">Belum Ada Tiket</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Anda belum memiliki pemesanan aktif. Pilih aktivitas Bali favorit Anda dan selesaikan pemesanan.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Mulai Eksplorasi
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
                        {booking.payment_status === 'paid' ? 'TIKET RESMI TERBIT' : 'MENUNGGU PEMBAYARAN'}
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
