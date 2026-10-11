"use client";
import { useReveal } from "./useReveal";
import type { Project } from "@/types/database";

// Live links for known projects (matched by name)
function projectLink(name: string) {
  const n = name.toLowerCase();
  if (n.includes("minewords")) return "https://minewords.com/";
  if (n.includes("arcade shipping calculator")) return "https://apps.shopify.com/shipping-cost-calculator";
  return "#";
}

// ─── Mock screen rendered inside each project card ───────────
function MockScreen({ accent }: { accent: string }) {
  const color = accent === "cyan" ? "0,245,255" : "124,58,237";
  return (
    <div
      style={{
        width: "85%",
        height: "80%",
        background: "#0a0a1a",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          height: 28,
          background: "#111125",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 12px",
        }}
      >
        {["#ff5f56", "#febc2e", "#27c93f"].map((c) => (
          <div
            key={c}
            style={{ width: 8, height: 8, borderRadius: "50%", background: c }}
          />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: `rgba(${color},0.12)`,
            width: "80%",
          }}
        />
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: "rgba(255,255,255,0.05)",
            width: "60%",
          }}
        />
        <div
          style={{
            height: 40,
            borderRadius: 8,
            background: `rgba(${color},0.1)`,
            border: `1px solid rgba(${color},0.15)`,
            marginTop: 4,
          }}
        />
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            marginTop: 4,
          }}
        >
          {[30, 60, 45, 80, 55, 70, 90, 65, 40, 75, 50, 85].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: "4px 4px 0 0",
                background: `rgba(${i > 5 ? "124,58,237" : color},${0.2 + (h / 100) * 0.2})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Single project card ─────────────────────────────────────
function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal reveal-d${Math.min(delay, 4)}`}
      style={{
        gridColumn: project.featured ? "span 2" : "span 1",
        background: "var(--glass)",
        border: "1px solid var(--glass-border)",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s, border-color 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "var(--glass-border)";
      }}
    >
      <a
        key={project.id}
        href={projectLink(project.name)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        {/* Image or mock screen */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: project.featured ? "16/6" : "16/7",
            background: "var(--navy)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <MockScreen accent={project.accent} />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(5,5,8,0.7) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              color: "var(--cyan)",
              marginBottom: 10,
            }}
          >
            {project.category}
          </div>
          <div
            style={{
              fontFamily: "var(--font-sg), sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: 10,
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            {project.description}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {project.tech_stack.map((t) => (
                <span
                  key={t}
                  style={{
                    background: "rgba(124,58,237,0.12)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: 100,
                    padding: "3px 10px",
                    fontSize: 11,
                    color: "#a78bfa",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#4ade80",
                  fontFamily: "var(--font-sg), sans-serif",
                }}
              >
                {project.result}
              </span>
              {project.result_label}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

// ─── Section — receives data from Server Component ───────────
export default function Projects({ projects }: { projects: Project[] }) {
  const headerRef = useReveal();

  if (projects.length === 0) return null;

  return (
    <section
      id="work"
      style={{ padding: "120px 0", position: "relative", zIndex: 1 }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div ref={headerRef} className="reveal" style={{ marginBottom: 64 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "var(--cyan)",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            Featured Work
          </div>
          <h2
            style={{
              fontFamily: "var(--font-sg), sans-serif",
              fontSize: "clamp(32px,3.5vw,52px)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              color: "#fff",
            }}
          >
            Products that <span style={{ color: "#a78bfa" }}>ship</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 24,
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
