'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import ExplorerHeader from '@/components/explorer/ExplorerHeader';
import ExplorerNav from '@/components/explorer/ExplorerNav';
import HomePage from '@/components/explorer/HomePage';
import ShopProfile from '@/components/explorer/ShopProfile';
import ProductDetail from '@/components/explorer/ProductDetail';
import WishlistPage from '@/components/explorer/WishlistPage';
import MapPage from '@/components/explorer/MapPage';
import Toast from '@/components/ui/Toast';
import { FilterState, DEFAULT_FILTERS } from '@/data/categories';
import { useShops } from '@/hooks/useShops';

export default function ExplorerApp() {
  const { user, currentPage } = useStore();
  const router = useRouter();

  // ── Lifted state — shared between header and HomePage ────
  const [query, setQuery]   = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const { shops, loading, error, refetch } = useShops({ radius: 3000 });

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':     return <HomePage query={query} filters={filters} shops={shops} loading={loading} error={error} refetch={refetch} />;
      case 'shop':     return <ShopProfile />;
      case 'product':  return <ProductDetail />;
      case 'wishlist': return <WishlistPage />;
      case 'map':      return <MapPage />;
      default:         return <HomePage query={query} filters={filters} shops={shops} loading={loading} error={error} refetch={refetch} />;
    }
  };

  return (
    <div style={{ background: '#f0ebe4', minHeight: '100vh' }}>
      <ExplorerHeader
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={shops.length}
        onRefetch={refetch}
      />
      <main className="max-w-7xl mx-auto px-4 pt-4 pb-24">
        <div key={currentPage} className="page-enter">
          {renderPage()}
        </div>
      </main>
      <ExplorerNav />
      <Toast />
    </div>
  );
}