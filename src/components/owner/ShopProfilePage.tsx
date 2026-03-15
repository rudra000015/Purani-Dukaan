'use client';

import { useRef, useState } from 'react';
import { SHOPS } from '@/data/shops';
import { useStore } from '@/store/useStore';

const SPECIALTY_SUGGESTIONS = [
  'Traditional Recipes', 'Pure Desi Ghee', 'Home Delivery', 'Bulk Orders',
  'Festival Specials', 'No Preservatives', 'Family Run', 'Since Generations',
  'Organic Ingredients', 'Custom Orders', 'Gift Packaging', 'Cash on Delivery',
];

export default function ShopProfilePage() {
  const { ownerShopId, shopProfiles, updateShopProfile, showToast } = useStore();
  const profile = shopProfiles[ownerShopId];
  const shop = SHOPS.find((s) => s.id === ownerShopId)!;

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [newSpecialty, setNewSpecialty] = useState('');
  const [saved, setSaved] = useState(false);

  // Local editable state
  const [form, setForm] = useState({
    tagline: profile.tagline,
    description: profile.description,
    phone: profile.phone,
    email: profile.email,
    website: profile.website,
    openTime: profile.openTime,
    closeTime: profile.closeTime,
    isOpen: profile.isOpen,
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'coverImage' | 'profileImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { showToast('Image must be under 8MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateShopProfile(ownerShopId, { [field]: ev.target?.result as string });
      showToast(field === 'coverImage' ? '✓ Cover photo updated!' : '✓ Profile photo updated!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    updateShopProfile(ownerShopId, form);
    setSaved(true);
    showToast('✓ Profile saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  const addSpecialty = (tag: string) => {
    if (!tag.trim() || profile.specialties.includes(tag.trim())) return;
    updateShopProfile(ownerShopId, {
      specialties: [...profile.specialties, tag.trim()],
    });
    setNewSpecialty('');
  };

  const removeSpecialty = (tag: string) => {
    updateShopProfile(ownerShopId, {
      specialties: profile.specialties.filter((s) => s !== tag),
    });
  };

  const toggleOpen = () => {
    const next = !form.isOpen;
    setForm((f) => ({ ...f, isOpen: next }));
    updateShopProfile(ownerShopId, { isOpen: next });
    showToast(next ? '✓ Shop marked as Open' : 'Shop marked as Closed');
  };

  return (
    <>
      {/* Hidden file inputs */}
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleImageUpload(e, 'coverImage')} />
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleImageUpload(e, 'profileImage')} />

      <div className="max-w-3xl">

        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#3e2723]">Shop Profile</h2>
            <p className="text-sm text-gray-500">How customers see your shop on the explorer</p>
          </div>
          <button
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white hover:-translate-y-0.5 hover:shadow-lg'
            }`}
          >
            <i className={`fas fa-${saved ? 'check' : 'save'} mr-2`} />
            {saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>

        {/* ── COVER + AVATAR ── */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-5">
          {/* Cover image */}
          <div
            className="relative h-44 bg-gradient-to-br from-[#3e2723] to-[#5d4037] cursor-pointer group"
            onClick={() => coverInputRef.current?.click()}
          >
            {profile.coverImage ? (
              <img src={profile.coverImage} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/50">
                <i className="fas fa-image text-4xl" />
                <p className="text-sm font-bold">Click to upload cover photo</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
              <i className="fas fa-camera" /> Change Cover
            </div>
          </div>

          {/* Avatar + open toggle */}
          <div className="px-6 pb-5 -mt-10 flex items-end justify-between">
            {/* Avatar */}
            <div
              className="relative cursor-pointer group"
              onClick={() => avatarInputRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-[#f5e6d3]">
                {profile.profileImage ? (
                  <img src={profile.profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🏪</div>
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className="fas fa-camera text-white text-lg" />
              </div>
            </div>

            {/* Open/Closed toggle */}
            <div className="flex items-center gap-3 mt-10">
              <span className="text-sm font-bold text-gray-600">Shop Status</span>
              <button
                onClick={toggleOpen}
                className={`relative w-14 h-7 rounded-full transition-all shadow-inner ${
                  form.isOpen ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  form.isOpen ? 'left-8' : 'left-1'
                }`} />
              </button>
              <span className={`text-sm font-black ${form.isOpen ? 'text-green-600' : 'text-gray-400'}`}>
                {form.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* ── BASIC INFO ── */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-5">
          <h3 className="font-black text-[#3e2723] mb-4 flex items-center gap-2">
            <i className="fas fa-store text-[#8d5524]" /> Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                Shop Name <span className="text-gray-300">(from system)</span>
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-500 text-sm border font-bold">
                {shop.name}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                placeholder="e.g., Serving Meerut with love since 1912"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm transition-colors"
                maxLength={80}
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">{form.tagline.length}/80</p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                Full Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Tell your story — history, what makes you special, your ingredients, your family heritage..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm transition-colors resize-none"
                maxLength={500}
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">{form.description.length}/500</p>
            </div>
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-5">
          <h3 className="font-black text-[#3e2723] mb-4 flex items-center gap-2">
            <i className="fas fa-phone-alt text-[#8d5524]" /> Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'phone', label: 'Phone Number', icon: 'phone', placeholder: '+91 98765 43210', type: 'tel' },
              { key: 'email', label: 'Email Address', icon: 'envelope', placeholder: 'shop@example.com', type: 'email' },
              { key: 'website', label: 'Website / Instagram', icon: 'globe', placeholder: 'instagram.com/yourshop', type: 'text' },
            ].map(({ key, label, icon, placeholder, type }) => (
              <div key={key} className={key === 'website' ? 'md:col-span-2' : ''}>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                  <i className={`fas fa-${icon} mr-1`} /> {label}
                </label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── HOURS ── */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-5">
          <h3 className="font-black text-[#3e2723] mb-4 flex items-center gap-2">
            <i className="fas fa-clock text-[#8d5524]" /> Business Hours
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1.5">Opens at</label>
              <input
                type="time"
                value={form.openTime}
                onChange={(e) => setForm((f) => ({ ...f, openTime: e.target.value }))}
                className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm font-bold"
              />
            </div>
            <div className="text-gray-300 text-xl mt-5">—</div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1.5">Closes at</label>
              <input
                type="time"
                value={form.closeTime}
                onChange={(e) => setForm((f) => ({ ...f, closeTime: e.target.value }))}
                className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm font-bold"
              />
            </div>
            <div className="mt-5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-700 font-bold">
              <i className="fas fa-sun mr-2 text-amber-500" />
              {form.openTime} – {form.closeTime}
            </div>
          </div>
        </div>

        {/* ── SPECIALTIES / TAGS ── */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-5">
          <h3 className="font-black text-[#3e2723] mb-1 flex items-center gap-2">
            <i className="fas fa-tags text-[#8d5524]" /> Specialties & Tags
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            These appear as badges on your shop card and help customers find you.
          </p>

          {/* Current tags */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-10">
            {profile.specialties.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-[#8d5524]/10 text-[#8d5524] border border-[#8d5524]/20 px-3 py-1 rounded-full text-xs font-bold"
              >
                {tag}
                <button
                  onClick={() => removeSpecialty(tag)}
                  className="hover:text-red-500 transition-colors ml-0.5"
                >
                  <i className="fas fa-times text-[10px]" />
                </button>
              </span>
            ))}
            {profile.specialties.length === 0 && (
              <p className="text-gray-300 text-sm italic">No specialties added yet</p>
            )}
          </div>

          {/* Custom input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSpecialty(newSpecialty)}
              placeholder="Add custom specialty..."
              className="flex-grow px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#8d5524] text-sm"
              maxLength={30}
            />
            <button
              onClick={() => addSpecialty(newSpecialty)}
              className="px-4 py-2.5 bg-[#8d5524] text-white rounded-xl text-sm font-bold hover:bg-[#b87333] transition-all"
            >
              Add
            </button>
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Quick Add</p>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_SUGGESTIONS.filter((s) => !profile.specialties.includes(s)).map((s) => (
                <button
                  key={s}
                  onClick={() => addSpecialty(s)}
                  className="px-3 py-1 bg-gray-100 hover:bg-[#8d5524]/10 hover:text-[#8d5524] hover:border-[#8d5524]/30 border border-gray-200 text-gray-600 rounded-full text-xs font-bold transition-all"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save button at bottom */}
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white hover:-translate-y-0.5 hover:shadow-xl'
          }`}
        >
          <i className={`fas fa-${saved ? 'check-circle' : 'save'} mr-2`} />
          {saved ? 'Profile Saved Successfully!' : 'Save All Changes'}
        </button>
      </div>
    </>
  );
}