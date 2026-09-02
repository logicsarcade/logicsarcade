import { getAllBookings, getAllBlockedDates } from "@/app/book/actions";
import { getSession } from "./actions";
import AdminDashboard from "./AdminDashboard";
import LogoutButton from "./LogoutButton";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import Link from "next/link";

export const metadata = { title: "Admin — LogicsArcade Bookings" };

export default async function AdminPage() {
  const [bookings, blockedDates, user] = await Promise.all([
    getAllBookings(),
    getAllBlockedDates(),
    getSession(),
  ]);

  return (
    <>
      <Cursor />
      <ParticleCanvas />

      {/* Admin nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "18px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(5,5,8,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
            Logics<span style={{ color: "var(--cyan)" }}>Arcade</span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 16 }}>|</span>
          <span style={{ fontSize: 13, color: "#6b6b8a", fontWeight: 500 }}>Admin</span>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {/* Logged-in user */}
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>
                {user.email?.[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: "#9090aa" }}>{user.email}</span>
            </div>
          )}
          <Link href="/book" style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}>
            Booking Page
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}>
            Home
          </Link>
          <LogoutButton />
        </div>
      </nav>

      <main style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "20%", left: "-5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        <AdminDashboard bookings={bookings} blockedDates={blockedDates} />
      </main>
    </>
  );
}


