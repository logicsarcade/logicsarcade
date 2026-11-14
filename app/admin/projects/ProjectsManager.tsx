"use client";
import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Project } from "@/types/database";
import { deleteProject, toggleFeaturedProject } from "./actions";
import ProjectEditor from "./ProjectEditor";

interface Props {
  projects: Project[];
}

export default function ProjectsManager({ projects: initial }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setProjects(initial);
  }

  const [editing, setEditing] = useState<Project | null | "new">(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "standard">("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (featuredFilter === "featured" && !p.featured) return false;
      if (featuredFilter === "standard" && p.featured) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inCat = p.category.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inTech = Array.isArray(p.tech_stack) && p.tech_stack.some((t) => t.toLowerCase().includes(q));
      return inName || inCat || inDesc || inTech;
    });
  }, [projects, categoryFilter, featuredFilter, search]);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete project "${name}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res?.error) {
        alert("Failed to delete project: " + res.error);
      } else {
        setProjects((list) => list.filter((x) => x.id !== id));
      }
      setDeletingId(null);
    });
  }

  function handleToggleFeatured(id: string, current: boolean) {
    setTogglingId(id);
    startTransition(async () => {
      const res = await toggleFeaturedProject(id, current);
      if (res?.error) {
        alert("Failed to update featured status: " + res.error);
      } else {
        setProjects((list) =>
          list.map((x) => (x.id === id ? { ...x, featured: !current } : x))
        );
      }
      setTogglingId(null);
    });
  }

  function onSaved() {
    setEditing(null);
    router.refresh();
  }

  const totalCount = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 3vw, 40px)" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: "#ea580c",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Portfolio & Showcase
          </div>
          <h1
            style={{
              fontFamily: "var(--font-sg), sans-serif",
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            Projects Management
          </h1>
          <p style={{ fontSize: 13, color: "#9090aa", marginTop: 6 }}>
            Create, edit, organize, and feature your client work and case studies.
          </p>
        </div>

        <button
          onClick={() => setEditing("new")}
          style={{
            background: "linear-gradient(135deg, #ea580c, #c2410c)",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(234, 88, 12, 0.35)",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(234, 88, 12, 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(234, 88, 12, 0.35)";
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700 }}>+</span>
          <span>Add Project</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid-3">
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "18px 22px",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "var(--font-sg), sans-serif" }}>
            {totalCount}
          </div>
          <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 4 }}>Total Projects</div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "18px 22px",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "#ea580c", fontFamily: "var(--font-sg), sans-serif" }}>
            {featuredCount}
          </div>
          <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 4 }}>Featured on Homepage</div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "18px 22px",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "#d8d8df", fontFamily: "var(--font-sg), sans-serif" }}>
            {categories.length}
          </div>
          <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 4 }}>Distinct Categories</div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", flex: 1, minWidth: 260 }}>
          {/* Search box */}
          <div style={{ position: "relative", minWidth: 240, flex: "1 1 240px" }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b6b8a",
                fontSize: 14,
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, categories, tech..."
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "9px 14px 9px 36px",
                color: "#fff",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "9px 14px",
              color: "#fff",
              fontSize: 13,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all" style={{ background: "#111" }}>All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} style={{ background: "#111" }}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Filter Tabs */}
        <div
          style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: 3,
            gap: 2,
          }}
        >
          {(
            [
              { id: "all", label: "All" },
              { id: "featured", label: "Featured" },
              { id: "standard", label: "Standard" },
            ] as const
          ).map((tab) => {
            const active = featuredFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFeaturedFilter(tab.id)}
                style={{
                  background: active ? "rgba(234,88,12,0.2)" : "transparent",
                  color: active ? "#ea580c" : "#9090aa",
                  border: active ? "1px solid rgba(234,88,12,0.4)" : "1px solid transparent",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Table View Container */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ minWidth: 840 }}>
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "70px 2.2fr 1.2fr 1.4fr 1.1fr 90px 100px",
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                gap: 12,
                alignItems: "center",
              }}
            >
              {["Cover", "Project", "Category", "Tech Stack", "Metric", "Featured", "Actions"].map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: 11,
                    color: "#6b6b8a",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📁</div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 500 }}>
                  {projects.length === 0 ? "No projects added yet" : "No matching projects found"}
                </div>
                <p style={{ color: "#6b6b8a", fontSize: 13, marginTop: 4, maxWidth: 400, margin: "6px auto 0" }}>
                  {projects.length === 0
                    ? "Add your first portfolio project to showcase on the website."
                    : "Try adjusting your search terms or filters."}
                </p>
                {projects.length === 0 && (
                  <button
                    onClick={() => setEditing("new")}
                    style={{
                      marginTop: 20,
                      color: "#ea580c",
                      background: "rgba(234,88,12,0.1)",
                      border: "1px solid rgba(234,88,12,0.3)",
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    + Add your first project
                  </button>
                )}
              </div>
            )}

            {/* Project Rows */}
            {filtered.map((p, i) => {
              const isDeleting = deletingId === p.id;
              const isToggling = togglingId === p.id;

              return (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "70px 2.2fr 1.2fr 1.4fr 1.1fr 90px 100px",
                    padding: "16px 20px",
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    gap: 12,
                    alignItems: "center",
                    opacity: isDeleting ? 0.4 : 1,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Thumbnail / Image */}
                  <div>
                    {p.image_url ? (
                      <div
                        style={{
                          width: 54,
                          height: 38,
                          borderRadius: 8,
                          overflow: "hidden",
                          position: "relative",
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "#111",
                        }}
                      >
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          sizes="54px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 54,
                          height: 38,
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px dashed rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          color: "#6b6b8a",
                        }}
                      >
                        📐
                      </div>
                    )}
                  </div>

                  {/* Name & Description */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.name}
                      </span>
                      {p.link_url && (
                        <a
                          href={p.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open ${p.link_url}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 10,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: "rgba(234,88,12,0.12)",
                            color: "#ea580c",
                            border: "1px solid rgba(234,88,12,0.25)",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          <span>Live Link</span>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                      {p.featured && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "1px 6px",
                            borderRadius: 6,
                            background: "rgba(234,88,12,0.15)",
                            color: "#ea580c",
                            border: "1px solid rgba(234,88,12,0.3)",
                            fontWeight: 600,
                          }}
                        >
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#9090aa",
                        marginTop: 3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.description}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#d8d8df",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "3px 8px",
                        borderRadius: 6,
                        display: "inline-block",
                      }}
                    >
                      {p.category}
                    </span>
                  </div>

                  {/* Tech stack */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {Array.isArray(p.tech_stack) && p.tech_stack.length > 0 ? (
                      p.tech_stack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: 10,
                            color: "#9090aa",
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 4,
                            padding: "2px 6px",
                          }}
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 11, color: "#555" }}>—</span>
                    )}
                    {Array.isArray(p.tech_stack) && p.tech_stack.length > 3 && (
                      <span style={{ fontSize: 10, color: "#6b6b8a" }}>
                        +{p.tech_stack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Metric Result */}
                  <div>
                    {p.result ? (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#ea580c" }}>{p.result}</div>
                        {p.result_label && (
                          <div style={{ fontSize: 10, color: "#6b6b8a" }}>{p.result_label}</div>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: "#555" }}>—</span>
                    )}
                  </div>

                  {/* Featured Toggle */}
                  <div>
                    <button
                      onClick={() => handleToggleFeatured(p.id, p.featured)}
                      disabled={isToggling || isPending}
                      title={p.featured ? "Unfeature from homepage" : "Feature on homepage"}
                      style={{
                        background: p.featured ? "rgba(234,88,12,0.2)" : "rgba(255,255,255,0.04)",
                        border: p.featured ? "1px solid rgba(234,88,12,0.4)" : "1px solid rgba(255,255,255,0.1)",
                        color: p.featured ? "#ea580c" : "#6b6b8a",
                        borderRadius: 20,
                        padding: "4px 10px",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {p.featured ? "★ Yes" : "☆ No"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      onClick={() => setEditing(p)}
                      title="Edit project"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                        borderRadius: 6,
                        padding: "5px 10px",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(234,88,12,0.5)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={isDeleting || isPending}
                      title="Delete project"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                        borderRadius: 6,
                        padding: "5px 10px",
                        fontSize: 12,
                        cursor: isDeleting ? "wait" : "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    >
                      {isDeleting ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {editing !== null && (
        <ProjectEditor
          project={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
