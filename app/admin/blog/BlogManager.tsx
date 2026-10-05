"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Blog } from "@/types/blog";
import { deleteBlog, togglePublish } from "./actions";
import BlogEditor from "./BlogEditor";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function BlogManager({ blogs: initial }: { blogs: Blog[] }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) { setPrevInitial(initial); setBlogs(initial); } // live update from server
  const [editing, setEditing] = useState<Blog | null | "new">(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteBlog(id);
      setBlogs(b => b.filter(x => x.id !== id));
      setDeletingId(null);
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await togglePublish(id, current);
      setBlogs(b => b.map(x => x.id === id ? { ...x, is_published: !current, published_at: !current ? new Date().toISOString() : null } : x));
    });
  }

  function onSaved() {
    setEditing(null);
    router.refresh();
  }

  const published = blogs.filter(b => b.is_published).length;
  const drafts = blogs.filter(b => !b.is_published).length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--cyan)", textTransform: "uppercase", marginBottom: 10 }}>Content</div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 700, letterSpacing: "-1px", color: "#fff" }}>
            Blog Manager
          </h1>
        </div>
        <button onClick={() => setEditing("new")}
          style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 0 20px rgba(124,58,237,0.3)", whiteSpace: "nowrap" }}>
          + New Post
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 36 }}>
        {[{ label: "Total Posts", value: blogs.length, color: "#fff" }, { label: "Published", value: published, color: "#4ade80" }, { label: "Drafts", value: drafts, color: "#fbbf24" }].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        {/* Table head */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 100px 100px 180px", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          {["Post", "Category", "Date", "Status", "Actions"].map(h => (
            <div key={h} style={{ fontSize: 11, color: "#6b6b8a", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✍️</div>
            <div style={{ color: "#444", fontSize: 15 }}>No blog posts yet.</div>
            <button onClick={() => setEditing("new")} style={{ marginTop: 16, color: "var(--cyan)", background: "none", border: "none", fontSize: 14, cursor: "pointer" }}>Create your first post →</button>
          </div>
        )}

        {blogs.map((b, i) => (
          <div key={b.id}
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr 100px 100px 180px", padding: "16px 24px", borderBottom: i < blogs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
            {/* Title + excerpt */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{b.title}</div>
              <div style={{ fontSize: 11, color: "#6b6b8a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 320 }}>{b.excerpt}</div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{b.read_time} min read · by {b.author_name}</div>
            </div>

            {/* Category */}
            <div>
              <span style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "#a78bfa" }}>{b.category}</span>
            </div>

            {/* Date */}
            <div style={{ fontSize: 12, color: "#6b6b8a" }}>
              {b.published_at ? fmtDate(b.published_at) : fmtDate(b.created_at)}
            </div>

            {/* Status */}
            <div>
              <span style={{
                background: b.is_published ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)",
                border: `1px solid ${b.is_published ? "rgba(74,222,128,0.3)" : "rgba(251,191,36,0.3)"}`,
                color: b.is_published ? "#4ade80" : "#fbbf24",
                borderRadius: 100, padding: "3px 12px", fontSize: 11, fontWeight: 600,
              }}>
                {b.is_published ? "Published" : "Draft"}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditing(b)}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ccc", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
                Edit
              </button>
              <button onClick={() => handleToggle(b.id, b.is_published)} disabled={isPending}
                style={{ background: b.is_published ? "rgba(251,191,36,0.1)" : "rgba(74,222,128,0.1)", border: `1px solid ${b.is_published ? "rgba(251,191,36,0.2)" : "rgba(74,222,128,0.2)"}`, color: b.is_published ? "#fbbf24" : "#4ade80", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
                {b.is_published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id}
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
                {deletingId === b.id ? "…" : "Del"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor modal */}
      {editing !== null && (
        <BlogEditor
          blog={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
