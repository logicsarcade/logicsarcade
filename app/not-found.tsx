import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import { getPublishedBlogs } from "@/lib/blog-queries";
import NotFoundSearch, { type SearchBlog } from "./NotFoundSearch";

export const metadata = {
  title: "Page Not Found — LogicsArcade",
  description: "The page you're looking for isn't available.",
};

export default async function NotFound() {
  // Published blogs are searchable too; if the lookup fails, the static pages still work.
  let blogs: SearchBlog[] = [];
  try {
    blogs = (await getPublishedBlogs()).map(b => ({
      title: b.title, slug: b.slug, excerpt: b.excerpt, category: b.category, tags: b.tags ?? [],
    }));
  } catch { /* ignore */ }

  return (
    <>
      <Cursor />
      <ParticleCanvas />
      <Navbar />
      <main style={{
        minHeight: "100vh", position: "relative", zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 60% 50% at 65% 45%, rgba(234,88,12,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 35% 55%, rgba(249,115,22,0.06) 0%, transparent 55%)
          `,
        }} />
        <NotFoundSearch blogs={blogs} />
      </main>
      <Footer />
    </>
  );
}
