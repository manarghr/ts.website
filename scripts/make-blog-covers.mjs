// Generate a cover image per blog category
// File: scripts/make-blog-covers.mjs
//
//   node scripts/make-blog-covers.mjs
//
// Writes public/blog-covers/<category>.svg.
//
// Why generated rather than photographed: the site has twice shipped broken
// images because a hardcoded Unsplash id stopped resolving, and there is no way
// to check from here whether a given photo will still be there next year. These
// are a few hundred bytes each, always resolve, scale to any size, and are
// drawn from the site palette so the blog grid reads as one system.
//
// Swap in real photography later by setting `image` on the article; the card
// only falls back to these when that field is empty.

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "blog-covers");

// One accent per category, all within the site's green/teal family so the grid
// stays cohesive while each category stays recognisable.
const CATEGORIES = {
  training: { base: "#354F52", accent: "#6BB371" },
  nutrition: { base: "#3B5F4A", accent: "#8CC47E" },
  technology: { base: "#2F4A52", accent: "#5FA8A0" },
  wellness: { base: "#42615C", accent: "#9BC9A8" },
  mindset: { base: "#3A5257", accent: "#7FB3B0" },
  progress: { base: "#38544B", accent: "#74BE86" },
};

/** Abstract motif: soft orbs plus a diagonal band. No text -- the card already
 *  prints the category badge, and baking words into an image is untranslatable. */
const cover = ({ base, accent }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="Article cover">
  <title>Article cover</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${base}" stop-opacity="0.82"/>
    </linearGradient>
    <clipPath id="frame"><rect width="1200" height="675"/></clipPath>
  </defs>

  <rect width="1200" height="675" fill="url(#bg)"/>

  <g clip-path="url(#frame)">
    <circle cx="960" cy="140" r="260" fill="${accent}" fill-opacity="0.16"/>
    <circle cx="1090" cy="520" r="180" fill="${accent}" fill-opacity="0.10"/>
    <circle cx="180" cy="590" r="220" fill="#ffffff" fill-opacity="0.05"/>
    <path d="M-100 520 L520 -80 L700 -80 L80 520 Z" fill="${accent}" fill-opacity="0.12"/>
    <path d="M140 675 L760 55 L860 55 L240 675 Z" fill="#ffffff" fill-opacity="0.04"/>
  </g>
</svg>
`;

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const [name, palette] of Object.entries(CATEGORIES)) {
    await writeFile(join(OUT, `${name}.svg`), cover(palette), "utf8");
  }

  console.log(`wrote ${Object.keys(CATEGORIES).length} covers to public/blog-covers/`);
}

main().catch((error) => {
  console.error("Failed to write covers:", error.message);
  process.exitCode = 1;
});
