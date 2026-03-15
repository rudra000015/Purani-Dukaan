import { NextRequest, NextResponse } from 'next/server';
import { deleteSubscription, readPushDb, upsertSubscription, writePushDb } from '@/lib/pushDb';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await readPushDb();
    const next = upsertSubscription(db, {
      subscription: body.subscription,
      shopIds: body.shopIds,
      types: body.types,
    });
    await writePushDb(next);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('[POST /api/push/subscribe]', err?.message ?? err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const endpoint = (body?.endpoint ?? '').toString();
    if (!endpoint) return NextResponse.json({ success: false }, { status: 400 });

    const db = await readPushDb();
    const next = deleteSubscription(db, endpoint);
    await writePushDb(next);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('[DELETE /api/push/subscribe]', err?.message ?? err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

