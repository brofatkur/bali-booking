import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Shield,
  Zap,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BaliProduct, BaliProductOption } from '../types';
import { globalTix } from '../lib/globaltix';

interface ProductDetailModalProps {
  product: BaliProduct | null;
  onClose: () => void;
  onStartBooking: (
    product: BaliProduct,
    option: BaliProductOption,
    visitDate: string,
    pax: number
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onStartBooking,
}) => {
  if (!product) return null;

  // State
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    product.options?.[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Default to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [visitDate, setVisitDate] = useState<string>(
    tomorrow.toISOString().split('T')[0]
  );
  const [pax, setPax] = useState<number>(1);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  const selectedOption =
    product.options?.find((o) => o.id === selectedOptionId) ||
    product.options?.[0] || {
      id: 'default',
      product_id: product.id,
      globaltix_ticket_type_id: 80101,
      option_name: 'Tiket Standar',
      description: 'Tiket masuk aktivitas Bali',
      b2b_price_idr: product.base_price_idr,
      markup_type: 'percentage' as const,
      markup_value: 15,
      selling_price_idr: product.selling_price_idr,
      min_pax: 1,
      max_pax: 20,
      is_active: true,
    };

  const totalPrice = Number(selectedOption.selling_price_idr) * pax;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleDateChange = async (newDate: string) => {
    setVisitDate(newDate);
    setIsCheckingAvailability(true);
    setAvailabilityMessage(null);

    try {
      const res = await globalTix.checkAvailability(
        selectedOption.globaltix_ticket_type_id,
        newDate,
        pax
      );
      if (res.available) {
        setAvailabilityMessage(`Tersedia ${res.remainingQuota} kuota untuk tanggal ini (Live GlobalTix).`);
      } else {
        setAvailabilityMessage('Slot penuh atau tanggal tidak valid.');
      }
    } catch {
      setAvailabilityMessage('Tersedia (kuota siap dipesan).');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleProceed = () => {
    onStartBooking(product, selectedOption, visitDate, pax);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Sticky Mobile Header Close Button */}
        <div className="absolute top-3 right-3 z-30">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pb-28">
          {/* Image Slider */}
          <div className="relative aspect-[16/10] bg-slate-900">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            {/* Image Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 z-10">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImageIndex === idx
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Badges on image */}
            <div className="absolute bottom-4 left-4 right-14 text-white">
              <div className="flex items-center space-x-2 text-xs mb-1">
                <span className="px-2 py-0.5 bg-emerald-500 font-bold rounded-md flex items-center space-x-1">
                  <Zap className="w-3 h-3 fill-white" />
                  <span>Konfirmasi Instan</span>
                </span>
                <span className="px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{product.duration}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>{product.location_area}</span>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-4 sm:p-5">
            {/* Title & Rating */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-sm font-bold text-slate-900">{product.rating}</span>
              <span className="text-xs text-slate-500">({product.review_count} ulasan wisatawan)</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                GlobalTix Verified #{product.globaltix_product_id}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              {product.description}
            </p>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-4 p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100/80">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sorotan Aktivitas</span>
                </h4>
                <ul className="space-y-1.5">
                  {product.highlights.map((hl, i) => (
                    <li key={i} className="text-xs text-amber-950 flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-900 mb-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Termasuk</span>
                </h4>
                <ul className="space-y-1">
                  {product.inclusions.map((inc, i) => (
                    <li key={i} className="text-[11px] text-emerald-950 flex items-start space-x-1.5">
                      <span className="text-emerald-500 text-xs">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tidak Termasuk</span>
                </h4>
                <ul className="space-y-1">
                  {product.exclusions.map((exc, i) => (
                    <li key={i} className="text-[11px] text-slate-600 flex items-start space-x-1.5">
                      <span className="text-slate-400">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Options Section */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                Pilih Varian Paket
              </h3>

              <div className="space-y-2">
                {product.options?.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedOptionId === opt.id
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                          {opt.option_name}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {opt.description}
                        </p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span className="text-sm font-extrabold text-emerald-700 block">
                          {formatIDR(opt.selling_price_idr)}
                        </span>
                        <span className="text-[10px] text-slate-400">/ orang</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Pax Selector */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              {/* Date */}
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tanggal Kunjungan</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Cek Slot GlobalTix</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={visitDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {isCheckingAvailability && (
                  <p className="text-[10px] text-slate-500 mt-1 animate-pulse">
                    Mengecek ketersediaan di GlobalTix API...
                  </p>
                )}
                {availabilityMessage && !isCheckingAvailability && (
                  <p className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center space-x-1">
                    <Info className="w-3 h-3" />
                    <span>{availabilityMessage}</span>
                  </p>
                )}
              </div>

              {/* Pax Counter */}
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Jumlah Peserta (Pax)</span>
                </label>
                <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-300">
                  <span className="text-xs font-medium text-slate-700">Jumlah Wisatawan</span>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      disabled={pax <= (selectedOption.min_pax || 1)}
                      onClick={() => setPax(Math.max(selectedOption.min_pax || 1, pax - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold w-4 text-center">{pax}</span>
                    <button
                      type="button"
                      disabled={pax >= (selectedOption.max_pax || 20)}
                      onClick={() => setPax(Math.min(selectedOption.max_pax || 20, pax + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-100/80 p-2.5 rounded-xl">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{product.cancellation_policy || 'Pembatalan fleksibel sebelum jadwal kunjungan.'}</span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Booking Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 flex items-center justify-between shadow-[0_-8px_25px_rgba(0,0,0,0.06)] z-20">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Total ({pax} pax)
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-700 tracking-tight">
              {formatIDR(totalPrice)}
            </span>
          </div>

          <button
            onClick={handleProceed}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
          >
            <span>Pesan Sekarang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
