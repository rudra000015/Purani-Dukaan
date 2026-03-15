'use client';

import { useState, useEffect } from 'react';
import { FESTIVALS, Festival, getTimeUntilFestival, getActiveFestivals } from '@/data/festivals';
import { useStore } from '@/store/useStore';

// ── Mini countdown for cards ──────────────────────────────────
function MiniCountdown({ festival }: { festival: Festival }) {
  const [t, setT] = useState(getTimeUntilFestival(festival));
  useEffect(() => {
    const id = setInterval(() => setT(getTimeUntilFestival(festival)), 1000);
    return () => clearInterval(id);
  }, [festival]);

  if (t.expired) return (
    <span style={{ color: '#34d399', fontSize: 11, fontWeight: 700 }}>🎉 Aaj hai!</span>
  );

  return (
    <span style={{
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11, fontWeight: 700,
      color: festival.theme.accent,
    }}>
      {t.days > 0 ? `${t.days}d ` : ''}{String(t.hours).padStart(2,'0')}:{String(t.minutes).padStart(2,'0')}:{String(t.seconds).padStart(2,'0')}
    </span>
  );
}

// ── Festival teaser card ──────────────────────────────────────
function FestivalCard({ festival, onOpen }: {
  festival: Festival;
  onOpen: (slug: string) => void;
}) {
  const active = getActiveFestivals().some(f => f.id === festival.id);
  const maxDiscount = Math.max(...festival.offers.map(o => o.discount));

  return (
    <div
      onClick={() => onOpen(festival.slug)}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
      }}
    >
      {/* Background */}
      <div style={{ background: festival.theme.bg, padding: '24px 20px 20px' }}>

        {/* Active badge */}
        {active && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#34d399', color: '#064e3b',
            fontSize: 9, fontWeight: 800,
            padding: '3px 8px', borderRadius: 100,
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            ● Live Now
          </div>
        )}

        {/* Emoji + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 48, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
            {festival.emoji}
          </div>
          <div>
            <h3 style={{
              fontFamily: "'Baloo 2',cursive",
              fontSize: 26, fontWeight: 900,
              color: '#fff', lineHeight: 1, marginBottom: 3,
            }}>
              {festival.nameHindi}
            </h3>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', lineHeight: 1.3 }}>
              {festival.tagline}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{
            background: `${festival.theme.accent}25`,
            border: `1px solid ${festival.theme.accent}50`,
            color: festival.theme.accent,
            fontSize: 11, fontWeight: 800,
            padding: '4px 10px', borderRadius: 100,
          }}>
            Up to {maxDiscount}% off
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11, fontWeight: 700,
            padding: '4px 10px', borderRadius: 100,
          }}>
            {festival.offers.length} shops
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11, fontWeight: 700,
            padding: '4px 10px', borderRadius: 100,
          }}>
            Meerut
          </span>
        </div>

        {/* Countdown + CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
              {festival.nameHindi} mein
            </p>
            <MiniCountdown festival={festival} />
          </div>
          <button style={{
            background: festival.theme.accent,
            color: '#1a0000',
            border: 'none', cursor: 'pointer',
            borderRadius: 12, padding: '10px 18px',
            fontFamily: "'Baloo 2',cursive",
            fontSize: 13, fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'opacity 0.2s',
          }}>
            Dekho <i className="fas fa-arrow-right text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FestivalHub — the listing page ───────────────────────────
interface Props {
  onNavigate: (slug: string) => void;
}

export default function FestivalHub({ onNavigate }: Props) {
  const { navTo } = useStore();

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #8d5524, #b87333)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fas fa-star text-white text-sm" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Baloo 2',cursive",
              fontSize: 22, fontWeight: 900,
              color: 'var(--fg)', lineHeight: 1,
            }}>
              Festival Special
            </h2>
            <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>
              Tyohar pe khaas offers — heritage shops se
            </p>
          </div>
        </div>
      </div>

      {/* Festival cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FESTIVALS.map(festival => (
          <FestivalCard
            key={festival.id}
            festival={festival}
            onOpen={onNavigate}
          />
        ))}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: 24, padding: '14px 16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <i className="fas fa-info-circle" style={{ color: '#8d5524' }} />
        <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
          Yeh offers limited time ke liye hain. Shop se contact karke confirm kar lo.
        </p>
      </div>
    </div>
  );
}