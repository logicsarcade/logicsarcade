"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let running = false;

    function tick() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.x - 6 + "px";
        cursorRef.current.style.top = pos.current.y - 6 + "px";
      }
      if (ringRef.current) {
        const offset = hoveredRef.current ? 30 : 20;
        ringRef.current.style.left = ring.current.x - offset + "px";
        ringRef.current.style.top = ring.current.y - offset + "px";
      }
      const settled =
        Math.abs(pos.current.x - ring.current.x) < 0.1 &&
        Math.abs(pos.current.y - ring.current.y) < 0.1;
      if (settled) { running = false; return; } // stop looping while the mouse is still
      raf = requestAnimationFrame(tick);
    }
    function start() {
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      start();
    };
    // One delegated listener instead of one per link/button
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a, button, [data-hover]");
      const next = !!el;
      if (next !== hoveredRef.current) { hoveredRef.current = next; setHovered(next); start(); }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" style={{ transform: hovered ? "scale(1.5)" : "scale(1)" }} />
      <div ref={ringRef} className={`cursor-ring ${hovered ? "hovered" : ""}`} />
    </>
  );
}
