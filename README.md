# 🏺 Locara

> Locara is a hyperlocal discovery platform that helps users find nearby local shops in traditional markets. It enables customers to explore products, compare prices with online platforms, and shop instantly, while giving small shopkeepers a digital presence to attract more customers. By bridging the gap between offline markets and digital discovery, the platform promotes local businesses, saves money for users, and strengthens community-driven commerce.

🌐 **Live:** [locara-web.vercel.app](https://locara-web.vercel.app) &nbsp;·&nbsp;

---

## Features

- 🔍 **Shop Discovery** — Real shops from OpenStreetMap, filtered to your area
- 📸 **Visual Search** — Point camera at a product, AI finds matching local shops
- 🗺 **Live Map** — Interactive map with markers, photos, open/closed status
- 💰 **Price Comparison** — Compare local prices with online platforms instantly
- 🪔 **Festival Hub** — Diwali, Eid, Holi seasonal specials per shop
- ❤️ **Wishlist & Reviews** — Save products, rate shops, owner replies
- 🔔 **Push Notifications** — Follow shops, get notified on new offers
- 📊 **Owner Dashboard** — Analytics, product management, QR menus
- 🏪 **Shutter Intro** — Scroll up to pull a rope and open the market

---

## Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Zustand · Leaflet · Framer Motion · Anthropic Claude API · Web Push

---

## Quick Start

```bash
git clone https://github.com/Rudra-Chaudhary/locara.git
cd locara
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

### Required env vars

```env
ANTHROPIC_API_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com
NOTIFY_SECRET=
NEXT_PUBLIC_BASE_URL=https://locara-web.vercel.app
```

Generate VAPID keys: `npx web-push generate-vapid-keys`

---

