// src/types/review.ts

export interface Review {
  id: string;
  shopId: string;
  userId: string;        // user email or anonymous ID
  userName: string;
  userImg?: string;
  rating: number;        // 1–5
  title: string;
  body: string;
  tags: ReviewTag[];     // quick-pick tags
  photos?: string[];     // base64 or URLs (future)
  ownerReply?: {
    text: string;
    repliedAt: string;
  };
  helpful: number;       // upvotes
  helpfulBy: string[];   // userIds who upvoted
  verified: boolean;     // visited the shop
  createdAt: string;     // ISO
  updatedAt?: string;
}

export type ReviewTag =
  | 'Fresh maal'
  | 'Saste daam'
  | 'Friendly staff'
  | 'Quick service'
  | 'Best in Meerut'
  | 'Packaging acha'
  | 'Revisit karunga'
  | 'Thoda mehnga'
  | 'Late delivery';

export const REVIEW_TAGS: ReviewTag[] = [
  'Fresh maal',
  'Saste daam',
  'Friendly staff',
  'Quick service',
  'Best in Meerut',
  'Packaging acha',
  'Revisit karunga',
  'Thoda mehnga',
  'Late delivery',
];

export const POSITIVE_TAGS: ReviewTag[] = [
  'Fresh maal',
  'Saste daam',
  'Friendly staff',
  'Quick service',
  'Best in Meerut',
  'Packaging acha',
  'Revisit karunga',
];

export const NEGATIVE_TAGS: ReviewTag[] = [
  'Thoda mehnga',
  'Late delivery',
];

export interface ReviewStats {
  shopId: string;
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  tagCounts: Partial<Record<ReviewTag, number>>;
}

export interface ReviewsStore {
  [shopId: string]: Review[];
}