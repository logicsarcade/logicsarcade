import JsonLd from "@/components/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — LogicsArcade",
  description: "Terms and conditions governing your use of LogicsArcade services and website.",
};

const LAST_UPDATED = "January 1, 2025";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `<p>By accessing or using the LogicsArcade website (<strong>logicsarcade.com</strong>) or engaging our services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website or services.</p>
      <p>These terms apply to all visitors, clients, and users of our services. We reserve the right to update these terms at any time, and your continued use of our services constitutes acceptance of any changes.</p>`,
    },
    {
      title: "2. Services",
      content: `<p>LogicsArcade provides software development services including but not limited to:</p>
      <ul>
        <li>Web application development (MERN stack, Next.js, and other frameworks)</li>
        <li>Mobile application development (React Native)</li>
        <li>Shopify app and theme development</li>
        <li>SaaS platform development</li>
        <li>AI integration and automation</li>
        <li>DevOps and cloud infrastructure</li>
      </ul>
      <p>The specific scope, deliverables, timeline, and pricing for each project are defined in separate project agreements or contracts signed between LogicsArcade and the client.</p>`,
    },
    {
      title: "3. Consultation Calls & Bookings",
      content: `<p>When you book a consultation call through our website:</p>
      <ul>
        <li>Consultation calls are <strong>free of charge</strong> and are intended as a discovery session, not a commitment to engage our services.</li>
        <li>We reserve the right to cancel or reschedule calls with reasonable notice.</li>
        <li>Please be punctual — if you miss a scheduled call without notice, we may mark it as cancelled.</li>
        <li>Information shared during consultation calls is treated confidentially and will not be disclosed to third parties without your consent.</li>
        <li>Booking a call does not constitute a binding agreement for services.</li>
      </ul>`,
    },
    {
      title: "4. Intellectual Property",
      content: `<p><strong>Our Content:</strong> All content on this website — including text, graphics, logos, images, and code — is the property of LogicsArcade and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
      <p><strong>Client Projects:</strong> Upon full payment of all invoices, intellectual property rights for custom-developed software are transferred to the client as specified in the project agreement. LogicsArcade retains the right to:</p>
      <ul>
        <li>Use the project in our portfolio and case studies (unless a specific NDA prohibits this).</li>
        <li>Reuse general-purpose code, libraries, and frameworks developed independently of the project.</li>
      </ul>
      <p><strong>Open Source:</strong> We use open-source libraries in our work. Relevant open-source licenses continue to apply to those components.</p>`,
    },
    {
      title: "5. Payment & Billing",
      content: `<p>Payment terms for projects are outlined in individual project agreements. Generally:</p>
      <ul>
        <li>Projects require a deposit (typically 30–50%) before work begins.</li>
        <li>Milestone-based payments are common for larger projects.</li>
        <li>Final payment is due before final deliverable handover.</li>
        <li>Late payments may incur interest charges as specified in the project agreement.</li>
        <li>All prices are in USD unless otherwise stated.</li>
      </ul>
      <p>We reserve the right to pause work on a project if payment obligations are not met.</p>`,
    },
    {
      title: "6. Confidentiality",
      content: `<p>We treat all client project information as confidential. We will not disclose your project details, business information, or trade secrets to third parties without your consent, except:</p>
      <ul>
        <li>To our team members or contractors who need the information to complete your project.</li>
        <li>When required by law.</li>
      </ul>
      <p>If you require a formal Non-Disclosure Agreement (NDA), please request one before our initial consultation — we are happy to accommodate this.</p>`,
    },
    {
      title: "7. Warranties & Disclaimers",
      content: `<p><strong>We warrant that:</strong></p>
      <ul>
        <li>We will perform services with professional care and skill.</li>
        <li>Deliverables will conform to the specifications agreed upon in the project agreement.</li>
        <li>We have the right to provide the services and deliverables.</li>
      </ul>
      <p><strong>We disclaim:</strong></p>
      <ul>
        <li>Guarantees of specific business outcomes, revenue, or user acquisition results from software we build.</li>
        <li>Responsibility for third-party services, APIs, or platforms that our software integrates with.</li>
        <li>Warranties beyond those expressly stated in the project agreement.</li>
      </ul>
      <p>The website and its content are provided "as is" without warranty of any kind.</p>`,
    },
    {
      title: "8. Limitation of Liability",
      content: `<p>To the maximum extent permitted by law, LogicsArcade shall not be liable for:</p>
      <ul>
        <li>Indirect, incidental, special, consequential, or punitive damages.</li>
        <li>Loss of profits, revenue, data, or business opportunities.</li>
        <li>Damages arising from third-party services or integrations.</li>
        <li>Security breaches on third-party infrastructure.</li>
      </ul>
      <p>Our total liability for any claim arising from our services shall not exceed the total amount paid by you for the specific service giving rise to the claim in the three months preceding the claim.</p>`,
    },
    {
      title: "9. Project Cancellation",
      content: `<p>If a client cancels a project:</p>
      <ul>
        <li>Work completed to date will be invoiced at our standard rates.</li>
        <li>Deposits are non-refundable unless cancellation is due to our failure to perform.</li>
        <li>A cancellation notice period (typically 7–14 days) must be provided as specified in the project agreement.</li>
      </ul>
      <p>LogicsArcade reserves the right to terminate a project engagement with notice if the client fails to fulfill payment obligations or engages in conduct that prevents us from performing our services.</p>`,
    },
    {
      title: "10. Governing Law",
      content: `<p>These Terms & Conditions are governed by the laws of Pakistan. Any disputes arising from these terms or our services shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to the jurisdiction of the courts of Pakistan.</p>`,
    },
    {
      title: "11. Contact",
      content: `<p>For any questions regarding these Terms & Conditions, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:info@logicsarcade.com" style="color:var(--cyan)">info@logicsarcade.com</a></li>
        <li><strong>Website:</strong> <a href="https://logicsarcade.com" style="color:var(--cyan)">logicsarcade.com</a></li>
      </ul>`,
    },
  ];

  return (
    <>
      <JsonLd data={[webPageSchema({ name: "Terms of Service — LogicsArcade", description: "The terms for using LogicsArcade services.", path: "/terms" }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }])]} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />

      <main style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "20%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(234,88,12,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b6b8a", marginBottom: 40 }}>
            <Link href="/" style={{ color: "#6b6b8a", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "var(--cyan)" }}>Terms & Conditions</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(234,88,12,0.1)", border: "1px solid rgba(234,88,12,0.25)", borderRadius: 100, padding: "6px 16px", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#fb923c", marginBottom: 24 }}>
              Legal
            </div>
            <h1 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>
              Terms & Conditions
            </h1>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
              Please read these terms carefully before using our website or engaging our services. By continuing, you agree to these terms.
            </p>
            <div style={{ marginTop: 16, fontSize: 13, color: "#444" }}>Last Updated: {LAST_UPDATED}</div>
          </div>

          {/* Quick links */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px", marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 12, fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>Jump to section</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sections.map((s, i) => (
                <span key={i} style={{ fontSize: 12, color: "var(--muted)", background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "4px 10px", cursor: "default" }}>
                  {s.title.split(". ")[1]}
                </span>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column" }}>
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
          <div style={{ marginTop: 56, background: "rgba(234,88,12,0.06)", border: "1px solid rgba(234,88,12,0.18)", borderRadius: 16, padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Questions about our terms?</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Get in touch — we&apos;re straightforward to work with.</div>
            </div>
            <Link href="/book"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#ea580c,#c2410c)", color: "#fff", padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Book a Call
            </Link>
          </div>

          {/* Also see */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/privacy" style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}>
              Also read our Privacy Policy →
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        ul { margin: 0.5em 0 1em 1.5em; }
        li { margin-bottom: 0.5em; line-height: 1.65; }
      `}</style>

      <Footer />
    </>
  );
}
