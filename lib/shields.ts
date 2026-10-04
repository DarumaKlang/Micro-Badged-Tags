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

export type SplitBadgeSize = "sm" | "md" | "lg";

/**
 * The left segment is either a brand icon or plain text. Text mode exists
 * because plenty of status tags ("in progress", "blocked", "on hold") have no
 * sensible brand icon, and shields.io renders both forms from one endpoint.
 */
export type SplitBadgeLeft =
  | { kind: "icon"; icon: BrandIconSlug }
  | { kind: "text"; text: string };

export interface SplitBadgeOptions {
  /** Right-hand segment text. */
  text: string;
  /** Left segment: a brand icon, or plain text when there is no good icon. */
  left: SplitBadgeLeft;
  /** Background of the left segment. */
  leftColor: string;
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
 * Two-tone badge mirroring the SVG geometry shields.io actually emits: two
 * flush rects, height and corner radius per `style`, white text. The path
 * colour ("gray") is only a fallback - labelColor/color override it.
 *
 * Icon mode puts an empty label in the path and supplies the logo separately,
 * so the left segment is exactly as wide as the icon. Text mode puts the left
 * text in the path and omits `logo`, which lets shields.io size that segment
 * to the text.
 */
export function buildShieldsUrl(options: SplitBadgeOptions): string {
  const params = new URLSearchParams({
    labelColor: normalizeHex(options.leftColor),
    color: normalizeHex(options.textColor),
    style: options.style,
  });

  if (options.left.kind === "icon") {
    params.set("logo", options.left.icon);
    // An empty label keeps the left segment collapsed down to the logo.
    params.set("label", "");
    return `https://img.shields.io/badge/-${encodeSegment(options.text)}-gray?${params.toString()}`;
  }

  const left = encodeSegment(options.left.text.trim());
  return `https://img.shields.io/badge/${left}-${encodeSegment(options.text)}-gray?${params.toString()}`;
}

export function buildShieldsAlt(options: SplitBadgeOptions): string {
  if (options.left.kind === "text") {
    const left = options.left.text.trim();
    if (left) return `${left}: ${options.text}`;
  }
  return options.text;
}

/**
 * Kept next to the URL builder so the snippet and the preview cannot drift:
 * both are derived from the same options object.
 */
export function buildReactSnippet(
  options: SplitBadgeOptions,
  size: SplitBadgeSize,
): string {
  const left =
    options.left.kind === "icon"
      ? `{ kind: "icon", icon: "${options.left.icon}" }`
      : `{ kind: "text", text: "${options.left.text.trim()}" }`;

  return [
    "<SplitBadgedTag",
    `  text="${options.text.trim()}"`,
    `  left={${left}}`,
    `  leftColor="${options.leftColor}"`,
    `  textColor="${options.textColor}"`,
    `  style="${options.style}"`,
    `  size="${size}"`,
    "/>",
  ].join("\n");
}

export function buildMarkdown(
  options: SplitBadgeOptions,
  link?: string,
): string {
  const image = `![${buildShieldsAlt(options)}](${buildShieldsUrl(options)})`;
  const href = link?.trim();
  return href ? `[${image}](${href})` : image;
}