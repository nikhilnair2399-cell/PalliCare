/**
 * Batch-fix mobile responsive issues across all patient pages.
 * Applies consistent responsive patterns:
 *   - Card padding: p-6 → p-4 sm:p-6 (tighter on mobile)
 *   - Card padding: p-5 → p-4 sm:p-5
 *   - Large headings: text-3xl → text-2xl sm:text-3xl
 *   - Section headings: text-xl → text-lg sm:text-xl (in font-heading context)
 *   - Buttons: h-14 → h-12 sm:h-14, rounded-2xl → rounded-xl sm:rounded-2xl
 *   - Container spacing: space-y-6 → space-y-4 sm:space-y-6
 *   - Overflow protection on cards
 *   - Input heights: h-14 → h-12 sm:h-14
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, relative } from 'path';
import { globSync } from 'fs';

const ROOT = resolve('src/app/patient');

// Find all page.tsx files under patient/
import { readdirSync, statSync } from 'fs';
function walk(dir) {
  let results = [];
  for (const f of readdirSync(dir)) {
    const full = resolve(dir, f);
    if (statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (f === 'page.tsx') results.push(full);
  }
  return results;
}

const files = walk(ROOT);
// Skip home and login (already fixed)
const skip = ['src\\app\\patient\\page.tsx', 'src\\app\\patient\\login\\page.tsx'];

let totalChanges = 0;

for (const file of files) {
  const rel = relative(resolve('.'), file);
  if (skip.some(s => rel.endsWith(s.replace(/\//g, '\\')) || rel.endsWith(s))) continue;

  let content = readFileSync(file, 'utf8');
  const original = content;
  let changes = 0;

  // 1. Card padding: "rounded-2xl bg-white p-6" → add overflow-hidden + responsive
  //    But skip if already has "sm:p-6" or "overflow-hidden"
  content = content.replace(
    /rounded-2xl bg-white p-6(?!\s)/g,
    (match) => {
      changes++;
      return 'overflow-hidden rounded-2xl bg-white p-4 sm:p-6';
    }
  );

  // 2. Card padding p-5 (some pages use p-5)
  content = content.replace(
    /rounded-2xl bg-white p-5(?!\s)/g,
    (match) => {
      changes++;
      return 'overflow-hidden rounded-2xl bg-white p-4 sm:p-5';
    }
  );

  // 3. Large hero-style padding
  content = content.replace(
    /rounded-2xl bg-white p-8(?!\s)/g,
    (match) => {
      changes++;
      return 'overflow-hidden rounded-2xl bg-white p-5 sm:p-8';
    }
  );

  // 4. Heading text-3xl → responsive (font-heading context)
  content = content.replace(
    /font-heading text-3xl font-bold/g,
    (match) => {
      changes++;
      return 'font-heading text-xl sm:text-3xl font-bold';
    }
  );

  // 5. Sub-heading text-2xl → responsive
  content = content.replace(
    /font-heading text-2xl font-bold/g,
    (match) => {
      changes++;
      return 'font-heading text-lg sm:text-2xl font-bold';
    }
  );

  // 6. Section heading text-xl → responsive (only font-heading ones)
  content = content.replace(
    /font-heading text-xl font-bold/g,
    (match) => {
      changes++;
      return 'font-heading text-base sm:text-xl font-bold';
    }
  );

  // 7. Container spacing
  content = content.replace(
    /max-w-2xl space-y-6/g,
    (match) => {
      changes++;
      return 'max-w-2xl space-y-4 sm:space-y-6';
    }
  );

  // 8. Large buttons: h-14 w-full ... rounded-2xl
  content = content.replace(
    /h-14 w-full(.*?)rounded-2xl bg-teal/g,
    (match, middle) => {
      changes++;
      return `h-12 sm:h-14 w-full${middle}rounded-xl sm:rounded-2xl bg-teal`;
    }
  );

  // 9. Standalone h-14 inputs (but not ones already responsive)
  // Fix: h-14 in input contexts where no sm: exists nearby
  content = content.replace(
    /className="h-14 (flex-1|w-full)([^"]*?)rounded-2xl border/g,
    (match, sizing, middle) => {
      changes++;
      return `className="h-12 sm:h-14 ${sizing}${middle}rounded-xl sm:rounded-2xl border`;
    }
  );

  // 10. Cancel/secondary buttons with rounded-2xl
  content = content.replace(
    /h-14(.*?)rounded-2xl bg-cream/g,
    (match, middle) => {
      changes++;
      return `h-12 sm:h-14${middle}rounded-xl sm:rounded-2xl bg-cream`;
    }
  );

  // 11. Space-y in card content areas
  content = content.replace(
    /rounded-2xl bg-cream\/50 p-6/g,
    (match) => {
      changes++;
      return 'rounded-2xl bg-cream/50 p-4 sm:p-6';
    }
  );

  // 12. Big toggle switches h-7 w-12 → h-6 w-10 sm:h-7 sm:w-12
  content = content.replace(
    /h-7 w-12 rounded-full/g,
    (match) => {
      changes++;
      return 'h-6 w-10 sm:h-7 sm:w-12 rounded-full';
    }
  );

  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    console.log(`✓ ${rel} — ${changes} fixes`);
    totalChanges += changes;
  } else {
    console.log(`  ${rel} — no changes needed`);
  }
}

console.log(`\nTotal: ${totalChanges} fixes across ${files.length - skip.length} files`);
