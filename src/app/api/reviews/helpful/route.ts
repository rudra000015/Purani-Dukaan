import { NextRequest, NextResponse } from 'next/server';

// Import the reviews array from the main route
// In a real app, this would be from a database
const reviews = require('../route').reviews;

export async function POST(req: NextRequest) {
  try {
    const { shopId, reviewId, userId } = await req.json();

    if (!shopId || !reviewId || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const review = reviews.find((r: any) => r.id === reviewId && r.shopId === shopId);
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    const alreadyHelpful = review.helpfulBy.includes(userId);
    if (alreadyHelpful) {
      review.helpful -= 1;
      review.helpfulBy = review.helpfulBy.filter((id: string) => id !== userId);
    } else {
      review.helpful += 1;
      review.helpfulBy.push(userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Helpful toggle error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}