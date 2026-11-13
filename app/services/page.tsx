import JsonLd from "@/components/JsonLd";
import { webPageSchema, servicesListSchema, breadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES, PROCESS } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services — LogicsArcade",
  description: "Web development, mobile apps, Shopify apps, SaaS, AI integrations, DevOps and SEO services from the LogicsArcade team.",
  alternates: { canonical: `${SITE_URL}/services` },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Services — LogicsArcade", description: "Web development, mobile apps, Shopify apps, SaaS, AI integrations, DevOps and SEO services.", path: "/services", type: "CollectionPage" }), servicesListSchema(), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])]} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1, paddingTop: 140 }}>
        <div className="svc-wrap">
          <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#6b6b8a", marginBottom: 28 }}>
            <Link href="/" style={{ color: "#6b6b8a", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#9090aa" }}>Services</span>
          </nav>

          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 16, fontWeight: 500 }}>What We Build</div>
          <h1 style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(34px,5vw,60px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.08, color: "#fff", maxWidth: 760 }}>
            Services built to help your business <span style={{ color: "#fb923c" }}>grow</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.7, maxWidth: 620, marginTop: 20 }}>
            From the first idea to launch and beyond, our team covers design, development, cloud, and search visibility, so you can work with one partner for the whole journey.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginTop: 56 }}>
            {SERVICES.map(s => <ServiceCard key={s.slug} s={s} />)}
          </div>

          {/* How we work */}
          <div style={{ marginTop: 110 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 14, fontWeight: 500 }}>How We Work</div>
            <h2 style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 700, letterSpacing: "-1px", color: "#fff", marginBottom: 32 }}>
              A clear process, every time
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {PROCESS.map((p, i) => (
                <div key={p.title} style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "28px 26px" }}>
                  <div style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 14, color: "var(--cyan)", marginBottom: 12 }}>0{i + 1}</div>
                  <div style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            margin: "110px 0 120px", textAlign: "center", padding: "56px 24px", borderRadius: 28,
            background: "linear-gradient(135deg, rgba(234,88,12,0.16), rgba(249,115,22,0.05))",
            border: "1px solid var(--glass-border)",
          }}>
            <h2 style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 700, letterSpacing: "-1px", color: "#fff" }}>Not sure which service you need?</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, margin: "14px auto 28px", maxWidth: 480, lineHeight: 1.7 }}>
              Tell us about your idea on a free strategy call and we will suggest the best way forward.
            </p>
            <Link href="/book" className="svc-btn svc-btn-primary">Book a Free Call →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
