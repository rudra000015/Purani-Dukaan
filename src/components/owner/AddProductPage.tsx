'use client';

import { useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { prodImg } from '@/utils/prodImg';

const UNITS = ['kg', 'pack', 'piece', 'bottle', 'strip', 'box', 'litre'] as const;

export default function AddProductPage() {
  const { ownerShopId, addProduct, ownerNavTo, showToast } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState<string>('kg');
  const [isNew, setIsNew] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!name.trim() || !price) {
      setError('Please fill in product name and price.');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Please enter a valid price.');
      return;
    }

    addProduct(ownerShopId, {
      id: 'p' + Date.now(),
      name: name.trim(),
      price: parseInt(price),
      unit,
      inStock,
      isNew,
      image: imageUrl || undefined,
    });

    showToast('✓ Product added to showcase!');
    ownerNavTo('showcase');
  };

  // preview index for placeholder
  const previewIndex = Math.floor(Math.random() * 6);

  return (
    <>
      <h2 className="text-2xl font-black text-[#3e2723] mb-2">Add New Product</h2>
      <p className="text-sm text-gray-500 mb-6">Fill in the details below. You can always edit later from Showcase.</p>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">

        {/* Left: Image upload */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
              Product Photo
            </label>
            {/* Image preview / upload zone */}
            <div
              className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative cursor-pointer group hover:border-[#8d5524] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={prodImg(name || 'New Product', previewIndex, imageUrl)}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <i className="fas fa-camera text-[#8d5524] text-xl" />
                </div>
                <p className="text-white font-bold text-sm">
                  {imageUrl ? 'Change Photo' : 'Upload Photo'}
                </p>
                <p className="text-white/60 text-xs">JPG, PNG, WebP · max 5MB</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />
          </div>

          {imageUrl && (
            <button
              onClick={() => setImageUrl('')}
              className="w-full py-2 rounded-xl border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-all"
            >
              <i className="fas fa-times mr-2" /> Remove Photo
            </button>
          )}

          {!imageUrl && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-medium">
              <i className="fas fa-info-circle mr-1 text-amber-500" />
              Products with real photos get <strong>3x more views</strong>. Click the image above to upload.
            </div>
          )}
        </div>

        {/* Right: Form fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g., Kaju Katli Premium"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm transition-colors"
              maxLength={60}
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Price (₹) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
              <input
                type="number"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setError(''); }}
                placeholder="e.g., 800"
                min={1}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm transition-colors"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Unit</label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    unit === u
                      ? 'bg-[#8d5524] text-white border-[#8d5524] shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#8d5524]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-1">
            {[
              { label: 'New Arrival', sub: 'Shows "NEW" badge on card', value: isNew, set: setIsNew, color: 'bg-[#8d5524]' },
              { label: 'In Stock', sub: 'Customers can see availability', value: inStock, set: setInStock, color: 'bg-[#059669]' },
            ].map(({ label, sub, value, set, color }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
                <button
                  onClick={() => set((v: boolean) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-all ${value ? color : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl font-medium">
              <i className="fas fa-exclamation-circle mr-2" />{error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            <i className="fas fa-plus-circle mr-2" />Add to Showcase
          </button>
        </div>
      </div>
    </>
  );
}