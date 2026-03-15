import { NextRequest, NextResponse } from 'next/server';

// Import the reviews array from the main route
// In a real app, this would be from a database
const reviews = require('../route').reviews;

export async function POST(req: NextRequest) {
  try {
    const { shopId, reviewId, text, secret } = await req.json();

    // Basic auth check - in production, use proper authentication
    if (secret !== process.env.NEXT_PUBLIC_NOTIFY_SECRET && secret !== 'purani-dukan-secret') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!shopId || !reviewId || !text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const review = reviews.find((r: any) => r.id === reviewId && r.shopId === shopId);
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    review.ownerReply = {
      text,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Owner reply error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}