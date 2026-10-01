import { createClient } from "@supabase/supabase-js";
import type { Blog } from "@/types/blog";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient(url, key, { auth: { persistSession: false } }) as any;
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const sb = getClient();
  const { data, error } = await sb
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) console.error("[getPublishedBlogs]", error.message);
  return data ?? [];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const sb = getClient();
  const { data } = await sb
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data ?? null;
}

export async function getAllBlogsAdmin(): Promise<Blog[]> {
  const sb = getClient();
  const { data, error } = await sb
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("[getAllBlogsAdmin]", error.message);
  return data ?? [];
}
