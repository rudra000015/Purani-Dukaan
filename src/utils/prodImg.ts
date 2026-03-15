const COLORS = ['#f3e8dc', '#ede0d4', '#e6ccb2', '#ddb892', '#d4a373', '#c49a6c'];
const EMOJIS = ['🍯', '🍬', '🧁', '🍮', '🫓', '🍡'];

export function prodImg(name: string, i: number, uploadedUrl?: string): string {
  // If the product has a real uploaded image, use it
  if (uploadedUrl) return uploadedUrl;

  // Otherwise fall back to SVG placeholder
  const c = COLORS[i % COLORS.length];
  const emoji = EMOJIS[i % EMOJIS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="400" height="400" fill="${c}"/>
    <text x="200" y="175" text-anchor="middle" font-family="sans-serif" font-size="72">${emoji}</text>
    <text x="200" y="245" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#5d4037" font-weight="bold">${name.substring(0, 20)}</text>
    <text x="200" y="268" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#8d6748">tap to add photo</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}