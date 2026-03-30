/**
 * Generate PWA icons for PalliCare Patient app.
 * Uses sharp (bundled with Next.js) to create PNG icons from SVG.
 *
 * Run: node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

// PalliCare brand colors
const TEAL = '#2A6B6B';
const CREAM = '#FFF8F0';
const WHITE = '#FFFFFF';

// SVG template for the icon: a rounded heart + leaf motif inside a circle
function createIconSvg(size) {
  const pad = Math.round(size * 0.15);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - pad;

  // Heart shape centered in circle
  const heartScale = r * 0.55;
  const hx = cx;
  const hy = cy - r * 0.05;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${TEAL}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${WHITE}" stroke-width="${Math.max(2, size * 0.015)}" opacity="0.15"/>
  <!-- Heart -->
  <g transform="translate(${hx}, ${hy}) scale(${heartScale / 24})">
    <path d="M0 6 C0 -2, -12 -2, -12 4 C-12 10, 0 18, 0 18 C0 18, 12 10, 12 4 C12 -2, 0 -2, 0 6Z"
          fill="${WHITE}" opacity="0.95"/>
    <!-- Small leaf accent -->
    <path d="M3 -5 C6 -9, 11 -7, 8 -3 C6 0, 3 -2, 3 -5Z"
          fill="${CREAM}" opacity="0.7"/>
  </g>
  <!-- "PC" text below -->
  <text x="${cx}" y="${cy + r * 0.72}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${Math.round(size * 0.1)}"
        font-weight="bold" fill="${WHITE}" opacity="0.6">
    PalliCare
  </text>
</svg>`;
}

// Maskable icon: same but with extra safe-zone padding (40% inset circle)
function createMaskableSvg(size) {
  const cx = size / 2;
  const cy = size / 2;
  const safeR = size * 0.35; // smaller to fit within maskable safe zone

  const heartScale = safeR * 0.55;
  const hx = cx;
  const hy = cy - safeR * 0.08;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${TEAL}"/>
  <!-- Heart centered in safe zone -->
  <g transform="translate(${hx}, ${hy}) scale(${heartScale / 24})">
    <path d="M0 6 C0 -2, -12 -2, -12 4 C-12 10, 0 18, 0 18 C0 18, 12 10, 12 4 C12 -2, 0 -2, 0 6Z"
          fill="${WHITE}" opacity="0.95"/>
    <path d="M3 -5 C6 -9, 11 -7, 8 -3 C6 0, 3 -2, 3 -5Z"
          fill="${CREAM}" opacity="0.7"/>
  </g>
</svg>`;
}

const sizes = [192, 512];

async function generate() {
  for (const size of sizes) {
    // Regular icon
    const svg = createIconSvg(size);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(join(outDir, `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);

    // Maskable icon
    const maskSvg = createMaskableSvg(size);
    await sharp(Buffer.from(maskSvg))
      .png()
      .toFile(join(outDir, `icon-maskable-${size}.png`));
    console.log(`✓ icon-maskable-${size}.png`);
  }

  // Also create a favicon-sized icon (32x32)
  const fav = createIconSvg(32);
  await sharp(Buffer.from(fav)).png().toFile(join(outDir, '..', 'favicon.png'));
  console.log('✓ favicon.png');

  // Apple touch icon (180x180)
  const apple = createIconSvg(180);
  await sharp(Buffer.from(apple))
    .png()
    .toFile(join(outDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  console.log('\nAll icons generated in public/icons/');
}

generate().catch(console.error);
