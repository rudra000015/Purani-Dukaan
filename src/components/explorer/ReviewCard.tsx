'use client';

import { useState } from 'react';
import { Review } from '@/types/review';
import { useStore } from '@/store/useStore';

const STAR_COLORS = ['', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#16a34a'];
const TAG_POSITIVE = new Set([
  'Fresh maal', 'Saste daam', 'Friendly staff',
  'Quick service', 'Best in Meerut', 'Packaging acha', 'Revisit karunga',
]);

interface Props {
  review: Review;
  onHelpful: (id: string) => void;
  isOwner?: boolean;
  onReply?: (id: string, text: string) => Promise<void>;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <i
          key={n}
          className={`${n <= rating ? 'fas' : 'far'} fa-star`}
          style={{ fontSize: 11, color: n <= rating ? STAR_COLORS[rating] : '#d1d5db' }}
        />
      ))}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);

  if (m < 1) return 'Abhi';
  if (m < 60) return `${m}m pehle`;
  if (h < 24) return `${h}h pehle`;
  if (d < 30) return `${d} din pehle`;

  return new Date(iso).toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export default function ReviewCard({ review: r, onHelpful, isOwner, onReply }: Props) {
  const { user } = useStore();

  // ✅ FIXED HERE
  const userId = user?.name ?? 'anon';

  const isMine = r.userId === userId;
  const isHelpful = r.helpfulBy.includes(userId);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState(r.ownerReply?.text ?? '');
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const BODY_LIMIT = 140;
  const isLong = r.body.length > BODY_LIMIT;

  const displayBody = isLong && !expanded
    ? r.body.slice(0, BODY_LIMIT) + '...'
    : r.body;

  const handleSaveReply = async () => {
    if (!onReply || !replyText.trim()) return;

    setSaving(true);
    await onReply(r.id, replyText);
    setSaving(false);
    setShowReplyBox(false);
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: '16px',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8d5524, #b87333)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {r.userImg ? (
            <img
              src={r.userImg}
              alt={r.userName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>
              {r.userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: 14 }}>{r.userName}</span>

            {isMine && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: 'rgba(141,85,36,0.12)',
                  color: '#8d5524',
                  padding: '1px 7px',
                  borderRadius: 100,
                }}
              >
                Aapka
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Stars rating={r.rating} />
            <span style={{ fontSize: 11, color: 'var(--fg-faint)' }}>
              {timeAgo(r.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <p style={{ fontSize: 13, lineHeight: 1.65 }}>
        {displayBody}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#8d5524',
              fontSize: 12,
              fontWeight: 700,
              paddingLeft: 4,
            }}
          >
            {expanded ? 'Kam karo' : 'Aur padho'}
          </button>
        )}
      </p>

      {/* Footer */}
      <button
        onClick={() => onHelpful(r.id)}
        style={{
          marginTop: 10,
          padding: '6px 12px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
      >
        Helpful {r.helpful > 0 && `(${r.helpful})`}
      </button>
    </div>
  );
}