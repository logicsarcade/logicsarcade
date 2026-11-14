import RealtimeSync from "@/components/RealtimeSync";
import { getAllBlogsAdmin } from "@/lib/blog-queries";
import BlogManager from "./BlogManager";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";

export const metadata = { title: "Blog Manager — LogicsArcade Admin" };

export default async function AdminBlogPage() {
  const blogs = await getAllBlogsAdmin();

  return (
    <>
      <RealtimeSync tables={["blogs"]} authenticated />
      <Cursor />
      <ParticleCanvas />

      <main style={{ minHeight: "100vh", paddingTop: 32, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(234,88,12,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
        <BlogManager blogs={blogs} />
      </main>
    </>
  );
}
