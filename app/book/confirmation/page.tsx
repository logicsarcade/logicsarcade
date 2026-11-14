import { getBookingById } from "../actions";
import Navbar from "@/components/Navbar";
import ParticleCanvas from "@/components/ParticleCanvas";
import Cursor from "@/components/Cursor";
import Link from "next/link";

const SERVICES: Record<string, string> = {
  web: "Web Development", mobile: "Mobile Apps", shopify: "Shopify Apps",
  saas: "SaaS Development", ai: "AI Integration", other: "Other",
};
const BUDGETS: Record<string, string> = {
  "$1k-$5k": "$1k � $5k", "$5k-$15k": "$5k � $15k",
  "$15k-$50k": "$15k � $50k", "$50k+": "$50k+",
};
const TIMELINES: Record<string, string> = {
  asap: "ASAP", "1-3mo": "1�3 months", "3-6mo": "3�6 months", "6mo+": "6 months+",
};

function fmt12h(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, "0")} ${ap}`;
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const booking = id ? await getBookingById(id) : null;

  if (!booking) {
    return (
      <>
        <Cursor />
        <ParticleCanvas />
        <Navbar />
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>??</div>
            <h1 style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 32, color: "#fff", marginBottom: 16 }}>Booking not found</h1>
            <Link href="/book" style={{ color: "var(--cyan)", textDecoration: "none" }}>? Book a call</Link>
          </div>
        </main>
      </>
    );
  }

  const dateStr = new Date(booking.preferred_date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <Cursor />
      <ParticleCanvas />
      <Navbar />

      <main style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{
          position: "fixed", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(234,88,12,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)", textAlign: "center" }}>

          {/* Success icon */}
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(74,222,128,0.08)",
            border: "2px solid rgba(74,222,128,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 44, margin: "0 auto 32px",
            boxShadow: "0 0 60px rgba(74,222,128,0.15)",
          }}>
            ?
          </div>

          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#4ade80", marginBottom: 16 }}>
            Booking Confirmed
          </div>
          <h1 style={{
            fontFamily: "var(--font-sg), sans-serif",
            fontSize: "clamp(32px,4vw,52px)",
            fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1,
            color: "#fff", marginBottom: 16,
          }}>
            You&apos;re all set,<br />
            <span style={{ color: "#fb923c" }}>{booking.full_name.split(" ")[0]}!</span>
          </h1>
          <p style={{ fontSize: 16, color: "#6b6b8a", lineHeight: 1.65, marginBottom: 48 }}>
            We&apos;ve received your booking and will send a confirmation to{" "}
            <span style={{ color: "#fff" }}>{booking.email}</span>{" "}
            within 2 hours with a Zoom/Meet link.
          </p>

          {/* Booking summary card */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "clamp(24px, 4vw, 36px) clamp(16px, 4vw, 40px)",
            textAlign: "left", marginBottom: 40,
          }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 24 }}>
              Booking Summary
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "20px 28px" }}>
              {[
                { icon: "??", label: "Name",     value: booking.full_name },
                { icon: "??", label: "Email",    value: booking.email },
                { icon: "??", label: "Date",     value: dateStr },
                { icon: "?", label: "Time",     value: `${fmt12h(booking.preferred_time)} (${booking.timezone})` },
                { icon: "??", label: "Service",  value: SERVICES[booking.service] ?? booking.service },
                { icon: "??", label: "Budget",   value: BUDGETS[booking.budget] ?? booking.budget },
                { icon: "???", label: "Timeline", value: TIMELINES[booking.timeline] ?? booking.timeline },
                booking.company ? { icon: "??", label: "Company", value: booking.company } : null,
              ].filter(Boolean).map(item => (
                <div key={item!.label}>
                  <div style={{ fontSize: 11, color: "#6b6b8a", marginBottom: 4 }}>{item!.icon} {item!.label}</div>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{item!.value}</div>
                </div>
              ))}
            </div>

            {booking.project_desc && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 11, color: "#6b6b8a", marginBottom: 8 }}>?? Project Description</div>
                <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.65 }}>{booking.project_desc}</div>
              </div>
            )}

            {/* Booking ID */}
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#444" }}>Booking ID</span>
              <code style={{ fontSize: 11, color: "#6b6b8a", fontFamily: "monospace" }}>{booking.id}</code>
            </div>
          </div>

          {/* What's next */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 13, color: "#6b6b8a", marginBottom: 20 }}>What happens next?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { step: "1", text: "We review your project details and prepare questions" },
                { step: "2", text: "You'll receive a calendar invite with a video call link" },
                { step: "3", text: "We jump on a 30-min call � no pitch, just honest advice" },
              ].map(item => (
                <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: 14, textAlign: "left", background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(234,88,12,0.15)", border: "1px solid rgba(234,88,12,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fb923c", flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <span style={{ fontSize: 14, color: "#9090aa", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg,#ea580c,#c2410c)",
              color: "#fff", padding: "14px 32px", borderRadius: 100,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 0 30px rgba(234,88,12,0.35)",
            }}>
              ? Back to Home
            </Link>
            <Link href="/book" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "#9090aa", padding: "14px 32px", borderRadius: 100,
              fontSize: 15, textDecoration: "none",
            }}>
              Book Another Call
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
