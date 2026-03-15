'use client';

import { useState } from 'react';
import { useShopDetail } from '@/hooks/useShops';
import { useStore } from '@/store/useStore';
import { prodImg } from '@/utils/prodImg';
import { MenuItem, DayHours } from '@/types/shop';
import ReviewsSection from './ReviewsSection';
import FollowShopButton from './FollowShopButton';

// ── Action buttons ────────────────────────────────────────────
function ActionButtons({ profile }: { profile: any }) {
  if (!profile) return null;

  const handleCall = () => {
    if (profile.ownerPhone) window.location.href = `tel:${profile.ownerPhone}`;
  };

  const handleWhatsApp = () => {
    const num = profile.whatsapp || profile.ownerPhone?.replace(/\D/g, '');
    if (!num) return;
    const msg = encodeURIComponent(`Hi! I found your shop on Purani Dukan app. I'd like to know more.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  };

  const handleDirections = () => {
    if (profile.googleMapsUrl) {
      window.open(profile.googleMapsUrl, '_blank');
    } else if (profile.lat && profile.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${profile.lat},${profile.lng}`,
        '_blank'
      );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this shop on Purani Dukan',
        text: `${profile.ownerName}'s shop — ${profile.speciality}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {/* Call */}
      {profile.ownerPhone && (
        <button
          onClick={handleCall}
          className="flex flex-col items-center gap-1.5 py-3 bg-green-50 rounded-2xl border border-green-100 hover:bg-green-100 transition-all group"
        >
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <i className="fas fa-phone text-white text-sm" />
          </div>
          <span className="text-xs font-bold text-green-700">Call</span>
        </button>
      )}

      {/* WhatsApp */}
      {(profile.whatsapp || profile.ownerPhone) && (
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-1.5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all group"
        >
          <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <i className="fab fa-whatsapp text-white text-lg" />
          </div>
          <span className="text-xs font-bold text-emerald-700">WhatsApp</span>
        </button>
      )}

      {/* Directions */}
      <button
        onClick={handleDirections}
        className="flex flex-col items-center gap-1.5 py-3 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all group"
      >
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <i className="fas fa-directions text-white text-sm" />
        </div>
        <span className="text-xs font-bold text-blue-700">Directions</span>
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        className="flex flex-col items-center gap-1.5 py-3 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-all group"
      >
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <i className="fas fa-share-alt text-white text-sm" />
        </div>
        <span className="text-xs font-bold text-purple-700">Share</span>
      </button>
    </div>
  );
}

// ── Photo gallery ─────────────────────────────────────────────
function PhotoGallery({ photos, name }: { photos: string[]; name: string }) {
  const [active, setActive] = useState(0);
  if (!photos.length) return null;

  return (
    <div className="mb-6">
      {/* Main photo */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-gray-100 mb-2">
        <img
          src={photos[active]}
          alt={name}
          className="w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/shapes/svg?seed=${name}`; }}
        />
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full font-bold">
          {active + 1}/{photos.length}
        </div>
      </div>
      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                active === i ? 'border-[#8d5524] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={p} alt="" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Open / Closed badge ───────────────────────────────────────
function OpenStatus({ openNow, hoursText }: { openNow?: boolean | null; hoursText?: string }) {
  if (openNow === null || openNow === undefined) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
      openNow
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-600 border border-red-200'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${openNow ? 'bg-green-500' : 'bg-red-500'}`} />
      {openNow ? 'Open Now' : 'Closed'}
      {hoursText && <span className="font-normal opacity-70 ml-1">{hoursText}</span>}
    </span>
  );
}

// ── Opening hours table ───────────────────────────────────────
function OpeningHoursBlock({ hours }: { hours: string[] | undefined }) {
  if (!hours?.length) return null;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
      <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
        <i className="fas fa-clock text-[#8d5524]" /> Opening Hours
      </h4>
      <div className="space-y-1.5">
        {hours.map((h, i) => {
          const isToday = h.startsWith(today);
          return (
            <div key={i} className={`flex justify-between text-sm px-2 py-1 rounded-lg ${
              isToday ? 'bg-[#8d5524]/10 font-bold text-[#8d5524]' : 'text-gray-600'
            }`}>
              <span>{h.split(':')[0]}</span>
              <span>{h.split(': ').slice(1).join(': ')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Menu section ──────────────────────────────────────────────
function MenuSection({ menu }: { menu: MenuItem[] }) {
  if (!menu?.length) return null;

  // Group by category
  const grouped = menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="mb-6">
      <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
        <i className="fas fa-utensils text-[#8d5524]" /> Menu
      </h3>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-5">
          <h4 className="text-sm font-black text-[#8d5524] uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="h-px flex-grow bg-[#8d5524]/20" />
            {cat}
            <span className="h-px flex-grow bg-[#8d5524]/20" />
          </h4>
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.isAvailable ? 'bg-white hover:border-[#8d5524]/30' : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Veg/Non-veg dot */}
                  <div className={`mt-1 w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${
                    item.isVeg ? 'border-green-600' : 'border-red-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">{item.name}</span>
                      {item.nameHindi && (
                        <span className="text-xs text-gray-400">{item.nameHindi}</span>
                      )}
                      {item.isSignature && (
                        <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          SIGNATURE
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-black text-[#8d5524]">
                    ₹{item.price}
                    <span className="text-xs text-gray-400 font-normal">/{item.unit}</span>
                  </p>
                  {!item.isAvailable && (
                    <span className="text-[10px] text-red-400 font-bold">Not available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Owner info card ───────────────────────────────────────────
function OwnerCard({ profile, ownerImg }: { profile: any; ownerImg: string }) {
  return (
    <div className="bg-gradient-to-br from-[#3e2723] to-[#5d4037] rounded-3xl p-5 text-white mb-6">
      <div className="flex items-center gap-4 mb-4">
        <img src={ownerImg} alt={profile.ownerName}
          className="w-16 h-16 rounded-2xl border-2 border-white/20 bg-white/10 object-cover" />
        <div>
          <p className="font-black text-lg">{profile.ownerName}</p>
          {profile.speciality && (
            <p className="text-[#d2b48c] text-sm">{profile.speciality}</p>
          )}
          {profile.established && (
            <p className="text-white/60 text-xs">Est. {profile.established}</p>
          )}
        </div>
        {profile.isVerified && (
          <div className="ml-auto">
            <span className="text-[10px] font-black bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
              <i className="fas fa-check-circle" /> Verified
            </span>
          </div>
        )}
      </div>

      {profile.bio && (
        <p className="text-white/80 text-sm italic leading-relaxed border-l-2 border-[#b87333] pl-3">
          &quot;{profile.bio}&quot;
        </p>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap gap-2 mt-4">
        {profile.fssaiNumber && (
          <span className="text-[10px] bg-white/10 border border-white/20 px-2 py-1 rounded-full font-bold">
            <i className="fas fa-shield-alt mr-1" />FSSAI: {profile.fssaiNumber}
          </span>
        )}
        {profile.instagram && (
          <a href={`https://instagram.com/${profile.instagram}`} target="_blank"
            className="text-[10px] bg-white/10 border border-white/20 px-2 py-1 rounded-full font-bold hover:bg-white/20">
            <i className="fab fa-instagram mr-1" />@{profile.instagram}
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
type Tab = 'overview' | 'menu' | 'products' | 'hours' | 'reviews' | 'info';

export default function ShopProfile() {
  const { currentShopId, navTo, viewProduct, toggleWish, isWished } = useStore();
  const { shop: s, loading, error } = useShopDetail(currentShopId);
  const [tab, setTab] = useState<Tab>('overview');

  const TABS = ([
    { id: 'overview', label: 'Overview', icon: 'home', show: true },
    { id: 'menu', label: 'Menu', icon: 'utensils', show: !!(s?.ownerProfile?.menu?.length) },
    { id: 'products', label: 'Products', icon: 'box', show: !!(s?.products?.length) },
    { id: 'hours', label: 'Hours', icon: 'clock', show: !!(s?.openingHours?.length || s?.ownerProfile?.openingHoursText) },
    { id: 'reviews', label: 'Reviews', icon: 'star', show: true },
    { id: 'info', label: 'Info', icon: 'info-circle', show: true },
  ] as const satisfies ReadonlyArray<{ id: Tab; label: string; icon: string; show: boolean }>)
    .filter((t) => t.show) as { id: Tab; label: string; icon: string; show: boolean }[];

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-3xl mb-4" />
      <div className="bg-white rounded-3xl p-6">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="h-32 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );

  if (error || !s) return (
    <div className="text-center py-20">
      <i className="fas fa-exclamation-triangle text-4xl text-red-300 block mb-4" />
      <p className="text-red-400 font-bold mb-4">{error ?? 'Shop not found'}</p>
      <button onClick={() => navTo('home')} className="text-[#8d5524] font-bold hover:underline">
        ← Back to Explore
      </button>
    </div>
  );

  const profile = s.ownerProfile;
  const photos = s.photos?.length ? s.photos : [];
  const allPhotos = [...photos, ...(profile?.photos ?? [])].filter(Boolean);
  // Today's hours from structured map
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const todayKey = dayKeys[new Date().getDay()];
  const todayHours = profile?.openingHoursMap?.[todayKey];
  const todayText =
    todayHours && !todayHours.closed
      ? `${todayHours.open} - ${todayHours.close}`
      : todayHours?.closed
        ? 'Closed today'
        : undefined;

  return (
    <>
      {/* Back */}
      <button onClick={() => navTo('home')}
        className="mb-4 text-sm font-bold text-gray-500 hover:text-[#8d5524] flex items-center gap-2 transition-colors">
        <i className="fas fa-arrow-left" /> Back
      </button>

      {/* Photo gallery */}
      {allPhotos.length > 0 && <PhotoGallery photos={allPhotos} name={s.name} />}

      <div className="bg-white rounded-[2.5rem] p-5 md:p-8 shadow-lg border">

        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black text-gray-800">{s.name}</h2>
              {profile?.isVerified && (
                <i className="fas fa-check-circle text-green-500 text-lg" title="Verified Shop" />
              )}
            </div>
            <p className="text-sm text-gray-400 capitalize">{s.cat} • {s.addr.split(',')[0]}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {s.rating > 0 && (
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                <i className="fas fa-star text-yellow-500 text-sm" />
                <span className="font-black text-sm">{s.rating.toFixed(1)}</span>
                {s.totalRatings > 0 && (
                  <span className="text-gray-400 text-xs">({s.totalRatings.toLocaleString()})</span>
                )}
              </div>
            )}
            <OpenStatus openNow={s.openNow} hoursText={todayText} />
          </div>
        </div>

        {/* Tagline */}
        {profile?.tagline && (
          <p className="text-sm font-bold text-[#8d5524] italic mb-4">{profile.tagline}</p>
        )}

        {/* Follow */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <FollowShopButton shopId={s.id} shopName={s.name} />
        </div>

        {/* Action buttons */}
        <ActionButtons profile={profile} />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar bg-gray-50 p-1 rounded-2xl">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-white text-[#8d5524] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}>
              <i className={`fas fa-${t.icon} text-[10px]`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ─────────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            {/* Owner card */}
            {profile && <OwnerCard profile={profile} ownerImg={s.ownerImg} />}

            {/* Description */}
            {(profile?.description || s.story) && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 border-l-4 border-[#8d5524]">
                <h4 className="font-bold text-sm text-gray-600 mb-2">About</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {profile?.description || s.story}
                </p>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-[#8d5524]/6 rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-[#8d5524]">{s.age}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Years</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-green-600">
                  {(profile?.menu?.length ?? 0) + s.products.length}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Items</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-amber-600">{s.rating.toFixed(1)}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Rating</p>
              </div>
            </div>

            {/* Address + map link */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl mb-4">
              <i className="fas fa-map-marker-alt mt-1 text-[#8d5524] flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">{profile?.fullAddress || s.addr}</p>
                {profile?.landmark && (
                  <p className="text-xs text-gray-400 mt-1">
                    <i className="fas fa-flag mr-1" />Near {profile.landmark}
                  </p>
                )}
                {(profile?.lat || s.loc) && (
                  <button
                    onClick={() => {
                      const lat = profile?.lat || s.loc[0];
                      const lng = profile?.lng || s.loc[1];
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                    }}
                    className="text-xs text-blue-500 font-bold mt-1 hover:underline"
                  >
                    <i className="fas fa-external-link-alt mr-1" />Open in Google Maps
                  </button>
                )}
              </div>
            </div>

            {/* Phone / Website */}
            <div className="space-y-2">
              {(profile?.ownerPhone || s.phone) && (
                <a href={`tel:${profile?.ownerPhone || s.phone}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <i className="fas fa-phone text-green-500 w-5" />
                  <span className="text-sm text-gray-600">{profile?.ownerPhone || s.phone}</span>
                </a>
              )}
              {(s.website || profile?.instagram) && (
                <a href={s.website || `https://instagram.com/${profile?.instagram}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <i className={`fas fa-${s.website ? 'globe' : 'instagram'} text-blue-500 w-5`} />
                  <span className="text-sm text-blue-500 truncate">{s.website || `@${profile?.instagram}`}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Menu ─────────────────────────────────────── */}
        {tab === 'menu' && (
          <MenuSection menu={profile?.menu ?? []} />
        )}

        {/* ── Tab: Products ─────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {s.products.map((p, i) => (
                <div key={p.id}
                  className="bg-gray-50 rounded-2xl overflow-hidden border hover:border-[#8d5524]/50 cursor-pointer transition-all hover:-translate-y-1"
                  onClick={() => viewProduct(s.id, p.id)}>
                  <div className="aspect-square bg-gray-100 relative">
                    <img src={p.image || prodImg(p.name, i)} className="w-full h-full object-cover" alt={p.name}
                      onError={e => { (e.target as HTMLImageElement).src = prodImg(p.name, i); }} />
                    {p.isNew && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-[#8d5524] to-[#b87333] text-white text-[9px] font-black px-2 py-0.5 rounded-full">NEW</span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); toggleWish(s.id, p.id, p, s.name); }}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all hover:scale-110 ${
                        isWished(s.id, p.id) ? 'bg-red-500' : 'bg-white'
                      }`}>
                      <i className={`${isWished(s.id, p.id) ? 'fas text-white' : 'far text-gray-400'} fa-heart text-xs`} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-gray-800 truncate">{p.name}</h4>
                    {p.description && <p className="text-xs text-gray-400 truncate">{p.description}</p>}
                    <p className="font-black text-[#8d5524]">
                      ₹{p.price}<span className="text-xs text-gray-400 font-normal">/{p.unit}</span>
                    </p>
                    {!p.inStock && (
                      <span className="text-[10px] text-red-400 font-bold">Out of stock</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {s.products.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <i className="fas fa-box-open text-4xl mb-3 block opacity-20" />
                <p className="text-sm">No products listed yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Hours ────────────────────────────────────── */}
        {tab === 'hours' && (
          <div>
            <OpeningHoursBlock hours={s.openingHours} />
            {profile?.openingHoursText && !s.openingHours?.length && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-clock text-[#8d5524]" /> Opening Hours
                </h4>
                <p className="text-sm text-gray-600">{profile.openingHoursText}</p>
              </div>
            )}
            {profile?.openingHoursMap && (
              <div className="bg-gray-50 rounded-2xl p-4 mt-4">
                <h4 className="font-bold text-sm text-gray-700 mb-3">Weekly Schedule</h4>
                {Object.entries(profile.openingHoursMap).map(([day, hours]) => {
                  const h = hours as DayHours;
                  const isToday = day === todayKey;
                  return (
                    <div key={day} className={`flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm ${
                      isToday ? 'font-bold text-[#8d5524]' : 'text-gray-600'
                    }`}>
                      <span className="capitalize">{day}</span>
                      <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Reviews ──────────────────────────────────── */}
        {tab === 'reviews' && (
          <ReviewsSection shopId={s.id} />
        )}

        {/* ── Tab: Info ─────────────────────────────────────── */}
        {tab === 'info' && (
          <div className="space-y-3">
            {[
              { label: 'Shop Name', value: s.name, icon: 'store' },
              { label: 'Category', value: s.cat.charAt(0).toUpperCase() + s.cat.slice(1), icon: 'tag' },
              { label: 'Established', value: profile?.established || String(s.est), icon: 'calendar' },
              { label: 'Owner', value: profile?.ownerName || s.owner, icon: 'user' },
              { label: 'Address', value: profile?.fullAddress || s.addr, icon: 'map-marker-alt' },
              { label: 'Phone', value: profile?.ownerPhone || s.phone, icon: 'phone' },
              { label: 'WhatsApp', value: profile?.whatsapp, icon: 'whatsapp', fab: true },
              { label: 'Website', value: s.website, icon: 'globe', link: true },
              { label: 'Instagram', value: profile?.instagram, icon: 'instagram', fab: true, link: true, prefix: 'https://instagram.com/' },
              { label: 'FSSAI No.', value: profile?.fssaiNumber, icon: 'shield-alt' },
              { label: 'GSTIN', value: profile?.gstin, icon: 'file-invoice' },
            ]
              .filter(row => row.value)
              .map(row => (
                <div key={row.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <i className={`${row.fab ? 'fab' : 'fas'} fa-${row.icon} text-[#8d5524] w-5 text-center`} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{row.label}</p>
                    {row.link ? (
                      <a href={(row.prefix ?? '') + row.value} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline truncate block">{row.value}</a>
                    ) : (
                      <p className="text-sm text-gray-700 truncate">{row.value}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

      </div>
    </>
  );
}
