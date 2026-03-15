// src/app/api/visual-search/route.ts
// Google Lens-style visual search — uses Claude Vision to identify
// the product in an uploaded image, then searches shops for matches
// FREE — uses your existing Anthropic API key

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing ANTHROPIC_API_KEY in .env.local' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const imageUrl  = formData.get('imageUrl') as string | null;

    if (!imageFile && !imageUrl) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to base64
    let base64Data = '';
    let mediaType  = 'image/jpeg';

    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      base64Data   = Buffer.from(buffer).toString('base64');
      mediaType    = imageFile.type || 'image/jpeg';
    } else if (imageUrl) {
      // Fetch from URL
      const imgRes = await fetch(imageUrl);
      const buffer = await imgRes.arrayBuffer();
      base64Data   = Buffer.from(buffer).toString('base64');
      mediaType    = imgRes.headers.get('content-type') || 'image/jpeg';
    }

    // Call Claude Vision to identify the product
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: 'text',
                text: `You are a product identification assistant for an Indian heritage shop app in Meerut, UP.

Look at this image and identify what product, food item, or category it shows.

Respond with ONLY a JSON object (no markdown, no explanation):
{
  "productName": "English name of the product",
  "productNameHindi": "Hindi name if applicable",
  "category": "one of: sweets, namkeen, grocery, dairy, bakery, spices, pharmacy, puja, seasonal, dry-fruits, beverages, general",
  "searchKeywords": ["keyword1", "keyword2", "keyword3"],
  "confidence": "high | medium | low",
  "description": "one sentence describing what you see"
}

If the image is not a product (e.g. a person, landscape, etc.), set category to "general" and confidence to "low".`,
              },
            ],
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error('[visual-search] Claude API error:', err);
      return NextResponse.json({ error: 'Vision API failed' }, { status: 500 });
    }

    const claudeData = await claudeRes.json();
    const textContent = claudeData.content?.find((c: any) => c.type === 'text')?.text ?? '{}';

    // Parse Claude's JSON response
    let identified: any = {};
    try {
      identified = JSON.parse(textContent.replace(/```json|```/g, '').trim());
    } catch {
      identified = {
        productName: 'Unknown product',
        category: 'general',
        searchKeywords: [],
        confidence: 'low',
        description: 'Could not identify product',
      };
    }

    // Now search Overpass for matching shops
    const { searchNearbyShops, textSearchShops } = await import('@/lib/overpass');

    const searchTerm = [identified.productName, ...(identified.searchKeywords ?? [])].join(' ');
    const shops = await textSearchShops(searchTerm + ' Meerut', 28.9845, 77.7064, 5000)
      .catch(() => []);

    return NextResponse.json({
      identified,
      shops,
      searchTerm,
    });

  } catch (err: any) {
    console.error('[visual-search]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
