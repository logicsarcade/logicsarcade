"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useRealtime } from "./useRealtime";
import { refreshSite } from "@/app/realtime-actions";

/**
 * Drop into any server-rendered page. When one of the given tables changes in
 * Supabase, the cached page is refreshed and the visitor sees the new data
 * instantly, with no manual reload.
 */
export default function RealtimeSync({ tables, authenticated = false }: { tables: string[]; authenticated?: boolean }) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Set<string>>(new Set());

  useRealtime(tables, table => {
    pending.current.add(table);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => { // batch bursts of changes
      const changed = Array.from(pending.current);
      pending.current.clear();
      try { await refreshSite(changed); } catch { /* ignore */ }
      router.refresh();
    }, 400);
  }, authenticated);

  return null;
}
