'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { CATEGORIES, FilterState, DEFAULT_FILTERS } from '@/data/categories';
import FilterPanel from './FilterPanel';
import VisualSearch from './VisualSearch';

interface Props {
  // passed down from HomePage so the header controls the same state
  query: string;
  onQueryChange: (q: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  totalResults: number;
  onRefetch: (q?: string) => void;
}

export default function ExplorerHeader({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  totalResults,
  onRefetch,
}: Props) {
  const { user, wishlist, navTo, logout } = useStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [locationOpen, setLocationOpen] = useState(false);
  const [showFilters, setShowFilters]   = useState(false);
  const [showVisual, setShowVisual]     = useState(false);

  const activeFilterCount = [
    filters.category !== 'all',
    filters.sort !== 'relevance',
    filters.openNow,
    filters.minRating > 0,
    filters.priceRange !== 'all',
  ].filter(Boolean).length;

  const handleSearch = (val: string) => {
    onQueryChange(val);
    if (val.length >= 3) onRefetch(val + ' Meerut');
    if (val.length === 0) onRefetch();
  };

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <>
    

      {/* ── Main sticky header ───────────────────────────── */}
      <header
        className="sticky top-0 z-40 px-4 pb-3 pt-3"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderBottom: '1px solid rgba(141,85,36,0.08)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}
      >
        <div className="max-w-7xl mx-auto">

          {/* ── Row 1: Logo + Location + Wishlist + Avatar ── */}
          <div className="flex items-center gap-3 mb-3">

            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => navTo('home')}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #8d5524, #b87333)' }}
              >
                <i className="fas fa-store text-white text-sm" />
              </div>
              <div className="hidden sm:block">
                <p
                  className="font-black text-base leading-none"
                  style={{ fontFamily: "'Baloo 2', cursive", color: '#3e2723',fontSize:20 }}
                >
                  पुरानी दुकान
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#059669' }}>
               Pride In Heritage
                </p>
              </div>
            </div>

            {/* Location pill */}
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 flex-shrink-0 transition-all"
              style={{
                background: '#fef3e2',
                border: '1px solid rgba(245,158,11,0.3)',
              }}
            >
              <i className="fas fa-map-marker-alt text-xs" style={{ color: '#f59e0b' }} />
              <div className="hidden sm:block text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">Deliver to</p>
                <p className="text-xs font-black text-gray-800 leading-tight">Meerut, UP</p>
              </div>
              <i className="fas fa-chevron-down text-[9px] text-gray-400" />
            </button>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Wishlist */}
            <button
              onClick={() => navTo('wishlist')}
              className="relative w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-gray-200 hover:border-[#8d5524]/40 transition-all shadow-sm flex-shrink-0"
            >
              <i className="fas fa-heart text-gray-500 text-sm" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-black">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Avatar */}
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl border-2 overflow-hidden hover:border-red-400 transition-all flex-shrink-0"
              style={{ borderColor: 'rgba(141,85,36,0.2)' }}
            >
              <img src={user?.img ?? ''} alt="U" className="w-full h-full object-cover" />
            </button>
          </div>

          {/* ── Row 2: Search + Lens + Filter ─────────────── */}
          <div className="flex items-center gap-2 mb-3">

            {/* Search input */}
            <div
              className="flex items-center flex-grow gap-2 px-4 py-2.5 rounded-2xl"
              style={{
                background: '#fff',
                border: '1.5px solid rgba(141,85,36,0.12)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onClick={() => inputRef.current?.focus()}
            >
              <i className="fas fa-search text-sm flex-shrink-0" style={{ color: '#9ca3af' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Jalebi, namkeen, dawai..."
                className="flex-grow bg-transparent outline-none text-sm font-medium min-w-0"
                style={{ color: '#374151' }}
              />
              {query && (
                <button
                  onClick={() => { onQueryChange(''); onRefetch(); }}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
                >
                  <i className="fas fa-times text-sm" />
                </button>
              )}
            </div>

            {/* Visual search (Lens) */}
            <button
              onClick={() => setShowVisual(true)}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #8d5524, #b87333)' }}
              title="Photo se search karo"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <circle cx="11" cy="11" r="3" />
              </svg>
            </button>

            {/* Filter */}
            <button
              onClick={() => setShowFilters(true)}
              className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all hover:scale-105 active:scale-95"
              style={{
                background: activeFilterCount > 0 ? '#8d5524' : '#fff',
                borderColor: activeFilterCount > 0 ? '#8d5524' : '#e5e7eb',
                color: activeFilterCount > 0 ? '#fff' : '#6b7280',
              }}
            >
              <i className="fas fa-sliders-h text-sm" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Row 3: Category pills ──────────────────────── */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map(cat => {
              const isActive = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFiltersChange({ ...filters, category: cat.id })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap flex-shrink-0 transition-all"
                  style={{
                    background: isActive ? '#8d5524' : '#fff',
                    color: isActive ? '#fff' : '#6b7280',
                    border: isActive ? '1.5px solid #8d5524' : '1.5px solid rgba(0,0,0,0.06)',
                    boxShadow: isActive ? '0 4px 12px rgba(141,85,36,0.3)' : 'none',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <i className={`fas fa-${cat.icon} text-[10px]`} />
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* ── Location dropdown ────────────────────────────── */}
      {locationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 backdrop-blur-sm"
          onClick={() => setLocationOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 mx-4 w-full max-w-sm shadow-2xl"
            style={{ animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-black text-gray-800 mb-4">Select Location</h3>
            {[
              { name: 'Sadar Bazaar',  sub: 'Meerut Cantt' },
              { name: 'Abu Lane',      sub: 'Central Meerut' },
              { name: 'Begum Bridge',  sub: 'Old Meerut' },
              { name: 'Shastri Nagar', sub: 'Meerut City' },
            ].map(loc => (
              <button
                key={loc.name}
                onClick={() => setLocationOpen(false)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left"
              >
                <i className="fas fa-map-marker-alt" style={{ color: '#8d5524' }} />
                <div>
                  <p className="font-bold text-sm text-gray-800">{loc.name}</p>
                  <p className="text-xs text-gray-400">{loc.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter panel ─────────────────────────────────── */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onChange={onFiltersChange}
          onClose={() => setShowFilters(false)}
          totalResults={totalResults}
        />
      )}

      {/* ── Visual search modal ───────────────────────────── */}
      {showVisual && <VisualSearch onClose={() => setShowVisual(false)} />}
    </>
  );
}