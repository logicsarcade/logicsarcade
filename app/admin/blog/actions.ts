"use server";
import { createClient } from "@supabase/supabase-js";
import type { BlogInsert, BlogUpdate } from "@/types/blog";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSB(): any {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function slugify(t: string) {
  return t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export async function createBlog(data: BlogInsert): Promise<{ id?: string; error?: string }> {
  const sb = getSB();
  if (!data.title?.trim()) return { error: "Title is required." };
  if (!data.content?.trim()) return { error: "Content is required." };
  if (!data.excerpt?.trim()) return { error: "Excerpt is required." };

  const slug = data.slug?.trim() || slugify(data.title);
  const { data: existing } = await sb.from("blogs").select("id").eq("slug", slug).maybeSingle();
  if (existing) return { error: "A blog with this slug already exists." };

  const { data: row, error } = await sb.from("blogs").insert({
    ...data,
    slug,
    published_at: data.is_published ? new Date().toISOString() : null,
  }).select("id").single();

  if (error) return { error: "Failed to create blog." };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { id: row.id };
}

export async function updateBlog(id: string, data: BlogUpdate): Promise<{ error?: string }> {
  const sb = getSB();
  const update: Record<string, unknown> = { ...data };
  if (data.is_published) update.published_at = new Date().toISOString();
  if (data.is_published === false) update.published_at = null;
  const { error } = await sb.from("blogs").update(update).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return {};
}

export async function deleteBlog(id: string): Promise<{ error?: string }> {
  const sb = getSB();
  const { error } = await sb.from("blogs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return {};
}

export async function togglePublish(id: string, current: boolean): Promise<{ error?: string }> {
  const sb = getSB();
  const { error } = await sb.from("blogs").update({
    is_published: !current,
    published_at: !current ? new Date().toISOString() : null,
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return {};
}
