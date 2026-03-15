'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { SHOPS } from '@/data/shops';
import OwnerHeader from '@/components/owner/OwnerHeader';
import OwnerBottomNav from '@/components/owner/OwnerBottomNav';
import ShowcasePage from '@/components/owner/ShowcasePage';
import CollectionsPage from '@/components/owner/CollectionsPage';
import AddProductPage from '@/components/owner/AddProductPage';
import ShopProfilePage from '@/components/owner/ShopProfilePage';
import AnalyticsPage from '@/components/owner/AnalyticsPage';
import Toast from '@/components/ui/Toast';

export default function OwnerApp() {
  const { user, ownerPage, ownerShopId } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
  }, [user, router]);

  if (!user) return null;

  const shop = SHOPS.find(s => s.id === ownerShopId)!;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <OwnerHeader shopName={shop.name} />
      <main className="flex-grow overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        {ownerPage === 'showcase'    && <ShowcasePage />}
        {ownerPage === 'collections' && <CollectionsPage />}
        {ownerPage === 'addproduct'  && <AddProductPage />}
        {ownerPage === 'profile'     && <ShopProfilePage />}
        {ownerPage === 'analytics'   && <AnalyticsPage />}
      </main>
      <OwnerBottomNav />
      <Toast />
    </div>
  );
}
