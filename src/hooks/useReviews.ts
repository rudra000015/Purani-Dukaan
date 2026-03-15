// src/hooks/useReviews.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Review, ReviewStats } from '@/types/review';
import { useStore } from '@/store/useStore';

interface UseReviewsReturn {
  reviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  submitting: boolean;
  userReview: Review | null;
  fetchReviews: () => Promise<void>;
  submitReview: (data: SubmitData) => Promise<boolean>;
  toggleHelpful: (reviewId: string) => Promise<void>;
}

interface SubmitData {
  rating: number;
  title: string;
  body: string;
  tags: string[];
}

const DEFAULT_STATS: ReviewStats = {
  shopId: '',
  totalReviews: 0,
  averageRating: 0,
  ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  tagCounts: {},
};

export function useReviews(shopId: string): UseReviewsReturn {
  const { user } = useStore();

  const [reviews,    setReviews]    = useState<Review[]>([]);
  const [stats,      setStats]      = useState<ReviewStats | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userId    = user?.email ?? user?.name ?? 'anon';
  const userName  = user?.name ?? 'Explorer';
  const userImg   = user?.img;
  const userReview = reviews.find(r => r.userId === userId) ?? null;

  // ── Fetch ───────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/reviews?shopId=${shopId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch (e) {
      console.error('[useReviews] fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // ── Submit ──────────────────────────────────────────────
  const submitReview = useCallback(async (data: SubmitData): Promise<boolean> => {
    if (!shopId) return false;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId,
          userId,
          userName,
          userImg,
          ...data,
          verified: false,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReviews(prev => {
          const filtered = prev.filter(r => r.userId !== userId);
          return [json.review, ...filtered];
        });
        setStats(json.stats);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[useReviews] submit failed:', e);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [shopId, userId, userName, userImg]);

  // ── Helpful toggle ──────────────────────────────────────
  const toggleHelpful = useCallback(async (reviewId: string) => {
    if (!userId) return;
    // Optimistic update
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      const alreadyHelpful = r.helpfulBy.includes(userId);
      return {
        ...r,
        helpful:   alreadyHelpful ? r.helpful - 1 : r.helpful + 1,
        helpfulBy: alreadyHelpful
          ? r.helpfulBy.filter(id => id !== userId)
          : [...r.helpfulBy, userId],
      };
    }));
    // Sync with server
    await fetch('/api/reviews/helpful', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId, reviewId, userId }),
    });
  }, [shopId, userId]);

  return { reviews, stats, loading, submitting, userReview, fetchReviews, submitReview, toggleHelpful };
}