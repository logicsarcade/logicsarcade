"use client";
import { useState, useTransition } from "react";
import type { Project } from "@/types/database";
import { createProject, updateProject, type ProjectInput } from "./actions";

const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 14px",
  color: "#fff",
  fontSize: 14,
  fontFamily: "var(--font-inter),sans-serif",
  outline: "none",
  transition: "border-color 0.2s",
};
const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#9090aa",
  marginBottom: 6,
  letterSpacing: "0.3px",
};
const foc = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = "rgba(234,88,12,0.45)");
const blr = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = "rgba(255,255,255,0.1)");

interface Props {
  project?: Project;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProjectEditor({ project, onClose, onSaved }: Props) {
  const isEdit = Boolean(project?.id);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState<ProjectInput>({
    name: project?.name ?? "",
    category: project?.category ?? "Website",
    description: project?.description ?? "",
    tech_stack: project?.tech_stack ?? [],
    result: project?.result ?? "",
    result_label: project?.result_label ?? "",
    accent: project?.accent ?? "cyan",
    featured: project?.featured ?? false,
    sort_order: project?.sort_order ?? 0,
    image_url: project?.image_url ?? null,
    link_url: project?.link_url ?? "",
  });

  const [techInput, setTechInput] = useState(project?.tech_stack?.join(", ") ?? "");

  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  async function uploadImage(file: File) {
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/admin/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
      set("image_url", json.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    if (!form.name.trim()) { setError("Project name is required."); return; }
    if (!form.category.trim()) { setError("Category is required."); return; }
    if (!form.description.trim()) { setError("Description is required."); return; }

    const parsedTech = techInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    setError("");
    startTransition(async () => {
      const payload: ProjectInput = {
        ...form,
        link_url: form.link_url?.trim() || null,
        tech_stack: parsedTech,
        sort_order: Number(form.sort_order) || 0,
      };

      if (isEdit && project) {
        const res = await updateProject(project.id, payload);
        if (res.error) { setError(res.error); return; }
      } else {
        const res = await createProject(payload);
        if (res.error) { setError(res.error); return; }
      }
      onSaved();
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
        }}
      />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          background: "#0c0c0e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "clamp(20px, 4vw, 36px)",
          width: "min(720px, 95vw)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--cyan)", textTransform: "uppercase", marginBottom: 6 }}>
              {isEdit ? "Update Project" : "New Portfolio Project"}
            </div>
            <h2 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 700, color: "#fff" }}>
              {isEdit ? form.name || "Edit Project" : "Add Project"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              color: "#9090aa",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 16 }}>
          <div>
            <label style={lbl}>Project Name *</label>
            <input
              value={form.name}
              onChange={e => set("name", e.target.value)}
              onFocus={foc}
              onBlur={blr}
              placeholder="e.g. MineWords"
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Category *</label>
            <input
              value={form.category}
              onChange={e => set("category", e.target.value)}
              onFocus={foc}
              onBlur={blr}
              placeholder="e.g. Website, Mobile App, SaaS, Shopify App"
              style={inp}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={lbl}>Project Link / Live URL</label>
            <input
              type="url"
              value={form.link_url ?? ""}
              onChange={e => set("link_url", e.target.value)}
              onFocus={foc}
              onBlur={blr}
              placeholder="e.g. https://outbox.logicsarcade.com/ or https://minewords.com/"
              style={inp}
            />
            <div style={{ fontSize: 11, color: "#6b6b8a", marginTop: 4 }}>
              When clicked on the website, this project card will navigate directly to this live link.
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={lbl}>Description *</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              onFocus={foc}
              onBlur={blr}
              rows={3}
              placeholder="Short, compelling summary of what was built and the value delivered..."
              style={{ ...inp, resize: "vertical" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={lbl}>Tech Stack (comma-separated)</label>
            <input
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onFocus={foc}
              onBlur={blr}
              placeholder="e.g. Next.js, React Native, Node.js, PostgreSQL"
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Metric / Result</label>
            <input
              value={form.result}
              onChange={e => set("result", e.target.value)}
              onFocus={foc}
              onBlur={blr}
              placeholder="e.g. ↑340% or 50k+ or 99.9%"
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Metric Label</label>
            <input
              value={form.result_label}
              onChange={e => set("result_label", e.target.value)}
              onFocus={foc}
              onBlur={blr}
              placeholder="e.g. revenue in 6mo or downloads"
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Sort Order (lower numbers appear first)</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={e => set("sort_order", Number(e.target.value))}
              onFocus={foc}
              onBlur={blr}
              style={inp}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#fff" }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => set("featured", e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#ea580c", cursor: "pointer" }}
              />
              Featured Project (takes 2-column width on homepage)
            </label>
          </div>

          {/* Image Upload */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={lbl}>Cover Image / Screenshot</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) uploadImage(f);
              }}
              style={{
                border: `1px dashed ${dragOver ? "rgba(234,88,12,0.6)" : "rgba(255,255,255,0.15)"}`,
                borderRadius: 12,
                padding: "20px",
                textAlign: "center",
                background: dragOver ? "rgba(234,88,12,0.06)" : "rgba(255,255,255,0.02)",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>🖼️</div>
              <div style={{ fontSize: 13, color: "#fff", marginBottom: 4 }}>
                {uploading ? "Uploading image..." : "Drag & drop project screenshot, or click below"}
              </div>
              <label
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  padding: "6px 16px",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  marginTop: 6,
                }}
              >
                Browse File
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                    e.target.value = "";
                  }}
                />
              </label>

              <div style={{ marginTop: 14 }}>
                <span style={{ fontSize: 11, color: "#6b6b8a" }}>Or enter image URL directly:</span>
                <input
                  value={form.image_url ?? ""}
                  onChange={e => set("image_url", e.target.value || null)}
                  placeholder="https://... or /images/..."
                  style={{ ...inp, marginTop: 6, fontSize: 12, padding: "8px 12px" }}
                />
              </div>

              {form.image_url && (
                <div style={{ marginTop: 14, position: "relative", display: "inline-block", maxWidth: "100%" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image_url}
                    alt="Preview"
                    style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <button
                    type="button"
                    onClick={() => set("image_url", null)}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.7)",
                      border: "none",
                      color: "#f87171",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: 16,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={onClose}
            disabled={isPending}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#9090aa",
              padding: "10px 24px",
              borderRadius: 100,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            style={{
              background: "linear-gradient(135deg,#ea580c,#c2410c)",
              color: "#fff",
              border: "none",
              padding: "10px 32px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              boxShadow: "0 0 25px rgba(234,88,12,0.35)",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
