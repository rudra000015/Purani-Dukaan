'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Festival, FestivalOffer, getTimeUntilFestival } from '@/data/festivals';
import { useStore } from '@/store/useStore';

// ── CSS injected once ─────────────────────────────────────────
const FESTIVAL_CSS = `
  @keyframes festParticle {
    0%   { transform: translateY(100vh) rotate(0deg) scale(0); opacity: 0; }
    5%   { opacity: 1; transform: translateY(90vh) scale(1); }
    95%  { opacity: 0.8; }
    100% { transform: translateY(-10vh) rotate(720deg) scale(0.5); opacity: 0; }
  }
  @keyframes festHeroIn {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes festCountPulse {
    0%,100% { transform: scale(1); }
    50%     { transform: scale(1.04); }
  }
  @keyframes festCardIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes festGlow {
    0%,100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
    50%     { box-shadow: 0 0 40px rgba(255,255,255,0.25); }
  }
  @keyframes festShimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .fest-particle {
    position: fixed;
    font-size: 20px;
    pointer-events: none;
    z-index: 0;
    animation: festParticle linear infinite;
    user-select: none;
  }
  .fest-count-box {
    animation: festCountPulse 2s ease-in-out infinite;
  }
  .fest-shimmer-text {
    background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.6) 40%, #fff 60%, rgba(255,255,255,0.6) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: festShimmer 3s linear infinite;
  }
  .fest-offer-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .fest-offer-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .fest-offer-card:active { transform: scale(0.98); }
`;

// ── Particle background ───────────────────────────────────────
function Particles({ symbols, color, count }: {
  symbols: string[]; color: string; count: number;
}) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: symbols[i % symbols.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${8 + Math.random() * 10}s`,
    size: `${14 + Math.random() * 16}px`,
  }));

  return (
    <>
      {particles.map(p => (
        <span key={p.id} className="fest-particle" style={{
          left: p.left,
          fontSize: p.size,
          animationDelay: p.delay,
          animationDuration: p.duration,
        }}>
          {p.symbol}
        </span>
      ))}
    </>
  );
}

// ── Countdown timer ───────────────────────────────────────────
function Countdown({ festival }: { festival: Festival }) {
  const [time, setTime] = useState(getTimeUntilFestival(festival));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilFestival(festival)), 1000);
    return () => clearInterval(id);
  }, [festival]);

  if (time.expired) return (
    <div className="text-center py-4">
      <p style={{
        fontFamily: "'Baloo 2',cursive",
        fontSize: 28, fontWeight: 900, color: festival.theme.accent,
      }}>
        🎉 {festival.nameHindi} Mubarak! 🎉
      </p>
    </div>
  );

  const boxes = [
    { val: time.days,    label: 'Din' },
    { val: time.hours,   label: 'Ghante' },
    { val: time.minutes, label: 'Minute' },
    { val: time.seconds, label: 'Second' },
  ];

  return (
    <div>
      <p style={{
        textAlign: 'center', fontSize: 12, fontWeight: 700,
        color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em',
        textTransform: 'uppercase', marginBottom: 12,
      }}>
        {festival.nameHindi} mein baki hai
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {boxes.map(b => (
          <div key={b.label} className="fest-count-box" style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: '12px 16px',
            minWidth: 64,
            textAlign: 'center',
            border: `1px solid ${festival.theme.accent}40`,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 32, fontWeight: 700,
              color: festival.theme.accent,
              lineHeight: 1,
            }}>
              {String(b.val).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 4, textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {b.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Offer end countdown ───────────────────────────────────────
function OfferExpiry({ endDate, accent }: { endDate: string; accent: string }) {
  const [secs, setSecs] = useState(
    Math.max(0, Math.floor((new Date(endDate).getTime() - Date.now()) / 1000))
  );
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  if (secs <= 0) return <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700 }}>Expired</span>;
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return (
    <span style={{
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11, fontWeight: 700,
      color: accent,
    }}>
      ⏱ {d > 0 ? `${d}d ` : ''}{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')} baki
    </span>
  );
}

// ── Offer card ────────────────────────────────────────────────
function OfferCard({
  offer, festival, index,
}: {
  offer: FestivalOffer; festival: Festival; index: number;
}) {
  const { openShop, showToast } = useStore();
  const [expanded, setExpanded] = useState(false);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Namaste! Purani Dukan app se dekha — ${festival.name} offer:\n` +
      `${offer.offerText}\n\nKya yeh available hai?`
    );
    window.open(`https://wa.me/${offer.shopPhone}?text=${msg}`, '_blank');
  };

  const badgeColors: Record<string, { bg: string; text: string }> = {
    'Best Deal':  { bg: '#fbbf24', text: '#78350f' },
    'Limited':    { bg: '#ef4444', text: '#fff' },
    'Exclusive':  { bg: festival.theme.primary, text: '#fff' },
  };
  const badge = offer.badge ? badgeColors[offer.badge] : null;

  return (
    <div
      className="fest-offer-card"
      style={{
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(20px)',
        border: `1px solid rgba(255,255,255,0.1)`,
        borderRadius: 20,
        overflow: 'hidden',
        animation: `festCardIn 0.5s ease forwards ${index * 0.08}s`,
        opacity: 0,
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top color strip */}
      <div style={{ height: 4, background: festival.theme.primary }} />

      <div style={{ padding: '16px 18px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            {/* Shop badge row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: festival.theme.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className={`fas fa-${
                  offer.category === 'sweets' ? 'cookie' :
                  offer.category === 'dairy'  ? 'glass-milk' :
                  offer.category === 'spices' ? 'pepper-hot' :
                  offer.category === 'bakery' ? 'bread-slice' :
                  offer.category === 'puja'   ? 'praying-hands' :
                  'store'
                } text-white text-sm`} />
              </div>
              <div>
                <p style={{ fontFamily: "'Baloo 2',cursive", fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                  {offer.shopName}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: 3, color: festival.theme.accent }} />
                  {offer.shopAddr}
                </p>
              </div>
            </div>
          </div>

          {/* Discount badge */}
          <div style={{
            background: festival.theme.accent,
            color: '#1a0000',
            borderRadius: 12,
            padding: '6px 12px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
              {offer.discount}%
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>OFF</div>
          </div>
        </div>

        {/* Offer text */}
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.4 }}>
          {offer.offerText}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {/* Legacy badge */}
          <span style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 10, fontWeight: 700,
            padding: '2px 8px', borderRadius: 100,
          }}>
            {offer.shopAge} Yrs
          </span>

          {/* Rating */}
          <span style={{
            background: 'rgba(255,255,255,0.1)',
            color: festival.theme.accent,
            fontSize: 10, fontWeight: 700,
            padding: '2px 8px', borderRadius: 100,
          }}>
            ⭐ {offer.shopRating}
          </span>

          {/* Category badge */}
          {badge && (
            <span style={{
              background: badge.bg, color: badge.text,
              fontSize: 10, fontWeight: 800,
              padding: '2px 8px', borderRadius: 100,
              textTransform: 'uppercase',
            }}>
              {offer.badge}
            </span>
          )}

          {/* Limited stock */}
          {offer.maxQuantity && (
            <span style={{
              background: 'rgba(239,68,68,0.2)',
              color: '#f87171',
              fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 100,
              border: '1px solid rgba(239,68,68,0.3)',
            }}>
              🔥 {offer.maxQuantity}
            </span>
          )}
        </div>

        {/* Offer expiry */}
        <OfferExpiry endDate={festival.offerEndDate} accent={festival.theme.accent} />

        {/* Expanded detail */}
        {expanded && (
          <div style={{
            marginTop: 12, padding: '12px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            borderLeft: `3px solid ${festival.theme.accent}`,
            animation: 'festCardIn 0.2s ease forwards',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              {offer.offerDetail}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }} onClick={e => e.stopPropagation()}>
          <button
            onClick={handleWhatsApp}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 0', borderRadius: 12,
              background: '#25d366', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Nunito',sans-serif",
              fontSize: 13, fontWeight: 800,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
          >
            <i className="fab fa-whatsapp" />
            Order
          </button>

          <button
            onClick={() => openShop(offer.shopId)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 0', borderRadius: 12,
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              fontFamily: "'Nunito',sans-serif",
              fontSize: 13, fontWeight: 700,
            }}
          >
            <i className="fas fa-store text-xs" />
            Shop Dekho
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Share button ──────────────────────────────────────────────
function ShareSection({ festival }: { festival: Festival }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/festival/${festival.slug}`
    : '';

  const handleWhatsApp = () => {
    const msg = festival.shareMessage.replace('{URL}', url);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(20px)',
      border: `1px solid rgba(255,255,255,0.1)`,
      borderRadius: 20, padding: '20px',
      marginBottom: 24,
    }}>
      <p style={{
        fontFamily: "'Baloo 2',cursive",
        fontSize: 18, fontWeight: 800, color: '#fff',
        marginBottom: 6,
      }}>
        {festival.emoji} Share karo friends ke saath!
      </p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.5 }}>
        Yeh offers WhatsApp pe share karo — sab ko pata chalega Meerut ke best deals ke baare mein
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleWhatsApp}
          style={{
            flex: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 0', borderRadius: 14,
            background: '#25d366', color: '#fff',
            border: 'none', cursor: 'pointer',
            fontFamily: "'Nunito',sans-serif",
            fontSize: 14, fontWeight: 800,
          }}
        >
          <i className="fab fa-whatsapp text-base" />
          WhatsApp pe Share Karo
        </button>

        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '12px 0', borderRadius: 14,
            background: copied ? 'rgba(5,150,105,0.3)' : 'rgba(255,255,255,0.1)',
            color: copied ? '#34d399' : '#fff',
            border: `1px solid ${copied ? '#34d399' : 'rgba(255,255,255,0.2)'}`,
            cursor: 'pointer',
            fontFamily: "'Nunito',sans-serif",
            fontSize: 13, fontWeight: 700,
            transition: 'all 0.2s',
          }}
        >
          <i className={`fas fa-${copied ? 'check' : 'link'} text-xs`} />
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}

// ── Category filter ───────────────────────────────────────────
const CATS = [
  { id: 'all',       icon: 'th',             label: 'Sab' },
  { id: 'sweets',    icon: 'cookie',         label: 'Mithai' },
  { id: 'dairy',     icon: 'glass-milk',     label: 'Dairy' },
  { id: 'spices',    icon: 'pepper-hot',     label: 'Masale' },
  { id: 'bakery',    icon: 'bread-slice',    label: 'Bakery' },
  { id: 'namkeen',   icon: 'seedling',       label: 'Namkeen' },
  { id: 'puja',      icon: 'praying-hands',  label: 'Puja' },
  { id: 'dry-fruits',icon: 'apple-alt',      label: 'Meve' },
];

// ── Main FestivalPage ─────────────────────────────────────────
interface Props { festival: Festival; }

export default function FestivalPage({ festival }: Props) {
  const { navTo } = useStore();
  const [cat, setCat] = useState('all');
  const styleInjected = useRef(false);

  // Inject CSS once
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const el = document.createElement('style');
    el.textContent = FESTIVAL_CSS;
    document.head.appendChild(el);
  }, []);

  const filtered = cat === 'all'
    ? festival.offers
    : festival.offers.filter(o => o.category === cat);

  return (
    <div style={{
      minHeight: '100vh',
      background: festival.theme.bg,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Nunito',sans-serif",
    }}>
      {/* Particles */}
      <Particles
        symbols={festival.particles.symbols}
        color={festival.theme.particle}
        count={festival.particles.count}
      />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '0 16px 100px' }}>

        {/* Back button */}
        <div style={{ paddingTop: 16, marginBottom: 8 }}>
          <button
            onClick={() => navTo('home')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 100, padding: '8px 14px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <i className="fas fa-arrow-left text-xs" />
            Wapas Jao
          </button>
        </div>

        {/* Hero section */}
        <div style={{
          textAlign: 'center',
          paddingTop: 20, paddingBottom: 32,
          animation: 'festHeroIn 0.7s ease forwards',
        }}>
          {/* Big emoji */}
          <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 12, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}>
            {festival.emoji}
          </div>

          {/* Hindi name */}
          <h1 className="fest-shimmer-text" style={{
            fontFamily: "'Baloo 2',cursive",
            fontSize: 52, fontWeight: 900,
            lineHeight: 1, marginBottom: 4,
          }}>
            {festival.nameHindi}
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: 15, fontWeight: 700,
            color: 'rgba(255,255,255,0.75)',
            marginBottom: 6, lineHeight: 1.4,
          }}>
            {festival.tagline}
          </p>

          {/* Description */}
          <p style={{
            fontSize: 13, color: 'rgba(255,255,255,0.5)',
            marginBottom: 28, lineHeight: 1.7,
            maxWidth: 400, margin: '0 auto 28px',
          }}>
            {festival.description}
          </p>

          {/* Countdown */}
          <Countdown festival={festival} />

          {/* Offer dates */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${festival.theme.accent}20`,
            border: `1px solid ${festival.theme.accent}40`,
            borderRadius: 100, padding: '6px 14px',
            marginTop: 16,
          }}>
            <i className="fas fa-tag" style={{ color: festival.theme.accent, fontSize: 11 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: festival.theme.accent }}>
              Offers: {new Date(festival.offerStartDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })} —{' '}
              {new Date(festival.offerEndDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10, marginBottom: 24,
        }}>
          {[
            { val: festival.offers.length, label: 'Shops' },
            { val: `${Math.max(...festival.offers.map(o => o.discount))}%`, label: 'Max Off' },
            { val: `${festival.offers.reduce((s,o) => s + o.shopAge, 0) / festival.offers.length | 0}+`, label: 'Avg Yrs' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '14px 0',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'Baloo 2',cursive",
                fontSize: 28, fontWeight: 900,
                color: festival.theme.accent, lineHeight: 1,
              }}>
                {stat.val}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: 700 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Share section */}
        <ShareSection festival={festival} />

        {/* Category filter */}
        <div style={{
          display: 'flex', gap: 8,
          overflowX: 'auto', marginBottom: 20,
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}>
          {CATS.filter(c => c.id === 'all' || festival.offers.some(o => o.category === c.id)).map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 100,
                background: cat === c.id ? festival.theme.accent : 'rgba(0,0,0,0.35)',
                color: cat === c.id ? '#1a0000' : 'rgba(255,255,255,0.7)',
                border: cat === c.id
                  ? `1.5px solid ${festival.theme.accent}`
                  : '1.5px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                fontFamily: "'Nunito',sans-serif",
                fontSize: 12, fontWeight: 800,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <i className={`fas fa-${c.icon} text-[10px]`} />
              {c.label}
            </button>
          ))}
        </div>

        {/* Offers heading */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{
            fontFamily: "'Baloo 2',cursive",
            fontSize: 20, fontWeight: 800, color: '#fff',
          }}>
            {festival.emoji} {festival.name} Offers
          </h2>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: 'rgba(255,255,255,0.4)',
          }}>
            {filtered.length} shops
          </span>
        </div>

        {/* Offer cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} festival={festival} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
            Aur bhi shops explore karo Meerut mein
          </p>
          <button
            onClick={() => navTo('home')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 14,
              background: festival.theme.primary, color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Baloo 2',cursive",
              fontSize: 16, fontWeight: 800,
            }}
          >
            <i className="fas fa-store" />
            Sab Shops Dekho
          </button>
        </div>
      </div>
    </div>
  );
}