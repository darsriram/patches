"use client";

import { useEffect, useRef } from "react";

export function InteractiveBackground({ tone = "light", draggable = true }: { tone?: "light" | "dark"; draggable?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let pointer = { x: -1000, y: -1000 };
    let frame = 0;
    const offsets = new Map<string, { x: number; y: number }>();
    const motion = new Map<string, { x: number; y: number }>();
    let tiles: { id: string; x: number; y: number; size: number; anchorX: number; anchorY: number }[] = [];
    let drag: { id: string; startX: number; startY: number; x: number; y: number; pointerId: number } | null = null;
    const originalCursor = parent.style.cursor;

    function draw() {
      frame = 0;
      if (!context) return;
      let settling = false;
      context.clearRect(0, 0, width, height);
      tiles = [];
      const step = width < 640 ? 32 : 38;
      for (let row = -1; row < Math.ceil(height / step) + 1; row++) {
        for (let col = -1; col < Math.ceil(width / step) + 1; col++) {
          const id = `${row}:${col}`;
          const offset = offsets.get(id) ?? { x: 0, y: 0 };
          const anchorX = col * step + (row % 2) * step / 2;
          const anchorY = row * step;
          const homeX = anchorX + offset.x;
          const homeY = anchorY + offset.y;
          const dx = homeX - pointer.x;
          const dy = homeY - pointer.y;
          const distance = Math.hypot(dx, dy);
          const proximity = reduced.matches || drag?.id === id ? 0 : Math.max(0, 1 - distance / 130);
          const push = proximity * proximity * 28;
          const targetX = distance > .1 ? dx / distance * push : push;
          const targetY = distance > .1 ? dy / distance * push : 0;
          const current = motion.get(id) ?? { x: 0, y: 0 };
          if (reduced.matches || drag?.id === id) {
            current.x = 0;
            current.y = 0;
          } else {
            current.x += (targetX - current.x) * .10;
            current.y += (targetY - current.y) * .10;
            if (Math.abs(targetX - current.x) + Math.abs(targetY - current.y) > .15) settling = true;
          }
          motion.set(id, current);
          const x = homeX + current.x;
          const y = homeY + current.y;
          const base = tone === "dark" ? .24 : .28;
          const size = 3.2;
          const color = tone === "dark" ? "235, 171, 148" : "180, 89, 61";
          tiles.push({ id, x, y, size, anchorX, anchorY });
          context.save();
          context.translate(x, y);
          context.beginPath();
          context.arc(0, 0, size / 2, 0, Math.PI * 2);
          context.fillStyle = `rgba(${color}, ${base + proximity * .12})`;
          context.fill();
          context.restore();
        }
      }
      if (settling) schedule();
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }
    const resize = new ResizeObserver(() => {
      const bounds = parent!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * scale;
      canvas!.height = height * scale;
      context!.setTransform(scale, 0, 0, scale, 0, 0);
      schedule();
    });
    function position(event: { clientX: number; clientY: number }) {
      const bounds = parent!.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }
    function hit(point: { x: number; y: number }) {
      return [...tiles].reverse().find(tile => Math.abs(tile.x - point.x) < tile.size / 2 + 9 && Math.abs(tile.y - point.y) < tile.size / 2 + 9);
    }
    function isControl(target: EventTarget | null) {
      return target instanceof Element && !!target.closest("a, button, input, textarea, select, [data-no-background-drag]");
    }
    function move(event: PointerEvent) {
      pointer = position(event);
      if (drag && event.pointerId === drag.pointerId) {
        const tile = tiles.find(tile => tile.id === drag!.id);
        const baseX = tile?.anchorX ?? 0;
        const baseY = tile?.anchorY ?? 0;
        offsets.set(drag.id, {
          x: Math.max(16, Math.min(width - 16, baseX + drag.x + pointer.x - drag.startX)) - baseX,
          y: Math.max(16, Math.min(height - 16, baseY + drag.y + pointer.y - drag.startY)) - baseY,
        });
        parent!.style.cursor = "grabbing";
      } else {
        parent!.style.cursor = draggable && !isControl(event.target) && hit(pointer) ? "grab" : originalCursor;
      }
      schedule();
    }
    function down(event: PointerEvent) {
      if (!draggable || event.button !== 0 || isControl(event.target)) return;
      pointer = position(event);
      const tile = hit(pointer);
      if (!tile) return;
      const offset = { x: tile.x - tile.anchorX, y: tile.y - tile.anchorY };
      offsets.set(tile.id, offset);
      motion.set(tile.id, { x: 0, y: 0 });
      drag = { id: tile.id, startX: pointer.x, startY: pointer.y, x: offset.x, y: offset.y, pointerId: event.pointerId };
      parent!.setPointerCapture(event.pointerId);
      parent!.style.cursor = "grabbing";
      event.preventDefault();
      schedule();
    }
    function up(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      if (parent!.hasPointerCapture(event.pointerId)) parent!.releasePointerCapture(event.pointerId);
      drag = null;
      parent!.style.cursor = hit(pointer) ? "grab" : originalCursor;
      schedule();
    }
    function touchStart(event: TouchEvent) {
      if (draggable && !isControl(event.target) && event.touches.length === 1 && hit(position(event.touches[0]))) event.preventDefault();
    }
    function leave() {
      if (drag) return;
      pointer = { x: -1000, y: -1000 };
      parent!.style.cursor = originalCursor;
      schedule();
    }
    resize.observe(parent);
    parent.addEventListener("pointerdown", down);
    parent.addEventListener("pointerup", up);
    parent.addEventListener("pointercancel", up);
    parent.addEventListener("touchstart", touchStart, { passive: false });
    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", schedule);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      parent.style.cursor = originalCursor;
      parent.removeEventListener("pointerdown", down);
      parent.removeEventListener("pointerup", up);
      parent.removeEventListener("pointercancel", up);
      parent.removeEventListener("touchstart", touchStart);
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
      reduced.removeEventListener("change", schedule);
    };
  }, [tone, draggable]);

  return <canvas ref={canvasRef} className="patches-background" aria-hidden="true" />;
}
