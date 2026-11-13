import RealtimeSync from "@/components/RealtimeSync";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blog-queries";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

// Fallback refresh every 5 min (instant refresh happens on every admin save)
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Post Not Found — LogicsArcade" };
  const url = `${SITE_URL}/blog/${blog.slug}`;
  const image = blog.cover_image
    ? (/^https?:\/\//.test(blog.cover_image) ? blog.cover_image : `${SITE_URL}${blog.cover_image}`)
    : undefined;
  return {
    title: `${blog.title} — LogicsArcade Blog`,
    description: blog.excerpt,
    alternates: { canonical: url },
    keywords: blog.tags,
    openGraph: {
      type: "article",
      url,
      title: blog.title,
      description: blog.excerpt,
      siteName: "LogicsArcade",
      publishedTime: blog.published_at ?? undefined,
      authors: [blog.author_name],
      tags: blog.tags,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: blog.title,
      description: blog.excerpt,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [blog, allBlogs] = await Promise.all([getBlogBySlug(slug), getPublishedBlogs()]);
  if (!blog) notFound();

  const related = allBlogs.filter(b => b.id !== blog.id && b.category === blog.category).slice(0, 3);

  const dateStr = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blog.title,
          description: blog.excerpt,
          image: blog.cover_image ? (/^https?:\/\//.test(blog.cover_image) ? blog.cover_image : `${SITE_URL}${blog.cover_image}`) : undefined,
          datePublished: blog.published_at ?? blog.created_at,
          author: { "@type": "Person", name: blog.author_name },
          publisher: { "@type": "Organization", name: "LogicsArcade", url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
        }).replace(/</g, "\\u003c") }}
      />
      <RealtimeSync tables={["blogs"]} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: blog.title, path: `/blog/${blog.slug}` }])} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />

      <main style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "20%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(234,88,12,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 40px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b6b8a", marginBottom: 36 }}>
            <Link href="/" style={{ color: "#6b6b8a", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/blog" style={{ color: "#6b6b8a", textDecoration: "none" }}>Blog</Link>
            <span>›</span>
            <span style={{ color: "var(--cyan)" }}>{blog.category}</span>
          </div>

          {/* Category + tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ background: "rgba(234,88,12,0.15)", border: "1px solid rgba(234,88,12,0.3)", color: "#fb923c", borderRadius: 100, padding: "4px 14px", fontSize: 12, fontWeight: 600 }}>
              {blog.category}
            </span>
            {blog.tags?.map(tag => (
              <span key={tag} style={{ background: "rgba(234,88,12,0.08)", border: "1px solid rgba(234,88,12,0.2)", color: "var(--cyan)", borderRadius: 100, padding: "4px 12px", fontSize: 12 }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: "clamp(28px,4.5vw,48px)", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff", marginBottom: 20 }}>
            {blog.title}
          </h1>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#ea580c,#c2410c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {blog.author_name[0]}
              </div>
              <span style={{ fontSize: 13, color: "#ccc" }}>{blog.author_name}</span>
            </div>
            <span style={{ color: "#333" }}>·</span>
            <span style={{ fontSize: 13, color: "#6b6b8a" }}>{dateStr}</span>
            <span style={{ color: "#333" }}>·</span>
            <span style={{ fontSize: 13, color: "#6b6b8a" }}>{blog.read_time} min read</span>
          </div>

          {/* Cover image */}
          {blog.cover_image && (
            <div style={{ marginBottom: 40, borderRadius: 16, overflow: "hidden", border: "1px solid var(--glass-border)" }}>
              <img src={blog.cover_image} alt={blog.title} style={{ width: "100%", display: "block" }} />
            </div>
          )}

          {/* Excerpt */}
          <div style={{ marginBottom: 40, padding: "20px 24px", background: "rgba(234,88,12,0.06)", border: "1px solid rgba(234,88,12,0.18)", borderRadius: 14, borderLeft: "3px solid var(--violet)" }}>
            <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.7, fontStyle: "italic" }}>{blog.excerpt}</p>
          </div>

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            style={{ color: "var(--text)", lineHeight: 1.8, fontSize: 16 }}
          />

          {/* Back link */}
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--glass-border)" }}>
            <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--cyan)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
              ← Back to Blog
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div style={{ marginTop: 60 }}>
              <h3 style={{ fontFamily: "var(--font-sg),sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24 }}>
                Related Posts
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
                {related.map(r => (
                  <Link key={r.id} href={`/blog/${r.slug}`} style={{ textDecoration: "none" }}>
                    <div className="related-card" style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: 14, padding: "18px 20px", transition: "all 0.2s" }}>
                      <div style={{ fontSize: 11, color: "#fb923c", marginBottom: 8 }}>{r.category}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: "#6b6b8a" }}>{r.read_time} min read</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Blog content styles */}
      <style>{`
        .related-card:hover{border-color:rgba(234,88,12,0.35) !important}
        .blog-content h1,.blog-content h2,.blog-content h3,.blog-content h4 {
          font-family:var(--font-sg),sans-serif; color:#fff;
          letter-spacing:-0.5px; margin:2em 0 0.75em; line-height:1.2;
        }
        .blog-content h1{font-size:2rem} .blog-content h2{font-size:1.6rem}
        .blog-content h3{font-size:1.25rem} .blog-content h4{font-size:1.05rem}
        .blog-content p{margin:0 0 1.25em;color:var(--text)}
        .blog-content a{color:var(--cyan);text-decoration:underline;text-decoration-color:rgba(234,88,12,0.35)}
        .blog-content a:hover{text-decoration-color:var(--cyan)}
        .blog-content strong,.blog-content b{color:#fff;font-weight:600}
        .blog-content em,.blog-content i{font-style:italic;color:#ccc}
        .blog-content code{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:5px;padding:2px 7px;font-size:0.88em;font-family:monospace;color:var(--cyan)}
        .blog-content pre{background:#0c0c0e;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 24px;overflow-x:auto;margin:1.5em 0}
        .blog-content pre code{background:none;border:none;padding:0;font-size:0.9em;color:#e8e8f0}
        .blog-content ul,.blog-content ol{margin:0 0 1.25em 1.5em;color:var(--text)}
        .blog-content li{margin-bottom:0.4em;line-height:1.7}
        .blog-content blockquote{border-left:3px solid var(--violet);margin:1.5em 0;padding:12px 20px;background:rgba(234,88,12,0.06);border-radius:0 10px 10px 0}
        .blog-content blockquote p{color:#ccc;font-style:italic;margin:0}
        .blog-content img{max-width:100%;border-radius:12px;margin:1.5em 0;border:1px solid var(--glass-border)}
        .blog-content hr{border:none;border-top:1px solid var(--glass-border);margin:2em 0}
        .blog-content table{width:100%;border-collapse:collapse;margin:1.5em 0;font-size:14px}
        .blog-content th{background:rgba(255,255,255,0.05);color:#fff;font-weight:600;padding:10px 16px;text-align:left;border-bottom:1px solid var(--glass-border)}
        .blog-content td{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04);color:var(--muted)}
      `}</style>

      <Footer />
    </>
  );
}
