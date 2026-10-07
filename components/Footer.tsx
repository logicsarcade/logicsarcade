"use client";
import Link from "next/link";
import la from "../icons/logicsarcade.png";
import Logo from "./Logo";

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
    <footer className="site-footer">
      <div className="site-footer-left" style={{ fontSize: 13, color: "var(--muted)" }}>
        &copy; {new Date().getFullYear()} LogicsArcade. All rights reserved.
      </div>
      <div className="site-footer-center">
        <Logo />
      </div>
      <div className="site-footer-right">
        <Link
          href="/terms"
          style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          Terms & Conditions
        </Link>
        <Link
          href="/privacy"
          style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          Privacy Policy
        </Link>
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.link}
            target={link.target}
            rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
            style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
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
