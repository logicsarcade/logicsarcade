"use client";
import Globe from "./Globe";

const PILLS = ["MERN Stack", "Next.js", "React Native", "Shopify", "AI Integrations", "SaaS"];

export default function Hero() {
  return (
    <section id="hero" style={{
      position: "relative", zIndex: 1,
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "0 60px", overflow: "hidden",
    }}>
      {/* Background gradients */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 80% 60% at 70% 50%, rgba(234,88,12,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 30% 50%, rgba(249,115,22,0.06) 0%, transparent 55%)
        `,
      }} />

      {/* Content */}
      <div style={{ maxWidth: 680, zIndex: 2, position: "relative" }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(234,88,12,0.08)", border: "1px solid rgba(234,88,12,0.25)",
          borderRadius: 100, padding: "6px 16px",
          fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--cyan)",
          marginBottom: 32,
        }}>
          <span className="pulse-dot" style={{ width: 6, height: 6, background: "var(--cyan)", borderRadius: "50%", display: "inline-block" }} />
          Pakistan&apos;s Leading Dev Studio
        </div>

        <h1 style={{
          fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(42px, 5.5vw, 72px)",
          fontWeight: 700, lineHeight: 1.05, letterSpacing: "-2px",
          marginBottom: 24, color: "#fff",
        }}>
          Building <span style={{ color: "var(--cyan)" }}>Scalable</span><br />
          Web & Mobile<br />
          <span style={{ color: "#fb923c" }}>Apps</span>
        </h1>

        <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, marginBottom: 20 }}>
          We turn ideas into production-ready products — from MVPs to enterprise-grade platforms.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 44 }}>
          {PILLS.map(p => (
            <span key={p} style={{
              background: "var(--glass)", border: "1px solid var(--glass-border)",
              borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 500,
              color: "var(--muted)", letterSpacing: "0.3px",
            }}>{p}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/book" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
            color: "#fff", padding: "14px 32px", borderRadius: 100,
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 0 40px rgba(234,88,12,0.35)",
            transition: "transform 0.2s, box-shadow 0.3s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(234,88,12,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 40px rgba(234,88,12,0.35)"; }}>
            📞 Book a Call
          </a>
          <a href="#work" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--text)", fontSize: 15, fontWeight: 500, textDecoration: "none",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text)"}>
            View Our Work →
          </a>
        </div>
      </div>

      <Globe />

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        color: "var(--muted)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
      }}>
        <span>scroll</span>
        <div className="scroll-line-anim" style={{ width: 1, height: 50, background: "linear-gradient(to bottom, var(--cyan), transparent)" }} />
      </div>
    </section>
  );
}
