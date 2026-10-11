import JsonLd from "@/components/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";
import RealtimeSync from "@/components/RealtimeSync";
import { getBlockedDates } from "./actions";
import BookingForm from "./BookingForm";
import Navbar from "@/components/Navbar";
import ParticleCanvas from "@/components/ParticleCanvas";
import Cursor from "@/components/Cursor";
import Link from "next/link";

export const metadata = {
  title: "Book a Call — LogicsArcade",
  description: "Schedule a free 30-minute strategy call with the LogicsArcade team.",
};

export default async function BookPage() {
  const blockedDates = await getBlockedDates();

  return (
    <>
      <RealtimeSync tables={["blocked_dates"]} />
      <JsonLd data={[webPageSchema({ name: "Book a Call — LogicsArcade", description: "Schedule a free 30-minute strategy call with the LogicsArcade team.", path: "/book", type: "ContactPage" }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Book a Call", path: "/book" }])]} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          paddingTop: 100,
          paddingBottom: 80,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "fixed",
            top: "20%",
            right: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "10%",
            left: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "90%", margin: "0 auto", padding: "0 40px" }}>
          {/* Breadcrumb */}
          <div
            style={{
              marginBottom: 48,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "#6b6b8a",
            }}
          >
            <Link href="/" style={{ color: "#6b6b8a", textDecoration: "none" }}>
              Home
            </Link>
            <span>›</span>
            <span style={{ color: "var(--cyan)" }}>Book a Call</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 80,
              flexDirection: "row",
            }}
          >
            <div>
              {/* Page header */}
              <div style={{ marginBottom: 60 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(0,245,255,0.05)",
                    border: "1px solid rgba(0,245,255,0.15)",
                    borderRadius: 100,
                    padding: "6px 16px",
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "var(--cyan)",
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: "var(--cyan)",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  Free 30-Minute Call
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-sg), sans-serif",
                    fontSize: "clamp(36px,5vw,60px)",
                    fontWeight: 700,
                    letterSpacing: "-2px",
                    lineHeight: 1.05,
                    color: "#fff",
                    marginBottom: 16,
                  }}
                >
                  Let&apos;s talk about
                  <br />
                  <span style={{ color: "#a78bfa" }}>your project</span>
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: "#6b6b8a",
                    maxWidth: 500,
                    lineHeight: 1.65,
                  }}
                >
                  Tell us what you&apos;re building. We&apos;ll come prepared
                  with ideas, a rough scope, and honest advice — no sales pitch.
                </p>
              </div>

              {/* Trust badges */}
              <div
                style={{
                  display: "flex",
                  gap: 32,
                  marginBottom: 56,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { icon: "⚡", text: "Response within 2 hours" },
                  { icon: "🔒", text: "NDA available on request" },
                  { icon: "🌍", text: "Remote-friendly" },
                ].map((b) => (
                  <div
                    key={b.text}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "#6b6b8a",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
            {/* Form card */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 24,
                padding: "48px 56px",
                backdropFilter: "blur(10px)",
              }}
            >
              <BookingForm blockedDates={blockedDates} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

