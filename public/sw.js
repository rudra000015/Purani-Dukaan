// public/sw.js
// Service Worker — handles push notification display and click actions
// Placed in /public so Next.js serves it at the root URL

const APP_NAME = 'Purani Dukan';
// Keep icons on existing assets to avoid 404s in dev preview.
const ICON_URL  = '/favicon.svg';
const BADGE_URL = '/favicon.svg';

// ── Push event ─────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: APP_NAME, body: event.data.text() };
  }

  const {
    title    = APP_NAME,
    body     = '',
    icon     = ICON_URL,
    badge    = BADGE_URL,
    tag      = 'default',
    url      = '/',
    shopId   = null,
    type     = 'general',   // 'new_product' | 'offer' | 'open_now' | 'general'
    data     = {},
  } = payload;

  // Action buttons vary by notification type
  const actions = type === 'offer'
    ? [{ action: 'view', title: 'View Offer' }, { action: 'dismiss', title: 'Dismiss' }]
    : type === 'new_product'
    ? [{ action: 'view', title: 'See Product' }, { action: 'save', title: 'Save Item' }]
    : [{ action: 'view', title: 'Open Shop' }];

  const options = {
    body,
    icon,
    badge,
    tag,
    renotify: true,
    requireInteraction: false,
    vibrate: [100, 50, 100],
    actions,
    data: { url, shopId, type, ...data },
    timestamp: Date.now(),
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ── Notification click ──────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const { action } = event;
  const { url, shopId } = event.notification.data || {};

  let targetUrl = url || '/';

  // Route based on action
  if (action === 'save') {
    targetUrl = shopId ? `/explorer?shop=${shopId}&save=true` : '/explorer';
  } else if (action === 'dismiss') {
    return; // just close
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'NAVIGATE', url: targetUrl });
          return;
        }
      }
      // Open new tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ── Notification close ──────────────────────────────────────
self.addEventListener('notificationclose', event => {
  // Analytics: track dismissed notifications
  console.log('[SW] Notification dismissed:', event.notification.tag);
});

// ── Background sync (optional) ──────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-subscriptions') {
    event.waitUntil(syncSubscriptions());
  }
});

async function syncSubscriptions() {
  // Re-register subscription if it was lost
  console.log('[SW] Syncing subscriptions...');
}

// ── Install + activate ──────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
