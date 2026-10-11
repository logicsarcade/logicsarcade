"use client";
import { useEffect, useRef } from "react";
import { getRealtimeToken } from "@/app/realtime-actions";

/**
 * Calls onChange(table) whenever a row is inserted / updated / deleted
 * in any of the given Supabase tables (Supabase Realtime).
 * authenticated: true = listen with the admin session (needed for private tables like bookings).
 *
 * The Supabase client is loaded lazily, a few seconds after the page opens,
 * so it never slows down the first load.
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
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sb: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any;

    async function applyToken() {
      try { const t = await getRealtimeToken(); if (t && sb) sb.realtime.setAuth(t); } catch { /* ignore */ }
    }

    async function start() {
      const { createBrowserClient } = await import("@/lib/supabase-browser");
      if (cancelled) return;
      sb = createBrowserClient();
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
    const starter = setTimeout(start, 3000);

    return () => {
      cancelled = true;
      clearTimeout(starter);
      if (timer) clearInterval(timer);
      if (channel && sb) sb.removeChannel(channel);
    };
  }, [key, authenticated]);
}
