"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-white">
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-ink"
                onClick={() => setOpen(expanded ? null : index)}
              >
                {item.title}
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-7 place-items-center rounded-lg border border-border text-lg leading-none text-muted transition-transform",
                    expanded && "rotate-45 bg-lavender text-primary",
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!expanded}
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-5 pb-5 text-[0.95rem] leading-relaxed text-muted">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
