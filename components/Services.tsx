"use client";
import { useReveal } from "./useReveal";

const SERVICES = [
  { icon: "🌐", name: "Web Development", desc: "Full-stack applications built with modern frameworks. Performant, scalable, and production-ready from day one." },
  { icon: "📱", name: "Mobile Apps", desc: "Cross-platform iOS & Android apps with React Native. Native performance with a single codebase." },
  { icon: "🛍️", name: "Shopify Apps", desc: "Custom Shopify themes and private apps. Revenue-focused solutions built for Shopify's ecosystem." },
  { icon: "⚡", name: "SaaS Development", desc: "Multi-tenant SaaS platforms with auth, billing, and dashboards — built to scale from 10 to 10,000 users." },
  { icon: "🤖", name: "AI Integrations", desc: "GPT-4, Claude, and custom ML pipelines woven into your product. Intelligent features that users actually love." },
  { icon: "🔒", name: "DevOps & Cloud", desc: "CI/CD pipelines, AWS/GCP deployments, and monitoring that keeps your product at 99.9% uptime." },
];

export default function Services() {
  const headerRef = useReveal();

  return (
    <section id="services" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div ref={headerRef} className="reveal" style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 16, fontWeight: 500 }}>What We Build</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff" }}>
            Full-stack <span style={{ color: "#a78bfa" }}>expertise</span>,<br />zero guesswork
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2, border: "1px solid var(--glass-border)", borderRadius: 24, overflow: "hidden",
          background: "var(--glass-border)",
        }}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.name} {...s} delay={i % 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, name, desc, delay }: { icon: string; name: string; desc: string; delay: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal reveal-d${delay + 1}`}
      style={{ background: "var(--navy)", padding: "44px 40px", position: "relative", overflow: "hidden", cursor: "default" }}
      data-hover
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = "#0d0d20";
        const overlay = e.currentTarget.querySelector(".card-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "1";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = "var(--navy)";
        const overlay = e.currentTarget.querySelector(".card-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "0";
      }}
    >
      <div className="card-overlay" style={{
        position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.4s",
        background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
      <div style={{
        width: 52, height: 52, background: "rgba(0,245,255,0.06)",
        border: "1px solid rgba(0,245,255,0.12)", borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 28, fontSize: 22,
      }}>{icon}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12, letterSpacing: "-0.3px" }}>{name}</div>
      <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{desc}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 24, fontSize: 13, color: "var(--cyan)", fontWeight: 500 }}>
        Learn more →
      </div>
    </div>
  );
}
