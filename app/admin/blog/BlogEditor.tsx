"use client";
import { useRef, useState, useTransition } from "react";
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
  fontFamily: "var(--font-inter),sans-serif", outline: "none", transition: "border-color 0.2s",
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
    is_featured: blog?.is_featured ?? false,
    tags: blog?.tags ?? [],
  });

  const set = (k: keyof BlogInsert, v: string | number | boolean | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Image uploaded in this editor session but not saved with the blog yet
  const pendingImage = useRef<string | null>(null);

  function discardImage(url: string | null) {
    if (!url) return;
    fetch("/admin/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      keepalive: true,
    }).catch(() => {});
  }

  function handleClose() {
    discardImage(pendingImage.current);
    pendingImage.current = null;
    onClose();
  }

  async function uploadImage(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) setError(json.error || "Image upload failed.");
      else {
        discardImage(pendingImage.current); // replaced before saving
        pendingImage.current = json.url;
        set("cover_image", json.url);
      }
    } catch {
      setError("Image upload failed.");
    }
    setUploading(false);
  }

  function handleTitleChange(val: string) {
    set("title", val);
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
      if (pendingImage.current && pendingImage.current !== form.cover_image) discardImage(pendingImage.current);
      pendingImage.current = null;
      onSaved();
      router.refresh();
    });
  }

  const isEdit = !!blog;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 20px 20px" }} onClick={handleClose}>
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
            <h2 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>
              {isEdit ? blog.title : "Create Post"}
            </h2>
          </div>
          <button onClick={handleClose} style={{ background: "none", border: "none", color: "#6b6b8a", fontSize: 26, cursor: "pointer", lineHeight: 1 }}>×</button>
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
            <label style={lbl}>Slug (URL) — optional, auto-generated from title if empty</label>
            <input value={form.slug} onChange={e => set("slug", e.target.value)} onFocus={foc} onBlur={blr}
              placeholder="Leave empty to generate automatically" style={{ ...inp, fontFamily: "monospace", fontSize: 13 }} />
          </div>

          {/* Category */}
          <div>
            <label style={lbl}>Category *</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} onFocus={foc} onBlur={blr}
              style={{ ...inp, cursor: "pointer" }}>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#0a0a16" }}>{c}</option>)}
            </select>
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
            <label
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) uploadImage(f); }}
              style={{
                display: "block", marginTop: 8, padding: "14px", textAlign: "center", cursor: "pointer",
                border: `1px dashed ${dragOver ? "rgba(0,245,255,0.6)" : "rgba(255,255,255,0.2)"}`,
                borderRadius: 10, fontSize: 12, color: "#9090aa",
                background: dragOver ? "rgba(0,245,255,0.05)" : "transparent",
              }}>
              {uploading ? "Uploading…" : "Drag & drop an image here, or click to upload"}
              <input type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />
            </label>
            {form.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.cover_image} alt="Cover preview" style={{ marginTop: 8, width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 8 }} />
            )}
          </div>

          {/* Tags */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={lbl}>Tags (comma separated)</label>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              onFocus={foc} onBlur={blr} placeholder="Next.js, React, Performance" style={inp} />
          </div>

          {/* Featured */}
          <label style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "var(--text)" }}>
            <input type="checkbox" checked={!!form.is_featured}
              onChange={e => set("is_featured", e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#7c3aed", cursor: "pointer" }} />
            Featured — show at the top of the blog page in the large layout
          </label>
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
          <button onClick={handleClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#9090aa", padding: "10px 24px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
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
