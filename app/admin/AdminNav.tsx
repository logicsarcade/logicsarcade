"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import LogoutButton from "./LogoutButton";
import { ADMIN_NAV_LINKS } from "./admin-nav-links";

export default function AdminNav({ email }: { email?: string | null }) {
  const pathname = usePathname();
  // No nav on the public login page
  if (pathname.startsWith("/admin/login")) return null;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "18px 40px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "rgba(5,5,8,0.95)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Logo />
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 16 }}>|</span>
        {ADMIN_NAV_LINKS.map(l => {
          const active = l.href === "/admin" ? pathname === "/admin" : false;
          return (
            <Link key={l.href} href={l.href}
              style={{ fontSize: 13, color: active ? "#fff" : "#6b6b8a", textDecoration: "none" }}>
              {l.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {email && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg,#ea580c,#c2410c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff",
            }}>
              {email[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: "#9090aa" }}>{email}</span>
          </div>
        )}
        <LogoutButton />
      </div>
    </nav>
  );
}
