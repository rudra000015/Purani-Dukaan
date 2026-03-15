// src/lib/reviews.ts
// Reads/writes reviews to data/reviews.json

import { promises as fs } from 'fs';
import path from 'path';
import { Review, ReviewStats, ReviewsStore } from '@/types/review';

const DATA_FILE = path.join(process.cwd(), 'data', 'reviews.json');

// ── Read all ──────────────────────────────────────────────────
export async function getAllReviews(): Promise<ReviewsStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// ── Get reviews for one shop ──────────────────────────────────
export async function getShopReviews(shopId: string): Promise<Review[]> {
  const all = await getAllReviews();
  return (all[shopId] ?? []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ── Save a new review ─────────────────────────────────────────
export async function saveReview(review: Review): Promise<void> {
  const all = await getAllReviews();
  if (!all[review.shopId]) all[review.shopId] = [];

  // Prevent duplicate by same user for same shop
  all[review.shopId] = all[review.shopId].filter(r => r.userId !== review.userId);
  all[review.shopId].unshift(review);

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

// ── Update owner reply ────────────────────────────────────────
export async function saveOwnerReply(
  shopId: string,
  reviewId: string,
  text: string
): Promise<void> {
  const all = await getAllReviews();
  const shop = all[shopId] ?? [];
  const idx = shop.findIndex(r => r.id === reviewId);
  if (idx === -1) return;
  shop[idx].ownerReply = { text, repliedAt: new Date().toISOString() };
  all[shopId] = shop;
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

// ── Mark helpful ──────────────────────────────────────────────
export async function markHelpful(
  shopId: string,
  reviewId: string,
  userId: string
): Promise<void> {
  const all = await getAllReviews();
  const shop = all[shopId] ?? [];
  const idx = shop.findIndex(r => r.id === reviewId);
  if (idx === -1) return;
  const review = shop[idx];
  if (review.helpfulBy.includes(userId)) {
    review.helpfulBy = review.helpfulBy.filter(id => id !== userId);
    review.helpful   = Math.max(0, review.helpful - 1);
  } else {
    review.helpfulBy.push(userId);
    review.helpful += 1;
  }
  all[shopId] = shop;
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

// ── Delete a review ───────────────────────────────────────────
export async function deleteReview(shopId: string, reviewId: string): Promise<void> {
  const all = await getAllReviews();
  all[shopId] = (all[shopId] ?? []).filter(r => r.id !== reviewId);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

// ── Compute stats ─────────────────────────────────────────────
export function computeStats(shopId: string, reviews: Review[]): ReviewStats {
  const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const tagCounts: Partial<Record<string, number>> = {};

  let total = 0;
  for (const r of reviews) {
    breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1;
    total += r.rating;
    for (const tag of r.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  return {
    shopId,
    totalReviews:    reviews.length,
    averageRating:   reviews.length ? +(total / reviews.length).toFixed(1) : 0,
    ratingBreakdown: breakdown as Record<1 | 2 | 3 | 4 | 5, number>,
    tagCounts: tagCounts as Partial<Record<any, number>>,
  };
}