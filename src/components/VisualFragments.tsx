import { cn } from "@/lib/cn";

export function ClutterFragment() {
  return (
    <div className="rounded-2xl border border-border bg-white p-3">
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-10 rounded-lg",
              index === 2 ? "bg-lavender" : "bg-[#f8f4f2]",
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted">Six competing modules</p>
    </div>
  );
}

export function SearchFragment() {
  return (
    <div className="rounded-2xl border border-border bg-white p-3">
      <div className="h-8 rounded-lg border border-dashed border-lilac bg-[#fefdfc]" />
      <div className="mt-2 space-y-1.5">
        <div className="h-2.5 w-4/5 rounded-full bg-[#f4efec]" />
        <div className="h-2.5 w-2/5 rounded-full bg-primary/40" />
        <div className="h-2.5 w-3/5 rounded-full bg-[#f4efec]" />
      </div>
      <p className="mt-2 text-[11px] text-muted">The useful line is buried</p>
    </div>
  );
}

export function ResetFragment() {
  return (
    <div className="flex gap-2">
      {["Portal A", "Portal B", "Portal C"].map((name, index) => (
        <div
          key={name}
          className="flex-1 rounded-2xl border border-border bg-white p-2"
          style={{ transform: `rotate(${(index - 1) * 2}deg)` }}
        >
          <div className="h-8 rounded-md bg-lavender" />
          <p className="mt-2 text-[10px] font-medium text-muted">{name}</p>
        </div>
      ))}
    </div>
  );
}

export function BeforeAfter() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <figure className="rounded-2xl border border-border bg-white p-4">
        <figcaption className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Before
        </figcaption>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-2">
            <div className="h-16 rounded-lg bg-[#f4f0ee]" />
            <div className="h-10 rounded-lg bg-[#f9f7f5]" />
          </div>
          <div className="space-y-2">
            <div className="h-8 rounded-lg bg-lilac/70" />
            <div className="h-8 rounded-lg bg-lilac/50" />
            <div className="h-8 rounded-lg bg-lilac/40" />
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">
          Deadlines sit beside ads, shortcuts, and extra widgets.
        </p>
      </figure>
      <figure className="rounded-2xl border border-primary/20 bg-lavender/50 p-4">
        <figcaption className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          After
        </figcaption>
        <div className="space-y-2">
          <div className="rounded-lg border border-primary/20 bg-white p-3">
            <p className="text-[11px] font-semibold text-primary">
              Deadlines on this page
            </p>
            <div className="mt-2 h-8 rounded-md bg-lavender" />
            <div className="mt-1.5 h-8 rounded-md bg-lavender" />
          </div>
          <div className="h-10 rounded-lg bg-white/80" />
        </div>
        <p className="mt-3 text-sm text-muted">
          The same information, with a clearer path to what matters.
        </p>
      </figure>
    </div>
  );
}

export function StepVisual({ step }: { step: 1 | 2 | 3 }) {
  if (step === 1) {
    return (
      <div className="rounded-2xl border border-border bg-white p-4">
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <span className="size-2 rounded-full bg-lilac" />
          Your current website
        </div>
        <div className="mt-3 h-24 rounded-xl bg-[#f8f5f3]" />
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="rounded-2xl border border-border bg-white p-4">
        <p className="text-[11px] font-semibold text-ink">Patches</p>
        <p className="mt-2 rounded-xl bg-lavender px-3 py-2 text-sm">
          Hide distractions and make this page easier to read.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-primary/20 bg-white p-4">
      <p className="text-[11px] font-semibold text-primary">Patch applied</p>
      <div className="mt-3 space-y-2">
        <div className="h-10 rounded-lg bg-lavender" />
        <div className="h-6 rounded-lg bg-[#f8f5f3]" />
      </div>
    </div>
  );
}

export function CompactProduct() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(237,230,226,0.75),transparent_70%)] blur-xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_20px_50px_-28px_rgba(53,43,37,0.4)]">
        <div className="border-b border-border bg-[#fcfbfb] px-3 py-2 text-[11px] text-muted">
          northfield.example/apply
        </div>
        <div className="space-y-2 p-3">
          <div className="h-8 rounded-lg bg-lavender" />
          <div className="h-8 rounded-lg border border-primary/20 bg-white" />
          <div className="h-8 rounded-lg bg-[#f9f7f5]" />
        </div>
      </div>
    </div>
  );
}
