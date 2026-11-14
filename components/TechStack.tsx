"use client";
import { useReveal } from "./useReveal";

const STACK = [
  { label: "Next.js", color: "#ea580c" },
  { label: "React", color: "#61dafb" },
  { label: "Node.js", color: "#339933" },
  { label: "MongoDB", color: "#47A248" },
  { label: "PostgreSQL", color: "#336791" },
  { label: "React Native", color: "#00d2ff" },
  { label: "Shopify", color: "#96bf48" },
  { label: "Tailwind CSS", color: "#38bdf8" },
  { label: "Framer Motion", color: "#fb923c" },
  { label: "Three.js", color: "#ff6b6b" },
  { label: "GSAP", color: "#88CE02" },
  { label: "AWS", color: "#FF9900" },
];

export default function TechStack() {
  const ref = useReveal();

  return (
    <section id="stack" style={{ padding: "clamp(50px, 8vw, 80px) 0", position: "relative", zIndex: 1, borderTop: "1px solid var(--glass-border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 5vw, 60px)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--cyan)", fontWeight: 500 }}>
            Technologies We Master
          </div>
        </div>
        <div ref={ref} className="reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          {STACK.map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--glass)", border: "1px solid var(--glass-border)",
                borderRadius: 12, padding: "14px 24px",
                fontSize: 13, fontWeight: 500, color: "var(--muted)",
                display: "flex", alignItems: "center", gap: 8,
                transition: "border-color 0.3s, color 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block", flexShrink: 0 }} />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
