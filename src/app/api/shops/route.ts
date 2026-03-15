import { NextRequest, NextResponse } from 'next/server';

import { SHOPS } from '@/data/shops';
import { searchNearbyShops, textSearchShops } from '@/lib/overpass';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').trim();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius');

  const latNum = lat ? Number(lat) : undefined;
  const lngNum = lng ? Number(lng) : undefined;
  const radiusNum = radius ? Number(radius) : undefined;

  const qLower = q.toLowerCase();
  const stop = new Set(['meerut', 'up', 'uttar', 'pradesh', 'uttarpradesh', 'india']);
  const tokens = qLower
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => !stop.has(t));

  const staticMatches =
    tokens.length > 0
      ? SHOPS.filter((s) => {
          const hay = [
            s.name,
            s.addr,
            s.story ?? '',
            ...(s.products ?? []).map((p) => p.name),
          ]
            .join(' ')
            .toLowerCase();

          // Match if any meaningful token is present. (Avoid requiring full phrase match like "jalebi meerut".)
          return tokens.some((t) => hay.includes(t));
        })
      : SHOPS;

  try {
    const osmPromise =
      q.length > 0
        ? textSearchShops(q, latNum, lngNum, radiusNum)
        : searchNearbyShops(latNum, lngNum, radiusNum);

    // Overpass can be slow/unreachable; keep UI snappy by timing out quickly.
    const timeoutPromise = new Promise<typeof staticMatches>((resolve) =>
      setTimeout(() => resolve([]), 3000)
    );

    const osmShops = await Promise.race([osmPromise, timeoutPromise]);

    // Always include local demo shops too (these have products/discounts so filters work in the UI).
    const merged = [...(osmShops ?? []), ...staticMatches];
    const uniq = Array.from(new Map(merged.map((s) => [s.id, s])).values());

    return NextResponse.json({ shops: uniq }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (err: any) {
    console.error('[GET /api/shops]', err?.message ?? err);
    return NextResponse.json({ shops: staticMatches, error: 'fallback' }, { status: 200 });
  }
}
