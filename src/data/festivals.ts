// src/data/festivals.ts
// Complete festival configuration for Diwali, Eid, and Holi

export interface FestivalOffer {
  id: string;
  shopId: string;
  shopName: string;
  shopAddr: string;
  shopPhone: string;
  shopRating: number;
  shopAge: number;
  photo?: string;
  discount: number;         // percentage
  offerText: string;        // e.g. "50% off on all mithai"
  offerDetail: string;      // longer description
  badge?: string;           // "Best Deal" | "Limited" | "Exclusive"
  maxQuantity?: string;     // "Only 50 kg available"
  category: string;
}

export interface Festival {
  id: string;
  slug: string;             // URL: /festival/diwali
  name: string;
  nameHindi: string;
  emoji: string;
  tagline: string;
  taglineHindi: string;
  description: string;

  // Dates
  date: string;             // ISO date of festival
  offerStartDate: string;   // When offers begin
  offerEndDate: string;     // When offers expire

  // Visual theme
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    bgDark: string;
    particle: string;       // CSS color for floating particles
  };

  // Particle config
  particles: {
    symbols: string[];
    count: number;
  };

  // Curated shops
  offers: FestivalOffer[];

  // WhatsApp share message template
  shareMessage: string;

  // SEO
  metaTitle: string;
  metaDesc: string;
}

// ── Compute next occurrence of a festival ──────────────────
function nextOccurrence(month: number, day: number): string {
  const now = new Date();
  const year = now.getMonth() + 1 > month ||
    (now.getMonth() + 1 === month && now.getDate() > day)
    ? now.getFullYear() + 1
    : now.getFullYear();
  return new Date(year, month - 1, day).toISOString();
}

export const FESTIVALS: Festival[] = [

  // ── DIWALI ──────────────────────────────────────────────
  {
    id: 'diwali',
    slug: 'diwali',
    name: 'Diwali',
    nameHindi: 'दीवाली',
    emoji: '🪔',
    tagline: 'Light up Meerut with Heritage Sweets',
    taglineHindi: 'Roshan karo Meerut ko — asli mithai ke saath',
    description: 'Diwali ki mithai sirf dukan se milti hai, packet se nahi. Meerut ke sabse purane shops se order karo aur ghar ki Diwali ko khaas banao.',

    date: nextOccurrence(11, 1),           // ~Nov 1 (varies yearly)
    offerStartDate: nextOccurrence(10, 20),
    offerEndDate: nextOccurrence(11, 5),

    theme: {
      primary:   '#c8813a',
      secondary: '#8d5524',
      accent:    '#fbbf24',
      bg:        'linear-gradient(160deg, #1a0a00 0%, #3d1c02 40%, #6b3210 70%, #c8813a 100%)',
      bgDark:    'linear-gradient(160deg, #0a0500 0%, #1a0a00 100%)',
      particle:  '#fbbf24',
    },

    particles: {
      symbols: ['🪔', '✨', '🌟', '💫', '🎆', '🎇'],
      count: 20,
    },

    offers: [
      {
        id: 'd1',
        shopId: 'hira-sweets',
        shopName: 'Hira Sweets',
        shopAddr: 'Abu Lane, Meerut',
        shopPhone: '9897xxxxxx',
        shopRating: 4.8,
        shopAge: 75,
        discount: 20,
        offerText: '20% off on all Diwali gift boxes',
        offerDetail: 'Kaju katli, besan ladoo, motichoor ladoo, soan papdi — sab Diwali gift packs mein available. 500g se 5kg tak.',
        badge: 'Best Deal',
        category: 'sweets',
        photo: '',
      },
      {
        id: 'd2',
        shopId: 'rc-sahai',
        shopName: 'RC Sahai & Sons',
        shopAddr: 'Sadar Bazaar, Meerut',
        shopPhone: '9876xxxxxx',
        shopRating: 4.9,
        shopAge: 110,
        discount: 15,
        offerText: '15% off on Gajak + Revdi combo',
        offerDetail: 'Diwali aur Gajak ka saath purana hai. RC Sahai ka mashoor til gajak aur revdi ka combo pack sirf is mauke par.',
        badge: 'Exclusive',
        maxQuantity: 'Sirf 200 packs',
        category: 'sweets',
        photo: '',
      },
      {
        id: 'd3',
        shopId: 'ram-asrey',
        shopName: 'Ram Asrey Mithai',
        shopAddr: 'Hapur Road, Meerut',
        shopPhone: '9812xxxxxx',
        shopRating: 4.7,
        shopAge: 60,
        discount: 25,
        offerText: '25% off on dry fruit mithai boxes',
        offerDetail: 'Kaju rolls, anjeer barfi, pista barfi — premium dry fruit mithaiyan Diwali gifting ke liye best choice.',
        badge: 'Limited',
        category: 'sweets',
        photo: '',
      },
      {
        id: 'd4',
        shopId: 'puja-bhandar',
        shopName: 'Shri Puja Bhandar',
        shopAddr: 'Shivaji Nagar, Meerut',
        shopPhone: '9834xxxxxx',
        shopRating: 4.5,
        shopAge: 40,
        discount: 10,
        offerText: '10% off on puja samagri sets',
        offerDetail: 'Complete Diwali puja kit — diyas, roli, chawal, dhoop, camphor, flowers, all in one box.',
        category: 'puja',
        photo: '',
      },
      {
        id: 'd5',
        shopId: 'delhi-dry-fruits',
        shopName: 'Delhi Dry Fruits Corner',
        shopAddr: 'Begum Bridge, Meerut',
        shopPhone: '9856xxxxxx',
        shopRating: 4.6,
        shopAge: 35,
        discount: 18,
        offerText: '18% off on premium dry fruit packs',
        offerDetail: 'Almonds, cashews, pistachios, raisins — premium quality gifting packs from ₹299 to ₹2499.',
        badge: 'Best Deal',
        category: 'dry-fruits',
        photo: '',
      },
      {
        id: 'd6',
        shopId: 'arora-bakery',
        shopName: 'Arora Bakery',
        shopAddr: 'Civil Lines, Meerut',
        shopPhone: '9878xxxxxx',
        shopRating: 4.4,
        shopAge: 28,
        discount: 30,
        offerText: '30% off on all Diwali cakes + cookies',
        offerDetail: 'Custom Diwali cakes with diya designs, assorted cookie boxes, and chocolate gift hampers.',
        badge: 'Best Deal',
        category: 'bakery',
        photo: '',
      },
    ],

    shareMessage: `🪔 *Diwali Mubarak!* 🪔\n\nMeerut ke purane shops pe bade offers hain is Diwali!\n\nHira Sweets — 20% off gift boxes\nRC Sahai — Gajak + Revdi combo\naur bhi bahut kuch...\n\nDekhna: {URL}\n\n✨ Asli mithai, purani shops, naya josh! ✨`,

    metaTitle: 'Diwali Special — Meerut Heritage Shops | Purani Dukan',
    metaDesc: 'Diwali ke liye best sweets, puja samagri, aur gift boxes — Meerut ke 50+ year purane shops se. Up to 30% off.',
  },

  // ── EID ─────────────────────────────────────────────────
  {
    id: 'eid',
    slug: 'eid',
    name: 'Eid',
    nameHindi: 'ईद',
    emoji: '🌙',
    tagline: 'Mubarak ho — Meerut ki best sewaiyan',
    taglineHindi: 'Eid ki khushiyaan — ghar ghar tak',
    description: 'Eid mubarak! Is khaas mauke par Meerut ke mashoor shops se sewaiyan, sheer khurma, biryani masala aur meethe gifts mangwaiye ghar par.',

    date: nextOccurrence(4, 10),           // ~Eid al-Fitr (varies)
    offerStartDate: nextOccurrence(4, 1),
    offerEndDate: nextOccurrence(4, 15),

    theme: {
      primary:   '#1a6b3c',
      secondary: '#0f4d2d',
      accent:    '#d4af37',
      bg:        'linear-gradient(160deg, #030d07 0%, #0a2b15 40%, #1a5c32 70%, #2d9955 100%)',
      bgDark:    'linear-gradient(160deg, #010804 0%, #030d07 100%)',
      particle:  '#d4af37',
    },

    particles: {
      symbols: ['🌙', '⭐', '✨', '🕌', '🌟', '💫'],
      count: 18,
    },

    offers: [
      {
        id: 'e1',
        shopId: 'ansari-sweets',
        shopName: 'Ansari Sewaiyan',
        shopAddr: 'Hapur Road, Meerut',
        shopPhone: '9899xxxxxx',
        shopRating: 4.9,
        shopAge: 85,
        discount: 20,
        offerText: '20% off on handmade sewaiyan',
        offerDetail: 'Meerut ki mashoor sewaiyan — meethi, namkeen, dry. Ghar pe banaye style mein, 3 generations se. Eid special packaging available.',
        badge: 'Exclusive',
        maxQuantity: 'Limited stock',
        category: 'sweets',
        photo: '',
      },
      {
        id: 'e2',
        shopId: 'meerut-sheer',
        shopName: 'Sharma Dairy Farm',
        shopAddr: 'Abu Lane, Meerut',
        shopPhone: '9812xxxxxx',
        shopRating: 4.7,
        shopAge: 45,
        discount: 15,
        offerText: '15% off on sheer khurma ingredients',
        offerDetail: 'Fresh khoya, malai, dates, vermicelli — all Sheer Khurma essentials at discounted prices. Ghar pe banao, mahol banana do.',
        badge: 'Best Deal',
        category: 'dairy',
        photo: '',
      },
      {
        id: 'e3',
        shopId: 'spice-world',
        shopName: 'Meerut Spice World',
        shopAddr: 'Sadar, Meerut',
        shopPhone: '9876xxxxxx',
        shopRating: 4.6,
        shopAge: 30,
        discount: 12,
        offerText: '12% off on biryani masala packs',
        offerDetail: 'Secret blend biryani masala jo sirf Meerut mein milti hai. Eid ki biryani is masale ke bina adhoori. Available in 100g, 250g, 500g.',
        category: 'spices',
        photo: '',
      },
      {
        id: 'e4',
        shopId: 'moonlight-bakery',
        shopName: 'Moonlight Bakery',
        shopAddr: 'Civil Lines, Meerut',
        shopPhone: '9834xxxxxx',
        shopRating: 4.5,
        shopAge: 22,
        discount: 25,
        offerText: '25% off on Eid special pastries',
        offerDetail: 'Khajoor cakes, baklava, sheer mal — special Eid collection. Custom gift boxes available with your name printed.',
        badge: 'Limited',
        category: 'bakery',
        photo: '',
      },
      {
        id: 'e5',
        shopId: 'itr-corner',
        shopName: 'Itr Corner',
        shopAddr: 'Begum Bridge, Meerut',
        shopPhone: '9856xxxxxx',
        shopRating: 4.8,
        shopAge: 55,
        discount: 30,
        offerText: '30% off on Eid ittar collection',
        offerDetail: 'Rose, Oud, Musk, Kewra — original ittar for Eid namaz aur mubarak. Pure non-alcoholic, 5ml to 50ml bottles.',
        badge: 'Exclusive',
        category: 'puja',
        photo: '',
      },
    ],

    shareMessage: `🌙 *Eid Mubarak!* 🌙\n\nMeerut ke heritage shops pe Eid ke khaas offers:\n\nAnsari Sewaiyan — 20% off handmade sewaiyan\nMoonlight Bakery — 25% off Eid pastries\naur bhi bahut kuch...\n\nDekhna: {URL}\n\n⭐ Khushiyan baanto, Meerut ke saath! ⭐`,

    metaTitle: 'Eid Special — Meerut Heritage Shops | Purani Dukan',
    metaDesc: 'Eid ke liye handmade sewaiyan, sheer khurma ingredients, biryani masala aur meethe gifts — Meerut ke purane shops se.',
  },

  // ── HOLI ────────────────────────────────────────────────
  {
    id: 'holi',
    slug: 'holi',
    name: 'Holi',
    nameHindi: 'होली',
    emoji: '🎨',
    tagline: 'Rang baro Meerut ka swaad',
    taglineHindi: 'Holi hai — rang bhi, thandai bhi!',
    description: 'Holi ke rang aur Meerut ki thandai — yeh combo unbeatable hai. Is Holi par heritage shops se thandai masala, gujiya, namkeen aur natural rang le aao.',

    date: nextOccurrence(3, 14),
    offerStartDate: nextOccurrence(3, 8),
    offerEndDate: nextOccurrence(3, 16),

    theme: {
      primary:   '#d63b8f',
      secondary: '#8b2566',
      accent:    '#ffd700',
      bg:        'linear-gradient(160deg, #1a0010 0%, #420033 30%, #7a0055 60%, #d63b8f 100%)',
      bgDark:    'linear-gradient(160deg, #0a0007 0%, #1a0010 100%)',
      particle:  '#ff69b4',
    },

    particles: {
      symbols: ['🎨', '🌈', '🎭', '💐', '🌸', '✨'],
      count: 22,
    },

    offers: [
      {
        id: 'h1',
        shopId: 'thandai-wale',
        shopName: 'Shri Thandai Bhandar',
        shopAddr: 'Hapur Road, Meerut',
        shopPhone: '9897xxxxxx',
        shopRating: 4.9,
        shopAge: 90,
        discount: 20,
        offerText: '20% off on thandai masala + dry fruits',
        offerDetail: 'Meerut ki sabse purani thandai shop. Rose petals, fennel, pepper, cardamom ka perfect blend. Fresh dry fruits ke saath combo packs available.',
        badge: 'Best Deal',
        maxQuantity: 'Sirf Holi tak',
        category: 'spices',
        photo: '',
      },
      {
        id: 'h2',
        shopId: 'gujiya-king',
        shopName: 'Gujiya King',
        shopAddr: 'Sadar, Meerut',
        shopPhone: '9812xxxxxx',
        shopRating: 4.7,
        shopAge: 50,
        discount: 30,
        offerText: '30% off on fresh gujiya — 5 varieties',
        offerDetail: 'Mawa gujiya, dry fruit gujiya, chocolate gujiya, suji gujiya, baked gujiya — sab ek hi jagah. Pre-order kar lena kyunki stock jaldi khatam hota hai.',
        badge: 'Exclusive',
        maxQuantity: 'Pre-order required',
        category: 'sweets',
        photo: '',
      },
      {
        id: 'h3',
        shopId: 'natural-rang',
        shopName: 'Prakriti Natural Colors',
        shopAddr: 'Civil Lines, Meerut',
        shopPhone: '9876xxxxxx',
        shopRating: 4.6,
        shopAge: 15,
        discount: 25,
        offerText: '25% off on natural herbal Holi colors',
        offerDetail: 'Skin-safe, eco-friendly rang — turmeric yellow, rose pink, indigo blue, palash orange. Bachchon ke liye bilkul safe. 100g, 250g, 500g packs.',
        badge: 'Best Deal',
        category: 'puja',
        photo: '',
      },
      {
        id: 'h4',
        shopId: 'namkeen-palace',
        shopName: 'Namkeen Palace',
        shopAddr: 'Abu Lane, Meerut',
        shopPhone: '9834xxxxxx',
        shopRating: 4.5,
        shopAge: 38,
        discount: 15,
        offerText: '15% off on Holi special namkeen',
        offerDetail: 'Papdi, sev, mathri, shakarpara — Holi party ke liye perfect. Family pack mein available. Free delivery on orders above ₹499.',
        category: 'namkeen',
        photo: '',
      },
      {
        id: 'h5',
        shopId: 'milk-dairy',
        shopName: 'Goyal Milk Center',
        shopAddr: 'Begum Bridge, Meerut',
        shopPhone: '9856xxxxxx',
        shopRating: 4.8,
        shopAge: 42,
        discount: 10,
        offerText: '10% off on special thandai milk packs',
        offerDetail: 'Holi special thandai-infused milk, fresh paneer, malai — pure aur fresh. Ghar deliver hoga subah 7 baje tak.',
        badge: 'Limited',
        category: 'dairy',
        photo: '',
      },
    ],

    shareMessage: `🎨 *Happy Holi!* 🎨\n\nMeerut ke heritage shops pe Holi ke rang bhi, swaad bhi!\n\nThandai Bhandar — 20% off thandai masala\nGujiya King — 30% off fresh gujiya\nNatural Colors — 25% off herbal rang\n\nDekhna: {URL}\n\n🌈 Rang barse, Meerut se! 🌈`,

    metaTitle: 'Holi Special — Meerut Heritage Shops | Purani Dukan',
    metaDesc: 'Holi ke liye thandai masala, gujiya, natural colors aur namkeen — Meerut ke purane shops se. Up to 30% off.',
  },
];

export function getFestivalBySlug(slug: string): Festival | undefined {
  return FESTIVALS.find(f => f.slug === slug);
}

export function getActiveFestivals(): Festival[] {
  const now = Date.now();
  return FESTIVALS.filter(f => {
    const end = new Date(f.offerEndDate).getTime();
    return end > now;
  });
}

export function getTimeUntilFestival(festival: Festival): {
  days: number; hours: number; minutes: number; seconds: number; expired: boolean;
} {
  const diff = new Date(festival.date).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}