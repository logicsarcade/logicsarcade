"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/lib/services";

export interface SearchBlog {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
}

interface Entry { title: string; href: string; desc: string; keywords: string; kind: string }

// Existing site routes / sections
const PAGES: Entry[] = [
  { title: "Home", href: "/", kind: "Page", desc: "Back to the LogicsArcade homepage", keywords: "home main landing start logicsarcade software house" },
  { title: "Services", href: "/services", kind: "Page", desc: "What we build for you", keywords: "services what we do offerings solutions" },
  ...SERVICES.map(sv => ({ title: sv.name, href: `/services/${sv.slug}`, kind: "Service", desc: sv.tagline, keywords: `${sv.tech.join(" ")} ${sv.name}` })),
  { title: "Our Work", href: "/#work", kind: "Section", desc: "Selected projects and case studies", keywords: "work projects portfolio case studies examples" },
  { title: "Process", href: "/#process", kind: "Section", desc: "How we take an idea to launch", keywords: "process how we work workflow steps method" },
  // { title: "Clients", href: "/#clients", kind: "Section", desc: "What our clients say", keywords: "clients testimonials reviews feedback customers" }, // hidden for now
  { title: "Tech Stack", href: "/#stack", kind: "Section", desc: "Technologies we use", keywords: "tech stack technologies tools frameworks react node mongodb" },
  { title: "Contact", href: "/#contact", kind: "Section", desc: "Start a conversation with us", keywords: "contact reach touch email hire" },
  { title: "Blog", href: "/blog", kind: "Page", desc: "Tech insights, tutorials and news", keywords: "blog blogs articles posts news tutorials insights" },
  { title: "Book a Call", href: "/book", kind: "Page", desc: "Schedule a free 30-minute strategy call", keywords: "book call consultation schedule meeting appointment booking strategy free" },
  { title: "Privacy Policy", href: "/privacy", kind: "Page", desc: "How we protect your information", keywords: "privacy policy data information protection legal" },
  { title: "Terms of Service", href: "/terms", kind: "Page", desc: "The terms for using our services", keywords: "terms conditions service legal agreement" },
];

function score(e: Entry, tokens: string[]): number {
  const title = e.title.toLowerCase();
  const kw = e.keywords.toLowerCase();
  const desc = e.desc.toLowerCase();
  let total = 0;
  for (const t of tokens) {
    let s = 0;
    if (title.startsWith(t)) s = 5;
    else if (title.includes(t)) s = 4;
    else if (kw.split(/\s+/).some(w => w.startsWith(t))) s = 3;
    else if (kw.includes(t)) s = 2;
    else if (desc.includes(t)) s = 1;
    if (!s) return 0; // every word must match something
    total += s;
  }
  return total;
}

export default function NotFoundSearch({ blogs }: { blogs: SearchBlog[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo<Entry[]>(() => [
    ...PAGES,
    ...blogs.map(b => ({
      title: b.title, href: `/blog/${b.slug}`, kind: "Blog post",
      desc: b.excerpt, keywords: `${b.category} ${b.tags.join(" ")}`,
    })),
  ], [blogs]);

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return [];
    const tokens = query.split(/\s+/);
    return entries
      .map(e => ({ e, s: score(e, tokens) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 5)
      .map(x => x.e);
  }, [entries, query]);

  const open = focused && query.length > 0;

  function go(e?: Entry) {
    const target = e ?? results[active];
    if (target) router.push(target.href);
  }

  function onKeyDown(ev: React.KeyboardEvent) {
    if (ev.key === "ArrowDown") { ev.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (ev.key === "Enter") { ev.preventDefault(); go(); }
    else if (ev.key === "Escape") { setQ(""); inputRef.current?.blur(); }
  }

  return (
    <div className="nf-wrap" style={{ position: "relative", width: "100%", maxWidth: 560, textAlign: "center" }}>
      <style>{`
        @keyframes nfFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes nfFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes nfPop { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .nf-wrap > * { animation: nfFadeUp 0.7s cubic-bezier(.2,.7,.2,1) both; }
        .nf-wrap > *:nth-child(2) { animation-delay: 0.08s; }
        .nf-wrap > *:nth-child(3) { animation-delay: 0.16s; }
        .nf-wrap > *:nth-child(4) { animation-delay: 0.24s; }
        .nf-wrap > *:nth-child(5) { animation-delay: 0.32s; }
        .nf-wrap > *:nth-child(6) { animation-delay: 0.4s; }
        .nf-404 { animation: nfFadeUp 0.7s cubic-bezier(.2,.7,.2,1) both, nfFloat 6s ease-in-out 0.7s infinite !important; }
        .nf-row { transition: background 0.2s, border-color 0.2s; }
        .nf-home:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { .nf-wrap > *, .nf-404 { animation: none !important; } }
      `}</style>

      <div className="nf-404" style={{
        fontFamily: "var(--font-sg), sans-serif", fontWeight: 700,
        fontSize: "clamp(96px, 22vw, 190px)", lineHeight: 1, letterSpacing: "-6px",
        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        filter: "drop-shadow(0 0 40px rgba(234,88,12,0.35))",
      }}>404</div>

      <h1 style={{
        fontFamily: "var(--font-sg), sans-serif", fontSize: "clamp(28px, 4.5vw, 44px)",
        fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff", marginTop: 8,
      }}>Looking for something?</h1>

      <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, margin: "16px auto 36px", maxWidth: 440 }}>
        The page you&apos;re looking for isn&apos;t available — it may have moved or never existed.
        Try searching, or head back home.
      </p>

      {/* Search */}
      <div style={{ position: "relative", textAlign: "left" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "0 20px",
          background: "var(--glass)", borderRadius: 100,
          border: `1px solid ${focused ? "rgba(234,88,12,0.7)" : "var(--glass-border)"}`,
          boxShadow: focused ? "0 0 0 4px rgba(234,88,12,0.15), 0 0 40px rgba(234,88,12,0.2)" : "none",
          transition: "border-color 0.25s, box-shadow 0.25s",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={focused ? "var(--cyan)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: "stroke 0.25s" }} aria-hidden>
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={e => { setQ(e.target.value); setActive(0); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            onKeyDown={onKeyDown}
            placeholder="Search pages, services, blogs…"
            aria-label="Search the site"
            role="combobox"
            aria-expanded={open}
            aria-controls="nf-results"
            aria-activedescendant={open && results[active] ? `nf-opt-${active}` : undefined}
            autoComplete="off"
            style={{
              flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none",
              color: "var(--text)", fontSize: 15, fontFamily: "inherit", padding: "16px 0", cursor: "text",
            }}
          />
          {q && (
            <button type="button" aria-label="Clear search"
              onMouseDown={e => e.preventDefault()}
              onClick={() => { setQ(""); inputRef.current?.focus(); }}
              style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, lineHeight: 1, cursor: "pointer" }}>×</button>
          )}
        </div>

        {open && (
          <div id="nf-results" role="listbox" style={{
            position: "absolute", top: "calc(100% + 10px)", left: 0, right: 0, zIndex: 20,
            background: "rgba(8,8,24,0.96)", backdropFilter: "blur(20px)",
            border: "1px solid var(--glass-border)", borderRadius: 20, padding: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animation: "nfPop 0.2s ease both",
          }}>
            {results.length > 0 ? results.map((r, i) => (
              <Link
                key={r.href} href={r.href} id={`nf-opt-${i}`} role="option" aria-selected={i === active}
                className="nf-row"
                onMouseEnter={() => setActive(i)}
                onMouseDown={e => e.preventDefault()}
                style={{
                  display: "block", textDecoration: "none", padding: "12px 14px", borderRadius: 14,
                  background: i === active ? "rgba(234,88,12,0.14)" : "transparent",
                  border: `1px solid ${i === active ? "rgba(234,88,12,0.35)" : "transparent"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
                  <span style={{ color: "var(--cyan)", fontSize: 11, fontWeight: 500, letterSpacing: "0.3px", flexShrink: 0 }}>{r.kind}</span>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.desc}</div>
              </Link>
            )) : (
              <div style={{ padding: "18px 14px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
                <span aria-hidden>🔍 </span>No matching page found.
                <div style={{ fontSize: 12, marginTop: 4 }}>Try a different keyword, or go back home.</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0 20px", color: "var(--muted)", fontSize: 12, letterSpacing: "1px" }}>
        <span style={{ flex: 1, height: 1, background: "var(--glass-border)" }} />
        OR
        <span style={{ flex: 1, height: 1, background: "var(--glass-border)" }} />
      </div>

      <div>
        <Link href="/" className="nf-home" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
          color: "#fff", padding: "14px 32px", borderRadius: 100,
          fontSize: 15, fontWeight: 600, textDecoration: "none",
          boxShadow: "0 0 40px rgba(234,88,12,0.35)",
          transition: "transform 0.2s, box-shadow 0.3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(234,88,12,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 40px rgba(234,88,12,0.35)"; }}>
          ← Go to Home
        </Link>
      </div>
    </div>
  );
}
