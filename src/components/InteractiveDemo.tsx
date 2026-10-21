"use client";

import { useState } from "react";
import { BrowserMockup } from "@/components/BrowserMockup";
import { Button } from "@/components/Button";
import { PromptPanel } from "@/components/PromptPanel";
import { cn } from "@/lib/cn";

type DemoState = "idle" | "processing" | "applied";

const PROMPT = "Highlight upcoming deadlines and hide distractions.";

export function InteractiveDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const patched = state === "applied";

  function runDemo() {
    if (state === "processing") return;
    setState("processing");
    window.setTimeout(() => setState("applied"), 900);
  }

  return (
    <div className="relative md:pb-20">
      <BrowserMockup
        url="campushub.example/dashboard"
        glow
        label="Interactive product preview"
      >
        <div className="relative overflow-hidden">
          <div
            className={cn(
              "grid gap-3 p-3 sm:p-4",
              patched ? "bg-[#fefdfc]" : "bg-[#f9f7f6]",
            )}
          >
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2">
              <span className="text-sm font-semibold text-ink">CampusHub</span>
              <div className="hidden items-center gap-3 text-[11px] text-muted sm:flex">
                <span>Courses</span>
                <span>Calendar</span>
                <span>Inbox</span>
                <span className={cn(patched && "opacity-40")}>Groups</span>
                <span className={cn(patched && "hidden")}>Marketplace</span>
              </div>
              <span className="rounded-full bg-lavender px-2 py-0.5 text-[10px] font-medium text-primary">
                Jordan
              </span>
            </div>

            <div
              className={cn(
                "grid gap-3 transition-all duration-500",
                patched
                  ? "lg:grid-cols-[1.4fr_0.8fr]"
                  : "lg:grid-cols-[1fr_0.9fr_0.85fr]",
              )}
            >
              <div className="space-y-3">
                <div
                  className={cn(
                    "rounded-xl border bg-white p-3 transition-all duration-500",
                    patched
                      ? "border-primary/30 shadow-[0_12px_30px_-20px_rgba(183,154,136,0.9)] ring-2 ring-primary/15"
                      : "border-border",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                      Upcoming deadlines
                    </p>
                    {patched ? (
                      <span className="text-[10px] font-medium text-primary">
                        Moved to the top
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted">3 this week</span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {[
                      ["History seminar essay", "Friday, 11:59 pm"],
                      ["CHEM 1A problem set", "Monday"],
                      ["Office hours RSVP", "Tomorrow"],
                    ].map(([title, due]) => (
                      <li
                        key={title}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm",
                          patched ? "bg-lavender" : "bg-[#f9f8f7]",
                        )}
                      >
                        <span className="font-medium text-ink">{title}</span>
                        <span className="shrink-0 text-[11px] text-muted">
                          {due}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={cn(
                    "rounded-xl border border-border bg-white p-3 transition-all duration-500",
                    patched && "opacity-90",
                  )}
                >
                  <p className="mb-2 text-xs font-semibold text-ink">
                    Course announcements
                  </p>
                  <div className="space-y-2 text-xs text-muted">
                    <p>
                      <span className="font-medium text-ink">Week 6 recap</span>{" "}
                      — reading notes posted for Thursday’s discussion.
                    </p>
                    <p className={cn(patched && "hidden sm:block")}>
                      Library extended hours begin next week.
                    </p>
                  </div>
                </div>
              </div>

              <aside
                className={cn(
                  "space-y-3 transition-all duration-500",
                  patched
                    ? "pointer-events-none max-lg:hidden lg:opacity-0 lg:max-h-0 lg:overflow-hidden"
                    : "opacity-100",
                )}
                aria-hidden={patched}
              >
                <Widget title="Recommended for you">
                  Join the campus spirit contest. Watch three suggested videos.
                </Widget>
                <Widget title="Campus marketplace">
                  Mini fridge · bike lock · last-minute textbooks.
                </Widget>
              </aside>

              <aside
                className={cn(
                  "space-y-3 transition-all duration-500",
                  patched ? "hidden lg:block lg:opacity-40" : "opacity-100",
                )}
              >
                <Widget title="Events this week">
                  Club fair, late-night breakfast, career mixer.
                </Widget>
                <Widget title="Inbox highlights">
                  12 unread messages, 4 from mailing lists.
                </Widget>
              </aside>
            </div>
          </div>

          {state === "processing" ? (
            <div className="absolute inset-0 grid place-items-center bg-white/55 backdrop-blur-[2px]">
              <p className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink">
                Applying patch…
              </p>
            </div>
          ) : null}
        </div>
      </BrowserMockup>

      <div className="mt-4 md:absolute md:-bottom-6 md:right-6 md:mt-0 md:w-[min(100%,20rem)]">
        <PromptPanel
          prompt={PROMPT}
          status={patched ? "Patch applied" : undefined}
          footer={
            state === "applied" ? (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setState("idle")}
              >
                Reset demo
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={runDemo}
                disabled={state === "processing"}
              >
                {state === "processing" ? "Working…" : "Try the demo"}
              </Button>
            )
          }
        />
      </div>
      <p className="mt-4 max-w-md text-xs text-muted md:mt-10">
        A self-contained mock page. This preview does not change websites in
        your browser.
      </p>
    </div>
  );
}

function Widget({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-lilac bg-white p-3">
      <p className="text-xs font-semibold text-ink">{title}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}
