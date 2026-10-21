"use client";

import { useEffect, useRef } from "react";
import { createReveal } from "@/lib/motion";

export function PageMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.IntersectionObserver) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const excluded = "[data-no-page-motion], [data-scroll-reveal], [data-sidebar-entrance], .extension-preview, .patch-lab, .sentence-map, .reading-workbench, form, [role='alert'], [role='status']";
    const candidates = Array.from(root.querySelectorAll<HTMLElement>("h1, h2, h3, p, .focus-page, .availability-list > article, .polished-faq, .signup-brand-panel, .signup-expectations"))
      .filter(element => !element.closest(excluded));
    const targets = candidates.filter(element => !candidates.some(parent => parent !== element && parent.contains(element)));
    const animations = new Map<Element, Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !reduced.matches) {
          animations.get(entry.target)?.play();
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -28px 0px" });
    function clear() { observer.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear(); }
    function setup() {
      clear();
      if (reduced.matches) return;
      targets.forEach((target, index) => {
        animations.set(target, createReveal(target, { delay: (index % 3) * 65 }));
        observer.observe(target);
      });
    }
    const focus = () => clear();
    setup();
    reduced.addEventListener("change", setup);
    root.addEventListener("focusin", focus);
    return () => { clear(); reduced.removeEventListener("change", setup); root.removeEventListener("focusin", focus); };
  }, []);

  return <div ref={ref}>{children}</div>;
}
