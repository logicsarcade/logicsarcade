"use client";
import Link from "next/link";
import type { Blog } from "@/types/blog";

function BlogCard({ blog, featured }: { blog: Blog; featured?: boolean }) {
  return (
    <Link href={`/blog/${blog.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article
        style={{
          background: "var(--glass)", border: "1px solid var(--glass-border)",
          borderRadius: 20, overflow: "hidden", cursor: "pointer",
          transition: "transform 0.3s, border-color 0.3s", height: "100%",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.borderColor = "var(--glass-border)";
        }}
      >
        {/* Cover */}
        <div style={{ position: "relative", width: "100%", ...(blog.cover_image ? {} : { aspectRatio: featured ? "16/6" : "16/8" }), background: "var(--navy)", overflow: "hidden" }}>
          {blog.cover_image ? (
            <img src={blog.cover_image} alt={blog.title} style={{ width: "100%", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,245,255,0.08))" }}>
              <span style={{ fontSize: featured ? 64 : 48, opacity: 0.4 }}>✍️</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: featured ? "28px 32px" : "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: "#6b6b8a" }}>
              {blog.published_at ? new Date(blog.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#333", display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#6b6b8a" }}>{blog.read_time} min read</span>
          </div>

          <h2 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: featured ? 26 : 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: 12 }}>
            {blog.title}
            <span style={{ color: "var(--muted)", fontWeight: 400, margin: "0 8px" }}>-</span>
            <span style={{ display: "inline-block", verticalAlign: "middle", background: "rgba(124,58,237,0.85)", color: "#fff", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", fontFamily: "var(--font-inter),sans-serif", lineHeight: 1.4 }}>
              {blog.category}
            </span>
          </h2>

          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {blog.excerpt}
          </p>

          {blog.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {blog.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 100, padding: "2px 10px", fontSize: 11, color: "var(--cyan)" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#6b6b8a" }}>By {blog.author_name}</span>
            <span style={{ fontSize: 13, color: "var(--cyan)", fontWeight: 500 }}>Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogList({ blogs }: { blogs: Blog[] }) {
  // Featured posts go on top in the large layout; the rest keep the incoming order (newest created first)
  const featuredPosts = blogs.filter(b => b.is_featured);
  const rest = blogs.filter(b => !b.is_featured);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 16, fontWeight: 500 }}>Our Blog</div>
        <h1 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.05, color: "#fff", marginBottom: 16 }}>
          Tech Insights &<br /><span style={{ color: "#a78bfa" }}>Industry News</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 540, lineHeight: 1.65 }}>
          Tutorials, deep-dives, and real-world lessons from the LogicsArcade engineering team.
        </p>
      </div>

      {blogs.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✍️</div>
          <div style={{ color: "#444", fontSize: 16 }}>No posts published yet. Check back soon!</div>
        </div>
      )}

      {featuredPosts.map(f => (
        <div key={f.id} style={{ marginBottom: 32 }}>
          <BlogCard blog={f} featured />
        </div>
      ))}

      {rest.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
          {rest.map(b => <BlogCard key={b.id} blog={b} />)}
        </div>
      )}
    </div>
  );
}
