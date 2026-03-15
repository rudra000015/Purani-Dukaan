'use client';

import { useMemo, useState } from 'react';
import { Shop } from '@/types/shop';
import { useStore } from '@/store/useStore';
import { FilterState, CATEGORIES } from '@/data/categories';
import ShopCard from './ShopCard';
import ProductCard from './ProductCard';
import OfferBanner from './OfferBanner';

// ── Props — all state lives in the header now ─────────────────
interface Props {
  query: string;
  filters: FilterState;
  shops: Shop[];
  loading: boolean;
  error: string | null;
  refetch: (q?: string) => void;
}

// ── Quick action icons row (Blinkit style) ────────────────────
const QUICK_ACTIONS = [
  { icon: '🍬', label: 'Sweets',   cat: 'sweets' },
  { icon: '🫘', label: 'Grocery',  cat: 'grocery' },
  { icon: '💊', label: 'Medical',  cat: 'pharmacy' },
  { icon: '🌶️', label: 'Namkeen', cat: 'namkeen' },
  { icon: '🥛', label: 'Dairy',    cat: 'dairy' },
  { icon: '🌸', label: 'Puja',     cat: 'puja' },
  { icon: '🧁', label: 'Bakery',   cat: 'bakery' },
  { icon: '🫚', label: 'Spices',   cat: 'spices' },
];

function QuickActions({ onCat }: { onCat: (cat: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {QUICK_ACTIONS.map((a, i) => (
          <button
            key={a.cat}
            onClick={() => onCat(a.cat)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
            style={{ animation: `fadeUp 0.4s ease forwards ${i * 0.04}s`, opacity: 0 }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              {a.icon}
            </div>
            <span className="text-[11px] font-bold text-gray-600 text-center">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Shop stories row ──────────────────────────────────────────
function ShopStories({ shops, onOpen }: { shops: Shop[]; onOpen: (id: string) => void }) {
  if (!shops.length) return null;
  return (
    <div className="mb-6">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {shops.slice(0, 8).map((s, i) => (
          <button
            key={s.id}
            onClick={() => onOpen(s.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0"
            style={{ animation: `fadeUp 0.4s ease forwards ${i * 0.05}s`, opacity: 0 }}
          >
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full p-0.5"
                style={{ background: 'linear-gradient(135deg, #8d5524, #b87333, #f59e0b)' }}
              >
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <img
                    src={s.ownerImg}
                    alt={s.name}
                    className="w-full h-full rounded-full object-cover bg-gray-100"
                  />
                </div>
              </div>
              {s.openNow && (
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <span className="text-[11px] font-bold text-gray-700 text-center leading-tight max-w-[60px] truncate">
              {s.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Horizontal product strip ──────────────────────────────────
function ProductStrip({ title, products }: { title: string; products: any[] }) {
  if (!products.length) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 style={{ fontFamily: "'Baloo 2',cursive", fontSize: 20, fontWeight: 800, color: '#1c1c1c' }}>
          {title}
        </h2>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#8d5524', cursor: 'pointer' }}>See all →</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {products.map((p, i) => (
          <div key={p.id} className="flex-shrink-0 w-36">
            <ProductCard product={p} shopId={p.shopId} shopName={p.shopName} imgIndex={i} showNew />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shop tile card ────────────────────────────────────────────
function ShopTileCard({ shop: s, index }: { shop: Shop; index: number }) {
  const { openShop } = useStore();
  return (
    <div
      className="shop-card pressable overflow-hidden"
      style={{ animation: `fadeUp 0.4s ease forwards ${index * 0.06}s`, opacity: 0 }}
      onClick={() => openShop(s.id)}
    >
      <div className="h-36 relative overflow-hidden">
        {s.photos?.[0] ? (
          <img src={s.photos[0]} alt={s.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3e2723, #8d5524)' }}>
            <i className="fas fa-store text-white/30 text-4xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <span className="badge-legacy">{s.age} Yrs</span>
        </div>
        {s.openNow !== null && s.openNow !== undefined && (
          <div className="absolute top-2.5 right-2.5">
            <span className={s.openNow ? 'badge-open' : 'badge-closed'}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.openNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {s.openNow ? 'Open' : 'Closed'}
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
          <img src={s.ownerImg} alt="" className="w-8 h-8 rounded-xl border-2 border-white/80 bg-white object-cover shadow-sm" />
          {s.rating > 0 && (
            <div className="rating-badge">
              <i className="fas fa-star text-[10px]" />{s.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-black text-sm text-gray-800 mb-0.5 truncate">{s.name}</h3>
        <p className="text-[11px] text-gray-400 mb-2 truncate">
          <i className="fas fa-map-marker-alt mr-1" style={{ color: '#8d5524' }} />
          {s.addr.split(',')[0]}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1 font-bold">
            <i className="fas fa-clock text-[9px]" /> 15 min
          </span>
          <span className="text-gray-200">|</span>
          <span style={{ color: '#059669' }} className="flex items-center gap-1 font-bold">
            <i className="fas fa-motorcycle text-[9px]" /> Free
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Shop list card ────────────────────────────────────────────
function ShopListCard({ shop: s, index }: { shop: Shop; index: number }) {
  const { openShop } = useStore();
  return (
    <div
      className="shop-card pressable flex gap-4 p-4"
      style={{ animation: `fadeUp 0.4s ease forwards ${index * 0.07}s`, opacity: 0 }}
      onClick={() => openShop(s.id)}
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
        {s.photos?.[0] ? (
          <img src={s.photos[0]} alt={s.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3e2723, #5d4037)' }}>
            <i className="fas fa-store text-white/60 text-2xl" />
          </div>
        )}
        {s.openNow !== null && (
          <span className={`absolute bottom-1 left-1 text-[8px] font-black px-1.5 py-0.5 rounded-full ${
            s.openNow ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {s.openNow ? 'OPEN' : 'CLOSED'}
          </span>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-black text-base text-gray-800 leading-tight truncate">{s.name}</h3>
          <div className="rating-badge flex-shrink-0">
            <i className="fas fa-star text-[10px]" />{s.rating.toFixed(1)}
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-1 truncate">{s.addr.split(',')[0]}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="badge-legacy text-[9px] px-2 py-0.5">{s.age} Yrs</span>
          <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold capitalize">{s.cat}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span><i className="fas fa-clock mr-1 text-[10px]" />~15 min</span>
          <span style={{ color: '#059669' }} className="font-bold">
            <i className="fas fa-motorcycle mr-1 text-[10px]" />Free delivery
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────────────
export default function HomePage({ query, filters, shops, loading, error, refetch }: Props) {
  const { openShop } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter logic
  const filtered = useMemo(() => {
    let list = [...shops];
    if (filters.category !== 'all') {
      const cat = CATEGORIES.find(c => c.id === filters.category);
      if (cat) {
        list = list.filter(s =>
          cat.shopCats.includes(s.cat) ||
          cat.keywords.some(kw =>
            s.name.toLowerCase().includes(kw) ||
            (s.story ?? '').toLowerCase().includes(kw)
          )
        );
      }
    }
    if (query.length >= 2) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.addr.toLowerCase().includes(q) ||
        s.products?.some(p => p.name.toLowerCase().includes(q))
      );
    }
    if (filters.openNow) list = list.filter(s => s.openNow === true);
    if (filters.minRating > 0) list = list.filter(s => s.rating >= filters.minRating);
    switch (filters.sort) {
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'legacy': list.sort((a, b) => a.est - b.est); break;
      case 'name':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [shops, filters, query]);

  const newProducts = useMemo(() =>
    shops.flatMap((s, si) =>
      (s.products ?? []).map((p, pi) => ({ ...p, shopId: s.id, shopName: s.name, imgIndex: si * 10 + pi }))
    ).filter(p => p.isNew).slice(0, 10),
  [shops]);

  const topRated = useMemo(() =>
    [...shops].sort((a, b) => b.rating - a.rating).slice(0, 6),
  [shops]);

  const isSearching = query.length > 0 || filters.category !== 'all' ||
    filters.sort !== 'relevance' || filters.openNow || filters.minRating > 0;

  if (error) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <p className="font-black text-lg text-gray-700 mb-2">Shops nahi mile</p>
      <p className="text-gray-400 text-sm mb-6">{error}</p>
      <button onClick={() => refetch()}
        className="bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white px-6 py-3 rounded-2xl font-black">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="pt-2">

      {/* ── Home view (not searching) ──────────────────────── */}
      {!isSearching && (
        <>
          <OfferBanner />
          <QuickActions onCat={cat => {}} />
          {!loading && <ShopStories shops={shops} onOpen={openShop} />}
          {newProducts.length > 0 && (
            <ProductStrip title="🔥 New Arrivals" products={newProducts} />
          )}
          {!loading && topRated.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:20, fontWeight:800, color:'#1c1c1c' }}>⭐ Top Rated</h2>
                <span style={{ fontSize:13, fontWeight:700, color:'#8d5524', cursor:'pointer' }}>See all →</span>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {topRated.map((s, i) => (
                  <div key={s.id} className="flex-shrink-0 w-60">
                    <ShopTileCard shop={s} index={i} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">All Shops</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
        </>
      )}

      {/* ── Results header ────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-black text-gray-800">
          {loading ? 'Dhoondh raha hoon...' : `${filtered.length} ${isSearching ? 'results' : 'Shops'}`}
        </p>
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100">
          {(['grid', 'list'] as const).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: viewMode === mode ? '#8d5524' : 'transparent', color: viewMode === mode ? '#fff' : '#9ca3af' }}>
              <i className={`fas fa-${mode === 'grid' ? 'th' : 'list'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading skeleton ──────────────────────────────── */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
          {Array.from({ length: 6 }).map((_, i) =>
            viewMode === 'grid' ? (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            ) : (
              <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse">
                <div className="w-20 h-20 skeleton rounded-xl flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-3 skeleton rounded w-2/3" />
                </div>
              </div>
            )
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-black text-lg text-gray-600">Kuch nahi mila</p>
          <p className="text-sm text-gray-400 mt-1">Search ya filter badlein</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((s, i) => <ShopTileCard key={s.id} shop={s} index={i} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s, i) => <ShopListCard key={s.id} shop={s} index={i} />)}
        </div>
      )}
    </div>
  );
}