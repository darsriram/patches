"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCases } from "@/lib/use-cases";
import { ButtonLink } from "@/components/Button";

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const reducedSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverSnapshot = () => false;

export function TypewriterPrompt() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribeReducedMotion, reducedSnapshot, serverSnapshot);
  const phrase = useCases[index][1];

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)));
    observer.observe(element);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  useEffect(() => {
    if (!visible || !pageVisible || reduced || interactionPaused) return;
    const delay = deleting ? 35 : count >= phrase.length ? 2600 : 42;
    const timer = setTimeout(() => {
      if (deleting) {
        if (count > 0) setCount(Math.max(0, count - 3));
        else { setIndex((index + 1) % useCases.length); setDeleting(false); }
      } else if (count < phrase.length) setCount(Math.min(phrase.length, count + 1));
      else setDeleting(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, pageVisible, reduced, interactionPaused, count, deleting, index, phrase]);

  return (
    <div ref={ref} className="closing-typewriter" data-no-page-motion onMouseEnter={() => setInteractionPaused(true)} onMouseLeave={() => setInteractionPaused(false)} onFocusCapture={() => setInteractionPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false); }}>
      <div className="closing-prompt-bar">
        <div className="closing-prompt-text"><span className="sr-only">Example patch request: {phrase}</span><span aria-hidden="true">{reduced ? phrase : phrase.slice(0, count)}<span className={`closing-caret ${interactionPaused ? "is-paused" : ""}`} /></span></div>
        <ButtonLink href="/beta" className="closing-prompt-arrow"><span aria-hidden="true">↑</span><span className="sr-only">Apply for the Patchy beta</span></ButtonLink>
      </div>
      <div className="closing-prompt-meta"><span>YOUR WORDS. YOUR PATCH.</span></div>
    </div>
  );
}
