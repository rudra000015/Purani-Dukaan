'use client';

import { useEffect, useState } from 'react';
import { CATEGORIES, SORT_OPTIONS, FilterState, DEFAULT_FILTERS, type HoursFilter } from '@/data/categories';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
  totalResults: number;
}

export default function FilterPanel({ filters, onChange, onClose, totalResults }: Props) {
  const [local, setLocal] = useState<FilterState>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const set = (k: keyof FilterState, v: any) =>
    setLocal(f => ({ ...f, [k]: v }));

  const apply = () => { onChange(local); onClose(); };
  const reset = () => { setLocal(DEFAULT_FILTERS); onChange(DEFAULT_FILTERS); };

  const hasChanges =
    local.category   !== DEFAULT_FILTERS.category   ||
    local.sort        !== DEFAULT_FILTERS.sort        ||
    local.openNow     !== DEFAULT_FILTERS.openNow     ||
    local.minRating   !== DEFAULT_FILTERS.minRating   ||
    local.priceRange  !== DEFAULT_FILTERS.priceRange  ||
    local.hours       !== DEFAULT_FILTERS.hours       ||
    local.openAt      !== DEFAULT_FILTERS.openAt      ||
    local.discountOnly !== DEFAULT_FILTERS.discountOnly ||
    local.minDiscount  !== DEFAULT_FILTERS.minDiscount  ||
    local.newCollection !== DEFAULT_FILTERS.newCollection;

  return (
    <div className="fixed inset-0 z-[9998] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="bg-white w-full md:max-w-lg md:rounded-3xl rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-800 text-lg flex items-center gap-2">
            <i className="fas fa-sliders-h text-[#8d5524]" /> Filters
          </h2>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button onClick={reset}
                className="text-sm text-red-500 font-bold hover:underline px-2">
                Reset
              </button>
            )}
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fas fa-times text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">

          {/* ── Category ──────────────────────────────────── */}
          <div>
            <h3 className="font-bold text-sm text-gray-600 uppercase tracking-wide mb-3">Category</h3>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id}
                  onClick={() => set('category', cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center ${
                    local.category === cat.id
                      ? 'border-[#8d5524] bg-[#8d5524]/5'
                      : 'border-transparent bg-gray-50 hover:border-gray-200'
                  }`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    local.category === cat.id ? 'bg-[#8d5524]' : 'bg-white border border-gray-100'
                  }`}>
                    <i className={`fas fa-${cat.icon} text-sm ${
                      local.category === cat.id ? 'text-white' : 'text-gray-500'
                    }`} />
                  </div>
                  <span className={`text-[11px] font-bold leading-tight ${
                    local.category === cat.id ? 'text-[#8d5524]' : 'text-gray-600'
                  }`}>{cat.label}</span>
                  <span className="text-[9px] text-gray-400">{cat.labelHindi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Sort ──────────────────────────────────────── */}
          <div>
            <h3 className="font-bold text-sm text-gray-600 uppercase tracking-wide mb-3">Sort By</h3>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.id}
                  onClick={() => set('sort', opt.id)}
                  className={`py-3 px-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                    local.sort === opt.id
                      ? 'border-[#8d5524] bg-[#8d5524]/5 text-[#8d5524]'
                      : 'border-transparent bg-gray-50 text-gray-600 hover:border-gray-200'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Open Now toggle ───────────────────────────── */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <p className="font-bold text-gray-700">Open Now</p>
              <p className="text-xs text-gray-400">Show only currently open shops</p>
            </div>
            <button
              onClick={() => set('openNow', !local.openNow)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                local.openNow ? 'bg-green-500' : 'bg-gray-300'
              }`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                local.openNow ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {/* â”€â”€ Opening Hours â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            <h3 className="font-bold text-sm text-gray-600 uppercase tracking-wide mb-3">Opening Hours</h3>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { id: 'any', label: 'Any' },
                { id: 'open_now', label: 'Open Now' },
                { id: 'open_late', label: 'Open Late' },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => set('hours', h.id as HoursFilter)}
                  className={`py-3 rounded-2xl border-2 text-center transition-all text-sm font-bold ${
                    local.hours === h.id
                      ? 'border-[#8d5524] bg-[#8d5524]/5 text-[#8d5524]'
                      : 'border-transparent bg-gray-50 text-gray-600'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <div className="flex-grow">
                <p className="font-bold text-gray-700">Open At</p>
                <p className="text-xs text-gray-400">Show shops open at a specific time (today)</p>
              </div>
              <input
                type="time"
                value={local.openAt}
                onChange={(e) => set('openAt', e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700"
              />
              {local.openAt && (
                <button
                  type="button"
                  onClick={() => set('openAt', '')}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 grid place-items-center text-gray-500"
                  aria-label="Clear time"
                  title="Clear"
                >
                  <i className="fas fa-times text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* ── Minimum Rating ────────────────────────────── */}
          <div>
            <h3 className="font-bold text-sm text-gray-600 uppercase tracking-wide mb-3">
              Minimum Rating
              {local.minRating > 0 && (
                <span className="ml-2 text-[#8d5524] font-black">{local.minRating}+ ★</span>
              )}
            </h3>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button key={r}
                  onClick={() => set('minRating', r)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    local.minRating === r
                      ? 'border-[#8d5524] bg-[#8d5524]/5 text-[#8d5524]'
                      : 'border-transparent bg-gray-50 text-gray-600'
                  }`}>
                  {r === 0 ? 'Any' : `${r}★`}
                </button>
              ))}
            </div>
          </div>

          {/* ── Price Range ───────────────────────────────── */}
          <div>
            <h3 className="font-bold text-sm text-gray-600 uppercase tracking-wide mb-3">Price Range</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all',     label: 'Any',    sub: '' },
                { id: 'budget',  label: '₹',      sub: 'Under 200' },
                { id: 'mid',     label: '₹₹',     sub: '200–500' },
                { id: 'premium', label: '₹₹₹',    sub: '500+' },
              ].map(p => (
                <button key={p.id}
                  onClick={() => set('priceRange', p.id)}
                  className={`py-3 rounded-2xl border-2 text-center transition-all ${
                    local.priceRange === p.id
                      ? 'border-[#8d5524] bg-[#8d5524]/5'
                      : 'border-transparent bg-gray-50'
                  }`}>
                  <p className={`font-black text-sm ${
                    local.priceRange === p.id ? 'text-[#8d5524]' : 'text-gray-700'
                  }`}>{p.label}</p>
                  {p.sub && <p className="text-[9px] text-gray-400 mt-0.5">{p.sub}</p>}
                </button>
              ))}
            </div>
          </div>

          {/* â”€â”€ Discount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            <h3 className="font-bold text-sm text-gray-600 uppercase tracking-wide mb-3">Discount</h3>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-3">
              <div>
                <p className="font-bold text-gray-700">Only Discounted</p>
                <p className="text-xs text-gray-400">Show shops with discounts on products</p>
              </div>
              <button
                type="button"
                onClick={() => set('discountOnly', !local.discountOnly)}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  local.discountOnly ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    local.discountOnly ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 20, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => set('minDiscount', d)}
                  className={`py-3 rounded-2xl border-2 text-center transition-all ${
                    local.minDiscount === d
                      ? 'border-[#8d5524] bg-[#8d5524]/5 text-[#8d5524]'
                      : 'border-transparent bg-gray-50 text-gray-600'
                  }`}
                >
                  {d === 0 ? 'Any' : `${d}%+`}
                </button>
              ))}
            </div>
          </div>

          {/* â”€â”€ New Collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <p className="font-bold text-gray-700">New Collection</p>
              <p className="text-xs text-gray-400">Show shops with new arrival items</p>
            </div>
            <button
              type="button"
              onClick={() => set('newCollection', !local.newCollection)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                local.newCollection ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  local.newCollection ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Sticky apply button */}
        <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
          <button onClick={apply}
            className="btn-primary w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg hover:-translate-y-0.5 transition-all">
            <i className="fas fa-check mr-2" />
            {totalResults > 0
              ? `Dekho ${totalResults} shops`
              : 'Apply Filters'}
          </button>
        </div>

      </div>
    </div>
  );
}
