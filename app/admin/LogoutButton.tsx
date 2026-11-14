"use client";
import { useTransition } from "react";
import { logout } from "./actions";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (compact) {
    return (
      <button
        onClick={() => startTransition(() => logout())}
        disabled={isPending}
        title={isPending ? "Signing out…" : "Sign Out"}
        aria-label="Sign Out"
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#f87171",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isPending ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          opacity: isPending ? 0.6 : 1,
          padding: 0,
        }}
        onMouseEnter={(e) => {
          if (!isPending) {
            e.currentTarget.style.background = "rgba(239,68,68,0.18)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      style={{
        width: "100%",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#f87171",
        padding: "7px 16px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: isPending ? 0.6 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      onMouseEnter={(e) => {
        if (!isPending) {
          e.currentTarget.style.background = "rgba(239,68,68,0.15)";
          e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      <span>{isPending ? "Signing out…" : "Sign Out"}</span>
    </button>
  );
}
