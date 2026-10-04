import type { BrandIconSlug } from "@/lib/brand-icons";

export type ShieldsStyle = "flat" | "flat-square" | "for-the-badge" | "plastic";

export const SHIELDS_STYLES: readonly ShieldsStyle[] = [
  "flat",
  "flat-square",
  "for-the-badge",
  "plastic",
];

export const SHIELDS_STYLE_LABELS: Record<ShieldsStyle, string> = {
  flat: "Flat",
  "flat-square": "Flat square",
  "for-the-badge": "For the badge",
  plastic: "Plastic",
};

export interface SplitBadgeOptions {
  /** Right-hand segment text. */
  text: string;
  /** simple-icons slug; also the shields.io `logo` value. */
  icon: BrandIconSlug;
  /** Background of the left (icon) segment. */
  iconColor: string;
  /** Background of the right (text) segment. */
  textColor: string;
  style: ShieldsStyle;
}

/**
 * shields.io splits the badge path on "-", so a dash inside the text has to be
 * escaped by doubling it. encodeURIComponent leaves "-" untouched and turns
 * spaces into %20, so escaping dashes afterwards is safe and idempotent.
 */
function encodeSegment(value: string): string {
  return encodeURIComponent(value).replace(/-/g, "--");
}

function normalizeHex(value: string): string {
  return value.replace(/^#/, "");
}

/**
 * Two-tone badge with an icon-only left segment, mirroring the SVG geometry
 * shields.io actually emits: two flush rects, 3px outer corners, height 20,
 * white text. The path colour is only a fallback - labelColor/color override it.
 */
export function buildShieldsUrl(options: SplitBadgeOptions): string {
  const params = new URLSearchParams({
    logo: options.icon,
    label: "",
    labelColor: normalizeHex(options.iconColor),
    color: normalizeHex(options.textColor),
    style: options.style,
  });

  return `https://img.shields.io/badge/-${encodeSegment(options.text)}-gray?${params.toString()}`;
}

export function buildShieldsAlt(options: SplitBadgeOptions): string {
  return options.text;
}

export function buildMarkdown(
  options: SplitBadgeOptions,
  link?: string,
): string {
  const image = `![${buildShieldsAlt(options)}](${buildShieldsUrl(options)})`;
  const href = link?.trim();
  return href ? `[${image}](${href})` : image;
}