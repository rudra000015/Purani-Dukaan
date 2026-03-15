import fs from 'node:fs/promises';
import path from 'node:path';

export type PushType = 'new_product' | 'offer' | 'open_now' | 'general';

export type PushSubscriptionJson = {
  endpoint: string;
  expirationTime?: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
};

export type PushSubscriptionRecord = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
  shopIds: string[];
  types: PushType[];
  createdAt: string;
  updatedAt: string;
};

export type PushDb = {
  subscriptions: PushSubscriptionRecord[];
};

const DB_PATH = path.join(process.cwd(), 'data', 'pushSubscriptions.json');

async function ensureDbFile() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  try {
    const st = await fs.stat(DB_PATH);
    if (st.size === 0) {
      await fs.writeFile(DB_PATH, JSON.stringify({ subscriptions: [] }, null, 2), 'utf8');
    }
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify({ subscriptions: [] }, null, 2), 'utf8');
  }
}

export async function readPushDb(): Promise<PushDb> {
  await ensureDbFile();
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { subscriptions: [] };
    const subs = Array.isArray((parsed as any).subscriptions) ? (parsed as any).subscriptions : [];
    return { subscriptions: subs };
  } catch {
    return { subscriptions: [] };
  }
}

export async function writePushDb(db: PushDb): Promise<void> {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

export function upsertSubscription(
  db: PushDb,
  input: {
    subscription: PushSubscriptionJson;
    shopIds?: string[];
    types?: PushType[];
  }
): PushDb {
  const sub = input.subscription;
  if (!sub?.endpoint) return db;
  if (!sub.keys?.p256dh || !sub.keys?.auth) return db;

  const now = new Date().toISOString();
  const shopIds = (input.shopIds ?? []).filter(Boolean);
  const types = (input.types ?? ['general']).filter(Boolean) as PushType[];

  const idx = db.subscriptions.findIndex((s) => s.endpoint === sub.endpoint);
  const next: PushSubscriptionRecord = idx >= 0
    ? {
        ...db.subscriptions[idx],
        expirationTime: sub.expirationTime ?? null,
        keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        // If caller didn't send shopIds/types, keep existing values.
        shopIds: input.shopIds ? shopIds : db.subscriptions[idx].shopIds,
        types: input.types ? types : db.subscriptions[idx].types,
        updatedAt: now,
      }
    : {
        endpoint: sub.endpoint,
        expirationTime: sub.expirationTime ?? null,
        keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        shopIds,
        types,
        createdAt: now,
        updatedAt: now,
      };

  const subscriptions = idx >= 0
    ? db.subscriptions.map((s, i) => (i === idx ? next : s))
    : [...db.subscriptions, next];

  return { subscriptions };
}

export function deleteSubscription(db: PushDb, endpoint: string): PushDb {
  return { subscriptions: db.subscriptions.filter((s) => s.endpoint !== endpoint) };
}

