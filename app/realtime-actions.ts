"use server";
import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase-auth";

const ALLOWED = ["projects", "testimonials", "blogs", "bookings", "blocked_dates"];

// Clears the server cache of the pages that show the changed tables.
export async function refreshSite(tables: string[]) {
  const t = new Set((tables ?? []).filter(x => ALLOWED.includes(x)));
  if (t.has("projects") || t.has("testimonials")) revalidatePath("/");
  if (t.has("blogs")) {
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/sitemap.xml");
  }
  if (t.has("bookings") || t.has("blocked_dates")) {
    revalidatePath("/book");
    revalidatePath("/admin");
  }
}

// Admin only: lets the admin's browser listen to realtime changes on private tables (bookings, draft blogs)
export async function getRealtimeToken(): Promise<string | null> {
  const sb = await createAuthServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: { session } } = await sb.auth.getSession();
  return session?.access_token ?? null;
}
