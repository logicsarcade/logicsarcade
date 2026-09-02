import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * BROWSER-SIDE Supabase client.
 * Safe to use in Client Components — uses the anon key with RLS enforced.
 * Singleton pattern so only one instance exists per page.
 */
let client: ReturnType<typeof createClient<Database>> | null = null;

export function createBrowserClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    );
  }

  client = createClient<Database>(url, anonKey);
  return client;
}
