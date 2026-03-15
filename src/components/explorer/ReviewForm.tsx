'use client';

import { useState } from 'react';
import { POSITIVE_TAGS, NEGATIVE_TAGS, ReviewTag } from '@/types/review';

interface Props {
  onSubmit: (data: {
    rating: number;
    title: string;
    body: string;
    tags: ReviewTag[];
  }) => Promise<boolean>;
  submitting: boolean;
  hasExisting: boolean;
  onClose: () => void;
}

// ── Star picker ───────────────────────────────────────────────
const STAR_LABELS = ['', 'Bahut bura', 'Theek nahi', 'Theek hai', 'Acha hai', 'Bahut badhiya!'];
const STAR_COLORS = ['', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#16a34a'];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
              transform: active >= n ? 'scale(1.25)' : 'scale(1)',
            }}
          >
            <i
              className={`${active >= n ? 'fas' : 'far'} fa-star`}
              style={{
                fontSize: 32,
                color: active >= n ? STAR_COLORS[active] : '#d1d5db',
                transition: 'color 0.15s, font-size 0.15s',
              }}
            />
          </button>
        ))}
      </div>
      <p style={{
        fontSize: 13, fontWeight: 700, height: 20,
        color: active ? STAR_COLORS[active] : 'var(--fg-faint)',
        transition: 'color 0.2s',
      }}>
        {active ? STAR_LABELS[active] : 'Rating do'}
      </p>
    </div>
  );
}

// ── Tag chip ──────────────────────────────────────────────────
function TagChip({
  tag, selected, onClick, positive,
}: {
  tag: ReviewTag; selected: boolean; onClick: () => void; positive: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '6px 12px', borderRadius: 100,
        border: selected
          ? `1.5px solid ${positive ? '#16a34a' : '#f97316'}`
          : '1.5px solid var(--border)',
        background: selected
          ? positive ? 'rgba(22,163,74,0.12)' : 'rgba(249,115,22,0.12)'
          : 'var(--bg-card)',
        color: selected
          ? positive ? '#16a34a' : '#f97316'
          : 'var(--fg-muted)',
        fontFamily: "'Nunito',sans-serif",
        fontSize: 12, fontWeight: 700, cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {selected && <i className="fas fa-check text-[9px]" />}
      {tag}
    </button>
  );
}

// ── Main form ─────────────────────────────────────────────────
export default function ReviewForm({ onSubmit, submitting, hasExisting, onClose }: Props) {
  const [rating,   setRating]   = useState(0);
  const [title,    setTitle]    = useState('');
  const [body,     setBody]     = useState('');
  const [tags,     setTags]     = useState<ReviewTag[]>([]);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const toggleTag = (tag: ReviewTag) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rating)        return setError('Pehle star rating do!');
    if (!body.trim())   return setError('Apna experience likho please!');
    if (body.length < 10) return setError('Thoda aur detail mein likho (10+ characters)');

    const ok = await onSubmit({ rating, title, body, tags });
    if (ok) {
      setSuccess(true);
    } else {
      setError('Review submit nahi hua — dobara try karo');
    }
  };

  if (success) return (
    <div style={{ textAlign: 'center', padding: '32px 24px' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>🙏</div>
      <h3 style={{
        fontFamily: "'Baloo 2',cursive",
        fontSize: 22, fontWeight: 900,
        color: 'var(--fg)', marginBottom: 8,
      }}>
        Shukriya!
      </h3>
      <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 20, lineHeight: 1.6 }}>
        Aapka review save ho gaya. Doosre customers aapke experience se fayda uthayenge.
      </p>
      <button
        onClick={onClose}
        style={{
          background: 'linear-gradient(135deg, #8d5524, #b87333)',
          color: '#fff', border: 'none', borderRadius: 14,
          padding: '12px 28px', cursor: 'pointer',
          fontFamily: "'Baloo 2',cursive",
          fontSize: 15, fontWeight: 800,
        }}
      >
        Wapas Jao
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px 0 0' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
        <h3 style={{
          fontFamily: "'Baloo 2',cursive",
          fontSize: 20, fontWeight: 900, color: 'var(--fg)', marginBottom: 4,
        }}>
          {hasExisting ? 'Review Update Karo' : 'Review Likho'}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
          Aapka honest feedback doosron ki madad karta hai
        </p>
      </div>

      {/* Star rating */}
      <div style={{
        background: 'var(--bg)',
        borderRadius: 16, padding: '20px',
        marginBottom: 16, border: '1px solid var(--border)',
      }}>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Quick Tags
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {POSITIVE_TAGS.map(tag => (
            <TagChip
              key={tag} tag={tag}
              selected={tags.includes(tag)}
              onClick={() => toggleTag(tag)}
              positive={true}
            />
          ))}
          {NEGATIVE_TAGS.map(tag => (
            <TagChip
              key={tag} tag={tag}
              selected={tags.includes(tag)}
              onClick={() => toggleTag(tag)}
              positive={false}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Ek Line Summary (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Bahut acha jalebi mila!"
          maxLength={80}
          style={{
            width: '100%', padding: '11px 14px',
            background: 'var(--bg-input)',
            border: '1.5px solid var(--border)',
            borderRadius: 12,
            color: 'var(--fg)', fontSize: 14,
            fontFamily: "'Nunito',sans-serif",
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#8d5524')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Body */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Apna Experience Batao *
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Kya acha laga, kya nahi laga, kya khaas tha..."
          rows={4}
          maxLength={500}
          required
          style={{
            width: '100%', padding: '11px 14px',
            background: 'var(--bg-input)',
            border: '1.5px solid var(--border)',
            borderRadius: 12, resize: 'vertical',
            color: 'var(--fg)', fontSize: 14,
            fontFamily: "'Nunito',sans-serif",
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#8d5524')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <p style={{ textAlign: 'right', fontSize: 11, color: 'var(--fg-faint)', marginTop: 4 }}>
          {body.length}/500
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10, padding: '10px 14px',
          marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="fas fa-exclamation-circle text-red-500 text-sm" />
          <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !rating}
        style={{
          width: '100%', padding: '14px 0',
          background: submitting || !rating
            ? 'var(--bg-card2)'
            : 'linear-gradient(135deg, #8d5524, #b87333)',
          color: submitting || !rating ? 'var(--fg-faint)' : '#fff',
          border: 'none', borderRadius: 14,
          fontFamily: "'Baloo 2',cursive",
          fontSize: 16, fontWeight: 900, cursor: submitting ? 'wait' : rating ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}
      >
        {submitting ? (
          <><i className="fas fa-spinner fa-spin" /> Submit ho raha hai...</>
        ) : (
          <><i className="fas fa-paper-plane" /> Review Submit Karo</>
        )}
      </button>
    </form>
  );
}