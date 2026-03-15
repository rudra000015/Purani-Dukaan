// src/lib/googlePlaces.ts
// Server-only — fetches live data (photos, hours, open status) from Google
// Called only when shop has a googlePlaceId in their owner profile
// This supplements Overpass OSM data — NOT the primary source

const PLACES_BASE = 'https://places.googleapis.com/v1';
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export interface GoogleLiveData {
  rating: number;
  totalRatings: number;
  openNow: boolean | null;
  openingHours: string[];
  photos: string[];
  phone?: string;
  website?: string;
  priceLevel?: number;
}

// Only called when shop owner has provided their Google Place ID
export async function fetchGoogleLiveData(placeId: string): Promise<GoogleLiveData | null> {
  if (!API_KEY) {
    console.warn('[googlePlaces] GOOGLE_PLACES_API_KEY not set — skipping live data');
    return null;
  }

  try {
    const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': [
          'rating',
          'userRatingCount',
          'currentOpeningHours',
          'regularOpeningHours',
          'nationalPhoneNumber',
          'websiteUri',
          'photos',
          'priceLevel',
        ].join(','),
      },
      next: { revalidate: 1800 }, // refresh every 30 min
    });

    if (!res.ok) return null;
    const data = await res.json();

    const photos: string[] = (data.photos ?? [])
      .slice(0, 8)
      .map((p: any) => `/api/photo?name=${encodeURIComponent(p.name)}`);

    return {
      rating: data.rating ?? 0,
      totalRatings: data.userRatingCount ?? 0,
      openNow: data.currentOpeningHours?.openNow ?? null,
      openingHours: data.regularOpeningHours?.weekdayDescriptions ?? [],
      photos,
      phone: data.nationalPhoneNumber,
      website: data.websiteUri,
      priceLevel: data.priceLevel,
    };
  } catch (err) {
    console.error('[googlePlaces] fetch error:', err);
    return null;
  }
}

// Photo proxy route handler (put in src/app/api/photo/route.ts)
// Proxies Google photo URLs so the API key stays server-side
export async function fetchGooglePhoto(name: string, maxWidth = 800): Promise<Response> {
  if (!API_KEY) return new Response('No API key', { status: 500 });

  const url = `${PLACES_BASE}/${name}/media?maxWidthPx=${maxWidth}&skipHttpRedirect=true&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return new Response('Photo fetch failed', { status: res.status });

  const data = await res.json();
  if (!data.photoUri) return new Response('No photo URI', { status: 404 });

  return Response.redirect(data.photoUri, 302);
}