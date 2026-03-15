import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const publicKey =
    process.env.VAPID_PUBLIC_KEY ??
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
    '';

  if (!publicKey) {
    return NextResponse.json(
      { error: 'Missing VAPID public key. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env.local.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ publicKey }, { status: 200 });
}

