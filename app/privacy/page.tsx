import JsonLd from "@/components/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — LogicsArcade",
  description: "Learn how LogicsArcade collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "January 1, 2025";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us when you:
      <ul>
        <li><strong>Book a consultation call:</strong> name, email address, phone number, company name, project details, and scheduling preferences.</li>
        <li><strong>Contact us:</strong> any information you choose to include in your message.</li>
        <li><strong>Use our website:</strong> browser type, IP address, pages visited, and time spent on pages (via standard server logs and analytics).</li>
      </ul>
      <p>We do not collect payment information directly — all payments are processed through secure third-party payment processors.</p>`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:
      <ul>
        <li>Respond to your inquiries and schedule consultation calls.</li>
        <li>Send you booking confirmations, updates, and meeting reminders.</li>
        <li>Improve our website, services, and user experience.</li>
        <li>Comply with legal obligations and enforce our terms.</li>
        <li>Send occasional updates about our services (you may opt out at any time).</li>
      </ul>
      <p>We will never sell, rent, or trade your personal information to third parties for their marketing purposes.</p>`,
    },
    {
      title: "3. Information Sharing",
      content: `We share your information only in the following circumstances:
      <ul>
        <li><strong>Service providers:</strong> We work with trusted third-party services (such as Supabase for database hosting, and video conferencing tools for calls) who access your data only to perform services on our behalf.</li>
        <li><strong>Legal requirements:</strong> We may disclose your information if required to do so by law or in response to valid legal requests.</li>
        <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
      </ul>`,
    },
    {
      title: "4. Data Storage & Security",
      content: `<p>Your data is stored securely on Supabase infrastructure with encryption at rest and in transit. We implement industry-standard security measures including:</p>
      <ul>
        <li>SSL/TLS encryption for all data in transit.</li>
        <li>Row-level security policies on our database.</li>
        <li>Access controls limiting who can view your data.</li>
        <li>Regular security reviews of our infrastructure.</li>
      </ul>
      <p>However, no method of transmission over the Internet is 100% secure. We strive to protect your information but cannot guarantee absolute security.</p>`,
    },
    {
      title: "5. Cookies & Tracking",
      content: `<p>Our website uses minimal cookies necessary for operation. We may use:</p>
      <ul>
        <li><strong>Session cookies:</strong> to maintain your logged-in state if you are an authenticated user.</li>
        <li><strong>Analytics:</strong> we may use privacy-respecting analytics tools to understand how visitors use our website. These do not track you across other websites.</li>
      </ul>
      <p>You can disable cookies in your browser settings, though this may affect some website functionality.</p>`,
    },
    {
      title: "6. Your Rights",
      content: `<p>You have the right to:</p>
      <ul>
        <li><strong>Access:</strong> request a copy of the personal information we hold about you.</li>
        <li><strong>Correction:</strong> ask us to correct inaccurate or incomplete information.</li>
        <li><strong>Deletion:</strong> request deletion of your personal data, subject to certain legal obligations.</li>
        <li><strong>Opt-out:</strong> unsubscribe from marketing communications at any time by contacting us or clicking the unsubscribe link in emails.</li>
        <li><strong>Data portability:</strong> request your data in a portable format.</li>
      </ul>
      <p>To exercise any of these rights, please contact us at <a href="mailto:info@logicsarcade.com" style="color:var(--cyan)">info@logicsarcade.com</a>.</p>`,
    },
    {
      title: "7. Third-Party Links",
      content: `<p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to read the privacy policies of any third-party sites you visit.</p>`,
    },
    {
      title: "8. Children's Privacy",
      content: `<p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.</p>`,
    },
    {
      title: "9. Changes to This Policy",
      content: `<p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last Updated" date at the top of this page. Your continued use of our website after changes constitutes your acceptance of the updated policy.</p>`,
    },
    {
      title: "10. Contact Us",
      content: `<p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:info@logicsarcade.com" style="color:var(--cyan)">info@logicsarcade.com</a></li>
        <li><strong>Website:</strong> <a href="https://logicsarcade.com" style="color:var(--cyan)">logicsarcade.com</a></li>
      </ul>
      <p>We will respond to your inquiry within 5 business days.</p>`,
    },
  ];

  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Privacy Policy — LogicsArcade", description: "How LogicsArcade collects, uses, and protects your personal information.", path: "/privacy" }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])]} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />

      <main style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "20%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,255,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 40px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b6b8a", marginBottom: 40 }}>
            <Link href="/" style={{ color: "#6b6b8a", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "var(--cyan)" }}>Privacy Policy</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.15)", borderRadius: 100, padding: "6px 16px", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 24 }}>
              Legal
            </div>
            <h1 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
              At LogicsArcade, we are committed to protecting your privacy. This policy explains how we handle your personal information.
            </p>
            <div style={{ marginTop: 16, fontSize: 13, color: "#444" }}>Last Updated: {LAST_UPDATED}</div>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {sections.map((section, i) => (
              <div key={i} style={{ paddingTop: 36, paddingBottom: 36, borderBottom: i < sections.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <h2 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", marginBottom: 16 }}>
                  {section.title}
                </h2>
                <div
                  style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.75 }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 56, background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 16, padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Have questions about your data?</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>We&apos;re happy to help clarify anything.</div>
            </div>
            <a href="mailto:info@logicsarcade.com"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,var(--violet),#5b21b6)", color: "#fff", padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <style>{`
        .privacy-content ul { margin: 0.5em 0 1em 1.5em; }
        .privacy-content li { margin-bottom: 0.4em; }
      `}</style>

      <Footer />
    </>
  );
}
