"use client";

import { useState } from "react";
import { BrandIcon } from "@/components/tag/BrandIcon";
import {
  BRAND_ICONS,
  BRAND_ICON_SLUGS,
  type BrandIconSlug,
} from "@/lib/brand-icons";

type IconPickerProps = {
  value: BrandIconSlug;
  onChange: (slug: BrandIconSlug) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSlugs = BRAND_ICON_SLUGS.filter((slug) => {
    const icon = BRAND_ICONS[slug];
    return (
      icon.title.toLowerCase().includes(normalizedQuery) ||
      slug.includes(normalizedQuery)
    );
  });

  return (
    <div>
      <label htmlFor="icon-search" className="sr-only">
        ค้นหาไอคอน
      </label>
      <input
        id="icon-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="ค้นหาแบรนด์ เช่น GitHub, React"
        className="neon-input mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
      />
      <p className="mb-2 text-xs text-slate-400" aria-live="polite">
        พบ {filteredSlugs.length} ไอคอน
      </p>
      {filteredSlugs.length > 0 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {filteredSlugs.map((slug) => {
            const isActive = value === slug;
            return (
              <button
                key={slug}
                type="button"
                onClick={() => onChange(slug)}
                aria-label={`เลือกไอคอน ${BRAND_ICONS[slug].title}`}
                aria-pressed={isActive}
                className={`flex items-center justify-center rounded-lg border p-2.5 transition focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/40"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                <BrandIcon slug={slug} className="size-5" />
              </button>
            );
          })}
        </div>
      ) : (
        <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-4 text-center text-sm text-slate-400">
          ไม่พบไอคอนที่ตรงกับคำค้น
        </p>
      )}
    </div>
  );
}