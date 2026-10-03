"use server";
import { createClient } from "@supabase/supabase-js";
import type { BlogInsert, BlogUpdate } from "@/types/blog";
import { revalidatePath } from "next/cache";
import { cleanupOrphanImages } from "@/lib/uploads-cleanup";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSB(): any {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Refresh every public page that shows blogs, plus the sitemap, right after any change
function revalidateBlogs() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

function slugify(t: string) {
  return t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").trim();
}

// Read time in minutes (~200 wpm) from HTML/Markdown content
function calcReadTime(content: string) {
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Returns a slug that is not used by another blog
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uniqueSlug(sb: any, base: string, excludeId?: string) {
  let slug = base, n = 2;
  for (;;) {
    let q = sb.from("blogs").select("id").eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function createBlog(data: BlogInsert): Promise<{ id?: string; error?: string }> {
  const sb = getSB();
  if (!data.title?.trim()) return { error: "Title is required." };
  if (!data.content?.trim()) return { error: "Content is required." };
  if (!data.excerpt?.trim()) return { error: "Excerpt is required." };

  const custom = data.slug?.trim() ? slugify(data.slug) : "";
  const base = custom || slugify(data.title) || `post-${Date.now()}`;
  if (custom) {
    const { data: existing } = await sb.from("blogs").select("id").eq("slug", custom).maybeSingle();
    if (existing) return { error: "A blog with this slug already exists." };
  }
  const slug = custom || await uniqueSlug(sb, base);

  const { data: row, error } = await sb.from("blogs").insert({
    ...data,
    slug,
    read_time: calcReadTime(data.content),
    published_at: data.is_published ? new Date().toISOString() : null,
  }).select("id").single();

  if (error) return { error: "Failed to create blog." };
  revalidateBlogs();
  revalidatePath("/admin/blog");
  return { id: row.id };
}

export async function updateBlog(id: string, data: BlogUpdate): Promise<{ error?: string }> {
  const sb = getSB();
  const update: Record<string, unknown> = { ...data };
  if (data.content !== undefined) update.read_time = calcReadTime(data.content);
  if (data.slug !== undefined) {
    const custom = data.slug.trim() ? slugify(data.slug) : "";
    if (custom) {
      const { data: existing } = await sb.from("blogs").select("id").eq("slug", custom).neq("id", id).maybeSingle();
      if (existing) return { error: "A blog with this slug already exists." };
      update.slug = custom;
    } else if (data.title?.trim()) {
      update.slug = await uniqueSlug(sb, slugify(data.title) || `post-${Date.now()}`, id);
    } else {
      delete update.slug;
    }
  }
  if (data.is_published) update.published_at = new Date().toISOString();
  if (data.is_published === false) update.published_at = null;
  const { error } = await sb.from("blogs").update(update).eq("id", id);
  if (error) return { error: error.message };
  await cleanupOrphanImages();
  revalidateBlogs();
  revalidatePath("/admin/blog");
  return {};
}

export async function deleteBlog(id: string): Promise<{ error?: string }> {
  const sb = getSB();
  const { error } = await sb.from("blogs").delete().eq("id", id);
  if (error) return { error: error.message };
  await cleanupOrphanImages();
  revalidateBlogs();
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
  revalidateBlogs();
  revalidatePath("/admin/blog");
  return {};
}
