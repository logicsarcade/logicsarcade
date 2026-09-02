"use client";
import { useTransition } from "react";
import { logout } from "./actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#f87171",
        padding: "7px 16px", borderRadius: 8,
        fontSize: 13, fontWeight: 500,
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: isPending ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (!isPending) {
          e.currentTarget.style.background = "rgba(239,68,68,0.15)";
          e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
      }}
    >
      {isPending ? "Signing out…" : "Sign Out"}
    </button>
  );
}
