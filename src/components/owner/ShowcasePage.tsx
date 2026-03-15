'use client';

import { SHOPS } from '@/data/shops';
import { useStore } from '@/store/useStore';
import { prodImg } from '@/utils/prodImg';

export default function ShowcasePage() {
  const { ownerShopId, shopProducts, removeProduct, updateProductImage, showToast } = useStore();
  const shop = SHOPS.find((s) => s.id === ownerShopId);
  const products = shopProducts[ownerShopId] ?? [];

  const setImage = (productId: string, current?: string) => {
    const next = window.prompt('Paste an image URL for this product:', current ?? '');
    if (!next) return;
    updateProductImage(ownerShopId, productId, next);
    showToast('Product image updated');
  };

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-[#3e2723] mb-1">Showcase</h2>
          <p className="text-gray-500 text-sm">
            {shop ? shop.name : 'Your shop'}{' '}
            {products.length ? `has ${products.length} products listed.` : 'has no products yet.'}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
          <i className="fas fa-box-open text-6xl text-gray-200 block mb-6" />
          <h3 className="text-xl font-black text-gray-400 mb-2">No products in your showcase</h3>
          <p className="text-gray-400 text-sm">Use the Add tab to list your first item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                <img
                  src={p.image ?? prodImg(p.name, i)}
                  className="w-full h-full object-cover"
                  alt={p.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = prodImg(p.name, i);
                  }}
                />
                {p.isNew && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-[#8d5524] to-[#b87333] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
                {!p.inStock && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    OUT
                  </span>
                )}
              </div>

              <div className="p-3">
                <h4 className="font-bold text-sm text-gray-800 truncate">{p.name}</h4>
                <p className="font-black text-[#8d5524] text-sm">
                  ₹{p.price}
                  <span className="text-xs text-gray-400 font-normal">/{p.unit}</span>
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setImage(p.id, p.image)}
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all"
                  >
                    <i className="fas fa-image mr-1" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(ownerShopId, p.id)}
                    className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
                  >
                    <i className="fas fa-trash mr-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

