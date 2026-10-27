import { LogoMark } from "@/components/Logo";
import { cn } from "@/lib/cn";

export function PromptPanel({
  prompt,
  footer,
  className,
  status,
}: {
  prompt: string;
  footer?: React.ReactNode;
  className?: string;
  status?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white/95 p-3.5 shadow-[0_16px_40px_-24px_rgba(53,43,37,0.45)] backdrop-blur",
        className,
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LogoMark className="h-5 w-5" />
          <span className="text-xs font-semibold tracking-tight text-ink">
            Patchy
          </span>
        </div>
        {status ? (
          <span className="rounded-md bg-lavender px-2 py-0.5 text-[11px] font-medium text-primary">
            {status}
          </span>
        ) : null}
      </div>
      <p className="rounded-xl bg-lavender px-3 py-2.5 text-sm leading-relaxed text-ink">
        {prompt}
      </p>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
