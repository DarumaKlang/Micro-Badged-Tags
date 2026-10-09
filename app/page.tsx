"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Download, Sparkles } from "lucide-react";
import { IconPicker } from "@/components/IconPicker";
import {
  BadgedTag,
  type BadgeSize,
  type BadgeVariant,
} from "@/components/tag/BadgedTag";
import { SplitBadgedTag } from "@/components/tag/SplitBadgedTag";
import { BRAND_ICONS, type BrandIconSlug } from "@/lib/brand-icons";
import { useCopyToClipboard } from "@/lib/clipboard";
import {
  buildMarkdown,
  buildReactSnippet,
  buildShieldsAlt,
  buildShieldsUrl,
  SHIELDS_STYLE_LABELS,
  SHIELDS_STYLES,
  isValidHttpUrl,
  type ShieldsStyle,
  type SplitBadgeOptions,
  type SplitBadgeSize,
} from "@/lib/shields";

type StyleMode = "solid" | "split";
type OutputTab = "react" | "markdown";
/** Whether the left segment shows a brand icon or plain text. */
type LeftMode = "icon" | "text";

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
const DEFAULT_LEFT_TEXT = "Beta";

export default function Home() {
  const [text, setText] = useState("Verified");
  const [styleMode, setStyleMode] = useState<StyleMode>("split");
  const [outputTab, setOutputTab] = useState<OutputTab>("markdown");

  const [selectedVariant, setSelectedVariant] =
    useState<BadgeVariant>("default");
  const [selectedSize, setSelectedSize] = useState<BadgeSize>("md");

  const [leftMode, setLeftMode] = useState<LeftMode>("icon");
  const [icon, setIcon] = useState<BrandIconSlug>(DEFAULT_SPLIT_ICON);
  const [leftText, setLeftText] = useState(DEFAULT_LEFT_TEXT);
  const [leftColor, setLeftColor] = useState<string>(
    `#${BRAND_ICONS[DEFAULT_SPLIT_ICON].hex}`,
  );
  const [textColor, setTextColor] = useState<string>(DEFAULT_TEXT_COLOR);
  const [shieldsStyle, setShieldsStyle] = useState<ShieldsStyle>("flat");
  const [link, setLink] = useState("");

  const { copy, isCopied } = useCopyToClipboard();

  const isEmpty = text.trim().length === 0;

  const splitOptions = useMemo<SplitBadgeOptions>(
    () => ({
      text: text.trim(),
      left:
        leftMode === "icon"
          ? { kind: "icon", icon }
          : { kind: "text", text: leftText },
      leftColor,
      textColor,
      style: shieldsStyle,
    }),
    [text, leftMode, icon, leftText, leftColor, textColor, shieldsStyle],
  );

  const isSplit = styleMode === "split";
  const hasInvalidUrl =
    Boolean(link.trim()) && !isValidHttpUrl(link.trim());
  const hasInvalidLink =
    isSplit && outputTab === "markdown" && hasInvalidUrl;

  const solidSnippet = `<BadgedTag text={${JSON.stringify(text)}} variant="${selectedVariant}" size="${selectedSize}" />`;
  const splitSnippet = buildReactSnippet(
    splitOptions,
    selectedSize as SplitBadgeSize,
  );

  const markdownSnippet = hasInvalidUrl ? "" : buildMarkdown(splitOptions, link);
  const shieldsUrl = buildShieldsUrl(splitOptions);
  const shieldsAlt = buildShieldsAlt(splitOptions);

  const snippet = isSplit
    ? outputTab === "markdown"
      ? markdownSnippet
      : splitSnippet
    : solidSnippet;

  const downloadExtension = isSplit && outputTab === "markdown" ? "md" : "tsx";

  const handleIconChange = useCallback((slug: BrandIconSlug) => {
    setIcon(slug);
    setLeftColor(`#${BRAND_ICONS[slug].hex}`);
  }, []);

  const handleCopy = useCallback(async () => {
    if (isEmpty || hasInvalidLink) return;
    await copy(snippet);
  }, [copy, snippet, isEmpty, hasInvalidLink]);

  const handleDownload = useCallback(() => {
    if (isEmpty || hasInvalidLink) return;
    const blob = new Blob([snippet], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `badged-tag-${text.trim().toLowerCase().replace(/\s+/g, "-")}.${downloadExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [snippet, text, isEmpty, hasInvalidLink, downloadExtension]);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="neon-orb-1 absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.35) 0%, transparent 70%)' }}
        />
        <div
          className="neon-orb-2 absolute top-1/3 -right-32 h-80 w-80 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(191,90,242,0.4) 0%, transparent 70%)' }}
        />
        <div
          className="neon-orb-3 absolute -bottom-20 left-1/3 h-72 w-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(255,45,120,0.35) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-6 sm:mb-10">
          <span className="neon-sparkle-badge mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" />
            Open Source &amp; Free
          </span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--foreground)' }}>
            Badged Tags{' '}
            <span className="neon-text-cyan">Generator</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: 'rgba(148,163,184,0.85)' }}>
            สร้างแท็กพร้อมสีและขนาด แล้วคัดลอกโค้ดไปใช้ในโปรเจกต์ Next.js
            หรือ Markdown บน GitHub / Gitea ของคุณ
          </p>
        </header>

        <main className="space-y-4 sm:space-y-6">
          {/* Config card */}
          <section className="glass-card rounded-2xl p-4 sm:p-6">
            <label
              htmlFor="tag-text"
              className="neon-section-label mb-2 block"
            >
              ข้อความแท็ก
            </label>
            <input
              id="tag-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="เช่น Premium, Verified, New"
              maxLength={50}
              className="neon-input w-full rounded-lg px-4 py-2.5 text-base transition sm:py-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--foreground)',
              }}
            />

            <fieldset className="mt-5">
              <legend className="neon-section-label mb-2 block">
                รูปแบบ
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: 'split', label: 'Split 2 สี + ไอคอน' },
                    { value: 'solid', label: 'Solid (React)' },
                  ] as { value: StyleMode; label: string }[]
                ).map((mode) => {
                  const isActive = styleMode === mode.value;
                  return (
                    <label
                      key={mode.value}
                      className={`cursor-pointer rounded-lg px-3 py-3 text-center text-sm font-medium transition ${isActive ? 'neon-pill-active' : 'neon-pill-inactive'
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
                  <legend className="neon-section-label mb-2 block">
                    ฝั่งซ้าย
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ['icon', 'ใช้ไอคอน'],
                        ['text', 'ใช้ข้อความ'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm ${leftMode === value
                            ? 'neon-radio-checked'
                            : 'neon-radio-unchecked'
                          }`}
                      >
                        <input
                          type="radio"
                          name="left-mode"
                          value={value}
                          checked={leftMode === value}
                          onChange={() => setLeftMode(value)}
                          className="accent-blue-600"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {leftMode === 'icon' ? (
                  <fieldset className="mt-5">
                    <legend className="neon-section-label mb-2 block">
                      ไอคอนฝั่งซ้าย
                    </legend>
                    <IconPicker value={icon} onChange={handleIconChange} />
                    <p className="mt-2 text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>
                      ใช้ slug ของ Simple Icons ตัวเดียวกับที่ shields.io
                      ใช้ จึงได้ไอคอนตรงกันทั้ง React และ Markdown
                    </p>
                  </fieldset>
                ) : (
                  <div className="mt-5">
                    <label
                      htmlFor="left-text"
                      className="neon-section-label mb-1.5 block"
                    >
                      ข้อความฝั่งซ้าย
                    </label>
                    <input
                      id="left-text"
                      type="text"
                      value={leftText}
                      maxLength={40}
                      onChange={(e) => setLeftText(e.target.value)}
                      placeholder="เช่น Beta, กำลังทำ, รออนุมัติ"
                      className="neon-input w-full rounded-lg px-3 py-2 text-sm"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'var(--foreground)',
                      }}
                    />
                    <p className="mt-2 text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>
                      {leftText.length}/40 · ช่องว่างแปลว่าฝั่งซ้ายไม่มีเนื้อหา
                    </p>
                  </div>
                )}

                <fieldset className="mt-5">
                  <legend className="neon-section-label mb-2 block">
                    สี 2 ด้าน
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="left-color"
                        className="neon-section-label mb-1.5 block"
                      >
                        สีฝั่งซ้าย
                      </label>
                      <div className="neon-color-row flex items-center gap-2 rounded-lg px-2 py-1.5">
                        <input
                          id="left-color"
                          type="color"
                          value={leftColor}
                          onChange={(e) => setLeftColor(e.target.value)}
                          className="size-8 cursor-pointer rounded border-0 bg-transparent"
                        />
                        <span className="font-mono text-xs" style={{ color: 'rgba(148,163,184,0.8)' }}>
                          {leftColor}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="text-color"
                        className="neon-section-label mb-1.5 block"
                      >
                        สีฝั่งข้อความ
                      </label>
                      <div className="neon-color-row flex items-center gap-2 rounded-lg px-2 py-1.5">
                        <input
                          id="text-color"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="size-8 cursor-pointer rounded border-0 bg-transparent"
                        />
                        <span className="font-mono text-xs" style={{ color: 'rgba(148,163,184,0.8)' }}>
                          {textColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="neon-section-label mb-2 block">
                    สไตล์ shields.io
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SHIELDS_STYLES.map((style) => {
                      const isActive = shieldsStyle === style;
                      return (
                        <label
                          key={style}
                          className={`cursor-pointer rounded-lg px-3 py-2.5 text-center text-xs font-medium transition ${isActive ? 'neon-pill-active' : 'neon-pill-inactive'
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
                    className="neon-section-label mb-2 block"
                  >
                    ลิงก์ปลายทาง (ไม่บังคับ)
                  </label>
                  <input
                    id="badge-link"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/docs"
                    aria-invalid={hasInvalidLink}
                    aria-describedby={
                      hasInvalidLink ? "badge-link-error" : "badge-link-hint"
                    }
                    className="neon-input w-full rounded-lg px-4 py-2.5 text-base transition"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'var(--foreground)',
                    }}
                  />
                  <p
                    id={hasInvalidLink ? "badge-link-error" : "badge-link-hint"}
                    role={hasInvalidLink ? "alert" : undefined}
                    className={`mt-1.5 text-xs ${
                      hasInvalidLink ? "text-rose-300" : "text-slate-400"
                    }`}
                  >
                    {hasInvalidLink
                      ? "กรุณาใส่ URL http:// หรือ https:// ที่ไม่มี username/password ฝังอยู่"
                      : "ถ้าใส่ จะได้ Markdown แบบคลิกได้ (ครอบด้วยลิงก์)"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <fieldset className="mt-5">
                  <legend className="neon-section-label mb-2 block">
                    สีแท็ก
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {tagVariants.map((variant) => {
                      const isActive = selectedVariant === variant;
                      return (
                        <label
                          key={variant}
                          className={`cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'neon-pill-active' : 'neon-pill-inactive'
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
              <legend className="neon-section-label mb-2 block">
                ขนาด
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(isSplit ? splitSizes : tagSizes).map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <label
                      key={size}
                      className={`cursor-pointer rounded-lg px-3 py-3 text-center text-sm font-medium transition ${isActive ? 'neon-pill-active' : 'neon-pill-inactive'
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

          {/* Preview & output card */}
          <section className="glass-card rounded-2xl p-4 sm:p-6">
            <h2 className="neon-section-label mb-3 block">ตัวอย่าง</h2>
            <div className="neon-preview-bg flex min-h-32 flex-col items-center justify-center gap-6 overflow-hidden rounded-xl p-6">
              {isEmpty ? (
                <span className="text-sm" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  พิมพ์ข้อความเพื่อดูตัวอย่าง
                </span>
              ) : isSplit ? (
                <>
                  <SplitBadgedTag
                    text={text.trim()}
                    left={splitOptions.left}
                    leftColor={leftColor}
                    textColor={textColor}
                    style={shieldsStyle}
                    size={selectedSize as SplitBadgeSize}
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>
                      ผลลัพธ์จริงบน GitHub / Gitea
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shieldsUrl}
                      alt={shieldsAlt}
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
              <div className="neon-tab-bar mt-4 inline-flex rounded-lg p-1">
                {(
                  [
                    { value: 'markdown', label: 'Markdown (.md)' },
                    { value: 'react', label: 'React (.tsx)' },
                  ] as { value: OutputTab; label: string }[]
                ).map((tab) => {
                  const isActive = outputTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setOutputTab(tab.value)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${isActive ? 'neon-tab-active' : 'neon-tab-inactive'
                        }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {hasInvalidLink ? (
              <p className="mt-3 text-sm text-rose-300" role="alert">
                แก้ URL ปลายทางให้ถูกต้องก่อนคัดลอกหรือดาวน์โหลด Markdown
              </p>
            ) : null}

            <pre className="neon-code mt-3 overflow-x-auto rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap">
              <code>{snippet}</code>
            </pre>
            {!isSplit || outputTab === "react" ? (
              <p className="mt-2 text-xs text-slate-400">
                React snippet เป็นตัวอย่างการเรียกใช้ component
                ต้องเพิ่ม source จาก <code>components/tag</code> และ <code>lib</code>
                ในโปรเจกต์ก่อน
              </p>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleCopy}
                disabled={isEmpty || hasInvalidLink}
                className="neon-btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {isCopied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}
              </button>
              <button
                onClick={handleDownload}
                disabled={isEmpty || hasInvalidLink}
                className="neon-btn-secondary inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="size-4" />
                ดาวน์โหลด .{downloadExtension}
              </button>
            </div>
          </section>

          {/* Usage examples card */}
          <section className="glass-card rounded-2xl p-4 sm:p-6">
            <h2 className="neon-section-label mb-3 block">ตัวอย่างการใช้งาน</h2>
            <ul className="space-y-3">
              {examples.map((example) => (
                <li
                  key={example.text}
                  className="flex flex-wrap items-center gap-2 text-sm"
                  style={{ color: 'rgba(148,163,184,0.7)' }}
                >
                  <code
                    className="font-mono text-xs"
                    style={{ color: 'rgba(0,245,255,0.6)' }}
                  >
                    {`<BadgedTag text="${example.text}"${example.variant ? ` variant="${example.variant}"` : ''
                      }${example.size ? ` size="${example.size}"` : ''
                      } />`}
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