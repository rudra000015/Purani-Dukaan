import type { ShopCategory } from '@/types/shop';

export type CategoryId =
  | 'all'
  | 'sweets'
  | 'grocery'
  | 'pharmacy'
  | 'namkeen'
  | 'dairy'
  | 'bakery'
  | 'spices'
  | 'puja'
  | 'heritage';

export interface Category {
  id: CategoryId;
  label: string;
  labelHindi: string;
  icon: string; // Font Awesome icon name (without the `fa-` prefix)
  shopCats: ShopCategory[];
  keywords: string[];
}

export type SortId = 'relevance' | 'rating' | 'legacy' | 'name';

export interface SortOption {
  id: SortId;
  label: string;
}

export type PriceRange = 'all' | 'budget' | 'mid' | 'premium';

export type HoursFilter = 'any' | 'open_now' | 'open_late';

export interface FilterState {
  category: CategoryId;
  sort: SortId;
  openNow: boolean;
  minRating: number;
  priceRange: PriceRange;
  hours: HoursFilter;
  openAt: string; // "HH:MM" or ""
  discountOnly: boolean;
  minDiscount: number; // percentage
  newCollection: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  sort: 'relevance',
  openNow: false,
  minRating: 0,
  priceRange: 'all',
  hours: 'any',
  openAt: '',
  discountOnly: false,
  minDiscount: 0,
  newCollection: false,
};

export const SORT_OPTIONS: SortOption[] = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'legacy', label: 'Oldest First' },
  { id: 'name', label: 'A - Z' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    label: 'All',
    labelHindi: 'Sab',
    icon: 'th-large',
    shopCats: ['sweets', 'grocery', 'pharmacy', 'general'],
    keywords: [],
  },
  {
    id: 'sweets',
    label: 'Sweets',
    labelHindi: 'Mithai',
    icon: 'candy-cane',
    shopCats: ['sweets'],
    keywords: ['mithai', 'jalebi', 'laddu', 'barfi', 'gajak', 'rewri', 'halwai', 'sweet'],
  },
  {
    id: 'namkeen',
    label: 'Namkeen',
    labelHindi: 'Namkeen',
    icon: 'cookie-bite',
    shopCats: ['sweets', 'general', 'grocery'],
    keywords: ['namkeen', 'snack', 'kachori', 'samosa', 'bhujia'],
  },
  {
    id: 'dairy',
    label: 'Dairy',
    labelHindi: 'Doodh',
    icon: 'cheese',
    shopCats: ['grocery', 'general'],
    keywords: ['dairy', 'milk', 'paneer', 'dahi', 'ghee', 'butter'],
  },
  {
    id: 'bakery',
    label: 'Bakery',
    labelHindi: 'Bakery',
    icon: 'bread-slice',
    shopCats: ['sweets', 'general', 'grocery'],
    keywords: ['bakery', 'bread', 'cake', 'pastry', 'biscuit'],
  },
  {
    id: 'spices',
    label: 'Spices',
    labelHindi: 'Masale',
    icon: 'pepper-hot',
    shopCats: ['grocery', 'general'],
    keywords: ['spices', 'masala', 'mirch', 'haldi', 'dhania', 'garam'],
  },
  {
    id: 'puja',
    label: 'Puja',
    labelHindi: 'Puja',
    icon: 'om',
    shopCats: ['general', 'grocery'],
    keywords: ['puja', 'pooja', 'dhoop', 'agarbatti', 'diya', 'kumkum'],
  },
  {
    id: 'grocery',
    label: 'Grocery',
    labelHindi: 'Kirana',
    icon: 'shopping-basket',
    shopCats: ['grocery', 'general'],
    keywords: ['kirana', 'grocery', 'atta', 'dal', 'spices', 'rice'],
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    labelHindi: 'Dawai',
    icon: 'capsules',
    shopCats: ['pharmacy'],
    keywords: ['medical', 'pharmacy', 'chemist', 'dawai', 'medicine'],
  },
  {
    id: 'heritage',
    label: 'Heritage',
    labelHindi: 'Virasat',
    icon: 'landmark',
    shopCats: ['sweets', 'grocery', 'pharmacy', 'general'],
    keywords: ['since', 'est', 'old', 'heritage', 'traditional', 'purana'],
  },
];
