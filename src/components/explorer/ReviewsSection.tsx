'use client';

import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { useStore } from '@/store/useStore';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

interface Props {
  shopId: string;
  isOwner?: boolean;
}

type SortKey = 'newest' | 'highest' | 'lowest' | 'helpful';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest',  label: 'Nayi pehle' },
  { key: 'highest', label: 'Best pehle' },
  { key: 'lowest',  label: 'Worst pehle' },
  { key: 'helpful', label: 'Helpful pehle' },
];

// ── Rating breakdown bar ──────────────────────────────────────
function RatingBar({ star, count, total, color }: {
  star: number; count: number; total: number; color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, width: 28, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)' }}>{star}</span>
        <i className="fas fa-star text-[9px]" style={{ color }} />
      </div>
      <div style={{ flex: 1, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: 3, transition: 'width 0.5s ease',
        }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--fg-faint)', width: 28 }}>{count}</span>
    </div>
  );
}

const STAR_COLORS: Record<number, string> = {
  5: '#16a34a', 4: '#22c55e', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444',
};

// ── Stats summary card ────────────────────────────────────────
function StatsCard({ stats, onWrite }: {
  stats: NonNullable<ReturnType<typeof useReviews>['stats']>;
  onWrite: () => void;
}) {
  const ratingLabel =
    stats.averageRating >= 4.5 ? 'Excellent' :
    stats.averageRating >= 4.0 ? 'Bahut Acha' :
    stats.averageRating >= 3.0 ? 'Theek Hai' :
    stats.averageRating >= 2.0 ? 'Average' : 'Poor';

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 20, padding: '20px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Big number */}
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{
            fontFamily: "'Baloo 2',cursive",
            fontSize: 52, fontWeight: 900, lineHeight: 1,
            color: stats.averageRating >= 4 ? '#16a34a' :
                   stats.averageRating >= 3 ? '#f59e0b' : '#ef4444',
          }}>
            {stats.averageRating.toFixed(1)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '4px 0' }}>
            {[1,2,3,4,5].map(n => (
              <i key={n} className={`${n <= Math.round(stats.averageRating) ? 'fas' : 'far'} fa-star`}
                style={{ fontSize: 10, color: '#f59e0b' }} />
            ))}
          </div>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#16a34a' }}>{ratingLabel}</p>
          <p style={{ fontSize: 11, color: 'var(--fg-faint)', marginTop: 2 }}>
            {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Bars */}
        <div style={{ flex: 1, minWidth: 160 }}>
          {[5, 4, 3, 2, 1].map(star => (
            <RatingBar
              key={star} star={star}
              count={stats.ratingBreakdown[star as 1|2|3|4|5] ?? 0}
              total={stats.totalReviews}
              color={STAR_COLORS[star]}
            />
          ))}
        </div>
      </div>

      {/* Top tags */}
      {Object.keys(stats.tagCounts).length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-faint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Customers kya kehte hain
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(stats.tagCounts)
              .sort(([,a],[,b]) => (b ?? 0) - (a ?? 0))
              .slice(0, 6)
              .map(([tag, count]) => (
                <span key={tag} style={{
                  fontSize: 12, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 100,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg-muted)',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {tag}
                  <span style={{
                    fontSize: 10, background: '#8d5524',
                    color: '#fff', borderRadius: 100,
                    padding: '0px 5px', fontWeight: 800,
                  }}>
                    {count}
                  </span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Write review button */}
      <button
        onClick={onWrite}
        style={{
          width: '100%', marginTop: 16, padding: '12px 0',
          background: 'linear-gradient(135deg, #8d5524, #b87333)',
          color: '#fff', border: 'none', borderRadius: 14,
          fontFamily: "'Baloo 2',cursive",
          fontSize: 15, fontWeight: 900, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
      >
        <i className="fas fa-pen text-sm" />
        {stats.totalReviews > 0 ? 'Apna Review Likho' : 'Pehla Review Likho'}
      </button>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyReviews({ onWrite }: { onWrite: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
      <h3 style={{
        fontFamily: "'Baloo 2',cursive",
        fontSize: 20, fontWeight: 900, color: 'var(--fg)', marginBottom: 6,
      }}>
        Abhi koi review nahi
      </h3>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 20, lineHeight: 1.6 }}>
        Is dukan ka pehla review aap likho!
      </p>
      <button
        onClick={onWrite}
        style={{
          background: 'linear-gradient(135deg, #8d5524, #b87333)',
          color: '#fff', border: 'none', borderRadius: 14,
          padding: '12px 24px', cursor: 'pointer',
          fontFamily: "'Baloo 2',cursive",
          fontSize: 15, fontWeight: 800,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}
      >
        <i className="fas fa-star" /> Pehla Review Likho
      </button>
    </div>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────
function Modal({ open, onClose, children }: {
  open: boolean; onClose: () => void; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-card)',
        width: '100%', maxWidth: 560,
        borderRadius: '24px 24px 0 0',
        padding: '0 20px 32px',
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>
        {/* Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 4 }}>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--bg)', border: '1px solid var(--border)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-muted)', fontSize: 12,
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Main ReviewsSection ───────────────────────────────────────
export default function ReviewsSection({ shopId, isOwner = false }: Props) {
  const { reviews, stats, loading, submitting, userReview, submitReview, toggleHelpful, fetchReviews } =
    useReviews(shopId);

  const [showForm, setShowForm]   = useState(false);
  const [sort,     setSort]       = useState<SortKey>('newest');
  const [filter,   setFilter]     = useState<number | null>(null); // filter by star

  const sorted = [...reviews]
    .filter(r => filter === null || r.rating === filter)
    .sort((a, b) =>
      sort === 'newest'  ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() :
      sort === 'highest' ? b.rating - a.rating :
      sort === 'lowest'  ? a.rating - b.rating :
      b.helpful - a.helpful
    );

  const handleOwnerReply = async (reviewId: string, text: string) => {
    await fetch('/api/reviews/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.NEXT_PUBLIC_NOTIFY_SECRET ?? 'purani-dukan-secret',
        shopId, reviewId, text,
      }),
    });
    await fetchReviews();
  };

  if (loading) return (
    <div style={{ padding: '32px 0' }}>
      {[1, 2].map(i => (
        <div key={i} style={{
          background: 'var(--bg-card)', borderRadius: 18, padding: 16,
          marginBottom: 12, border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div className="skeleton" style={{ width: 38, height: 38, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '40%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 11, borderRadius: 6, width: '25%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 13, borderRadius: 6, width: '90%', marginBottom: 5 }} />
          <div className="skeleton" style={{ height: 13, borderRadius: 6, width: '70%' }} />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Stats card */}
      {stats && stats.totalReviews > 0 ? (
        <StatsCard stats={stats} onWrite={() => setShowForm(true)} />
      ) : (
        <EmptyReviews onWrite={() => setShowForm(true)} />
      )}

      {/* Controls — only if there are reviews */}
      {reviews.length > 1 && (
        <div style={{ marginBottom: 14 }}>
          {/* Sort */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 8, scrollbarWidth: 'none' }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                style={{
                  padding: '6px 13px', borderRadius: 100, border: 'none',
                  background: sort === opt.key ? '#8d5524' : 'var(--bg-card)',
                  color: sort === opt.key ? '#fff' : 'var(--fg-muted)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0,
                  border: sort === opt.key ? 'none' : '1px solid var(--border)',
                  transition: 'all 0.15s',
                } as React.CSSProperties}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Star filter */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--fg-faint)', fontWeight: 700, marginRight: 2 }}>Filter:</span>
            <button
              onClick={() => setFilter(null)}
              style={{
                padding: '4px 10px', borderRadius: 100,
                background: filter === null ? '#8d5524' : 'var(--bg-card)',
                color: filter === null ? '#fff' : 'var(--fg-muted)',
                border: filter === null ? 'none' : '1px solid var(--border)',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
              } as React.CSSProperties}
            >
              Sab
            </button>
            {[5,4,3,2,1].map(s => (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? null : s)}
                style={{
                  padding: '4px 9px', borderRadius: 100,
                  background: filter === s ? STAR_COLORS[s] : 'var(--bg-card)',
                  color: filter === s ? '#fff' : 'var(--fg-muted)',
                  border: filter === s ? 'none' : '1px solid var(--border)',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 3,
                } as React.CSSProperties}
              >
                {s} <i className="fas fa-star text-[9px]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {sorted.length === 0 && reviews.length > 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--fg-faint)', fontSize: 13 }}>
          Is filter mein koi review nahi
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={toggleHelpful}
              isOwner={isOwner}
              onReply={isOwner ? handleOwnerReply : undefined}
            />
          ))}
        </div>
      )}

      {/* Review form modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <ReviewForm
          onSubmit={submitReview}
          submitting={submitting}
          hasExisting={!!userReview}
          onClose={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}