import { BrandIcon } from "@/components/tag/BrandIcon";
import type { BrandIconSlug } from "@/lib/brand-icons";
import type { ShieldsStyle, SplitBadgeSize } from "@/lib/shields";

export type { SplitBadgeSize };

type Geometry = {
  /** Height, corner radius, font size, and weight/case for the whole badge. */
  root: string;
  /** Horizontal padding inside each segment. */
  segment: string;
  /** Rendered icon box. */
  icon: string;
  /**
   * Gloss overlay painted on top of each segment's flat colour. Shields.io
   * draws this as a gradient rect above the fill but below the glyphs, so it
   * belongs on the segment's own background rather than in a sibling layer.
   */
  gradient?: string;
  /** Drop shadow behind the white glyphs. */
  shadow?: string;
};

/**
 * Base metrics measured from the SVG shields.io actually emits, per style:
 *
 * | style          | height | radius | font | extra                    |
 * |----------------|--------|--------|------|--------------------------|
 * | flat           | 20px   | 3px    | 11px | subtle gradient + shadow |
 * | flat-square    | 20px   | 0      | 11px | -                        |
 * | for-the-badge  | 28px   | 0      | 10px | bold, uppercase          |
 * | plastic        | 18px   | 4px    | 11px | strong gloss + shadow    |
 *
 * `sm` is 1x; `md` and `lg` scale the same proportions to ~1.2x and ~1.4x.
 * Every class is a literal so Tailwind's static scanner can see it.
 */
const geometry: Record<ShieldsStyle, Record<SplitBadgeSize, Geometry>> = {
  flat: {
    sm: {
      root: "h-5 rounded-[3px] text-[11px] font-semibold",
      segment: "px-[5px]",
      icon: "size-3.5",
      gradient:
        "linear-gradient(to bottom, rgba(187,187,187,0.1), rgba(0,0,0,0.1))",
      shadow: "text-shadow: 0 1px 1px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.8)",
    },
    md: {
      root: "h-[24px] rounded-[4px] text-[13px] font-semibold",
      segment: "px-[6px]",
      icon: "size-[17px]",
      gradient:
        "linear-gradient(to bottom, rgba(187,187,187,0.1), rgba(0,0,0,0.1))",
      shadow: "text-shadow: 0 1px 1px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.8)",
    },
    lg: {
      root: "h-[28px] rounded-[4px] text-[15px] font-semibold",
      segment: "px-[7px]",
      icon: "size-5",
      gradient:
        "linear-gradient(to bottom, rgba(187,187,187,0.1), rgba(0,0,0,0.1))",
      shadow: "text-shadow: 0 1px 1px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.8)",
    },
  },
  "flat-square": {
    sm: {
      root: "h-5 rounded-none text-[11px] font-semibold",
      segment: "px-[5px]",
      icon: "size-3.5",
    },
    md: {
      root: "h-[24px] rounded-none text-[13px] font-semibold",
      segment: "px-[6px]",
      icon: "size-[17px]",
    },
    lg: {
      root: "h-[28px] rounded-none text-[15px] font-semibold",
      segment: "px-[7px]",
      icon: "size-5",
    },
  },
  "for-the-badge": {
    sm: {
      root: "h-7 rounded-none text-[10px] font-extrabold uppercase",
      segment: "px-[5px]",
      icon: "size-3.5",
    },
    md: {
      root: "h-[34px] rounded-none text-[12px] font-extrabold uppercase",
      segment: "px-[6px]",
      icon: "size-[17px]",
    },
    lg: {
      root: "h-[39px] rounded-none text-[14px] font-extrabold uppercase",
      segment: "px-[7px]",
      icon: "size-5",
    },
  },
  plastic: {
    sm: {
      root: "h-[18px] rounded-[4px] text-[11px] font-semibold",
      segment: "px-[5px]",
      icon: "size-3.5",
      gradient:
        "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(170,170,170,0.1) 10%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.5) 100%)",
      shadow: "text-shadow: 0 1px 2px rgba(0,0,0,0.5)",
    },
    md: {
      root: "h-[22px] rounded-[5px] text-[13px] font-semibold",
      segment: "px-[6px]",
      icon: "size-[17px]",
      gradient:
        "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(170,170,170,0.1) 10%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.5) 100%)",
      shadow: "text-shadow: 0 1px 2px rgba(0,0,0,0.5)",
    },
    lg: {
      root: "h-[25px] rounded-[6px] text-[15px] font-semibold",
      segment: "px-[7px]",
      icon: "size-5",
      gradient:
        "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(170,170,170,0.1) 10%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.5) 100%)",
      shadow: "text-shadow: 0 1px 2px rgba(0,0,0,0.5)",
    },
  },
};

export type SplitBadgeLeft =
  | { kind: "icon"; icon: BrandIconSlug }
  | { kind: "text"; text: string };

interface SplitBadgedTagProps {
  text: string;
  /**
   * Left segment: a brand icon, or plain text when the badge is a status tag
   * with no matching brand.
   */
  left: SplitBadgeLeft;
  /** Background of the left segment. */
  leftColor: string;
  /** Background of the right (text) segment. */
  textColor: string;
  style?: ShieldsStyle;
  size?: SplitBadgeSize;
  className?: string;
}

export function SplitBadgedTag({
  text,
  left,
  leftColor,
  textColor,
  style = "flat",
  size = "md",
  className,
}: SplitBadgedTagProps) {
  const g = geometry[style][size];
  const gradient = g.gradient;

  return (
    <span
      className={`inline-flex overflow-hidden font-['Verdana,Geneva,DejaVu_Sans,sans-serif'] whitespace-nowrap text-white ${g.root} ${className ?? ""}`}
      style={g.shadow ? ({ textShadow: g.shadow } as const) : undefined}
    >
      <span
        className={`inline-flex items-center ${g.segment}`}
        style={{
          backgroundColor: leftColor,
          ...(gradient ? { backgroundImage: gradient } : {}),
        }}
      >
        {left.kind === "icon" ? (
          <BrandIcon slug={left.icon} className={g.icon} />
        ) : (
          left.text.trim()
        )}
      </span>
      <span
        className={`inline-flex items-center ${g.segment}`}
        style={{
          backgroundColor: textColor,
          ...(gradient ? { backgroundImage: gradient } : {}),
        }}
      >
        {text}
      </span>
    </span>
  );
}