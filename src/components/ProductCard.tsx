import React from 'react';
import { Star, MapPin, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { BaliProduct } from '../types';

interface ProductCardProps {
  product: BaliProduct;
  onSelect: (product: BaliProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80';

  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col group active:scale-[0.98]"
    >
      {/* Thumbnail with overlay badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          {product.is_featured ? (
            <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md text-white font-bold text-[10px] rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
              <span>★ Populer</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-white font-medium text-[10px] rounded-full flex items-center space-x-1">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>Instan</span>
            </span>
          )}

          <div className="px-2 py-0.5 bg-black/50 backdrop-blur-md text-white text-[11px] rounded-full flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-300" />
            <span>{product.duration || '2-3 Jam'}</span>
          </div>
        </div>

        {/* Location pill */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1 text-white text-xs font-medium drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span className="truncate max-w-[200px]">{product.location_area}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-900">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.review_count} ulasan)</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>

          {/* Perks */}
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
              Resmi GlobalTix
            </span>
            <span className="inline-flex items-center text-[10px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
              E-Tiket Langsung
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-end justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Mulai dari</span>
            <span className="text-base font-extrabold text-emerald-700 tracking-tight">
              {formatIDR(product.selling_price_idr)}
            </span>
            <span className="text-[10px] text-slate-400"> /org</span>
          </div>

          <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 transition-all">
            Pilih
          </button>
        </div>
      </div>
    </div>
  );
};
