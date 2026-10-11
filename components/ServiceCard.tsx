import Link from "next/link";
import type { Service } from "@/lib/services";

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <Link href={`/services/${s.slug}`} className="svc-card">
      <div style={{
        width: 52, height: 52, background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.12)",
        borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 22,
      }}>{s.icon}</div>
      <div style={{ fontFamily: "var(--font-sg), sans-serif", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>{s.name}</div>
      <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{s.desc}</div>
      <div style={{ marginTop: 22, fontSize: 13, color: "var(--cyan)", fontWeight: 500 }}>Learn more →</div>
    </Link>
  );
}
