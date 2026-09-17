import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  QrCode,
  CreditCard,
  Building2,
  AlertCircle,
  Sparkles,
  Calendar,
  Users,
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { BaliProduct, BaliProductOption, BookingRecord } from '../types';
import { globalTix } from '../lib/globaltix';
import { saveBooking } from '../lib/db';

interface CheckoutModalProps {
  product: BaliProduct;
  option: BaliProductOption;
  visitDate: string;
  pax: number;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  option,
  visitDate,
  pax,
  onClose,
  onBookingSuccess,
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [hotelPickup, setHotelPickup] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca_va' | 'card'>('qris');

  // Reservation hold state
  const [reservationRef, setReservationRef] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600); // 60 mins
  const [isReserving, setIsReserving] = useState<boolean>(true);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const unitPrice = Number(option.selling_price_idr);
  const totalAmount = unitPrice * pax;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Step 1: Automatically trigger GlobalTix reserve on mount
  useEffect(() => {
    let timer: any;

    async function initReservation() {
      setIsReserving(true);
      setErrorMsg(null);
      try {
        const res = await globalTix.reserveBooking({
          ticketTypeId: option.globaltix_ticket_type_id,
          visitDate,
          quantity: pax,
          leadPassenger: {
            name: customerName || 'Wisatawan',
            email: customerEmail || 'guest@example.com',
            phone: customerPhone || '+628123456789',
          },
          pickupNotes: hotelPickup,
        });

        if (res.success) {
          setReservationRef(res.reservationRef);
          const exp = new Date(res.expiresAt);

          // Update remaining seconds
          const diff = Math.max(0, Math.floor((exp.getTime() - Date.now()) / 1000));
          setSecondsRemaining(diff);
        }
      } catch (err: any) {
        setErrorMsg('Gagal mengamankan kuota ke GlobalTix API.');
      } finally {
        setIsReserving(false);
      }
    }

    initReservation();

    // 60-Minute Countdown Interval
    timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate real QRIS QR code on canvas
  useEffect(() => {
    if (paymentMethod === 'qris' && qrCanvasRef.current) {
      const qrisString = `00020101021226610014ID.LINKAJA.WWW0118936009110000000000021500000000000000051440014ID.CO.QRIS.WWW02150000000000000000303UMI52045812530336054${totalAmount}5802ID5913BALI_ACTIVITIES6008DENPASAR6304`;
      QRCode.toCanvas(qrCanvasRef.current, qrisString, {
        width: 170,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    }
  }, [paymentMethod, totalAmount]);

  // Formatter for MM:SS
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Step 2: Confirmation & Payment Submission
  const handleSimulatePayment = async () => {
    if (!customerName.trim()) {
      alert('Mohon isi Nama Lengkap pemesan.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Mohon isi Nomor WhatsApp untuk pengiriman e-voucher.');
      return;
    }

    setIsConfirming(true);
    setErrorMsg(null);

    try {
      const bookingCode = `BALI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Call GlobalTix confirm booking API
      const confirmRes = await globalTix.confirmBooking(
        reservationRef,
        bookingCode,
        customerName,
        pax
      );

      // 2. Save confirmed booking to InsForge database
      const savedRecord = await saveBooking({
        booking_code: bookingCode,
        customer_name: customerName,
        customer_email: customerEmail || 'guest@baliactivity.com',
        customer_phone: customerPhone,
        hotel_pickup_address: hotelPickup,
        product_id: product.id,
        product_option_id: option.id,
        product_title: product.title,
        option_name: option.option_name,
        visit_date: visitDate,
        quantity: pax,
        unit_price: unitPrice,
        total_amount: totalAmount,
        payment_status: 'paid',
        payment_method: paymentMethod,
        globaltix_status: 'confirmed',
        globaltix_booking_ref: confirmRes.bookingRef,
        confirmed_at: confirmRes.confirmedAt,
        voucher_pdf_url: confirmRes.voucherUrl,
        ticket_codes: confirmRes.tickets.map((t) => ({
          ticket_id: t.ticketId,
          barcode: t.barcode,
          passenger_name: t.passengerName,
        })),
      });

      // 3. Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      // 4. Pass to parent to show e-voucher
      onBookingSuccess(savedRecord);
    } catch (err: any) {
      setErrorMsg('Terjadi kendala saat konfirmasi ke GlobalTix.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900">
              Konfirmasi & Pembayaran
            </h2>
            <p className="text-[11px] text-slate-500">
              Two-Phase Booking via GlobalTix API
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GlobalTix 60-Minute Countdown Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-xs font-semibold">Slot Tersimpan di GlobalTix</span>
          </div>
          <div className="bg-black/20 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold tracking-wider">
            {formatTimer(secondsRemaining)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Booking Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
              {product.title}
            </h4>
            <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3 h-3 text-emerald-600" />
                <span>Tanggal: {visitDate}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Users className="w-3 h-3 text-emerald-600" />
                <span>Paket: {option.option_name} ({pax} Pax)</span>
              </div>
              {reservationRef && (
                <div className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded mt-1.5 inline-block">
                  Ref Reservasi: {reservationRef}
                </div>
              )}
            </div>
          </div>

          {/* Lead Passenger Form */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Data Pemesan (E-Tiket)
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Nama Lengkap (Sesuai KTP/Paspor) *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08123456789"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Email (Kirim PDF Voucher)
                </label>
                <input
                  type="email"
                  placeholder="budi@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Nama Hotel / Catatan Penjemputan
              </label>
              <input
                type="text"
                placeholder="Contoh: Hotel Discovery Kartika Plaza Kuta, Kamar 302"
                value={hotelPickup}
                onChange={(e) => setHotelPickup(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Metode Pembayaran
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <QrCode className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-[11px]">QRIS Instan</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bca_va')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                  paymentMethod === 'bca_va'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-5 h-5 mb-1 text-blue-600" />
                <span className="text-[11px]">BCA Virtual</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-indigo-600" />
                <span className="text-[11px]">Kartu Kredit</span>
              </button>
            </div>

            {/* QRIS Display Container */}
            {paymentMethod === 'qris' && (
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <p className="text-[11px] text-slate-600 font-semibold mb-2 text-center">
                  Scan QRIS menggunakan GoPay, OVO, ShopeePay, BCA, atau Livin
                </p>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <canvas ref={qrCanvasRef} />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[10px] text-slate-400 block">Total Tagihan</span>
                  <span className="text-base font-extrabold text-emerald-700">
                    {formatIDR(totalAmount)}
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'bca_va' && (
              <div className="mt-3 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
                <span className="text-blue-900 font-bold block mb-1">Nomor Virtual Account BCA</span>
                <span className="text-base font-mono font-black text-blue-950 tracking-wider">
                  80777 0812 3456 7890
                </span>
                <p className="text-[10px] text-blue-700 mt-1">
                  Otomatis terverifikasi dalam 1-2 detik setelah transfer.
                </p>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Total Bayar</span>
            <span className="text-base font-black text-emerald-700">
              {formatIDR(totalAmount)}
            </span>
          </div>

          <button
            disabled={isConfirming || isReserving || secondsRemaining === 0}
            onClick={handleSimulatePayment}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
          >
            {isConfirming ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menerbitkan E-Tiket...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Bayar & Terbitkan Tiket</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
