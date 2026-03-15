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
        <i key={n}
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
  if (m < 1)   return 'Abhi';
  if (m < 60)  return `${m}m pehle`;
  if (h < 24)  return `${h}h pehle`;
  if (d < 30)  return `${d} din pehle`;
  return new Date(iso).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' });
}

export default function ReviewCard({ review: r, onHelpful, isOwner, onReply }: Props) {
  const { user } = useStore();
  const userId    = user?.email ?? user?.name ?? 'anon';
  const isMine    = r.userId === userId;
  const isHelpful = r.helpfulBy.includes(userId);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText,    setReplyText]    = useState(r.ownerReply?.text ?? '');
  const [saving,       setSaving]       = useState(false);
  const [expanded,     setExpanded]     = useState(false);

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
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 18,
      padding: '16px',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>

        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8d5524, #b87333)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {r.userImg
            ? <img src={r.userImg} alt={r.userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>
                {r.userName.charAt(0).toUpperCase()}
              </span>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--fg)' }}>
              {r.userName}
            </span>
            {isMine && (
              <span style={{
                fontSize: 10, fontWeight: 700, background: 'rgba(141,85,36,0.12)',
                color: '#8d5524', padding: '1px 7px', borderRadius: 100,
              }}>Aapka</span>
            )}
            {r.verified && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: 'rgba(22,163,74,0.1)', color: '#16a34a',
                padding: '1px 7px', borderRadius: 100, border: '1px solid rgba(22,163,74,0.2)',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <i className="fas fa-check-circle text-[9px]" /> Verified
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Stars rating={r.rating} />
            <span style={{ fontSize: 11, color: 'var(--fg-faint)' }}>{timeAgo(r.createdAt)}</span>
          </div>
        </div>

        {/* Rating number bubble */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: STAR_COLORS[r.rating] + '18',
          border: `1.5px solid ${STAR_COLORS[r.rating]}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Baloo 2',cursive",
          fontSize: 16, fontWeight: 900,
          color: STAR_COLORS[r.rating],
        }}>
          {r.rating}
        </div>
      </div>

      {/* Title */}
      {r.title && (
        <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg)', marginBottom: 6 }}>
          {r.title}
        </p>
      )}

      {/* Body */}
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65, marginBottom: 10 }}>
        {displayBody}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8d5524', fontSize: 12, fontWeight: 700, paddingLeft: 4 }}
          >
            {expanded ? 'Kam karo' : 'Aur padho'}
          </button>
        )}
      </p>

      {/* Tags */}
      {r.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {r.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 700,
              padding: '3px 9px', borderRadius: 100,
              background: TAG_POSITIVE.has(tag)
                ? 'rgba(22,163,74,0.1)' : 'rgba(249,115,22,0.1)',
              color: TAG_POSITIVE.has(tag) ? '#16a34a' : '#f97316',
              border: `1px solid ${TAG_POSITIVE.has(tag) ? 'rgba(22,163,74,0.2)' : 'rgba(249,115,22,0.2)'}`,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Owner reply */}
      {r.ownerReply && (
        <div style={{
          background: 'rgba(141,85,36,0.06)',
          border: '1px solid rgba(141,85,36,0.15)',
          borderRadius: 12, padding: '12px 14px', marginBottom: 12,
          borderLeft: '3px solid #8d5524',
        }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#8d5524', marginBottom: 4 }}>
            <i className="fas fa-store mr-1" /> Dukan ka Jawab
          </p>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            {r.ownerReply.text}
          </p>
          <p style={{ fontSize: 10, color: 'var(--fg-faint)', marginTop: 4 }}>
            {timeAgo(r.ownerReply.repliedAt)}
          </p>
        </div>
      )}

      {/* Footer actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => onHelpful(r.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: isHelpful ? 'rgba(141,85,36,0.1)' : 'none',
            border: isHelpful ? '1px solid rgba(141,85,36,0.25)' : '1px solid var(--border)',
            borderRadius: 10, padding: '5px 12px', cursor: 'pointer',
            fontSize: 12, fontWeight: 700,
            color: isHelpful ? '#8d5524' : 'var(--fg-muted)',
            transition: 'all 0.15s',
          }}
        >
          <i className={`${isHelpful ? 'fas' : 'far'} fa-thumbs-up text-[11px]`} />
          Helpful {r.helpful > 0 && `(${r.helpful})`}
        </button>

        {/* Owner-only reply button */}
        {isOwner && !r.ownerReply && (
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 10, padding: '5px 12px', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)',
            }}
          >
            <i className="fas fa-reply text-[11px]" /> Reply Karo
          </button>
        )}
      </div>

      {/* Reply box */}
      {isOwner && showReplyBox && (
        <div style={{ marginTop: 10 }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Customer ko jawab do..."
            rows={3}
            style={{
              width: '100%', padding: '10px 12px',
              background: 'var(--bg-input)', border: '1.5px solid var(--border)',
              borderRadius: 10, resize: 'vertical',
              color: 'var(--fg)', fontSize: 13,
              fontFamily: "'Nunito',sans-serif", outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#8d5524')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button
              onClick={handleSaveReply}
              disabled={saving || !replyText.trim()}
              style={{
                flex: 1, padding: '9px 0',
                background: 'linear-gradient(135deg, #8d5524, #b87333)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Reply Bhejo'}
            </button>
            <button
              onClick={() => setShowReplyBox(false)}
              style={{
                padding: '9px 14px', border: '1px solid var(--border)',
                background: 'none', borderRadius: 10,
                color: 'var(--fg-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}