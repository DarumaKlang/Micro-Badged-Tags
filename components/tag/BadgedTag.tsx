import { ComponentType } from "react";

type BadgeSize = "sm" | "md" | "lg";
type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error";

export type { BadgeSize, BadgeVariant };

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-white/80 text-slate-800 ring-1 ring-white/70",
  primary: "bg-sky-600 text-white",
  secondary: "bg-slate-900 text-white",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  error: "bg-red-50 text-red-700 ring-1 ring-red-100",
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: "gap-1 px-2 py-0.5 text-xs",
  md: "gap-1.5 px-2.5 py-1 text-sm",
  lg: "gap-2 px-3 py-1.5 text-base",
};

const iconSizes: Record<BadgeSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

interface BadgedTagProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}

export function BadgedTag({
  text,
  variant = "default",
  size = "md",
  icon: Icon,
  className,
}: BadgedTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${badgeVariants[variant]} ${badgeSizes[size]} ${className ?? ""}`}
    >
      {Icon ? <Icon className={iconSizes[size]} /> : null}
      {text}
    </span>
  );
}