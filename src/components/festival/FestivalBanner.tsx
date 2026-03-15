'use client';

import { useRouter } from 'next/navigation';
import { getActiveFestivals, FESTIVALS } from '@/data/festivals';
import { useState, useEffect } from 'react';

export default function FestivalBanner() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  // Show active festivals first, then all
  const toShow = FESTIVALS.slice(0, 3);

  // Auto-rotate
  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % toShow.length), 3500);
    return () => clearInterval(id);
  }, [toShow.length]);

  const f = toShow[current];

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => router.push(`/festival/${f.slug}`)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderRadius: 18,
          background: f.theme.bg,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'left',
          boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        }}
      >
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />

        {/* Left content */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
          }}>
            <span style={{
              background: f.theme.accent,
              color: '#1a0000',
              fontSize: 9, fontWeight: 800,
              padding: '2px 7px', borderRadius: 100,
              textTransform: 'uppercase',
            }}>
              Tyohar Special
            </span>
          </div>
          <p style={{
            fontFamily: "'Baloo 2',cursive",
            fontSize: 18, fontWeight: 900,
            color: '#fff', lineHeight: 1, marginBottom: 3,
          }}>
            {f.nameHindi} Offers
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
            Up to {Math.max(...f.offers.map(o => o.discount))}% off — {f.offers.length} shops
          </p>
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 44, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))', marginLeft: 10 }}>
          {f.emoji}
        </div>

        {/* Arrow */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: 8, flexShrink: 0,
        }}>
          <i className="fas fa-arrow-right text-white text-xs" />
        </div>
      </button>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
        {toShow.map((fest, i) => (
          <button
            key={fest.id}
            onClick={() => setCurrent(i)}
            style={{
              border: 'none', padding: 0, cursor: 'pointer',
              background: i === current ? toShow[current].theme.accent : 'rgba(0,0,0,0.15)',
              borderRadius: 100,
              width: i === current ? 20 : 6, height: 6,
              transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}