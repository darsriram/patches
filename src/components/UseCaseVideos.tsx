"use client";

import { useEffect, useId, useRef, useState } from "react";

const demos = [
  { id: "amazon", name: "Amazon", description: "Your carts, your categories" },
  { id: "netflix", name: "Netflix", description: "A watchlist that fits your plans" },
  { id: "gmail", name: "Gmail", description: "Keep follow-ups in sight" },
  { id: "youtube", name: "YouTube", description: "Just what you came to watch" },
];

export function UseCaseVideos() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const video = useRef<HTMLVideoElement>(null);
  const current = demos[active];

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) element.pause();
      else if (!started && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        started = true;
        void element.play().catch(() => {});
      }
    }, { threshold: .3 });
    observer.observe(element);
    const onVisibility = () => { if (document.hidden) element.pause(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); element.pause(); };
  }, [active]);

  return <div className="use-case-videos" data-no-page-motion>
    <div className="use-case-video-tabs" role="tablist" aria-label="Patches video examples">
      {demos.map((demo, index) => <button key={demo.id} ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`${id}-${demo.id}`} aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % demos.length;
        else if (event.key === "ArrowLeft") next = (index + demos.length - 1) % demos.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = demos.length - 1;
        else return;
        event.preventDefault(); setActive(next); tabs.current[next]?.focus();
      }}><span>0{index + 1}</span><strong>{demo.name}</strong><small>{demo.description}</small></button>)}
    </div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${current.id}`} className="use-case-video-panel">
      <video key={current.id} ref={video} controls muted playsInline preload="metadata" poster={`/videos/patches-${current.id}-poster.png`} aria-label={`${current.name}: ${current.description}. Animated product concept showing the Patches sidebar opening, typing a request, and applying it.`}>
        <source src={`/videos/patches-${current.id}.mp4`} type="video/mp4" />
        Your browser does not support video. <a href={`/videos/patches-${current.id}.mp4`}>Download this demo</a>.
      </video>
    </div>
    <p className="use-case-video-caption">Illustrative product concepts with sample content. These websites are not affiliated with Patches.</p>
  </div>;
}
