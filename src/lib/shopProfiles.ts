// src/lib/shopProfiles.ts
// Stores owner-filled shop profiles
// Currently uses a JSON file — swap this for a real DB (Supabase/MongoDB/PlanetScale) later

import { promises as fs } from 'fs';
import path from 'path';
import { ShopOwnerProfile } from '@/types/shop';

const DATA_FILE = path.join(process.cwd(), 'data', 'shopProfiles.json');

// ── Read all profiles ─────────────────────────────────────────
export async function getAllProfiles(): Promise<Record<string, ShopOwnerProfile>> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// ── Get one profile by shop ID ────────────────────────────────
export async function getProfile(shopId: string): Promise<ShopOwnerProfile | null> {
  const all = await getAllProfiles();
  return all[shopId] ?? null;
}

// ── Save / update a profile ───────────────────────────────────
export async function saveProfile(shopId: string, profile: ShopOwnerProfile): Promise<void> {
  const all = await getAllProfiles();
  all[shopId] = profile;

  // Ensure data/ directory exists
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

// ── Delete a profile ──────────────────────────────────────────
export async function deleteProfile(shopId: string): Promise<void> {
  const all = await getAllProfiles();
  delete all[shopId];
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}