"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
  color: string;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    const particles: Particle[] = [];

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function makeParticle(): Particle {
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.6 ? "0,245,255" : "124,58,237",
      };
    }
    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) particles.push(makeParticle());

    let raf = 0;
    let last = 0;
    const BUCKETS = 4;
    function draw(now = 0) {
      if (document.hidden) return;
      raf = requestAnimationFrame(draw);
      if (now - last < 33) return; // ~30fps is plenty for a background effect
      last = now;
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          Object.assign(p, makeParticle());
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
      // connection lines: grouped into a few opacity buckets = a few strokes instead of hundreds
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (dx > 140 || dx < -140 || dy > 140 || dy < -140) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const k = Math.min(BUCKETS - 1, Math.floor((1 - dist / 140) * BUCKETS));
            paths[k].moveTo(particles[i].x, particles[i].y);
            paths[k].lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.lineWidth = 0.5;
      paths.forEach((path, k) => {
        ctx.strokeStyle = `rgba(0,245,255,${0.04 * ((k + 0.5) / BUCKETS)})`;
        ctx.stroke(path);
      });
    }
    const onVisible = () => { if (!document.hidden && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    document.addEventListener("visibilitychange", onVisible);
    // Start after the page has loaded, so the animation never blocks the first render
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const starter = setTimeout(() => { if (!reduce) raf = requestAnimationFrame(draw); }, 1500);
    return () => {
      clearTimeout(starter);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisible);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.5 }}
    />
  );
}
