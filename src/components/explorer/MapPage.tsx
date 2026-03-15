'use client';
 
import { useEffect, useRef } from 'react';
import { useShops } from '@/hooks/useShops';
import { useStore } from '@/store/useStore';
 
export default function MapPage() {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef  = useRef<any[]>([]);
 
  const { openShop, showToast } = useStore();
  const { shops, loading }      = useShops({ radius: 4000 });
 
  // Init Leaflet map once
  useEffect(() => {
    if (mapInstance.current) return;
    if (!mapRef.current) return;

    let isCancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' });
 
      if (isCancelled) return;

      // React 18 StrictMode mounts/unmounts components twice in dev; Leaflet needs explicit cleanup.
      const map = L.map(mapRef.current!).setView([28.9845, 77.7064], 15);
      mapInstance.current = map;
 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
 
      L.circle([28.9845, 77.7064], {
        color: '#8d5524', fillColor: '#8d5524', fillOpacity: 0.04, radius: 2500, weight: 1,
      }).addTo(map);
    })();

    return () => {
      isCancelled = true;
      try {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        mapInstance.current?.remove?.();
      } catch {}
      mapInstance.current = null;
    };
  }, []);
 
  // Place markers when shops load
  useEffect(() => {
    if (!shops.length || !mapInstance.current) return;
    (async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstance.current;
 
      // Clear old markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
 
      const iconMap: Record<string, string> = {
        pharmacy: 'prescription-bottle-alt',
        grocery: 'shopping-cart',
        sweets: 'cookie',
        general: 'store',
      };
 
      shops.forEach(s => {
        const icon = L.divIcon({
          className: '',
          html: `<div class="cm"><i class="fas fa-${iconMap[s.cat] ?? 'store'}"></i></div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
 
        const openBadge =
          s.openNow !== null && s.openNow !== undefined
            ? `<span style="color:${s.openNow ? '#059669' : '#ef4444'};font-weight:700;font-size:10px">
               ${s.openNow ? '● Open Now' : '● Closed'}</span>`
            : '';
 
        const photoHtml = s.photos?.[0]
          ? `<img src="${s.photos[0]}" style="width:100%;height:70px;object-fit:cover;border-radius:8px;margin-bottom:8px">`
          : '';
 
        const marker = L.marker(s.loc, { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:210px;padding:4px">
              ${photoHtml}
              <h4 style="font-weight:800;font-size:14px;margin:0 0 4px">${s.name}</h4>
              <p style="font-size:11px;color:#8d5524;font-weight:600;margin:0 0 2px">
                ⭐ ${s.rating.toFixed(1)} (${s.totalRatings} reviews)
              </p>
              ${openBadge ? `<p style="margin:0 0 4px">${openBadge}</p>` : ''}
              <p style="font-size:11px;color:#666;margin:0 0 8px">${s.addr}</p>
              <button onclick="window.__openShop('${s.id}')"
                style="background:#8d5524;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;width:100%">
                Explore Shop
              </button>
            </div>
          `);
 
        markersRef.current.push(marker);
      });
 
      // Expose to Leaflet popup (outside React tree)
      (window as any).__openShop = openShop;
    })();
  }, [shops, openShop]);
 
  const locateMe = async () => {
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const L = (await import('leaflet')).default;
        const map = mapInstance.current;
        if (!map) return;
        const icon = L.divIcon({
          className: '',
          html: '<div class="cm um"><i class="fas fa-street-view"></i></div>',
          iconSize: [40, 40], iconAnchor: [20, 20],
        });
        L.marker([pos.coords.latitude, pos.coords.longitude], { icon })
          .addTo(map)
          .bindPopup('<b>You are here</b>')
          .openPopup();
        map.setView([pos.coords.latitude, pos.coords.longitude], 16);
      },
      () => showToast('Location denied. Showing Meerut.')
    );
  };
 
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#3e2723]">Heritage Map</h2>
          <p className="text-gray-500">
            {loading ? (
              <span><i className="fas fa-spinner fa-spin mr-1" />Loading shops...</span>
            ) : (
              `${shops.length} shops on map`
            )}
          </p>
        </div>
        <button
          onClick={locateMe}
          className="bg-gradient-to-br from-[#8d5524] to-[#b87333] text-white px-4 py-2 rounded-lg text-sm font-bold hover:-translate-y-0.5 transition-all"
        >
          <i className="fas fa-location-arrow mr-2" />Find Me
        </button>
      </div>
 
      <div className="bg-white p-4 rounded-2xl shadow-lg border">
        <div ref={mapRef} style={{ height: '55vh', minHeight: 350, borderRadius: '1rem' }} />
      </div>
 
      {/* Quick cards below map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {shops.slice(0, 3).map(s => (
          <div
            key={s.id}
            onClick={() => openShop(s.id)}
            className="bg-white p-4 rounded-2xl border shadow-sm cursor-pointer hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3">
              {s.photos?.[0] ? (
                <img
                  src={s.photos[0]}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  alt={s.name}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#8d5524]/10 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-store text-[#8d5524]" />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-bold text-sm truncate">{s.name}</h4>
                <p className="text-[10px] text-gray-400">
                  ⭐ {s.rating.toFixed(1)} •{' '}
                  {s.openNow ? (
                    <span className="text-green-500">Open</span>
                  ) : s.openNow === false ? (
                    <span className="text-red-400">Closed</span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
