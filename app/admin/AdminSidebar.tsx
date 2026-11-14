"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import LogoutButton from "./LogoutButton";
import { ADMIN_PRIMARY_LINKS, ADMIN_SECONDARY_LINKS, AdminNavLink } from "./admin-nav-links";
import logoIcon from "@/icons/logicsarcade.png";

interface Props {
  email?: string | null;
  children: React.ReactNode;
}

function NavIcon({ name, size = 18 }: { name: AdminNavLink["icon"]; size?: number }) {
  switch (name) {
    case "calendar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "briefcase":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "file-text":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "globe":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "book-open":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
  }
}

export default function AdminSidebar({ email, children }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
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

  // No admin navigation on login page
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const getSectionTitle = () => {
    if (pathname.startsWith("/admin/projects")) return "Projects Management";
    if (pathname.startsWith("/admin/blog")) return "Blog Manager";
    if (pathname === "/admin") return "Bookings Dashboard";
    return "Admin Portal";
  };

  function isLinkActive(link: AdminNavLink) {
    if (link.href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(link.href);
  }

  // Expanded View Navigation
  const renderExpandedLinks = (links: AdminNavLink[], sectionTitle?: string) => (
    <div style={{ marginBottom: 18 }}>
      {sectionTitle && (
        <div
          style={{
            fontSize: 10,
            letterSpacing: "1.5px",
            color: "#6b6b8a",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "0 10px",
            marginBottom: 6,
          }}
        >
          {sectionTitle}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {links.map((link) => {
          const active = isLinkActive(link);
          return (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? "#fff" : "#9090aa",
                background: active
                  ? "linear-gradient(90deg, rgba(234, 88, 12, 0.16), rgba(234, 88, 12, 0.04))"
                  : "transparent",
                borderLeft: active ? "3px solid #ea580c" : "3px solid transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9090aa";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: active ? "#ea580c" : "#6b6b8a", display: "flex" }}>
                  <NavIcon name={link.icon} size={16} />
                </span>
                <span>{link.label}</span>
              </div>
              {link.external && (
                <span style={{ fontSize: 11, color: "#6b6b8a" }}>↗</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  // Collapsed View Navigation: ONLY MENU ICONS
  const renderCollapsedIcons = (links: AdminNavLink[]) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {links.map((link) => {
        const active = isLinkActive(link);
        return (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            title={link.label}
            aria-label={link.label}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              color: active ? "#ea580c" : "#9090aa",
              background: active
                ? "rgba(234, 88, 12, 0.15)"
                : "transparent",
              border: active
                ? "1px solid rgba(234, 88, 12, 0.35)"
                : "1px solid transparent",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#9090aa";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
          >
            <NavIcon name={link.icon} size={18} />
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="admin-root">
      {/* ─── DESKTOP FIXED SIDEBAR (Never Scrolls with Page) ─── */}
      <aside
        className="admin-sidebar-fixed"
        style={{
          width: sidebarOpen ? 260 : 68,
        }}
      >
        {sidebarOpen ? (
          /* EXPANDED SIDEBAR (Full width: 260px) */
          <div
            style={{
              width: 260,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 14px",
            }}
          >
            <div>
              {/* Top: Logo + Collapse Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 16,
                  marginBottom: 18,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Logo />
                  {/* <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "#ea580c",
                      background: "rgba(234, 88, 12, 0.12)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      border: "1px solid rgba(234, 88, 12, 0.25)",
                    }}
                  >
                    Admin
                  </span> */}
                </div>

                {/* Collapse Button */}
                {/* <button
                  onClick={() => setSidebarOpen(false)}
                  title="Collapse to icons"
                  aria-label="Collapse sidebar panel"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 6,
                    color: "#9090aa",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "rgba(234, 88, 12, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#9090aa";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button> */}
              </div>

              {/* Navigation sections */}
              {renderExpandedLinks(ADMIN_PRIMARY_LINKS, "Management")}
              {renderExpandedLinks(ADMIN_SECONDARY_LINKS, "Navigation")}
            </div>

            {/* Bottom Profile and Logout */}
            <div
              style={{
                paddingTop: 14,
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              {email && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ea580c, #c2410c)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      boxShadow: "0 0 10px rgba(234, 88, 12, 0.3)",
                      flexShrink: 0,
                    }}
                  >
                    {email[0]?.toUpperCase() || "A"}
                  </div>
                  <div style={{ minWidth: 0, overflow: "hidden" }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#fff",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {email}
                    </div>
                    <div style={{ fontSize: 10, color: "#6b6b8a" }}>Administrator</div>
                  </div>
                </div>
              )}
              <LogoutButton />
            </div>
          </div>
        ) : (
          /* COLLAPSED SIDEBAR: ONLY MENU ICONS (Width: 68px) */
          <div
            style={{
              width: 68,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              {/* Top: Brand Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 16,
                  marginBottom: 16,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  width: "100%",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  title="LogicsArcade (Click to expand sidebar)"
                  aria-label="Expand sidebar panel"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Image
                    src={logoIcon}
                    alt="LogicsArcade"
                    width={36}
                    height={36}
                    priority
                    style={{ height: 36, width: "auto", objectFit: "contain" }}
                  />
                </button>
              </div>

              {/* Primary menu icons */}
              {renderCollapsedIcons(ADMIN_PRIMARY_LINKS)}

              {/* Divider */}
              <div style={{ width: 36, height: 1, background: "rgba(255, 255, 255, 0.06)", margin: "14px 0" }} />

              {/* Secondary menu icons */}
              {renderCollapsedIcons(ADMIN_SECONDARY_LINKS)}
            </div>

            {/* Bottom: User avatar + Compact Sign Out */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                paddingTop: 14,
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                width: "100%",
              }}
            >
              {email && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ea580c, #c2410c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    boxShadow: "0 0 10px rgba(234, 88, 12, 0.3)",
                    cursor: "pointer",
                  }}
                  title={`Logged in as ${email}`}
                >
                  {email[0]?.toUpperCase() || "A"}
                </div>
              )}
              <LogoutButton compact={true} />
            </div>
          </div>
        )}
      </aside>

      {/* ─── MAIN CONTENT CONTAINER (Scrolls Independently, Zero Overlap) ─── */}
      <div
        className="admin-main-container"
        style={{
          marginLeft: sidebarOpen ? 260 : 68,
          width: sidebarOpen ? "calc(100% - 260px)" : "calc(100% - 68px)",
        }}
      >
        {/* DESKTOP HEADER */}
        <header
          className="admin-desktop-header"
          style={{
            position: "sticky",
            top: 0,
            height: 60,
            background: "rgba(9, 9, 12, 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            zIndex: 25,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Collapse sidebar (icons only)" : "Expand sidebar panel"}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                color: "#fff",
                padding: "6px 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(234, 88, 12, 0.5)";
                e.currentTarget.style.background = "rgba(234, 88, 12, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              {/* <span>{sidebarOpen ? "Collapse Menu" : "Expand Menu"}</span> */}
            </button>

            {/* Breadcrumb Trail */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#6b6b8a" }}>Admin</span>
              <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>/</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>{getSectionTitle()}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Quick Live Site Link */}
            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#9090aa",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 8,
                padding: "6px 12px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9090aa";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              }}
            >
              <span>Live Website</span>
              <span style={{ fontSize: 11, color: "#ea580c" }}>↗</span>
            </Link>

            {/* User Avatar + Email */}
            {email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ea580c, #c2410c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {email[0]?.toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "#9090aa",
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email}
                </span>
              </div>
            )}

            <div style={{ width: 110 }}>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* MOBILE TOP HEADER */}
        <header
          className="admin-mobile-header"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            zIndex: 40,
            background: "rgba(9, 9, 12, 0.95)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(16px)",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#ea580c",
                background: "rgba(234, 88, 12, 0.12)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              Admin
            </span>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open admin menu"}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 8,
              color: "#fff",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </header>

        {/* MOBILE DRAWER OVERLAY */}
        {mobileOpen && (
          <div className="admin-mobile-drawer">
            <div
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
                zIndex: 90,
              }}
            />

            <aside
              style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                width: 270,
                maxWidth: "85vw",
                background: "#09090c",
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                zIndex: 100,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "10px 0 30px rgba(0, 0, 0, 0.8)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Logo />
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#ea580c" }}>Admin</span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "none",
                      color: "#9090aa",
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      fontSize: 18,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>

                {renderExpandedLinks(ADMIN_PRIMARY_LINKS, "Management")}
                {renderExpandedLinks(ADMIN_SECONDARY_LINKS, "Navigation")}
              </div>

              <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                {email && (
                  <div style={{ fontSize: 12, color: "#9090aa", marginBottom: 12 }}>
                    Logged in as <strong style={{ color: "#fff" }}>{email}</strong>
                  </div>
                )}
                <LogoutButton />
              </div>
            </aside>
          </div>
        )}

        {/* Page Content */}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
