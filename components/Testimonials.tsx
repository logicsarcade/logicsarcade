"use client";
import { useReveal } from "./useReveal";
import type { Testimonial } from "@/types/database";

// ─── Single card ─────────────────────────────────────────────
function TestimonialCard({ testimonial, delay }: { testimonial: Testimonial; delay: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal reveal-d${Math.min(delay + 1, 4)}`}
      style={{
        background: "var(--glass)", border: "1px solid var(--glass-border)",
        borderRadius: 20, padding: 36, position: "relative", overflow: "hidden",
        backdropFilter: "blur(10px)", transition: "border-color 0.3s, transform 0.3s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.transform = "none"; }}
    >
      {/* decorative quote mark */}
      <div style={{ position: "absolute", top: -10, right: 24, fontSize: 120, fontFamily: "Georgia, serif", color: "rgba(124,58,237,0.08)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
        &ldquo;
      </div>

      {/* Star rating */}
      <div style={{ display: "flex", gap: 3, marginBottom: 20, fontSize: 14 }}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>

      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.75, marginBottom: 28 }}>
        {testimonial.review_text}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: testimonial.avatar_grad,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif",
          flexShrink: 0, color: "#fff",
        }}>
          {testimonial.initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{testimonial.author_name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{testimonial.author_role}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Section — receives data from Server Component ───────────
export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const headerRef = useReveal();

  if (testimonials.length === 0) return null;

  return (
    <section id="clients" style={{ padding: "120px 0", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div ref={headerRef} className="reveal" style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 16, fontWeight: 500 }}>
            Client Feedback
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px,3.5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff" }}>
            Trusted by <span style={{ color: "#a78bfa" }}>founders</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
