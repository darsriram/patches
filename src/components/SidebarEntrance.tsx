"use client";

import { useEffect, useRef } from "react";
import { motionEase } from "@/lib/motion";

export function SidebarEntrance({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const distance = Math.max(80, window.innerWidth - element.getBoundingClientRect().left + 24);
    const animation = element.animate(
      [{ transform: `translateX(${distance}px)`, opacity: 0, filter: "blur(4px)" }, { transform: "translateX(0)", opacity: 1, filter: "blur(0px)" }],
      { duration: 850, easing: motionEase, fill: "none" },
    );
    const stop = () => { if (reduced.matches) animation.cancel(); };
    const focus = () => animation.finish();
    reduced.addEventListener("change", stop);
    element.addEventListener("focusin", focus);
    return () => { animation.cancel(); reduced.removeEventListener("change", stop); element.removeEventListener("focusin", focus); };
  }, []);

  return <div ref={ref} data-sidebar-entrance className={className}>{children}</div>;
}
