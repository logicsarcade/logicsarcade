"use client";
import { useState, useTransition } from "react";
import { loginWithEmail } from "../actions";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);

  function submit() {
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }
    setError("");
    startTransition(async () => {
      const result = await loginWithEmail(email, password, redirectTo);
      if (result.status === "error") setError(result.message);
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
  };

  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "rgba(0,245,255,0.4)");
  const blur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Email */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#9090aa", marginBottom: 8 }}>
          Email
        </label>
        <input
          type="email"
          placeholder="admin@logicsarcade.io"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={focus}
          onBlur={blur}
          onKeyDown={e => e.key === "Enter" && submit()}
          disabled={isPending}
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#9090aa", marginBottom: 8 }}>
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={focus}
            onBlur={blur}
            onKeyDown={e => e.key === "Enter" && submit()}
            disabled={isPending}
            style={{ ...inputStyle, paddingRight: 48 }}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPass(s => !s)}
            style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#6b6b8a", fontSize: 16, lineHeight: 1, padding: 4,
            }}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 10, padding: "12px 16px",
          color: "#f87171", fontSize: 14,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={isPending}
        style={{
          width: "100%",
          background: isPending
            ? "rgba(124,58,237,0.4)"
            : "linear-gradient(135deg,#7c3aed,#5b21b6)",
          color: "#fff", border: "none",
          padding: "15px 32px", borderRadius: 12,
          fontSize: 15, fontWeight: 600,
          cursor: isPending ? "not-allowed" : "pointer",
          boxShadow: isPending ? "none" : "0 0 30px rgba(124,58,237,0.3)",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          marginTop: 4,
        }}
        onMouseEnter={e => {
          if (!isPending) {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.5)";
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = isPending ? "none" : "0 0 30px rgba(124,58,237,0.3)";
        }}
      >
        {isPending ? (
          <>
            <span style={{
              width: 16, height: 16,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff", borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }} />
            Signing in…
          </>
        ) : (
          "🔐 Sign In"
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

