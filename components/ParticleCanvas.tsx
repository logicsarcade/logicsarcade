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
    function draw() {
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
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${0.04 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      if (!document.hidden) raf = requestAnimationFrame(draw);
    }
    const onVisible = () => { if (!document.hidden) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    document.addEventListener("visibilitychange", onVisible);
    // Start after the page has loaded, so the animation never blocks the first render
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const starter = setTimeout(() => { if (!reduce) draw(); }, 1500);
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
