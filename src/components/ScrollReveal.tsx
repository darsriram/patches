"use client";

import { useEffect, useRef } from "react";
import { createReveal } from "@/lib/motion";

type RevealProps = { children: React.ReactNode; className?: string; stagger?: boolean; variant?: "rise" | "zoom" };

export function ScrollReveal({ children, className = "", stagger = false, variant = "rise" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = stagger ? Array.from(element.querySelectorAll<HTMLElement>("[data-scroll-item]")) : [element];
    const targets = items.length ? items : [element];
    const animations = new Map<Element, Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || reduced.matches) return;
        animations.get(entry.target)?.play();
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -28px 0px" });

    function clear() { observer.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear(); }
    function setup() {
      clear();
      if (reduced.matches) return;
      targets.forEach((target, index) => {
        animations.set(target, createReveal(target, { delay: stagger ? Math.min(index * 85, 255) : 0, zoom: variant === "zoom" }));
        observer.observe(target);
      });
    }
    const revealFocusedContent = () => clear();
    setup();
    reduced.addEventListener("change", setup);
    element.addEventListener("focusin", revealFocusedContent);
    return () => { clear(); reduced.removeEventListener("change", setup); element.removeEventListener("focusin", revealFocusedContent); };
  }, [stagger, variant]);

  return <div ref={ref} data-scroll-reveal className={className}>{children}</div>;
}
