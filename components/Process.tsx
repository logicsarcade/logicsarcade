"use client";
import { useReveal } from "./useReveal";

const STEPS = [
  { num: "01", title: "Discovery", desc: "We deep-dive into your goals, users, and constraints. Define scope. No wasted sprints." },
  { num: "02", title: "Design", desc: "High-fidelity Figma prototypes. UX-first thinking with brand-aligned visuals." },
  { num: "03", title: "Development", desc: "Agile sprints with weekly demos. Clean code, tested, and documented end-to-end." },
  { num: "04", title: "Launch", desc: "Deployment, monitoring, and post-launch support. We're there when it matters most." },
];

export default function Process() {
  const headerRef = useReveal();

  return (
    <section id="process" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div ref={headerRef} className="reveal" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 16, fontWeight: 500 }}>
            How We Work
          </div>
          <h2 style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff" }}>
            From idea to <span style={{ color: "#a78bfa" }}>launch</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", position: "relative" }}>
          {/* connecting line */}
          <div style={{
            position: "absolute", top: 36, left: "12.5%", right: "12.5%", height: 1,
            background: "linear-gradient(to right, transparent, var(--glass-border) 20%, var(--glass-border) 80%, transparent)",
          }} />
          {STEPS.map((s, i) => <Step key={s.num} {...s} delay={i + 1} />)}
        </div>
      </div>
    </section>
  );
}

function Step({ num, title, desc, delay }: { num: string; title: string; desc: string; delay: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal reveal-d${delay}`}
      style={{ padding: "0 24px", textAlign: "center", position: "relative" }}
      onMouseEnter={e => {
        const circle = e.currentTarget.querySelector(".step-circle") as HTMLElement;
        if (circle) { circle.style.borderColor = "var(--cyan)"; circle.style.background = "rgba(0,245,255,0.04)"; circle.style.color = "var(--cyan)"; }
      }}
      onMouseLeave={e => {
        const circle = e.currentTarget.querySelector(".step-circle") as HTMLElement;
        if (circle) { circle.style.borderColor = "var(--glass-border)"; circle.style.background = "var(--navy)"; circle.style.color = "var(--text)"; }
      }}
    >
      <div className="step-circle" style={{
        width: 72, height: 72, background: "var(--navy)",
        border: "1px solid var(--glass-border)", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 28px", fontFamily: "var(--font-sg), sans-serif",
        fontSize: 22, fontWeight: 700, position: "relative", zIndex: 1,
        transition: "border-color 0.3s, background 0.3s, color 0.3s",
      }}>
        {num}
      </div>
      <div style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 12, letterSpacing: "-0.3px" }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{desc}</div>
    </div>
  );
}
