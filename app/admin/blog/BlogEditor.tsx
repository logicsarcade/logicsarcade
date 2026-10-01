"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlog, updateBlog } from "./actions";
import type { Blog, BlogInsert } from "@/types/blog";

const CATEGORIES = [
  "Web Development", "Mobile Apps", "AI & Machine Learning",
  "Shopify & E-commerce", "DevOps & Cloud", "SaaS", "JavaScript", "Next.js",
  "React", "Database", "Career & Freelancing", "Tech News",
];

const inp: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
  padding: "12px 14px", color: "#fff", fontSize: 14,
  fontFamily: "'Inter',sans-serif", outline: "none", transition: "border-color 0.2s",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 500,
  color: "#9090aa", marginBottom: 6, letterSpacing: "0.3px",
};
const foc = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = "rgba(0,245,255,0.4)");
const blr = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = "rgba(255,255,255,0.1)");

interface Props {
  blog?: Blog;
  onClose: () => void;
  onSaved: () => void;
}

export default function BlogEditor({ blog, onClose, onSaved }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [tagsInput, setTagsInput] = useState(blog?.tags?.join(", ") ?? "");

  const [form, setForm] = useState<Partial<BlogInsert>>({
    title: blog?.title ?? "",
    slug: blog?.slug ?? "",
    excerpt: blog?.excerpt ?? "",
    content: blog?.content ?? "",
    category: blog?.category ?? CATEGORIES[0],
    cover_image: blog?.cover_image ?? "",
    author_name: blog?.author_name ?? "LogicsArcade Team",
    read_time: blog?.read_time ?? 5,
    is_published: blog?.is_published ?? false,
    tags: blog?.tags ?? [],
  });

  const set = (k: keyof BlogInsert, v: string | number | boolean | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  function slugify(t: string) {
    return t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  }

  function handleTitleChange(val: string) {
    set("title", val);
    if (!blog) set("slug", slugify(val)); // auto-slug only on create
  }

  function handleSave(publish: boolean) {
    setError("");
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const payload = { ...form, tags, is_published: publish } as BlogInsert;

    startTransition(async () => {
      if (blog) {
        const res = await updateBlog(blog.id, payload);
        if (res.error) { setError(res.error); return; }
      } else {
        const res = await createBlog(payload);
        if (res.error) { setError(res.error); return; }
      }
      onSaved();
      router.refresh();
    });
  }

  const isEdit = !!blog;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 20px 20px" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }} />

      <div onClick={e => e.stopPropagation()} style={{
        position: "relative", zIndex: 1, background: "#0a0a16",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
        width: "min(860px,95vw)", maxHeight: "88vh", overflowY: "auto",
        padding: "36px 40px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--cyan)", textTransform: "uppercase", marginBottom: 6 }}>
              {isEdit ? "Edit Blog Post" : "New Blog Post"}
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>
              {isEdit ? blog.title : "Create Post"}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b6b8a", fontSize: 26, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Form grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Title */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={lbl}>Title *</label>
            <input value={form.title} onChange={e => handleTitleChange(e.target.value)} onFocus={foc} onBlur={blr}
              placeholder="e.g. Why Next.js 15 Changes Everything" style={inp} />
          </div>

          {/* Slug */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={lbl}>Slug (URL) *</label>
            <input value={form.slug} onChange={e => set("slug", e.target.value)} onFocus={foc} onBlur={blr}
              placeholder="why-nextjs-15-changes-everything" style={{ ...inp, fontFamily: "monospace", fontSize: 13 }} />
          </div>

          {/* Category */}
          <div>
            <label style={lbl}>Category *</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} onFocus={foc} onBlur={blr}
              style={{ ...inp, cursor: "pointer" }}>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#0a0a16" }}>{c}</option>)}
            </select>
          </div>

          {/* Read time */}
          <div>
            <label style={lbl}>Read Time (minutes)</label>
            <input type="number" min={1} max={60} value={form.read_time} onChange={e => set("read_time", parseInt(e.target.value) || 5)}
              onFocus={foc} onBlur={blr} style={inp} />
          </div>

          {/* Author */}
          <div>
            <label style={lbl}>Author Name</label>
            <input value={form.author_name} onChange={e => set("author_name", e.target.value)}
              onFocus={foc} onBlur={blr} placeholder="LogicsArcade Team" style={inp} />
          </div>

          {/* Cover image */}
          <div>
            <label style={lbl}>Cover Image URL</label>
            <input value={form.cover_image ?? ""} onChange={e => set("cover_image", e.target.value)}
              onFocus={foc} onBlur={blr} placeholder="https://..." style={inp} />
          </div>

          {/* Tags */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={lbl}>Tags (comma separated)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              onFocus={foc} onBlur={blr} placeholder="Next.js, React, Performance" style={inp} />
          </div>
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Excerpt * (shown on blog listing)</label>
          <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
            onFocus={foc} onBlur={blr} rows={3}
            placeholder="A brief summary of the article (1–2 sentences)..."
            style={{ ...inp, resize: "vertical" }} />
        </div>

        {/* Content */}
        <div style={{ marginBottom: 28 }}>
          <label style={lbl}>Content * (HTML or Markdown supported)</label>
          <textarea value={form.content} onChange={e => set("content", e.target.value)}
            onFocus={foc} onBlur={blr} rows={16}
            placeholder={"<h2>Introduction</h2>\n<p>Your blog content here...</p>"}
            style={{ ...inp, resize: "vertical", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 }} />
          <div style={{ fontSize: 11, color: "#444", marginTop: 6 }}>
            {(form.content ?? "").length} characters
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 16px", color: "#f87171", fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#9090aa", padding: "10px 24px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={() => handleSave(false)} disabled={isPending}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#ccc", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            {isPending ? "Saving…" : "Save Draft"}
          </button>
          <button onClick={() => handleSave(true)} disabled={isPending}
            style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)", color: "#fff", border: "none", padding: "10px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: isPending ? "not-allowed" : "pointer", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
            {isPending ? "Publishing…" : isEdit ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
