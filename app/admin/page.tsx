import RealtimeSync from "@/components/RealtimeSync";
import { getAllBookings, getAllBlockedDates } from "@/app/book/actions";
import AdminDashboard from "./AdminDashboard";
import Cursor from "@/components/Cursor";
import ParticleCanvas from "@/components/ParticleCanvas";

export const metadata = { title: "Admin — LogicsArcade Bookings" };

export default async function AdminPage() {
  const [bookings, blockedDates] = await Promise.all([
    getAllBookings(),
    getAllBlockedDates(),
  ]);

  return (
    <>
      <RealtimeSync tables={["bookings", "blocked_dates"]} authenticated />
      <Cursor />
      <ParticleCanvas />

      <main style={{ minHeight: "100vh", paddingTop: 90, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: "30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "20%", left: "-5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        <AdminDashboard bookings={bookings} blockedDates={blockedDates} />
      </main>
    </>
  );
}


