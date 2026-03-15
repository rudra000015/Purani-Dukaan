// src/lib/pushSubscriptions.ts
// Stores push subscriptions in data/pushSubscriptions.json
// Each user can subscribe to specific shops or all notifications

import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'pushSubscriptions.json');

export interface StoredSubscription {
  id: string;                   // unique ID (hash of endpoint)
  subscription: PushSubscriptionJSON;
  userId?: string;              // optional user identifier
  shopIds: string[];            // shops this user follows — empty = all shops
  types: NotificationType[];    // what types to receive
  createdAt: string;
  lastUsed?: string;
}

export type NotificationType =
  | 'new_product'    // shop adds a new product
  | 'offer'          // shop creates a limited offer
  | 'open_now'       // favourite shop just opened
  | 'general';       // any announcement

interface SubscriptionsStore {
  [id: string]: StoredSubscription;
}

// ── Read all ──────────────────────────────────────────────────
export async function getAllSubscriptions(): Promise<SubscriptionsStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// ── Get subscriptions for a specific shop ─────────────────────
export async function getSubscriptionsForShop(shopId: string): Promise<StoredSubscription[]> {
  const all = await getAllSubscriptions();
  return Object.values(all).filter(sub =>
    sub.shopIds.length === 0 || sub.shopIds.includes(shopId)
  );
}

// ── Get subscriptions by notification type ────────────────────
export async function getSubscriptionsByType(type: NotificationType): Promise<StoredSubscription[]> {
  const all = await getAllSubscriptions();
  return Object.values(all).filter(sub =>
    sub.types.includes(type) || sub.types.includes('general')
  );
}

// ── Save subscription ─────────────────────────────────────────
export async function saveSubscription(sub: StoredSubscription): Promise<void> {
  const all = await getAllSubscriptions();
  all[sub.id] = sub;
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

// ── Remove subscription ───────────────────────────────────────
export async function removeSubscription(id: string): Promise<void> {
  const all = await getAllSubscriptions();
  delete all[id];
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

// ── Update subscription's followed shops ─────────────────────
export async function updateFollowedShops(id: string, shopIds: string[]): Promise<void> {
  const all = await getAllSubscriptions();
  if (all[id]) {
    all[id].shopIds = shopIds;
    all[id].lastUsed = new Date().toISOString();
    await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
  }
}

// ── Generate subscription ID from endpoint ────────────────────
export function getSubscriptionId(endpoint: string): string {
  // Simple hash of the endpoint URL
  let hash = 0;
  for (let i = 0; i < endpoint.length; i++) {
    const char = endpoint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}