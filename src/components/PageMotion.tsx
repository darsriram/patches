"use client";

import { useEffect, useRef } from "react";
import { createReveal } from "@/lib/motion";

export function PageMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.IntersectionObserver) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const excluded = "[data-no-page-motion], [data-scroll-reveal], [data-sidebar-entrance], .patch-lab, .sentence-map, .reading-workbench, form, [role='alert'], [role='status']";
    const candidates = Array.from(root.querySelectorAll<HTMLElement>("[data-motion-group], h1, h2, h3, p, .extension-preview, .focus-page, .availability-list > article, .polished-faq, .signup-brand-panel, .signup-expectations"))
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
    }, { rootMargin: "0px 0px -24px 0px", threshold: .06 });
    function clear() { observer.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear(); }
    function setup() {
      clear();
      if (reduced.matches) return;
      targets.forEach(target => {
        const siblings = targets.filter(item => item.parentElement === target.parentElement);
        animations.set(target, createReveal(target, { delay: Math.min(siblings.indexOf(target) * 90, 180) }));
        observer.observe(target);
      });
    }
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const length = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0})`;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
    const focus = () => clear();
    setup(); scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    reduced.addEventListener("change", setup);
    root.addEventListener("focusin", focus);
    return () => { clear(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); reduced.removeEventListener("change", setup); root.removeEventListener("focusin", focus); };
  }, []);

  return <div ref={ref}><div className="page-reading-progress" ref={progress} aria-hidden="true" />{children}</div>;
}
