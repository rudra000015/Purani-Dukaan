import { NextRequest, NextResponse } from 'next/server';
import { getShopById } from '@/lib/overpass';
import { SHOPS } from '@/data/shops';

export async function GET(
  _req: NextRequest,
  { params }: { params: { placeId: string } }
) {
  const { placeId } = params;

  if (!placeId) {
    return NextResponse.json({ error: 'placeId is required' }, { status: 400 });
  }

  const staticShop = SHOPS.find((s) => s.id === placeId);
  if (staticShop) return NextResponse.json({ shop: staticShop });

  try {
    const shop = await getShopById(placeId);

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json(
      { shop },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (err: any) {
    console.error(`[GET /api/shops/${placeId}]`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
