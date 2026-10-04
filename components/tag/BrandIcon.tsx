import { BRAND_ICONS, type BrandIconSlug } from "@/lib/brand-icons";

type BrandIconProps = {
  slug: BrandIconSlug;
  className?: string;
};

export function BrandIcon({ slug, className }: BrandIconProps) {
  const icon = BRAND_ICONS[slug];

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}