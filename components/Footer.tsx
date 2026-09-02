"use client";
import la from "../icons/logicsarcade_white.png";

const socialLinks = [
  {
    label: "Facebook",
    link: "https://facebook.com/logicsarcade",
    alt: "Follow Logic's Arcade on Facebook",
    icon: "facebook",
    type: "social",
    target: "_blank",
  },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/company/logicsarcade",
    alt: "Connect with Logic's Arcade on LinkedIn",
    icon: "linkedin",
    type: "social",
    target: "_blank",
  },

  {
    label: "Email",
    link: "mailto:info@logicsarcade.com",
    alt: "Email Logic's Arcade",
    icon: "mail",
    type: "email",
    target: "_self",
    value: "info@logicsarcade.com",
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--glass-border)",
        padding: "40px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 13, color: "var(--muted)" }}>
        � {new Date().getFullYear()} LogicsArcade. All rights reserved.
      </div>

      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 18,
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
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.link}
            target={link.target}
            rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
            style={{
              fontSize: 13,
              color: "var(--muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
