"use client";
import { useReveal } from "./useReveal";
import Link from "next/link";

export default function CTA() {
  const ref = useReveal();

  return (
    <section
      id="contact"
      style={{
        padding: "clamp(60px, 8vw, 100px) 0",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* orange radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(600px, 90vw)",
          height: 300,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse, rgba(234,88,12,0.18) 0%, transparent 70%)",
        }}
      />

      <div
        ref={ref}
        className="reveal"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(16px, 5vw, 60px)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--cyan)",
            marginBottom: 24,
          }}
        >
          Ready to Build?
        </div>
        <h2
          style={{
            fontFamily: "var(--font-sg), sans-serif",
            fontSize: "clamp(40px,5vw,72px)",
            fontWeight: 700,
            letterSpacing: "-2px",
            lineHeight: 1.05,
            color: "#fff",
            marginBottom: 24,
          }}
        >
          Let&apos;s build something
          <br />
          <span style={{ color: "#fb923c" }}>amazing</span> together
        </h2>
        <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 48 }}>
          Free 30-minute strategy call. No commitment, just clarity.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/book"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background:
                "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: 100,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 0 40px rgba(234,88,12,0.35)",
              transition: "transform 0.2s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 60px rgba(234,88,12,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(234,88,12,0.35)";
            }}
          >
            📞 Book Free Call
          </Link>
          <Link
            href="#work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "1px solid var(--glass-border)",
              color: "var(--text)",
              padding: "14px 32px",
              borderRadius: 100,
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              transition: "border-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--glass-border)";
              e.currentTarget.style.color = "var(--text)";
            }}
          >
            See Our Work →
          </Link>
        </div>
      </div>
    </section>
  );
}
