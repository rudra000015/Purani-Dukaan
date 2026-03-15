'use client';

import { LegacyBadge as BadgeType, BADGE_CONFIG } from '@/data/shops';

interface Props {
  badge: BadgeType;
  age: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function LegacyBadge({ badge, age, size = 'md' }: Props) {
  const cfg = BADGE_CONFIG[badge];

  const sizes = {
    sm: { padding: '3px 10px', fontSize: '10px', emojiSize: '12px' },
    md: { padding: '5px 14px', fontSize: '12px', emojiSize: '14px' },
    lg: { padding: '8px 18px', fontSize: '14px', emojiSize: '18px' },
  };

  const s = sizes[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: s.padding,
        borderRadius: '100px',
        background: cfg.bg,
        color: cfg.text,
        border: `1.5px solid ${cfg.border}`,
        fontSize: s.fontSize,
        fontWeight: 800,
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: s.emojiSize }}>{cfg.emoji}</span>
      {cfg.label}
      <span
        style={{
          background: cfg.border,
          color: '#fff',
          borderRadius: '100px',
          padding: '1px 7px',
          fontSize: '10px',
          fontWeight: 900,
        }}
      >
        {age}y
      </span>
    </span>
  );
}
