export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import {
  saveSubscription,
  removeSubscription,
  getSubscriptionId,
  StoredSubscription,
} from '@/lib/pushSubscriptions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, shopIds = [], types = ['general'], userId } = body;

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const id = getSubscriptionId(subscription.endpoint);

    const stored: StoredSubscription = {
      id,
      subscription,
      userId,
      shopIds,
      types: types.length ? types : ['general'],
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };

    await saveSubscription(stored);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error('[POST /api/subscribe]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: 'endpoint required' }, { status: 400 });
    }

    const id = getSubscriptionId(endpoint);
    await removeSubscription(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}