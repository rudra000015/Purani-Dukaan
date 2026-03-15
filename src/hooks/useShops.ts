'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shop } from '@/types/shop';

interface UseShopsOptions {
  lat?: number;
  lng?: number;
  radius?: number;
  query?: string;
  enabled?: boolean; // set false to skip auto-fetch
}

interface UseShopsReturn {
  shops: Shop[];
  loading: boolean;
  error: string | null;
  refetch: (searchQuery?: string) => Promise<void>;
}

// ── useShops: fetch a list of shops ──────────────────────────
export function useShops(opts: UseShopsOptions = {}): UseShopsReturn {
  const {
    lat = 28.9845,
    lng = 77.7064,
    radius = 3000,
    query,
    enabled = true,
  } = opts;

  const [shops, setShops]     = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchShops = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set('q', searchQuery);
      } else {
        params.set('lat', String(lat));
        params.set('lng', String(lng));
        params.set('radius', String(radius));
      }

      const res = await fetch(`/api/shops?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setShops(data.shops ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, radius]);

  useEffect(() => {
    if (!enabled) return;
    fetchShops(query);
  }, [enabled, fetchShops, query]);

  return { shops, loading, error, refetch: fetchShops };
}

// ── useShopDetail: fetch a single shop by Place ID ────────────
interface UseShopDetailReturn {
  shop: Shop | null;
  loading: boolean;
  error: string | null;
}

export function useShopDetail(placeId: string | null): UseShopDetailReturn {
  const [shop, setShop]       = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/shops/${placeId}`)
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then(d => { if (!cancelled) setShop(d.shop); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [placeId]);

  return { shop, loading, error };
}