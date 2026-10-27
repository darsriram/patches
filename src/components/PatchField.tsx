"use client";

import { useEffect, useRef } from "react";

/** An original flowing ribbon field in the Patchy peach and vermilion palette. */
export function PatchField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, visible = true, elapsed = 0, previous = 0;
    let pointer = { x: -1000, y: -1000 };
    function draw(time: number) {
      frame = 0;
      if (!ctx || !canvas) return;
      if (previous && !reduced.matches) elapsed += Math.min(time - previous, 40);
      previous = time;
      ctx.clearRect(0, 0, width, height);
      const seconds = elapsed / 1000;
      const pointerY = pointer.y < 0 ? 0 : (pointer.y / height - .5) * 12;
      // Translucent ribbons follow a shared current, with fine contours along their edges.
      for (let band = 0; band < 4; band++) {
        const base = height * (.37 + band * .16);
        const points: { x: number; y: number }[] = [];
        for (let x = -40; x <= width + 40; x += 16) {
          const u = x / width;
          const wave = Math.sin(u * 4.8 + seconds * .24 + band * .65) * height * .13;
          const ripple = Math.sin(u * 7 - seconds * .17 + band) * height * .035;
          points.push({ x, y: base + wave + ripple + pointerY * Math.sin(u * Math.PI) });
        }
        const gradient = ctx.createLinearGradient(0, base - 100, width, base + 130);
        gradient.addColorStop(0, "rgba(255, 225, 205, 0)");
        gradient.addColorStop(.45, `rgba(255, 190, 150, ${.07 + band * .012})`);
        gradient.addColorStop(.78, "rgba(255, 112, 67, .12)");
        gradient.addColorStop(1, "rgba(255, 218, 188, .02)");
        ctx.beginPath();
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        for (let i = points.length - 1; i >= 0; i--) ctx.lineTo(points[i].x, points[i].y + 70 + band * 18);
        ctx.closePath(); ctx.fillStyle = gradient; ctx.fill();
        for (let contour = 0; contour < 3; contour++) {
          ctx.beginPath();
          points.forEach((p, i) => {
            const y = p.y + contour * 9;
            if (i === 0) ctx.moveTo(p.x, y); else ctx.lineTo(p.x, y);
          });
          ctx.strokeStyle = `rgba(231, 133, 91, ${.10 - contour * .025})`;
          ctx.lineWidth = .8; ctx.stroke();
        }
      }
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
    }
    const schedule = () => { if (!frame) { previous = 0; frame = requestAnimationFrame(draw); } };
    const resize = new ResizeObserver(() => {
      width = host.clientWidth; height = host.clientHeight;
      const scale = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * scale; canvas.height = height * scale;
      ctx.setTransform(scale, 0, 0, scale, 0, 0); schedule();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; previous = 0; }
    });
    const move = (event: PointerEvent) => { const bounds = host.getBoundingClientRect(); pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }; if (!reduced.matches) schedule(); };
    const leave = () => { pointer = { x: -1000, y: -1000 }; };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else if (visible) schedule(); };
    const preference = () => { cancelAnimationFrame(frame); frame = 0; schedule(); };
    resize.observe(host); observer.observe(host);
    host.addEventListener("pointermove", move); host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility); reduced.addEventListener("change", preference);
    return () => { resize.disconnect(); observer.disconnect(); cancelAnimationFrame(frame); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", preference); };
  }, []);
  return <canvas ref={ref} className="patches-background patch-symbol-field" aria-hidden="true" />;
}
