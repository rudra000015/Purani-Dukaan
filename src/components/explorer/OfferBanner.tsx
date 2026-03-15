'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store/useStore';

const OFFERS = [
  {
    id: 'o1',
    tag: 'NEW USER',
    title: '50% OFF',
    sub: 'Hira Sweets pe pehli order par',
    emoji: '🍯',
    shopId: 'hira',
    cta: 'Order Karo',
    expiresIn: 6 * 60 * 60,
    from: '#8d5524',
    to: '#c8813a',
    accent: '#fbbf24',
  },
  {
    id: 'o2',
    tag: 'ALWAYS ON',
    title: 'Free Delivery',
    sub: '₹299 se upar har order pe free',
    emoji: '🛵',
    shopId: null,
    cta: 'Explore Karo',
    expiresIn: null,
    from: '#064e3b',
    to: '#0c831f',
    accent: '#34d399',
  },
  {
    id: 'o3',
    tag: 'SEASON SPECIAL',
    title: 'Winter Gajak',
    sub: 'RC Sahai ki fresh seasonal collection',
    emoji: '🌾',
    shopId: 'rcsahai',
    cta: 'Dekhna Hai',
    expiresIn: 48 * 60 * 60,
    from: '#1a0f0a',
    to: '#5d4037',
    accent: '#b87333',
  },
  {
    id: 'o4',
    tag: 'FESTIVAL',
    title: '30% Discount',
    sub: 'Sabhi mithai shops pe aaj special',
    emoji: '🎉',
    shopId: null,
    cta: 'Shop Now',
    expiresIn: 24 * 60 * 60,
    from: '#1e1b4b',
    to: '#4f46e5',
    accent: '#818cf8',
  },
  {
    id: 'o5',
    tag: 'CASHBACK',
    title: '₹100 Back',
    sub: 'Pehli pharmacy order pe guaranteed',
    emoji: '💊',
    shopId: null,
    cta: 'Claim Karo',
    expiresIn: 12 * 60 * 60,
    from: '#7f1d1d',
    to: '#b91c1c',
    accent: '#f87171',
  },
];

function useCountdown(seconds: number | null) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!seconds) return;
    setLeft(seconds);
    const id = setInterval(() => {
      setLeft(p => (!p || p <= 1 ? 0 : p - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  if (!left) return null;
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  return `${h > 0 ? h + 'h ' : ''}${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function Slide({
  offer, active, direction, onCta,
}: {
  offer: typeof OFFERS[0];
  active: boolean;
  direction: 'left' | 'right';
  onCta: () => void;
}) {
  const countdown = useCountdown(offer.expiresIn);
  const ef = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
  const et = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${offer.from} 0%, ${offer.to} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // right padding = 120px keeps text clear of the emoji
        padding: '20px 120px 20px 22px',
        overflow: 'hidden',
        animation: active
          ? 'offerIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards'
          : 'offerOut 0.45s cubic-bezier(0.55,0,1,0.45) forwards',
        '--ef': ef,
        '--et': et,
      } as React.CSSProperties}
    >
      {/* bg blobs */}
      <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-40, right:100, width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

      {/* floating emoji — right side, vertically centred */}
      <div style={{
        position: 'absolute',
        right: 18,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 72,
        lineHeight: 1,
        animation: active ? 'emojiFloat 3s ease-in-out infinite' : 'none',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {offer.emoji}
      </div>

      {/* tag */}
      <span style={{
        alignSelf: 'flex-start',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        color: offer.accent,
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: '0.12em',
        padding: '3px 10px',
        borderRadius: 100,
        border: `1px solid ${offer.accent}55`,
        marginBottom: 7,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {offer.tag}
      </span>

      {/* title */}
      <h2 style={{
        fontFamily: "'Baloo 2','Nunito',cursive",
        fontSize: 32,
        fontWeight: 900,
        color: '#fff',
        lineHeight: 1,
        marginBottom: 6,
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {offer.title}
      </h2>

      {/* subtitle */}
      <p style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.82)',
        lineHeight: 1.45,
        marginBottom: 8,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      } as React.CSSProperties}>
        {offer.sub}
      </p>

      {/* countdown */}
      {countdown && (
        <div style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: 'rgba(0,0,0,0.28)',
          borderRadius: 8,
          padding: '3px 10px',
          marginBottom: 10,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 10 }}>⏱</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:offer.accent, letterSpacing:'0.03em' }}>
            {countdown}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>baki</span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onCta}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: '#fff',
          color: offer.from,
          border: 'none',
          borderRadius: 10,
          padding: '9px 18px',
          fontFamily: "'Nunito',sans-serif",
          fontSize: 13,
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.transform = 'scale(1.05)';
          b.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={e => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.transform = 'scale(1)';
          b.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22)';
        }}
      >
        {offer.cta} <span style={{ fontSize: 12 }}>→</span>
      </button>
    </div>
  );
}

export default function OfferBanner() {
  const { openShop, navTo } = useStore();
  const [current, setCurrent]       = useState(0);
  const [prev, setPrev]             = useState<number | null>(null);
  const [direction, setDirection]   = useState<'left' | 'right'>('left');
  const [isPaused, setIsPaused]     = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = OFFERS.length;

  const goTo = useCallback((target: 'next' | 'prev' | number) => {
    setCurrent(cur => {
      const next =
        target === 'next' ? (cur + 1) % total
        : target === 'prev' ? (cur - 1 + total) % total
        : (target as number);
      if (next === cur) return cur;
      setDirection(
        typeof target === 'number'
          ? next > cur ? 'left' : 'right'
          : target === 'next' ? 'left' : 'right'
      );
      setPrev(cur);
      setTimeout(() => setPrev(null), 600);
      return next;
    });
  }, [total]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPaused) goTo('next');
    }, 4200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, goTo]);

  const handleCta = (o: typeof OFFERS[0]) => o.shopId ? openShop(o.shopId) : navTo('home');

  return (
    <>
      <style>{`
        @keyframes offerIn {
          from { transform: var(--ef, translateX(100%)); opacity: 0.7; }
          to   { transform: translateX(0);               opacity: 1; }
        }
        @keyframes offerOut {
          from { transform: translateX(0);                opacity: 1; }
          to   { transform: var(--et, translateX(-100%)); opacity: 0.4; }
        }
        @keyframes emojiFloat {
          0%,100% { transform: translateY(-50%) rotate(0deg); }
          33%     { transform: translateY(calc(-50% - 8px)) rotate(5deg); }
          66%     { transform: translateY(calc(-50% - 4px)) rotate(-3deg); }
        }
        @keyframes dotGrow {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.35); }
        }
      `}</style>

      {/*
        ── SCROLL FIX ──────────────────────────────────────────────────────
        The sticky search bar above is ~100px tall.
        paddingTop: 12 here ensures the banner starts BELOW it, not behind it.
        Remove this if your HomePage already has enough top padding.
        ────────────────────────────────────────────────────────────────── */}
      <div
        style={{ paddingTop: 12, marginBottom: 20 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={e => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={e => {
          if (touchStart === null) return;
          const diff = touchStart - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) goTo(diff > 0 ? 'next' : 'prev');
          setTouchStart(null);
        }}
      >
        {/*
          height: 215 — enough for:
            tag (20) + gap (7) + title (32) + gap (6) + subtitle (36) + gap (8) + countdown (22) + gap (10) + button (38) + top/bottom padding (40)
            = ~219px total — 215 fits comfortably
        */}
        <div style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          height: 215,
          paddingBlock:100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          cursor: 'grab',
          userSelect: 'none',
        }}>
          {prev !== null && (
            <Slide offer={OFFERS[prev]} active={false} direction={direction} onCta={() => handleCta(OFFERS[prev])} />
          )}
          <Slide offer={OFFERS[current]} active={true} direction={direction} onCta={() => handleCta(OFFERS[current])} />

          {/* Arrow buttons */}
          {(['prev', 'next'] as const).map((dir, i) => (
            <button
              key={dir}
              onClick={() => goTo(dir)}
              style={{
                position: 'absolute',
                [i === 0 ? 'left' : 'right']: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 30, height: 30,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.32)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background 0.2s, transform 0.15s',
                paddingBottom: 1,
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'rgba(0,0,0,0.55)';
                b.style.transform = 'translateY(-50%) scale(1.12)';
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'rgba(0,0,0,0.32)';
                b.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              {i === 0 ? '‹' : '›'}
            </button>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:10 }}>
          {OFFERS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === current ? OFFERS[current].accent : 'rgba(0,0,0,0.18)',
                borderRadius: 100,
                width: i === current ? 22 : 6,
                height: 6,
                transition: 'all 0.38s cubic-bezier(0.34,1.56,0.64,1)',
                animation: i === current ? 'dotGrow 2s ease-in-out infinite' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}