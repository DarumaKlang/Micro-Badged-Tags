import { BrandIcon } from "@/components/tag/BrandIcon";
import type { BrandIconSlug } from "@/lib/brand-icons";

export type SplitBadgeSize = "sm" | "md" | "lg";

/**
 * Geometry mirrors what shields.io actually renders at 1x: 20px tall, 3px
 * outer corners, two segments flush against each other (no gap), white text.
 * md/lg scale the same proportions up by 20% and 40%.
 */
const splitSizes: Record<
  SplitBadgeSize,
  { root: string; segment: string; icon: string }
> = {
  sm: {
    root: "h-5 rounded-[3px] text-[11px]",
    segment: "px-1.5",
    icon: "size-2.5",
  },
  md: {
    root: "h-6 rounded-[4px] text-xs",
    segment: "px-2",
    icon: "size-3",
  },
  lg: {
    root: "h-7 rounded-[5px] text-sm",
    segment: "px-2.5",
    icon: "size-3.5",
  },
};

interface SplitBadgedTagProps {
  text: string;
  icon: BrandIconSlug;
  iconColor: string;
  textColor: string;
  size?: SplitBadgeSize;
  className?: string;
}

export function SplitBadgedTag({
  text,
  icon,
  iconColor,
  textColor,
  size = "md",
  className,
}: SplitBadgedTagProps) {
  const scale = splitSizes[size];

  return (
    <span
      className={`relative inline-flex overflow-hidden font-['Verdana,Geneva,DejaVu_Sans,sans-serif'] font-semibold whitespace-nowrap text-white ${scale.root} ${className ?? ""}`}
    >
      <span
        className={`relative z-10 inline-flex items-center ${scale.segment}`}
        style={{ backgroundColor: iconColor }}
      >
        <BrandIcon slug={icon} className={scale.icon} />
      </span>
      <span
        className={`relative z-10 inline-flex items-center ${scale.segment}`}
        style={{ backgroundColor: textColor }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 to-transparent"
      />
    </span>
  );
}