import React, { useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Share2,
  ShieldCheck,
  Palmtree,
  Printer,
} from 'lucide-react';
import QRCode from 'qrcode';
import { BookingRecord } from '../types';

interface TicketVoucherModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
}

export const TicketVoucherModal: React.FC<TicketVoucherModalProps> = ({
  booking,
  onClose,
}) => {
  if (!booking) return null;

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const primaryTicket = booking.ticket_codes?.[0] || {
    ticket_id: 'GTX-TIX-01',
    barcode: 'GTX992817293847',
    passenger_name: booking.customer_name,
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Draw QR code onto canvas
  useEffect(() => {
    if (qrCanvasRef.current) {
      const qrData = JSON.stringify({
        bookingCode: booking.booking_code,
        globaltixRef: booking.globaltix_booking_ref,
        ticketBarcode: primaryTicket.barcode,
        passenger: booking.customer_name,
        date: booking.visit_date,
        pax: booking.quantity,
      });

      QRCode.toCanvas(qrCanvasRef.current, qrData, {
        width: 190,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    }
  }, [booking, primaryTicket]);

  const handleShareWhatsApp = () => {
    const text = `Halo, ini E-Voucher Resmi BaliPass & GlobalTix:\n\n` +
      `🎫 Aktivitas: ${booking.product_title}\n` +
      `📋 Paket: ${booking.option_name}\n` +
      `📅 Tanggal: ${booking.visit_date}\n` +
      `👤 Pemesan: ${booking.customer_name} (${booking.quantity} Pax)\n` +
      `🔢 Kode Booking: ${booking.booking_code}\n` +
      `🔗 Ref GlobalTix: ${booking.globaltix_booking_ref || '-'}\n\n` +
      `Tunjukkan voucher ini di lokasi aktivitas Bali.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col relative max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Palmtree className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight leading-none">
                E-Tiket Resmi Aktivitas Bali
              </h3>
              <p className="text-[10px] text-emerald-100 mt-0.5">
                Terkonfirmasi di Sistem GlobalTix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Ticket Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 p-2.5 rounded-2xl">
            <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>TIKET SUDAH DITERBITKAN</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
              LUNAS
            </span>
          </div>

          {/* Ticket Barcode / QR Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
              <canvas ref={qrCanvasRef} />
            </div>
            <div className="mt-2.5">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                Kode Barcode GlobalTix
              </span>
              <span className="text-sm font-mono font-black text-slate-900 tracking-widest">
                {primaryTicket.barcode}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[260px]">
              Tunjukkan barcode ini langsung di gerbang masuk atau loket petugas di Bali.
            </p>
          </div>

          {/* Ticket Details */}
          <div className="space-y-3 text-xs bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="pb-2.5 border-b border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Nama Aktivitas
              </span>
              <span className="font-extrabold text-slate-900 text-sm block mt-0.5">
                {booking.product_title}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                Paket: {booking.option_name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Tanggal Kunjungan
                </span>
                <span className="font-bold text-slate-900 flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{booking.visit_date}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Jumlah Peserta
                </span>
                <span className="font-bold text-slate-900 flex items-center space-x-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{booking.quantity} Orang (Pax)</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Pemesan Utama
                </span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {booking.customer_name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {booking.customer_phone}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Kode Booking
                </span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {booking.booking_code}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Ref: {booking.globaltix_booking_ref || 'GTX-CONF'}
                </span>
              </div>
            </div>

            {booking.hotel_pickup_address && (
              <div className="pb-2.5 border-b border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Lokasi Penjemputan / Catatan
                </span>
                <span className="font-medium text-slate-800 flex items-start space-x-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-500 mt-0.5 flex-shrink-0" />
                  <span>{booking.hotel_pickup_address}</span>
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 text-xs">Total Pembayaran:</span>
              <span className="font-black text-sm text-emerald-700">
                {formatIDR(booking.total_amount)}
              </span>
            </div>
          </div>

          {/* PWA Offline Note */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Tiket ini tersimpan di memori PWA offline ponsel Anda dan dapat dibuka tanpa koneksi internet.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Kirim ke WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
