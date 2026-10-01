import { getAllBlogsAdmin } from "@/lib/blog-queries";
import BlogManager from "./BlogManager";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = { title: "Blog Manager — LogicsArcade Admin" };

export default async function AdminBlogPage() {
  const blogs = await getAllBlogsAdmin();

  return (
    <>
      <Cursor />
      <ParticleCanvas />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(5,5,8,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Logo />
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 16 }}>|</span>
          <Link href="/" style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}>Home</Link>
          <Link href="/admin" style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}>Admin</Link>
          <Link href="/admin/blog" style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}>Blog Manager</Link>
          <Link href="/blog" style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}>View Blog</Link>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        </div>
      </nav>

      <main style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <BlogManager blogs={blogs} />
      </main>
    </>
  );
}
