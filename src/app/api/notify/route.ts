import { NextRequest, NextResponse } from 'next/server';
import { readPushDb, writePushDb } from '@/lib/pushDb';

export const runtime = 'nodejs';

type NotifyPayload = {
  title: string;
  body: string;
  type?: 'new_product' | 'offer' | 'open_now' | 'general';
  url?: string;
  shopId?: string | null;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
};

function envSecret() {
  return (
    process.env.NOTIFY_SECRET ??
    process.env.NEXT_PUBLIC_NOTIFY_SECRET ??
    'purani-dukan-secret'
  );
}

export async function POST(req: NextRequest) {
  let webPush: any;
  try {
    // Avoid hard dependency at type-check time; `require` works fine in Next node runtime.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    webPush = require('web-push');
  } catch {
    return NextResponse.json(
      { success: false, error: 'Missing dependency: install web-push' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const secret = (body?.secret ?? '').toString();
    const shopId = (body?.shopId ?? '').toString();
    const payload = body?.payload as NotifyPayload | undefined;

    if (!payload?.title || !payload?.body) {
      return NextResponse.json({ success: false, error: 'Missing payload' }, { status: 400 });
    }

    if (secret !== envSecret()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const publicKey =
      process.env.VAPID_PUBLIC_KEY ??
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
      '';
    const privateKey = process.env.VAPID_PRIVATE_KEY ?? '';
    const subject = process.env.VAPID_SUBJECT ?? 'mailto:example@example.com';

    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { success: false, error: 'Missing VAPID keys in .env.local' },
        { status: 500 }
      );
    }

    webPush.setVapidDetails(subject, publicKey, privateKey);

    const db = await readPushDb();
    const targets = db.subscriptions.filter((s) => {
      if (shopId && shopId.length > 0) return (s.shopIds ?? []).includes(shopId);
      return true;
    });

    const toRemove: string[] = [];
    const results = await Promise.allSettled(
      targets.map(async (s) => {
        // Respect type preferences if stored.
        if (payload.type && s.types?.length && !s.types.includes(payload.type)) return 'skipped';

        const sub = {
          endpoint: s.endpoint,
          keys: s.keys,
          expirationTime: s.expirationTime ?? undefined,
        };

        try {
          await webPush.sendNotification(sub, JSON.stringify(payload));
          return 'sent';
        } catch (err: any) {
          const code = err?.statusCode ?? err?.status;
          if (code === 404 || code === 410) {
            toRemove.push(s.endpoint);
          }
          return 'failed';
        }
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value === 'sent').length;
    const failed = results.filter((r) => {
      if (r.status === 'rejected') return true;
      return r.value === 'failed';
    }).length;

    if (toRemove.length > 0) {
      const remaining = db.subscriptions.filter((s) => !toRemove.includes(s.endpoint));
      await writePushDb({ subscriptions: remaining });
    }

    return NextResponse.json(
      { success: true, sent, failed, totalTargets: targets.length },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[POST /api/notify]', err?.message ?? err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

