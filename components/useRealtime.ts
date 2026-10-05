"use client";
import { useEffect, useRef } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import { getRealtimeToken } from "@/app/realtime-actions";

/**
 * Calls onChange(table) whenever a row is inserted / updated / deleted
 * in any of the given Supabase tables (Supabase Realtime).
 * authenticated: true = listen with the admin session (needed for private tables like bookings).
 */
export function useRealtime(
  tables: string[],
  onChange: (table: string) => void,
  authenticated = false,
) {
  const cb = useRef(onChange);
  useEffect(() => { cb.current = onChange; });

  const key = tables.join(",");
  useEffect(() => {
    const sb = createBrowserClient();
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any;

    async function applyToken() {
      try { const t = await getRealtimeToken(); if (t) sb.realtime.setAuth(t); } catch { /* ignore */ }
    }

    async function start() {
      if (authenticated) {
        await applyToken();
        timer = setInterval(applyToken, 45 * 60 * 1000); // keep the admin token fresh
      }
      if (cancelled) return;
      channel = sb.channel(`rt-${key}-${Math.random().toString(36).slice(2, 8)}`);
      key.split(",").forEach(table => {
        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => cb.current(table),
        );
      });
      channel.subscribe();
    }
    start();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      if (channel) sb.removeChannel(channel);
    };
  }, [key, authenticated]);
}
