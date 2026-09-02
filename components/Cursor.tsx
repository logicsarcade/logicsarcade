"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let raf: number;
    function tick() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.x - 6 + "px";
        cursorRef.current.style.top = pos.current.y - 6 + "px";
      }
      if (ringRef.current) {
        const offset = hovered ? 30 : 20;
        ringRef.current.style.left = ring.current.x - offset + "px";
        ringRef.current.style.top = ring.current.y - offset + "px";
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [hovered]);

  return (
    <>
      <div ref={cursorRef} className="cursor" style={{ transform: hovered ? "scale(1.5)" : "scale(1)" }} />
      <div ref={ringRef} className={`cursor-ring ${hovered ? "hovered" : ""}`} />
    </>
  );
}
