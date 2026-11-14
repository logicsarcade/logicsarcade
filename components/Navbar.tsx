"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Blogs", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "clamp(12px, 2.5vw, 20px) clamp(16px, 4vw, 60px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled || mobileOpen
            ? "rgba(7, 7, 8, 0.96)"
            : "linear-gradient(to bottom, rgba(5,5,8,0.92) 0%, transparent 100%)",
          backdropFilter: scrolled || mobileOpen ? "blur(20px)" : "blur(4px)",
          borderBottom: scrolled || mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
          transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
        }}
      >
        <Logo />

        {/* Desktop Navigation Links */}
        <ul className="nav-desktop-links">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                style={{
                  color: "var(--muted, #9090aa)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  transition: "color 0.25s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted, #9090aa)")}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Action Button */}
        <div className="nav-desktop-btn">
          <Link
            href="/book"
            style={{
              background: "var(--violet, #ea580c)",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.3px",
              boxShadow: "0 4px 20px rgba(234, 88, 12, 0.3)",
              transition: "background 0.25s, transform 0.2s, box-shadow 0.25s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#c2410c";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(234, 88, 12, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--violet, #ea580c)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(234, 88, 12, 0.3)";
            }}
          >
            Book a Call
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="nav-mobile-btn">
          <Link
            href="/book"
            style={{
              background: "linear-gradient(135deg, #ea580c, #c2410c)",
              color: "#fff",
              padding: "7px 14px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Book Call
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              cursor: "pointer",
              padding: 0,
            }}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <>
                <span style={{ width: 18, height: 2, background: "#fff", borderRadius: 2 }} />
                <span style={{ width: 18, height: 2, background: "#ea580c", borderRadius: 2 }} />
                <span style={{ width: 18, height: 2, background: "#fff", borderRadius: 2 }} />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      {mobileOpen && (
        <div
          className="nav-mobile-drawer"
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(7, 7, 8, 0.98)",
            backdropFilter: "blur(24px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 20px 32px",
            overflowY: "auto",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#6b6b8a",
                fontWeight: 600,
                padding: "8px 12px 4px",
              }}
            >
              Navigation
            </div>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 18,
                  fontWeight: 600,
                  fontFamily: "var(--font-sg), sans-serif",
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background 0.15s",
                }}
              >
                <span>{label}</span>
                <span style={{ fontSize: 13, color: "#ea580c" }}>→</span>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #ea580c, #c2410c)",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(234, 88, 12, 0.35)",
                marginBottom: 16,
              }}
            >
              📞 Book a 30-Min Strategy Call
            </Link>

            <div style={{ textAlign: "center", fontSize: 12, color: "#6b6b8a" }}>
              info@logicsarcade.com · Remote-First Studio
            </div>
          </div>
        </div>
      )}
    </>
  );
}
