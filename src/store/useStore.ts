import { create } from 'zustand';
import { Product } from '@/types/shop';
import { SHOPS } from '@/data/shops';
import { haptic } from '@/utils/haptic';



export type ThemeMode = 'light' | 'dark';


interface WishItem {
  shopId: string;
  prodId: string;
  name: string;
  price: number;
  unit: string;
  shopName: string;
}

interface ToastState {
  message: string;
  visible: boolean;
}

export type OwnerPage = 'showcase' | 'collections' | 'addproduct' | 'profile' | 'analytics';
export type ThemeMode = 'light' | 'dark';

export interface OwnerShopProfile {
  tagline: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  specialties: string[];
  coverImage?: string;
  profileImage?: string;
}

interface AppStore {
  // Auth
  user: { name: string; img: string } | null;
  role: 'explorer' | 'owner';
  setUser: (user: { name: string; img: string }, role: 'explorer' | 'owner') => void;
  logout: () => void;

  // Theme
  theme: ThemeMode;
setTheme: (t: ThemeMode) => void;

  // Explorer navigation
  currentPage: string;
  currentShopId: string | null;
  currentProdId: string | null;
  navTo: (page: string) => void;
  openShop: (shopId: string) => void;
  viewProduct: (shopId: string, prodId: string) => void;

  // Wishlist
  wishlist: WishItem[];
  toggleWish: (shopId: string, prodId: string, product: Product, shopName: string) => void;
  isWished: (shopId: string, prodId: string) => boolean;

  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;

  // Search History
  searchHistory: string[];
  addSearchHistory: (query: string) => void;

  // Toast
  toast: ToastState;
  showToast: (msg: string) => void;

  // Owner
  ownerShopId: string;
  ownerPage: OwnerPage;
  ownerNavTo: (page: OwnerPage) => void;

  // Owner: Shop profile editor
  shopProfiles: Record<string, OwnerShopProfile>;
  updateShopProfile: (shopId: string, patch: Partial<OwnerShopProfile>) => void;

  // Collections
  collections: { id: string; name: string; count: number; date: string }[];
  addCollection: (name: string) => void;
  deleteCollection: (id: string) => void;

  // Shop Products
  shopProducts: Record<string, Product[]>;
  addProduct: (shopId: string, product: Product) => void;
  removeProduct: (shopId: string, productId: string) => void;
  updateProductImage: (shopId: string, productId: string, image: string) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // ── Auth ──────────────────────────────────────────────
  user: null,
  role: 'explorer',
  setUser: (user, role) => set({ user, role }),
  logout: () => set({ user: null }),

  // Theme
 theme: 'light',
  setTheme: (theme) => set({ theme }),
  // ── Navigator ─────────────────────────────────────────
  currentPage: 'home',
  currentShopId: null,
  currentProdId: null,
  navTo: (page) => set({ currentPage: page }),
  openShop: (shopId) => set({ currentShopId: shopId, currentPage: 'shop' }),
  viewProduct: (shopId, prodId) =>
    set({ currentShopId: shopId, currentProdId: prodId, currentPage: 'product' }),

  // ── Wishlist ───────────────────────────────────────────
  wishlist: [],
  toggleWish: (shopId, prodId, product, shopName) => {
    const { wishlist } = get();
    const idx = wishlist.findIndex(w => w.shopId === shopId && w.prodId === prodId);
    if (idx >= 0) {
      set({ wishlist: wishlist.filter((_, i) => i !== idx) });
      haptic.light();
      get().showToast('Removed from wishlist');
    } else {
      set({
        wishlist: [...wishlist, {
          shopId, prodId,
          name: product.name, price: product.price,
          unit: product.unit, shopName,
        }],
      });
      haptic.success();
      get().showToast('Saved to wishlist ❤️');
    }
  },
  isWished: (shopId, prodId) =>
    get().wishlist.some(w => w.shopId === shopId && w.prodId === prodId),

  // ── Recently Viewed ────────────────────────────────────
  recentlyViewed: [],
  addRecentlyViewed: (id) => set(s => ({
    recentlyViewed: [
      id,
      ...s.recentlyViewed.filter(x => x !== id)
    ].slice(0, 5)
  })),

  // ── Search History ─────────────────────────────────────
  searchHistory: [],
  addSearchHistory: (query) => set(s => ({
    searchHistory: [
      query,
      ...s.searchHistory.filter(x => x !== query)
    ].slice(0, 5)
  })),

  // ── Toast ──────────────────────────────────────────────
  toast: { message: '', visible: false },
  showToast: (message) => {
    set({ toast: { message, visible: true } });
    setTimeout(() => set({ toast: { message: '', visible: false } }), 3500);
  },

  // ── Owner ──────────────────────────────────────────────
  ownerShopId: 'hira',
  ownerPage: 'showcase',
  ownerNavTo: (page) => set({ ownerPage: page }),

  shopProfiles: Object.fromEntries(
    SHOPS.map((s) => [
      s.id,
      {
        tagline: '',
        description: s.story ?? '',
        phone: s.phone ?? '',
        email: '',
        website: s.website ?? '',
        openTime: '09:00',
        closeTime: '21:00',
        isOpen: true,
        specialties: [],
      } satisfies OwnerShopProfile,
    ])
  ),
  updateShopProfile: (shopId, patch) =>
    set((state) => ({
      shopProfiles: {
        ...state.shopProfiles,
        [shopId]: { ...state.shopProfiles[shopId], ...patch },
      },
    })),

  // ── Collections ────────────────────────────────────────
  collections: [
    { id: 'c1', name: 'Festive Diwali Special 2024', count: 12, date: 'Nov 2024' },
    { id: 'c2', name: 'Winter Season Gajak Collection', count: 8,  date: 'Dec 2024' },
  ],
  addCollection: (name) =>
    set(s => ({
      collections: [...s.collections, { id: 'c' + Date.now(), name, count: 0, date: 'Mar 2026' }],
    })),
  deleteCollection: (id) =>
    set(s => ({ collections: s.collections.filter(c => c.id !== id) })),

  // ── Shop Products ──────────────────────────────────────
  shopProducts: Object.fromEntries(SHOPS.map(s => [s.id, s.products])),
  addProduct: (shopId, product) =>
    set(s => ({
      shopProducts: {
        ...s.shopProducts,
        [shopId]: [...(s.shopProducts[shopId] ?? []), product],
      },
    })),
  removeProduct: (shopId, productId) =>
    set(s => ({
      shopProducts: {
        ...s.shopProducts,
        [shopId]: (s.shopProducts[shopId] ?? []).filter(p => p.id !== productId),
      },
    })),
  updateProductImage: (shopId, productId, image) =>
    set((state) => ({
      shopProducts: {
        ...state.shopProducts,
        [shopId]: (state.shopProducts[shopId] ?? []).map((p) =>
          p.id === productId ? { ...p, image } : p
        ),
      },
    })),
    
}));
