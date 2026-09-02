import { getSession } from "../actions";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import ParticleCanvas from "@/components/ParticleCanvas";
import Cursor from "@/components/Cursor";
import Link from "next/link";
import la from "../../../icons/logicsarcade_white.png";

export const metadata = {
  title: "Admin Login — LogicsArcade",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  // Already logged in → go straight to admin
  const user = await getSession();
  if (user) redirect("/admin");

  const { redirectTo = "/admin" } = await searchParams;

  return (
    <>
      <Cursor />
      <ParticleCanvas />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          padding: "40px 24px",
        }}
      >
        {/* Ambient glows */}
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 300,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "20%",
            right: "10%",
            width: 300,
            height: 300,
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)",
          }}
        />

        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Link
              href="/"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
              }}
            >
              <img
                src={la.src}
                alt="LogicsArcade Logo"
                style={{ height: 40, marginRight: 12 }}
              />
              Logics<span style={{ color: "var(--cyan)" }}>Arcade</span>
            </Link>
            <div style={{ marginTop: 8, fontSize: 13, color: "#6b6b8a" }}>
              Admin Panel
            </div>
          </div>

          {/* Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "40px 36px",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Lock icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 24,
              }}
            >
              🔒
            </div>

            <h1
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.5px",
                marginBottom: 8,
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#6b6b8a",
                marginBottom: 32,
                lineHeight: 1.5,
              }}
            >
              Sign in to manage bookings and availability.
            </p>

            <LoginForm redirectTo={redirectTo} />
          </div>

          {/* Back link */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link
              href="/"
              style={{ fontSize: 13, color: "#6b6b8a", textDecoration: "none" }}
            >
              ← Back to website
            </Link>
          </div>

          {/* Setup hint */}
          {/* <div style={{
            marginTop: 24,
            background: "rgba(0,245,255,0.04)",
            border: "1px solid rgba(0,245,255,0.1)",
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 11, color: "var(--cyan)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.5px" }}>
              FIRST TIME SETUP
            </div>
            <div style={{ fontSize: 12, color: "#6b6b8a", lineHeight: 1.6 }}>
              Create an admin account in{" "}
              <span style={{ color: "#ccc" }}>Supabase Dashboard → Authentication → Users → Add User</span>.
              Use that email and password here.
            </div>
          </div> */}
        </div>
      </main>
    </>
  );
}



