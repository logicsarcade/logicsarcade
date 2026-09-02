import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from "@/types/database";

/**
 * SERVER-SIDE Supabase client.
 * Use this in Server Components, Route Handlers, and Server Actions.
 * Uses the Service Role key so it bypasses RLS — keep it server-only.
 */
export function createServerClient(): SupabaseClient<Database, 'public'> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local"
    );
  }

  return createClient<Database, 'public'>(url, key, {
    auth: { persistSession: false },
  });
}


