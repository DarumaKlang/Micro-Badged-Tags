// Regenerates `lib/brand-icons.ts` from a curated allowlist of simple-icons.
//
//   node scripts/generate-brand-icons.mjs
//
// The allowlist is curated on purpose: importing the `simple-icons` index would
// pull every brand into the bundle, and the point of this module is that the
// React preview and the shields.io `logo=` parameter always agree on one icon.
//
// To add an icon: append its slug to SLUGS below, then re-run this script.
// The slug must exist in `node_modules/simple-icons/icons/<slug>.svg`.

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SLUGS = [
  // Core stack
  "react",
  "github",
  "gitea",
  "gitlab",
  "npm",
  "docker",
  "python",
  "flask",
  "javascript",
  "typescript",
  "tailwindcss",
  "vercel",
  "nodedotjs",
  "zap",
  "discord",
  "telegram",
  "youtube",
  "apple",
  "android",
  "linux",
  // AI
  "googlegemini",
  "ollama",
  "pytorch",
  // Data / infra
  "prisma",
  "postgresql",
  "neon",
  "supabase",
  "redis",
  "drizzle",
  "stripe",
];

// The package's `exports` does not expose `./package.json`, so anchor on the
// `./icons.json` subpath (which maps to data/simple-icons.json) and walk up.
const dataPath = require.resolve("simple-icons/icons.json");
const simpleIconsDir = join(dirname(dataPath), "..");
const iconsDir = join(simpleIconsDir, "icons");

const pkg = JSON.parse(
  readFileSync(join(simpleIconsDir, "package.json"), "utf8"),
);

const parsed = JSON.parse(readFileSync(dataPath, "utf8"));
const icons = Array.isArray(parsed) ? parsed : parsed.icons;

const byslug = new Map(icons.map((icon) => [icon.slug, icon]));

const entries = SLUGS.map((slug) => {
  const meta = byslug.get(slug);
  if (!meta) {
    throw new Error(`Unknown simple-icons slug: ${slug}`);
  }

  const svg = readFileSync(join(iconsDir, `${slug}.svg`), "utf8");
  const match = svg.match(/<path\s+d="([^"]+)"/);
  if (!match) {
    throw new Error(`No <path d="..."> found in icons/${slug}.svg`);
  }

  return { slug, title: meta.title, hex: meta.hex.toUpperCase(), path: match[1] };
});

const union = entries
  .map((entry) => `  | "${entry.slug}"`)
  .join("\n");

const records = entries
  .map(
    (entry) => `  ${entry.slug}: {
    slug: "${entry.slug}",
    title: ${JSON.stringify(entry.title)},
    hex: "${entry.hex}",
    path: ${JSON.stringify(entry.path)},
  },`,
  )
  .join("\n");

const slugList = entries.map((entry) => `  "${entry.slug}",`).join("\n");

const file = `// AUTO-GENERATED from simple-icons@${pkg.version} (icons/*.svg + data/simple-icons.json). Do not edit by hand.
//
// Regenerate with: node scripts/generate-brand-icons.mjs

// Each \`slug\` is the simple-icons slug, which is exactly what shields.io
// expects for its \`logo=\` query parameter, so the React preview and the
// generated Markdown badge always show the same icon.

export type BrandIconSlug =
${union};

export type BrandIcon = {
  slug: BrandIconSlug;
  title: string;
  /** Brand hex without the leading '#', e.g. "61DAFB". */
  hex: string;
  /** Path data from a 0 0 24 24 viewBox. */
  path: string;
};

export const BRAND_ICONS: Record<BrandIconSlug, BrandIcon> = {
${records}
};

export const BRAND_ICON_SLUGS = [
${slugList}
] as const satisfies readonly BrandIconSlug[];
`;

writeFileSync(join(root, "lib", "brand-icons.ts"), file, "utf8");
console.log(
  `Wrote lib/brand-icons.ts with ${entries.length} icons from simple-icons@${pkg.version}`,
);