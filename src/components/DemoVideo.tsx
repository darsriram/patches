"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

// Supply a local video URL and caption track when the product recording is ready.
export function DemoVideo({ src, captionsSrc }: { src?: string; captionsSrc?: string }) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = element.getBoundingClientRect().top;
      const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (window.innerHeight * .95 - top) / (window.innerHeight * .65)));
      element.style.setProperty("--video-reveal", String(progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", schedule); };
  }, []);
  return (
    <section ref={section} data-no-page-motion id="demo-video" className="patches-video-section scroll-video-reveal" aria-labelledby="demo-video-title">
      <Container>
        <ScrollReveal>
          <div className="patches-video-heading">
            <p className="patches-eyebrow">A quick look</p>
            <h2 id="demo-video-title">A small patch.<br className="sm:hidden" /> <em>A better page.</em></h2>
            <p>From a few words to a page that feels like yours.</p>
          </div>
        </ScrollReveal>
        <div className="patches-video-frame scroll-video-frame">
          {src ? (
            <video className="patches-demo-video" controls playsInline preload="none" aria-label="Patches product demo">
              <source src={src} type="video/mp4" />
              {captionsSrc && <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />}
              Your browser does not support embedded video.
            </video>
          ) : (
            <div className="patches-video-placeholder">
              <div className="patches-video-window" aria-hidden="true"><span /><span /><span /><i /></div>
              <div className="patches-video-center">
                <span className="patches-video-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="5" width="13" height="14" rx="3" /><path d="m16 10 5-3v10l-5-3Z" /></svg></span>
                <p>See Patches in action.</p>
                <span>Demo video coming soon</span>
              </div>
              <div className="patches-video-timeline" aria-hidden="true"><span /><i /><span /></div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
