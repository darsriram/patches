"use client";

import { useId, useState } from "react";
import { BrowserMockup } from "@/components/BrowserMockup";
import { PromptPanel } from "@/components/PromptPanel";
import { cn } from "@/lib/cn";

const cases = [
  {
    id: "study",
    label: "Study",
    prompt: "Hide recommendations and give me a distraction-free view.",
    url: "clipstream.example/watch",
    preview: <StudyPreview />,
  },
  {
    id: "research",
    label: "Research",
    prompt: "Make this article easier to read and highlight the abstract.",
    url: "openscholar.example/article/1842",
    preview: <ResearchPreview />,
  },
  {
    id: "applications",
    label: "Applications",
    prompt: "Highlight required fields and make instructions easier to find.",
    url: "northfield.example/internships/apply",
    preview: <ApplicationsPreview />,
  },
] as const;

export function UseCaseTabs() {
  const [active, setActive] = useState(0);
  const tablistId = useId();
  const current = cases[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Student use cases"
        className="flex flex-wrap gap-2"
      >
        {cases.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${tablistId}-${item.id}`}
              aria-selected={selected}
              aria-controls={`${tablistId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted hover:text-ink",
              )}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  setActive((index + 1) % cases.length);
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  setActive((index - 1 + cases.length) % cases.length);
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tablistId}-panel`}
        aria-labelledby={`${tablistId}-${current.id}`}
        className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]"
      >
        <BrowserMockup url={current.url}>{current.preview}</BrowserMockup>
        <PromptPanel prompt={current.prompt} className="lg:mt-10" />
      </div>
    </div>
  );
}

function StudyPreview() {
  return (
    <div className="grid gap-3 bg-[#f9f8f7] p-3 sm:grid-cols-[1fr_9rem]">
      <div className="space-y-3">
        <div className="aspect-video rounded-xl bg-[#352b25]" />
        <p className="text-sm font-semibold text-ink">
          Lecture 12: Memory and attention
        </p>
        <p className="text-xs text-muted">
          Transcript and notes stay visible after recommendations are tucked
          away.
        </p>
      </div>
      <div className="space-y-2 opacity-30" aria-hidden="true">
        <div className="h-16 rounded-lg bg-lilac" />
        <div className="h-16 rounded-lg bg-lilac" />
        <div className="h-16 rounded-lg bg-lilac" />
      </div>
    </div>
  );
}

function ResearchPreview() {
  return (
    <div className="space-y-3 bg-white p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
        OpenScholar
      </p>
      <h3 className="text-lg font-semibold leading-snug text-ink">
        Attention residue in interrupted study sessions
      </h3>
      <div className="rounded-xl border border-primary/20 bg-lavender p-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          Abstract
        </p>
        <p className="mt-1 text-sm text-ink">
          Students switching between tabs lose time reorienting. Clearer
          hierarchy on the page can reduce that extra work.
        </p>
      </div>
      <p className="text-xs leading-relaxed text-muted">
        Body text is given more space, with a comfortable line length and fewer
        competing side modules.
      </p>
    </div>
  );
}

function ApplicationsPreview() {
  return (
    <div className="grid gap-3 bg-[#f9f8f7] p-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <div className="rounded-xl bg-white p-3 text-[11px] text-muted">
        <p className="font-semibold text-ink">Instructions</p>
        <p className="mt-2 rounded-lg bg-lavender p-2 text-ink">
          Required fields are marked. Save before leaving this page.
        </p>
      </div>
      <div className="space-y-2 rounded-xl bg-white p-3">
        <label className="block text-xs font-medium text-ink">
          Role title <span className="text-primary">*</span>
          <span className="mt-1 block h-8 rounded-lg border border-primary/30 bg-lavender/60" />
        </label>
        <label className="block text-xs font-medium text-ink">
          Availability <span className="text-primary">*</span>
          <span className="mt-1 block h-8 rounded-lg border border-primary/30 bg-lavender/60" />
        </label>
        <label className="block text-xs text-muted">
          Optional notes
          <span className="mt-1 block h-8 rounded-lg border border-border bg-[#fcfbfb]" />
        </label>
      </div>
    </div>
  );
}

