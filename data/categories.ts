// src/data/categories.ts
// Broad category taxonomy for Meerut heritage shops

export interface Category {
  id: string;
  label: string;
  labelHindi: string;
  icon: string;           // FontAwesome icon name
  color: string;          // tailwind bg color class
  textColor: string;
  shopCats: string[];     // which shop.cat values this maps to
  keywords: string[];     // for search/image matching
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    label: 'All',
    labelHindi: 'सभी',
    icon: 'store',
    color: 'bg-[#8d5524]',
    textColor: 'text-white',
    shopCats: ['sweets','grocery','pharmacy','general'],
    keywords: [],
  },
  {
    id: 'sweets',
    label: 'Sweets',
    labelHindi: 'मिठाई',
    icon: 'candy-cane',
    color: 'bg-orange-50',
    textColor: 'text-orange-800',
    shopCats: ['sweets'],
    keywords: ['jalebi','laddu','barfi','gulab jamun','rasgulla','mithai','halwai','gajak','rewri','soan papdi'],
  },
  {
    id: 'namkeen',
    label: 'Namkeen',
    labelHindi: 'नमकीन',
    icon: 'pepper-hot',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    shopCats: ['sweets','general'],
    keywords: ['namkeen','mathri','chakli','bhujia','mixture','chivda','sev'],
  },
  {
    id: 'grocery',
    label: 'Grocery',
    labelHindi: 'किराना',
    icon: 'shopping-basket',
    color: 'bg-green-50',
    textColor: 'text-green-800',
    shopCats: ['grocery'],
    keywords: ['atta','dal','rice','oil','ghee','masala','kirana','pulses','grain'],
  },
  {
    id: 'dairy',
    label: 'Dairy',
    labelHindi: 'डेयरी',
    icon: 'glass-whiskey',
    color: 'bg-blue-50',
    textColor: 'text-blue-800',
    shopCats: ['grocery','general'],
    keywords: ['milk','paneer','curd','butter','dahi','lassi','rabdi','mawa','khoya'],
  },
  {
    id: 'bakery',
    label: 'Bakery',
    labelHindi: 'बेकरी',
    icon: 'bread-slice',
    color: 'bg-amber-50',
    textColor: 'text-amber-800',
    shopCats: ['sweets','general'],
    keywords: ['bread','cake','biscuit','rusk','toast','patty','pastry'],
  },
  {
    id: 'spices',
    label: 'Spices',
    labelHindi: 'मसाले',
    icon: 'mortar-pestle',
    color: 'bg-red-50',
    textColor: 'text-red-800',
    shopCats: ['grocery','general'],
    keywords: ['masala','haldi','jeera','mirchi','garam masala','spice','pickle','achar'],
  },
  {
    id: 'pharmacy',
    label: 'Medical',
    labelHindi: 'दवाई',
    icon: 'pills',
    color: 'bg-teal-50',
    textColor: 'text-teal-800',
    shopCats: ['pharmacy'],
    keywords: ['medicine','tablet','syrup','medical','pharmacy','health','strip','capsule'],
  },
  {
    id: 'puja',
    label: 'Puja Items',
    labelHindi: 'पूजा सामग्री',
    icon: 'pray',
    color: 'bg-purple-50',
    textColor: 'text-purple-800',
    shopCats: ['general'],
    keywords: ['agarbatti','diya','kumkum','prasad','pooja','incense','camphor'],
  },
  {
    id: 'seasonal',
    label: 'Seasonal',
    labelHindi: 'मौसमी',
    icon: 'snowflake',
    color: 'bg-sky-50',
    textColor: 'text-sky-800',
    shopCats: ['sweets','general'],
    keywords: ['gajak','til','rewri','gazak','winter','festival','diwali','holi','eid'],
  },
  {
    id: 'dry-fruits',
    label: 'Dry Fruits',
    labelHindi: 'मेवे',
    icon: 'seedling',
    color: 'bg-lime-50',
    textColor: 'text-lime-800',
    shopCats: ['grocery','sweets'],
    keywords: ['kaju','badam','pista','kishmish','cashew','almond','raisin','dry fruit','akhrot'],
  },
  {
    id: 'beverages',
    label: 'Beverages',
    labelHindi: 'पेय',
    icon: 'mug-hot',
    color: 'bg-rose-50',
    textColor: 'text-rose-800',
    shopCats: ['grocery','general'],
    keywords: ['chai','tea','coffee','juice','sharbat','lassi','thandai','bournvita'],
  },
];

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating',    label: 'Top Rated' },
  { id: 'legacy',    label: 'Oldest First' },
  { id: 'name',      label: 'A → Z' },
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['id'];

export interface FilterState {
  category: string;
  sort: SortOption;
  openNow: boolean;
  minRating: number;
  priceRange: 'all' | 'budget' | 'mid' | 'premium';
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  sort: 'relevance',
  openNow: false,
  minRating: 0,
  priceRange: 'all',
};