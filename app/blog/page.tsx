import JsonLd from "@/components/JsonLd";
import { blogListSchema, webPageSchema, breadcrumbSchema } from "@/lib/schema";
import RealtimeSync from "@/components/RealtimeSync";
import { getPublishedBlogs } from "@/lib/blog-queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import BlogList from "./BlogList";

// Fallback refresh every 5 min (instant refresh happens on every admin save)
export const revalidate = 300;

export const metadata = {
  title: "Blog — LogicsArcade",
  description: "Tech insights, tutorials, and industry news from the LogicsArcade team.",
};

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();
  return (
    <>
      <RealtimeSync tables={["blogs"]} />
      <JsonLd data={[webPageSchema({ name: "Blog — LogicsArcade", description: "Tech insights, tutorials, and industry news from the LogicsArcade team.", path: "/blog", type: "CollectionPage" }), blogListSchema(blogs), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])]} />
      <Cursor />
      <ParticleCanvas />
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 100, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
        <BlogList blogs={blogs} />
      </main>
      <Footer />
    </>
  );
}
