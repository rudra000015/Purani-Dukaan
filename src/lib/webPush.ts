// src/lib/webPush.ts
// Server-side push notification sender
// Uses the Web Push Protocol directly without the web-push npm package
// (avoids dependency issues — pure Node.js crypto)

import crypto from 'crypto';
import { StoredSubscription, removeSubscription } from './pushSubscriptions';

const VAPID_PUBLIC_KEY  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT     = process.env.VAPID_SUBJECT || 'mailto:admin@puranidukan.com';

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  shopId?: string;
  type?: 'new_product' | 'offer' | 'open_now' | 'general';
  data?: Record<string, any>;
}

// ── Send to one subscription ──────────────────────────────────
export async function sendPushNotification(
  subscription: StoredSubscription,
  payload: PushPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const sub = subscription.subscription;
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return { success: false, error: 'Invalid subscription' };
    }

    const body = JSON.stringify({
      title:  payload.title,
      body:   payload.body,
      icon:   payload.icon  || '/icons/icon-192x192.png',
      badge:  payload.badge || '/icons/badge-72x72.png',
      tag:    payload.tag   || 'purani-dukan',
      url:    payload.url   || '/',
      shopId: payload.shopId,
      type:   payload.type  || 'general',
      data:   payload.data  || {},
    });

    // Build VAPID auth header
    const vapidHeaders = await buildVapidHeaders(sub.endpoint, body);

    const response = await fetch(sub.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400',
        ...vapidHeaders,
      },
      body: await encryptPayload(body, sub.keys.p256dh, sub.keys.auth),
    });

    // 410 Gone = subscription expired, remove it
    if (response.status === 410 || response.status === 404) {
      await removeSubscription(subscription.id);
      return { success: false, error: 'Subscription expired — removed' };
    }

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Send to multiple subscriptions ───────────────────────────
export async function sendToMany(
  subscriptions: StoredSubscription[],
  payload: PushPayload
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = await Promise.allSettled(
    subscriptions.map(sub => sendPushNotification(sub, payload))
  );

  let sent = 0, failed = 0;
  const errors: string[] = [];

  results.forEach(r => {
    if (r.status === 'fulfilled' && r.value.success) {
      sent++;
    } else {
      failed++;
      const err = r.status === 'rejected' ? r.reason : r.value.error;
      if (err) errors.push(err);
    }
  });

  return { sent, failed, errors };
}

// ── VAPID header builder ──────────────────────────────────────
async function buildVapidHeaders(endpoint: string, body: string): Promise<Record<string, string>> {
  const origin = new URL(endpoint).origin;
  const expiration = Math.floor(Date.now() / 1000) + 12 * 60 * 60; // 12h

  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const payload = btoa(JSON.stringify({
    aud: origin,
    exp: expiration,
    sub: VAPID_SUBJECT,
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const sigInput = `${header}.${payload}`;

  // Sign with private key
  const privateKeyBuffer = base64UrlToBuffer(VAPID_PRIVATE_KEY);
  const key = await crypto.subtle.importKey(
    'raw',
    privateKeyBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(sigInput)
  );

  const sigBase64 = bufferToBase64Url(new Uint8Array(signature));
  const token = `${sigInput}.${sigBase64}`;

  return {
    'Authorization': `vapid t=${token},k=${VAPID_PUBLIC_KEY}`,
  };
}

// ── Payload encryption (RFC 8291) ─────────────────────────────
async function encryptPayload(
  plaintext: string,
  p256dhBase64: string,
  authBase64: string
): Promise<ArrayBuffer> {
  const encoder     = new TextEncoder();
  const plaintextBuf = encoder.encode(plaintext);

  const p256dh = base64UrlToBuffer(p256dhBase64);
  const auth   = base64UrlToBuffer(authBase64);

  // Generate sender key pair
  const senderKeys = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );

  // Import receiver public key
  const receiverKey = await crypto.subtle.importKey(
    'raw', p256dh,
    { name: 'ECDH', namedCurve: 'P-256' },
    false, []
  );

  // ECDH shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: receiverKey },
    senderKeys.privateKey,
    256
  );

  // Salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF
  const prk = await hkdf(
    new Uint8Array(sharedSecret),
    auth,
    encoder.encode('Content-Encoding: auth\0'),
    32
  );

  const senderPublicKey = await crypto.subtle.exportKey('raw', senderKeys.publicKey);

  const context = buildContext(p256dh, new Uint8Array(senderPublicKey));

  const cek = await hkdf(prk, salt, buildInfo('aesgcm', context), 16);
  const nonce = await hkdf(prk, salt, buildInfo('nonce', context), 12);

  // Encrypt
  const key = await crypto.subtle.importKey(
    'raw', cek, { name: 'AES-GCM' }, false, ['encrypt']
  );

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 },
    key,
    plaintextBuf
  );

  // Build output: salt (16) + length (4) + key size (1) + sender key + ciphertext
  const senderKeyBuf = new Uint8Array(senderPublicKey);
  const output = new Uint8Array(16 + 4 + 1 + senderKeyBuf.length + ciphertext.byteLength);
  let offset = 0;
  output.set(salt, offset);               offset += 16;
  new DataView(output.buffer).setUint32(offset, 4096, false); offset += 4;
  output[offset] = senderKeyBuf.length;   offset += 1;
  output.set(senderKeyBuf, offset);       offset += senderKeyBuf.length;
  output.set(new Uint8Array(ciphertext), offset);

  return output.buffer;
}

// ── HKDF helper ───────────────────────────────────────────────
async function hkdf(
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  length: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    key,
    length * 8
  );
  return new Uint8Array(bits);
}

function buildContext(receiverKey: Uint8Array, senderKey: Uint8Array): Uint8Array {
  const ctx = new Uint8Array(1 + 2 + receiverKey.length + 2 + senderKey.length);
  let offset = 0;
  ctx[offset++] = 0; // type = 0x00
  new DataView(ctx.buffer).setUint16(offset, receiverKey.length, false); offset += 2;
  ctx.set(receiverKey, offset); offset += receiverKey.length;
  new DataView(ctx.buffer).setUint16(offset, senderKey.length, false); offset += 2;
  ctx.set(senderKey, offset);
  return ctx;
}

function buildInfo(type: string, context: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const typeBytes = encoder.encode(`Content-Encoding: ${type}\0P-256\0`);
  const info = new Uint8Array(typeBytes.length + context.length);
  info.set(typeBytes, 0);
  info.set(context, typeBytes.length);
  return info;
}

// ── Base64url helpers ─────────────────────────────────────────
function base64UrlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bufferToBase64Url(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64.replace(/\+/g, '-').replace(/\//g, '/').replace(/=/g, '');
}