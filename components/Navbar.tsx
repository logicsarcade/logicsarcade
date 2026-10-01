"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import la from "../icons/logicsarcade.png";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "24px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background:
          "linear-gradient(to bottom, rgba(5,5,8,0.9) 0%, transparent 100%)",
        // background: scrolled
        //   ? "rgba(5,5,8,0.92)"
        //   : "linear-gradient(to bottom, rgba(5,5,8,0.9) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(2px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
      }}
    >
      {/* <Link
        href="/"
        style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "#fff",
          textDecoration: "none",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <img
          src={la.src}
          alt="LogicsArcade Logo"
          style={{ height: 40, marginRight: 12 }}
        />
        Logics<span style={{ color: "var(--cyan)" }}>Arcade</span>
      </Link> */}
      <Logo />
      <ul
        style={{ display: "flex", gap: 40, listStyle: "none" }}
        className="hidden md:flex"
      >
        {[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Work", href: "/#work" },
          { label: "Process", href: "/#process" },
          { label: "Clients", href: "/#clients" },
          { label: "Blogs", href: "/blog" },
        ].map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              style={{
                color: "var(--muted)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.5px",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--muted)")
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/book"
        style={{
          background: "var(--violet)",
          color: "#fff",
          padding: "10px 24px",
          borderRadius: 100,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "0.3px",
          transition: "background 0.3s, transform 0.2s",
          display: "inline-block",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#6d28d9";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--violet)";
          e.currentTarget.style.transform = "none";
        }}
      >
        Book a Call
      </Link>
    </nav>
  );
}
