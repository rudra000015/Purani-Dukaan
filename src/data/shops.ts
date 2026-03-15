import type { Hours, LegacyBadge, Product, Review, Shop } from '@/types/shop';

export type { Hours, LegacyBadge, Product, Review, Shop } from '@/types/shop';

export function getLegacyBadge(age: number): LegacyBadge {
  if (age >= 100) return 'centennial';
  if (age >= 50) return 'heritage';
  if (age >= 25) return 'established';
  return 'rising';
}

export const BADGE_CONFIG: Record<
  LegacyBadge,
  { label: string; emoji: string; bg: string; text: string; border: string }
> = {
  centennial: { label: 'Centennial Legacy', emoji: '100y', bg: '#1a0f0a', text: '#d2b48c', border: '#b87333' },
  heritage: { label: 'Heritage Shop', emoji: 'H', bg: '#1c1505', text: '#fde68a', border: '#f59e0b' },
  established: { label: 'Established', emoji: 'E', bg: '#0a1a0f', text: '#6ee7b7', border: '#059669' },
  rising: { label: 'Rising Star', emoji: 'R', bg: '#0a0f1a', text: '#93c5fd', border: '#3b82f6' },
};

const SWEET_IMGS = [
  'https://images.unsplash.com/photo-1666448079979-6fdc715b8b28?w=900&q=80',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=900&q=80',
  'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=900&q=80',
];
const GROCERY_IMGS = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80',
  'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=900&q=80',
  'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=900&q=80',
];
const PHARMACY_IMGS = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&q=80',
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=900&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&q=80',
];

export function shopImages(cat: Shop['cat']): string[] {
  if (cat === 'sweets') return SWEET_IMGS;
  if (cat === 'grocery') return GROCERY_IMGS;
  if (cat === 'pharmacy') return PHARMACY_IMGS;
  return SWEET_IMGS;
}

export const DEFAULT_HOURS: Record<string, Hours> = {
  mon: { open: '09:00', close: '21:00', closed: false },
  tue: { open: '09:00', close: '21:00', closed: false },
  wed: { open: '09:00', close: '21:00', closed: false },
  thu: { open: '09:00', close: '21:00', closed: false },
  fri: { open: '09:00', close: '21:00', closed: false },
  sat: { open: '09:00', close: '22:00', closed: false },
  sun: { open: '10:00', close: '20:00', closed: false },
};

export function isOpenNow(hours: Record<string, Hours>): boolean {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const today = days[new Date().getDay()];
  const h = hours[today];
  if (!h || h.closed) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = h.open.split(':').map(Number);
  const [ch, cm] = h.close.split(':').map(Number);
  return cur >= oh * 60 + om && cur <= ch * 60 + cm;
}

export function todayHours(hours: Record<string, Hours>): string {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const today = days[new Date().getDay()];
  const h = hours[today];
  if (!h || h.closed) return 'Closed today';
  return `${h.open} - ${h.close}`;
}

export function gmapsUrl(loc: [number, number], name: string): string {
  const dest = `${loc[0]},${loc[1]}`;
  const label = encodeURIComponent(name);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&destination_place_id=${label}&travelmode=driving`;
}

export function whatsappUrl(phone: string, shopName: string): string {
  const msg = encodeURIComponent(
    `Hi! I found ${shopName} on Purani Dukan app. I'd like to enquire about your products.`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}

function makeShop(base: Omit<Shop, 'badge' | 'images' | 'hours' | 'reviews' | 'totalRatings'>): Shop {
  return {
    ...base,
    totalRatings: 0,
    badge: getLegacyBadge(base.age),
    images: shopImages(base.cat),
    hours: DEFAULT_HOURS,
    reviews: [],
  };
}

// Static fallback data used by UI and by API fallback when Overpass fails.
export const SHOPS: Shop[] = [
  makeShop({
    id: 'hira',
    placeId: 'hira',
    name: 'Hira Sweets',
    est: 1912,
    age: 113,
    cat: 'sweets',
    owner: 'Hira Family (4th Gen)',
    ownerImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hira',
    whatsapp: '919837000001',
    story:
      'Serving Meerut since 1912 for four generations. 100+ varieties of sweets and savouries with traditional recipes.',
    addr: 'Main Road, Opp Manoranjan Park, Saket, Meerut',
    loc: [28.9845, 77.7064],
    rating: 4.8,
    products: [
      { id: 'hs1', name: 'Desi Ghee Jalebi', price: 180, unit: 'kg', inStock: true, isNew: true },
      { id: 'hs2', name: 'Soan Papdi Special', price: 350, unit: 'kg', inStock: true, isNew: false, discountPct: 10 },
      { id: 'hs3', name: 'Kaju Katli Premium', price: 800, unit: 'kg', inStock: true, isNew: true },
      { id: 'hs4', name: 'Gulab Jamun', price: 400, unit: 'kg', inStock: true, isNew: false },
      { id: 'hs5', name: 'Rasgulla Fresh', price: 350, unit: 'kg', inStock: true, isNew: true, discountPct: 15 },
      { id: 'hs6', name: 'Besan Laddu', price: 380, unit: 'kg', inStock: true, isNew: false },
    ],
  }),
  makeShop({
    id: 'rohtash',
    placeId: 'rohtash',
    name: 'Rohtash Halwai',
    est: 1965,
    age: 60,
    cat: 'sweets',
    owner: 'Rohtash Family',
    ownerImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohtash',
    whatsapp: '919837000002',
    story: 'Pure desi ghee sweets at reasonable prices. Authentic recipes passed through generations.',
    addr: 'Jain Nagar, Meerut',
    loc: [28.98, 77.7],
    rating: 4.7,
    products: [
      { id: 'rh1', name: 'Rasamalai', price: 450, unit: 'kg', inStock: true, isNew: true },
      { id: 'rh2', name: 'Dry Fruit Mithai', price: 650, unit: 'kg', inStock: true, isNew: true, discountPct: 20 },
      { id: 'rh3', name: 'Barfi Assorted', price: 380, unit: 'kg', inStock: true, isNew: false },
    ],
  }),
  makeShop({
    id: 'dubai',
    placeId: 'dubai',
    name: 'Dubai Stores',
    est: 1980,
    age: 45,
    cat: 'grocery',
    owner: 'Dubai Family',
    ownerImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dubai',
    whatsapp: '919837000004',
    story: "Chapel Street's trusted grocery destination. Quality products and honest pricing for 45 years.",
    addr: '284 Chapel St, Meerut Cantt, Sadar Bazaar',
    loc: [28.983, 77.705],
    rating: 4.2,
    products: [
      { id: 'ds1', name: 'Aashirvaad Atta 5kg', price: 215, unit: 'pack', inStock: true, isNew: false },
      { id: 'ds2', name: 'Tata Salt 1kg', price: 28, unit: 'pack', inStock: true, isNew: false, discountPct: 5 },
    ],
  }),
  makeShop({
    id: 'natmed',
    placeId: 'natmed',
    name: 'National Medical Hall',
    est: 1960,
    age: 65,
    cat: 'pharmacy',
    owner: 'Dr. RK Sharma',
    ownerImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RK',
    whatsapp: '919837000005',
    story: 'The oldest pharmacy near Begum Bridge. Trusted by families for 65 years. Authentic medicines guaranteed.',
    addr: 'Begum Bridge Road, Meerut',
    loc: [28.981, 77.699],
    rating: 4.6,
    products: [{ id: 'nm1', name: 'Dolo 650', price: 32, unit: 'strip', inStock: true, isNew: false }],
  }),
];
