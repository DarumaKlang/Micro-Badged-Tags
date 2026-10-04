"use client";

import { BrandIcon } from "@/components/tag/BrandIcon";
import { BRAND_ICON_SLUGS, type BrandIconSlug } from "@/lib/brand-icons";

type IconPickerProps = {
  value: BrandIconSlug;
  onChange: (slug: BrandIconSlug) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {BRAND_ICON_SLUGS.map((slug) => {
        const isActive = value === slug;
        return (
          <button
            key={slug}
            type="button"
            onClick={() => onChange(slug)}
            title={slug}
            aria-pressed={isActive}
            className={`flex items-center justify-center rounded-lg border p-2.5 transition focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
              isActive
                ? "border-sky-500 bg-sky-50 text-slate-900 ring-2 ring-sky-200"
                : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600"
            }`}
          >
            <BrandIcon slug={slug} className="size-5" />
            <span className="sr-only">{slug}</span>
          </button>
        );
      })}
    </div>
  );
}