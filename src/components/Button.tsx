import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-primary text-white shadow-[0_8px_20px_-12px_rgba(182,156,140,0.35)] hover:bg-primary-hover",
  secondary:
    "bg-white text-ink border border-border hover:border-lilac hover:bg-lavender/60",
  ghost: "bg-transparent text-primary hover:bg-lavender",
};

const sizes = {
  md: "h-11 px-5 text-[0.95rem]",
  sm: "h-9 px-3.5 text-sm",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background-color,border-color,transform,box-shadow] duration-200 motion-safe:hover:-translate-y-px disabled:pointer-events-none disabled:opacity-60";

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
