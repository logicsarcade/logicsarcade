import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES, PROCESS, getService } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Service not found — LogicsArcade" };
  const url = `${SITE_URL}/services/${s.slug}`;
  return {
    title: `${s.name} — LogicsArcade`,
    description: s.tagline + " " + s.overview[0].split(". ")[0] + ".",
    keywords: [s.name, ...s.tech],
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${s.name} — LogicsArcade`, description: s.tagline, siteName: "LogicsArcade" },
  };
}

const label = { fontSize: 11, letterSpacing: 3, textTransform: "uppercase" as const, color: "var(--cyan)", marginBottom: 14, fontWeight: 500 };
const h2 = { fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, letterSpacing: "-1px", color: "#fff", marginBottom: 28 } as const;

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const others = SERVICES.filter(x => x.slug !== s.slug).slice(0, 3);
  const url = `${SITE_URL}/services/${s.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "Service",
      name: s.name, description: s.tagline, url,
      provider: { "@type": "Organization", name: "LogicsArcade", url: SITE_URL },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: s.faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        { "@type": "ListItem", position: 3, name: s.name, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1, paddingTop: 140 }}>
        <div className="svc-wrap">
          <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "#6b6b8a", marginBottom: 28 }}>
            <Link href="/" style={{ color: "#6b6b8a", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href="/services" style={{ color: "#6b6b8a", textDecoration: "none" }}>Services</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#9090aa" }}>{s.name}</span>
          </nav>

          {/* Hero */}
          <div style={{
            width: 64, height: 64, background: "rgba(234,88,12,0.08)", border: "1px solid rgba(234,88,12,0.2)",
            borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 28,
          }}>{s.icon}</div>
          <h1 style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(34px,5vw,58px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.08, color: "#fff", maxWidth: 800 }}>{s.name}</h1>
          <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.7, maxWidth: 640, marginTop: 18 }}>{s.tagline}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
            <Link href="/book" className="svc-btn svc-btn-primary">Book a Free Call →</Link>
            <Link href="/services" className="svc-btn svc-btn-ghost">All Services</Link>
          </div>

          {/* Overview */}
          <section style={{ marginTop: 96, maxWidth: 780 }}>
            <div style={label}>Overview</div>
            <h2 style={h2}>What you get with {s.name}</h2>
            {s.overview.map((p, i) => (
              <p key={i} style={{ color: "#b4b4cc", fontSize: 16, lineHeight: 1.85, marginBottom: 16 }}>{p}</p>
            ))}
          </section>

          {/* Features */}
          <section style={{ marginTop: 80 }}>
            <div style={label}>Key Features</div>
            <h2 style={h2}>Built around your goals</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              {s.features.map(f => (
                <div key={f.title} style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "26px 24px" }}>
                  <div style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Deliverables + tech */}
          <section style={{ marginTop: 80, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>
            <div>
              <div style={label}>Deliverables</div>
              <h2 style={h2}>What is included</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
                {s.deliverables.map(d => (
                  <li key={d} style={{ display: "flex", gap: 12, color: "#b4b4cc", fontSize: 15, lineHeight: 1.5 }}>
                    <span style={{ color: "var(--cyan)" }} aria-hidden>✓</span>{d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={label}>Technology</div>
              <h2 style={h2}>Tools we use</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {s.tech.map(t => <span key={t} className="svc-chip">{t}</span>)}
              </div>
            </div>
          </section>

          {/* Process */}
          <section style={{ marginTop: 80 }}>
            <div style={label}>Our Process</div>
            <h2 style={h2}>From idea to launch</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              {PROCESS.map((p, i) => (
                <div key={p.title} style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "26px 24px" }}>
                  <div style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 14, color: "var(--cyan)", marginBottom: 10 }}>0{i + 1}</div>
                  <div style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ marginTop: 80, maxWidth: 820 }}>
            <div style={label}>FAQ</div>
            <h2 style={h2}>Common questions</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {s.faqs.map(f => (
                <details key={f.q} className="svc-faq">
                  <summary>{f.q}</summary>
                  <p style={{ color: "#b4b4cc", fontSize: 15, lineHeight: 1.75, paddingBottom: 20 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div style={{
            margin: "96px 0 0", textAlign: "center", padding: "56px 24px", borderRadius: 28,
            background: "linear-gradient(135deg, rgba(234,88,12,0.16), rgba(249,115,22,0.05))",
            border: "1px solid var(--glass-border)",
          }}>
            <h2 style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 700, letterSpacing: "-1px", color: "#fff" }}>Ready to talk about {s.name}?</h2>
            <p style={{ color: "var(--muted)", fontSize: 16, margin: "14px auto 28px", maxWidth: 480, lineHeight: 1.7 }}>
              Book a free strategy call and tell us about your project.
            </p>
            <Link href="/book" className="svc-btn svc-btn-primary">Book a Free Call →</Link>
          </div>

          {/* Other services */}
          <section style={{ margin: "96px 0 120px" }}>
            <div style={label}>More Services</div>
            <h2 style={h2}>You may also need</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {others.map(o => <ServiceCard key={o.slug} s={o} />)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
