'use client';

import { Shop } from '@/types/shop';
import { useStore } from '@/store/useStore';

export default function ShopCard({ shop: s }: { shop: Shop }) {
  const { openShop } = useStore();

  return (
    <div className="shop-card pressable" onClick={() => openShop(s.id)}>
      {/* Cover */}
      <div className="h-36 relative overflow-hidden">
        {s.photos?.[0] ? (
          <img src={s.photos[0]} alt={s.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3e2723 0%, #8d5524 100%)' }}>
            <i className="fas fa-store text-white/30 text-4xl" />
          </div>
        )}

        {/* Dark overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Legacy badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="badge-legacy">{s.age} Years</span>
        </div>

        {/* Open/Closed */}
        {s.openNow !== null && s.openNow !== undefined && (
          <div className="absolute top-2.5 right-2.5">
            <span className={s.openNow ? 'badge-open' : 'badge-closed'}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.openNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {s.openNow ? 'Open' : 'Closed'}
            </span>
          </div>
        )}

        {/* Owner avatar + rating */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
          <img src={s.ownerImg} alt={s.owner}
            className="w-8 h-8 rounded-xl border-2 border-white/80 bg-white object-cover shadow-sm" />
          {s.rating > 0 && (
            <div className="rating-badge">
              <i className="fas fa-star text-[10px]" />
              {s.rating.toFixed(1)}
              {s.totalRatings > 0 && (
                <span className="text-[9px] text-amber-600">({s.totalRatings})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-black text-sm text-gray-800 mb-0.5 truncate leading-tight">{s.name}</h3>
        <p className="text-[11px] text-gray-400 mb-2 truncate">
          <i className="fas fa-map-marker-alt text-[#8d5524] mr-1" />
          {s.addr.split(',')[0]}
        </p>

        {/* Footer row */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1 font-bold">
            <i className="fas fa-clock text-[9px]" /> 15 min
          </span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1 text-[#059669] font-bold">
            <i className="fas fa-motorcycle text-[9px]" /> Free delivery
          </span>
          {s.products.length > 0 && (
            <>
              <span className="text-gray-200">|</span>
              <span>{s.products.length} items</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}