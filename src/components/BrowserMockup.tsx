import { cn } from "@/lib/cn";

export function BrowserMockup({
  url,
  children,
  glow = false,
  className,
  label,
}: {
  url: string;
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <figure className={cn("relative", className)}>
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(237,230,226,0.7),transparent_68%)] blur-2xl"
        />
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_60px_-28px_rgba(53,43,37,0.35)]">
        <div className="flex items-center gap-3 border-b border-border bg-[#fcfbfb] px-3 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#f0eae7]" />
            <span className="size-2.5 rounded-full bg-[#f1ebe8]" />
            <span className="size-2.5 rounded-full bg-[#efebe8]" />
          </div>
          <div className="min-w-0 flex-1 rounded-md border border-border bg-white px-3 py-1 text-center text-[11px] text-muted sm:text-left">
            <span className="truncate">{url}</span>
          </div>
        </div>
        <div className="bg-white">{children}</div>
      </div>
      {label ? (
        <figcaption className="mt-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
