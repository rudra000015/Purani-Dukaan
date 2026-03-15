'use client';

import { SHOPS } from '@/data/shops';
import { useStore } from '@/store/useStore';
import { prodImg } from '@/utils/prodImg';

export default function ProductDetail() {
  const { currentShopId, currentProdId, openShop, viewProduct, toggleWish, isWished } = useStore();

  const s = SHOPS.find(x => x.id === currentShopId);
  const p = s?.products.find(x => x.id === currentProdId);
  const prodIndex = s?.products.indexOf(p!) ?? 0;
  const others = s?.products.filter(x => x.id !== currentProdId).slice(0, 4) ?? [];

  if (!s || !p) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Product not found.</p>
      </div>
    );
  }

  const wished = isWished(s.id, p.id);

  return (
    <>
      {/* Back button */}
      <button
        onClick={() => openShop(s.id)}
        className="mb-6 text-sm font-bold text-gray-500 hover:text-[#8d5524] flex items-center gap-2 transition-colors"
      >
        <i className="fas fa-arrow-left" /> Back to Shop
      </button>

      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-lg border">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Product image */}
          <div className="w-full md:w-96 aspect-square bg-gray-50 rounded-3xl overflow-hidden relative shadow-inner flex-shrink-0">
            <img
              src={prodImg(p.name, prodIndex)}
              className="w-full h-full object-cover"
              alt={p.name}
            />
            {p.isNew && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#8d5524] to-[#b87333] text-white text-sm font-black px-4 py-1 rounded-full">
                NEW ARRIVAL
              </span>
            )}
            {/* Wishlist button on image */}
            <button
              onClick={() => toggleWish(s.id, p.id, p, s.name)}
              className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
                wished ? 'bg-red-500' : 'bg-white'
              }`}
            >
              <i className={`${wished ? 'fas text-white' : 'far text-gray-400'} fa-heart text-lg`} />
            </button>
          </div>

          {/* Product info */}
          <div className="flex-grow">
            {/* Shop breadcrumb */}
            <p
              className="text-xs font-bold text-[#8d5524] uppercase tracking-widest mb-2 cursor-pointer hover:underline"
              onClick={() => openShop(s.id)}
            >
              <i className="fas fa-store mr-1" />{s.name} • Since {s.est}
            </p>

            <h2 className="text-4xl font-black text-gray-800 mb-4">{p.name}</h2>

            <p className="text-3xl font-black text-[#8d5524] mb-6">
              ₹{p.price}{' '}
              <span className="text-base text-gray-400 font-normal">per {p.unit}</span>
            </p>

            {/* Badges */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                p.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}>
                <i className={`fas fa-${p.inStock ? 'check-circle' : 'times-circle'} mr-1`} />
                {p.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold">
                <i className="fas fa-star mr-1" />{s.rating} rated
              </span>
              <span className="px-4 py-2 bg-[#8d5524]/8 text-[#8d5524] rounded-full text-sm font-bold">
                {s.age} yrs legacy
              </span>
            </div>

            {/* Shop story */}
              <div className="bg-gray-50 p-5 rounded-2xl mb-6 border-l-4 border-[#8d5524]">
                <h4 className="font-bold text-sm text-gray-600 mb-2">About this shop</h4>
                <p className="text-sm text-gray-500 italic">&quot;{s.story}&quot;</p>
                <p className="text-xs text-gray-400 mt-2">
                  <i className="fas fa-map-marker-alt mr-1" />{s.addr}
                </p>
              </div>

            {/* CTA */}
            <button
              onClick={() => toggleWish(s.id, p.id, p, s.name)}
              className="w-full py-4 rounded-xl font-bold text-lg shadow-lg bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <i className={`${wished ? 'fas' : 'far'} fa-heart mr-2`} />
              {wished ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>
        </div>

        {/* More from this shop */}
        {others.length > 0 && (
          <div className="mt-10 pt-8 border-t">
            <h3 className="text-xl font-black text-gray-800 mb-4">More from {s.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {others.map((o, oi) => (
                <div
                  key={o.id}
                  className="bg-gray-50 rounded-2xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                  onClick={() => viewProduct(s.id, o.id)}
                >
                  <div className="aspect-square bg-gray-100">
                    <img src={prodImg(o.name, oi + 10)} className="w-full h-full object-cover" alt={o.name} />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm line-clamp-1">{o.name}</h4>
                    <p className="font-black text-[#8d5524] text-sm">₹{o.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
