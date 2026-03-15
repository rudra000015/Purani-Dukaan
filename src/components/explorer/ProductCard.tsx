'use client';

import { Product } from '@/types/shop';
import { useStore } from '@/store/useStore';
import { prodImg } from '@/utils/prodImg';

interface Props {
  product: Product;
  shopId: string;
  shopName: string;
  imgIndex: number;
  showNew?: boolean;
}

export function ProductCard({ product: p, shopId, shopName, imgIndex, showNew }: Props) {
  const { viewProduct, toggleWish, isWished } = useStore();
  const wished = isWished(shopId, p.id);
  const hasDiscount = typeof p.discountPct === 'number' && p.discountPct > 0;
  const originalPrice = hasDiscount ? Math.round(p.price / (1 - p.discountPct! / 100)) : null;

  return (
    <div className="prod-card pressable" onClick={() => viewProduct(shopId, p.id)}>
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <img
          src={p.image || prodImg(p.name, imgIndex)}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = prodImg(p.name, imgIndex); }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {showNew && p.isNew && <span className="badge-new">NEW</span>}
          {hasDiscount && <span className="badge-discount">-{p.discountPct}%</span>}
        </div>

        {/* Wish button */}
        <button
          onClick={e => { e.stopPropagation(); toggleWish(shopId, p.id, p, shopName); }}
          className={`wish-btn absolute top-2 right-2 ${wished ? 'saved' : ''}`}
        >
          <i className={`${wished ? 'fas text-white' : 'far text-gray-400'} fa-heart text-xs`} />
        </button>

        {/* Out of stock overlay */}
        {!p.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-0.5 truncate">{shopName}</p>
        <h4 className="font-black text-xs text-gray-800 mb-1 line-clamp-2 leading-tight">{p.name}</h4>
        <div className="flex items-center justify-between">
          <p className="font-black text-sm text-[var(--primary)]">
            ₹{p.price}
            <span className="text-[10px] text-gray-400 font-normal">/{p.unit}</span>
            {hasDiscount && originalPrice && originalPrice > p.price && (
              <span className="ml-2 text-[10px] text-gray-400 font-bold line-through">
                â‚¹{originalPrice}
              </span>
            )}
          </p>
          {/* Add button */}
          <button
            onClick={e => { e.stopPropagation(); toggleWish(shopId, p.id, p, shopName); }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black transition-all border-2 pressable ${
              wished
                ? 'btn-primary border-transparent text-white'
                : 'btn-surface border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
            }`}
            aria-label={wished ? 'Saved' : 'Save'}
            title={wished ? 'Saved' : 'Save'}
          >
            <i className={`fas fa-${wished ? 'check' : 'plus'} text-[10px]`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
