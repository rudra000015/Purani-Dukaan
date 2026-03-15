'use client';

import { SHOPS } from '@/data/shops';
import { useStore } from '@/store/useStore';
import NotificationSender from '@/components/owner/NotificationSender';

export default function AnalyticsPage() {
  const { ownerShopId, shopProducts } = useStore();
  const shop = SHOPS.find((s) => s.id === ownerShopId);
  const products = shopProducts[ownerShopId] ?? [];

  const inStock = products.filter((p) => p.inStock).length;
  const newItems = products.filter((p) => p.isNew).length;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#3e2723] mb-1">Analytics</h2>
        <p className="text-gray-500 text-sm">A quick snapshot for {shop?.name ?? 'your shop'}.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Products</p>
          <p className="text-3xl font-black text-[#8d5524] mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase">In Stock</p>
          <p className="text-3xl font-black text-[#059669] mt-1">{inStock}</p>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase">New Items</p>
          <p className="text-3xl font-black text-amber-600 mt-1">{newItems}</p>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Rating</p>
          <p className="text-3xl font-black text-gray-800 mt-1">{shop?.rating ?? '—'}</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-black text-[#3e2723] mb-2">Coming Next</h3>
        <p className="text-sm text-gray-500">
          This demo doesn&apos;t track orders yet. If you want, we can add simple mock sales,
          visitor counts, and a lightweight chart so this page feels alive.
        </p>
      </div>

      <div className="mt-6 bg-white rounded-2xl border shadow-sm p-6">
        <NotificationSender />
      </div>
    </>
  );
}
