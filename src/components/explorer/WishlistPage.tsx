'use client';

import { useStore } from '@/store/useStore';
import { SHOPS } from '@/data/shops';
import { prodImg } from '@/utils/prodImg';

export default function WishlistPage() {
  const { wishlist, toggleWish, viewProduct, navTo } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-24">
        <i className="fas fa-heart text-6xl text-gray-200 block mb-6" />
        <h3 className="text-xl font-black text-gray-400 mb-2">No saved items yet</h3>
        <p className="text-gray-400 text-sm mb-6">
          Tap the heart icon on any product to save it here.
        </p>
        <button
          onClick={() => navTo('home')}
          className="bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all shadow-lg"
        >
          Explore Shops
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#3e2723] mb-1 flex items-center gap-3">
          <i className="fas fa-heart text-red-500" /> My Saved Items
        </h2>
        <p className="text-gray-500">
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlist.map((w, i) => {
          // Find the actual product for toggleWish
          const shop = SHOPS.find(s => s.id === w.shopId);
          const product = shop?.products.find(p => p.id === w.prodId);

          return (
            <div
              key={`${w.shopId}-${w.prodId}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border relative cursor-pointer transition-all hover:-translate-y-1.5 hover:shadow-lg"
              onClick={() => viewProduct(w.shopId, w.prodId)}
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                <img src={prodImg(w.name, i)} className="w-full h-full object-cover" alt={w.name} />

                {/* Remove from wishlist */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (product) toggleWish(w.shopId, w.prodId, product, w.shopName);
                  }}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shadow-md transition-all hover:scale-110 hover:bg-red-600"
                >
                  <i className="fas fa-heart text-white text-sm" />
                </button>
              </div>

              <div className="p-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 truncate">
                  {w.shopName}
                </p>
                <h4 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{w.name}</h4>
                <p className="text-lg font-black text-[#8d5524]">
                  ₹{w.price}<span className="text-xs text-gray-400 font-normal">/{w.unit}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}