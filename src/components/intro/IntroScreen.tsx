'use client';

import { useEffect, useRef } from 'react';
import ThreeBackground from './ThreeBackground';

export default function IntroScreen() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Create 60 floating particles
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'ptc';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (5 + Math.random() * 5) + 's';
      container.appendChild(p);
    }
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100000,
        background: 'linear-gradient(135deg, #1a0f0a, #2c1810)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}
    >
      {/* <ThreeBackground /> */}
      {/* Particles container */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} />

      {/* Logo */}
      <div style={{
        fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, textAlign: 'center',
        background: 'linear-gradient(135deg, #d2b48c, #b87333, #d2b48c)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        filter: 'drop-shadow(0 0 60px rgba(184,115,51,0.5))',
        animation: 'logoReveal 4s cubic-bezier(.16,1,.3,1) forwards',padding:20,
        opacity: 0, lineHeight: 1.1,
      }}>
       WELCOME TO Hidden Haat
      </div>

      {/* Tagline */}
      <div style={{
        color: '#34d399', letterSpacing: '0.6rem', textTransform: 'uppercase',
        fontWeight: 700, marginTop: '1.5rem', fontSize: '0.85rem',
        animation: 'tagReveal 3s ease-out 1s forwards', opacity: 0,
      }}>
      Pride In Heritage
      </div>

      {/* Loading bar */}
      <div style={{
        marginTop: '3rem', width: 200, height: 3,
        background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden',
        animation: 'fadeIn 1s ease 1.5s forwards', opacity: 0,
      }}>
        <div style={{
          height: '100%', width: '0%',
          background: 'linear-gradient(90deg, #b87333, #34d399)',
          animation: 'loadBar 2.5s ease 1.5s forwards',
        }} />
      </div>
    </div>
  );
}