import { NextRequest, NextResponse } from 'next/server';
import { Review, ReviewStats } from '@/types/review';

// Mock data store - in production, use a real database
let reviews: Review[] = [
  // Sample reviews for testing
  {
    id: 'review-1',
    shopId: 'shop1',
    userId: 'user1',
    userName: 'Rahul Sharma',
    userImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    rating: 5,
    title: 'Amazing sweets!',
    body: 'Best jalebi in Meerut. The taste is authentic and the service is excellent.',
    tags: ['Fresh maal', 'Friendly staff', 'Best in Meerut'],
    helpful: 12,
    helpfulBy: ['user2', 'user3', 'user4'],
    verified: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    ownerReply: undefined,
  },
  {
    id: 'review-2',
    shopId: 'shop1',
    userId: 'user2',
    userName: 'Priya Singh',
    userImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    rating: 4,
    title: 'Good quality',
    body: 'Nice variety of sweets. A bit expensive but worth it.',
    tags: ['Fresh maal', 'Packaging acha'],
    helpful: 8,
    helpfulBy: ['user1', 'user3'],
    verified: false,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    ownerReply: {
      text: 'Thank you for your feedback! We strive to maintain quality.',
      repliedAt: '2024-01-11T09:00:00Z',
    },
  },
];

function calculateStats(shopId: string): ReviewStats {
  const shopReviews = reviews.filter(r => r.shopId === shopId);
  const totalReviews = shopReviews.length;

  if (totalReviews === 0) {
    return {
      shopId,
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      tagCounts: {},
    };
  }

  const totalRating = shopReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  shopReviews.forEach(r => {
    ratingBreakdown[r.rating as keyof typeof ratingBreakdown]++;
  });

  const tagCounts: Record<string, number> = {};
  shopReviews.forEach(r => {
    r.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return {
    shopId,
    totalReviews,
    averageRating,
    ratingBreakdown,
    tagCounts,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get('shopId');

  if (!shopId) {
    return NextResponse.json({ success: false, error: 'shopId required' }, { status: 400 });
  }

  const shopReviews = reviews.filter(r => r.shopId === shopId);
  const stats = calculateStats(shopId);

  return NextResponse.json({
    success: true,
    reviews: shopReviews,
    stats,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      shopId,
      userId,
      userName,
      userImg,
      rating,
      title,
      body: reviewBody,
      tags,
      verified = false,
    } = body;

    if (!shopId || !userId || !rating || !title || !reviewBody) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Remove existing review from this user for this shop
    reviews = reviews.filter(r => !(r.shopId === shopId && r.userId === userId));

    const newReview: Review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shopId,
      userId,
      userName,
      userImg,
      rating,
      title,
      body: reviewBody,
      tags: tags || [],
      helpful: 0,
      helpfulBy: [],
      verified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerReply: undefined,
    };

    reviews.unshift(newReview); // Add to beginning

    const stats = calculateStats(shopId);

    return NextResponse.json({
      success: true,
      review: newReview,
      stats,
    });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}