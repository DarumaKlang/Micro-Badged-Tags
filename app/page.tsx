"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Download, Sparkles } from "lucide-react";
import { IconPicker } from "@/components/IconPicker";
import {
  BadgedTag,
  type BadgeSize,
  type BadgeVariant,
} from "@/components/tag/BadgedTag";
import {
  SplitBadgedTag,
  type SplitBadgeSize,
} from "@/components/tag/SplitBadgedTag";
import { BRAND_ICONS, type BrandIconSlug } from "@/lib/brand-icons";
import { useCopyToClipboard } from "@/lib/clipboard";
import {
  buildMarkdown,
  buildShieldsUrl,
  SHIELDS_STYLE_LABELS,
  SHIELDS_STYLES,
  type ShieldsStyle,
} from "@/lib/shields";

type StyleMode = "solid" | "split";
type OutputTab = "react" | "markdown";

const tagVariants: BadgeVariant[] = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
];

const tagSizes: BadgeSize[] = ["sm", "md", "lg"];
const splitSizes: SplitBadgeSize[] = ["sm", "md", "lg"];

const variantLabels: Record<BadgeVariant, string> = {
  default: "Default",
  primary: "Primary",
  secondary: "Secondary",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

const variantSwatches: Record<BadgeVariant, string> = {
  default: "bg-white ring-1 ring-slate-300",
  primary: "bg-sky-600",
  secondary: "bg-slate-900",
  success: "bg-emerald-500",
  warning: "bg-amber-400",
  error: "bg-red-500",
};

const sizeLabels: Record<BadgeSize, string> = {
  sm: "เล็ก",
  md: "กลาง",
  lg: "ใหญ่",
};

const examples: { text: string; variant?: BadgeVariant; size?: BadgeSize }[] = [
  { text: "Permission" },
  { text: "Premium", variant: "primary" },
  { text: "Verified", variant: "success", size: "lg" },
];

const DEFAULT_SPLIT_ICON: BrandIconSlug = "github";
const DEFAULT_TEXT_COLOR = "#2563EB";

export default function Home() {
  const [text, setText] = useState("Verified");
  const [styleMode, setStyleMode] = useState<StyleMode>("split");
  const [outputTab, setOutputTab] = useState<OutputTab>("markdown");

  const [selectedVariant, setSelectedVariant] =
    useState<BadgeVariant>("default");
  const [selectedSize, setSelectedSize] = useState<BadgeSize>("md");

  const [icon, setIcon] = useState<BrandIconSlug>(DEFAULT_SPLIT_ICON);
  const [iconColor, setIconColor] = useState<string>(
    `#${BRAND_ICONS[DEFAULT_SPLIT_ICON].hex}`,
  );
  const [textColor, setTextColor] = useState<string>(DEFAULT_TEXT_COLOR);
  const [shieldsStyle, setShieldsStyle] = useState<ShieldsStyle>("flat");
  const [link, setLink] = useState("");

  const { copy, isCopied } = useCopyToClipboard();

  const isEmpty = text.trim().length === 0;

  const splitOptions = useMemo(
    () => ({
      text: text.trim(),
      icon,
      iconColor,
      textColor,
      style: shieldsStyle,
    }),
    [text, icon, iconColor, textColor, shieldsStyle],
  );

  const solidSnippet = `<BadgedTag text="${text}" variant="${selectedVariant}" size="${selectedSize}" />`;
  const splitSnippet = `<SplitBadgedTag\n  text="${text.trim()}"\n  icon="${icon}"\n  iconColor="${iconColor}"\n  textColor="${textColor}"\n  size="${selectedSize}"\n/>`;

  const markdownSnippet = buildMarkdown(splitOptions, link);
  const shieldsUrl = buildShieldsUrl(splitOptions);

  const isSplit = styleMode === "split";

  const snippet = isSplit
    ? outputTab === "markdown"
      ? markdownSnippet
      : splitSnippet
    : solidSnippet;

  const downloadExtension = isSplit && outputTab === "markdown" ? "md" : "tsx";

  const handleIconChange = useCallback((slug: BrandIconSlug) => {
    setIcon(slug);
    setIconColor(`#${BRAND_ICONS[slug].hex}`);
  }, []);

  const handleCopy = useCallback(async () => {
    if (isEmpty) return;
    await copy(snippet);
  }, [copy, snippet, isEmpty]);

  const handleDownload = useCallback(() => {
    if (isEmpty) return;
    const blob = new Blob([snippet], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `badged-tag-${text.trim().toLowerCase().replace(/\s+/g, "-")}.${downloadExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [snippet, text, isEmpty, downloadExtension]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-6 sm:mb-10">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            <Sparkles className="size-3.5" />
            Open Source &amp; Free
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Badged Tags Generator
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            สร้างแท็กพร้อมสีและขนาด แล้วคัดลอกโค้ดไปใช้ในโปรเจกต์ Next.js
            หรือ Markdown บน GitHub / Gitea ของคุณ
          </p>
        </header>

        <main className="space-y-4 sm:space-y-6">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <label
              htmlFor="tag-text"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              ข้อความแท็ก
            </label>
            <input
              id="tag-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="เช่น Premium, Verified, New"
              maxLength={50}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 sm:py-3"
            />

            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-medium text-slate-700">
                รูปแบบ
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "split", label: "Split 2 สี + ไอคอน" },
                    { value: "solid", label: "Solid (React)" },
                  ] as { value: StyleMode; label: string }[]
                ).map((mode) => {
                  const isActive = styleMode === mode.value;
                  return (
                    <label
                      key={mode.value}
                      className={`cursor-pointer rounded-lg px-3 py-3 text-center text-sm font-medium transition focus-within:ring-2 focus-within:ring-sky-500 focus-within:outline-none ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="style-mode"
                        value={mode.value}
                        checked={isActive}
                        onChange={() => setStyleMode(mode.value)}
                        className="sr-only"
                      />
                      {mode.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {isSplit ? (
              <>
                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm font-medium text-slate-700">
                    ไอคอนฝั่งซ้าย
                  </legend>
                  <IconPicker value={icon} onChange={handleIconChange} />
                  <p className="mt-2 text-xs text-slate-400">
                    ใช้ slug ของ Simple Icons ตัวเดียวกับที่ shields.io ใช้ จึงได้ไอคอนตรงกันทั้ง
                    React และ Markdown
                  </p>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm font-medium text-slate-700">
                    สี 2 ด้าน
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="icon-color"
                        className="mb-1.5 block text-xs font-medium text-slate-500"
                      >
                        สีฝั่งไอคอน
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5">
                        <input
                          id="icon-color"
                          type="color"
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="size-8 cursor-pointer rounded border border-slate-200 bg-transparent"
                        />
                        <span className="font-mono text-xs text-slate-500">
                          {iconColor}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="text-color"
                        className="mb-1.5 block text-xs font-medium text-slate-500"
                      >
                        สีฝั่งข้อความ
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5">
                        <input
                          id="text-color"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="size-8 cursor-pointer rounded border border-slate-200 bg-transparent"
                        />
                        <span className="font-mono text-xs text-slate-500">
                          {textColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm font-medium text-slate-700">
                    สไตล์ shields.io
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SHIELDS_STYLES.map((style) => {
                      const isActive = shieldsStyle === style;
                      return (
                        <label
                          key={style}
                          className={`cursor-pointer rounded-lg px-3 py-2.5 text-center text-xs font-medium transition focus-within:ring-2 focus-within:ring-sky-500 focus-within:outline-none ${
                            isActive
                              ? "bg-sky-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="shields-style"
                            value={style}
                            checked={isActive}
                            onChange={() => setShieldsStyle(style)}
                            className="sr-only"
                          />
                          {SHIELDS_STYLE_LABELS[style]}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-5">
                  <label
                    htmlFor="badge-link"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    ลิงก์ปลายทาง (ไม่บังคับ)
                  </label>
                  <input
                    id="badge-link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/docs"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    ถ้าใส่ จะได้ Markdown แบบคลิกได้ (ครอบด้วยลิงก์)
                  </p>
                </div>
              </>
            ) : (
              <>
                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm font-medium text-slate-700">
                    สีแท็ก
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {tagVariants.map((variant) => {
                      const isActive = selectedVariant === variant;
                      return (
                        <label
                          key={variant}
                          className={`cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-sky-500 focus-within:outline-none ${
                            isActive
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="variant"
                            value={variant}
                            checked={isActive}
                            onChange={() => setSelectedVariant(variant)}
                            className="sr-only"
                          />
                          <span className="flex items-center gap-2">
                            <span
                              className={`size-3 shrink-0 rounded-full ${variantSwatches[variant]}`}
                            />
                            {variantLabels[variant]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </>
            )}

            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-medium text-slate-700">
                ขนาด
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(isSplit ? splitSizes : tagSizes).map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <label
                      key={size}
                      className={`cursor-pointer rounded-lg px-3 py-3 text-center text-sm font-medium transition focus-within:ring-2 focus-within:ring-sky-500 focus-within:outline-none ${
                        isActive
                          ? "bg-sky-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={isActive}
                        onChange={() =>
                          setSelectedSize(size as BadgeSize & SplitBadgeSize)
                        }
                        className="sr-only"
                      />
                      {sizeLabels[size]}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="mb-3 text-sm font-medium text-slate-700">ตัวอย่าง</h2>
            <div className="flex min-h-32 flex-col items-center justify-center gap-6 overflow-hidden rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200">
              {isEmpty ? (
                <span className="text-sm text-slate-400">
                  พิมพ์ข้อความเพื่อดูตัวอย่าง
                </span>
              ) : isSplit ? (
                <>
                  <SplitBadgedTag
                    text={text.trim()}
                    icon={icon}
                    iconColor={iconColor}
                    textColor={textColor}
                    size={selectedSize}
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs text-slate-400">
                      ผลลัพธ์จริงบน GitHub / Gitea
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shieldsUrl}
                      alt={text.trim()}
                      className="max-w-full"
                    />
                  </div>
                </>
              ) : (
                <BadgedTag
                  text={text}
                  variant={selectedVariant}
                  size={selectedSize}
                />
              )}
            </div>

            {isSplit ? (
              <div className="mt-4 inline-flex rounded-lg bg-slate-100 p-1">
                {(
                  [
                    { value: "markdown", label: "Markdown (.md)" },
                    { value: "react", label: "React (.tsx)" },
                  ] as { value: OutputTab; label: string }[]
                ).map((tab) => {
                  const isActive = outputTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setOutputTab(tab.value)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed whitespace-pre-wrap text-slate-100">
              <code>{snippet}</code>
            </pre>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleCopy}
                disabled={isEmpty}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {isCopied ? "คัดลอกแล้ว" : "คัดลอกโค้ด"}
              </button>
              <button
                onClick={handleDownload}
                disabled={isEmpty}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="size-4" />
                ดาวน์โหลด .{downloadExtension}
              </button>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="mb-3 text-sm font-medium text-slate-700">
              ตัวอย่างการใช้งาน
            </h2>
            <ul className="space-y-3">
              {examples.map((example) => (
                <li
                  key={example.text}
                  className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
                >
                  <code className="font-mono text-xs text-slate-400">
                    {`<BadgedTag text="${example.text}"${
                      example.variant ? ` variant="${example.variant}"` : ""
                    }${example.size ? ` size="${example.size}"` : ""} />`}
                  </code>
                  <BadgedTag
                    text={example.text}
                    variant={example.variant}
                    size={example.size}
                  />
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}