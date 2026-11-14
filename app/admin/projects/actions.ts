"use server";
import { createServerClient } from "@/lib/supabase-server";
import { getSession } from "@/app/admin/actions";
import type { Project } from "@/types/database";
import { revalidatePath } from "next/cache";

export type ProjectInput = {
  name: string;
  category: string;
  description: string;
  tech_stack: string[];
  result: string;
  result_label: string;
  accent: "cyan" | "violet";
  featured: boolean;
  sort_order: number;
  image_url: string | null;
  link_url?: string | null;
};

function extractLinkFromDescription(desc: string): { cleanDesc: string; linkUrl: string | null } {
  if (!desc) return { cleanDesc: desc || "", linkUrl: null };
  const match = desc.match(/<!--link:(.*?)-->/);
  if (match) {
    const linkUrl = match[1]?.trim() || null;
    const cleanDesc = desc.replace(/<!--link:(.*?)-->/g, "").trim();
    return { cleanDesc, linkUrl };
  }
  return { cleanDesc: desc, linkUrl: null };
}

function attachLinkToDescription(desc: string, linkUrl?: string | null): string {
  const clean = desc.replace(/<!--link:(.*?)-->/g, "").trim();
  if (linkUrl && linkUrl.trim()) {
    return `${clean}\n<!--link:${linkUrl.trim()}-->`;
  }
  return clean;
}

function revalidateProjectPaths() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (!(await getSession())) return [];
  const supabase = createServerClient() as any;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllProjectsAdmin] error:", error.message);
    return [];
  }
  return (data ?? []).map((row: any) => {
    if (row.link_url) return row;
    const { cleanDesc, linkUrl } = extractLinkFromDescription(row.description);
    return {
      ...row,
      description: cleanDesc,
      link_url: linkUrl || null,
    };
  });
}

export async function createProject(data: ProjectInput): Promise<{ id?: string; error?: string }> {
  if (!(await getSession())) return { error: "Unauthorized" };
  if (!data.name?.trim()) return { error: "Project name is required." };
  if (!data.category?.trim()) return { error: "Category is required." };
  if (!data.description?.trim()) return { error: "Description is required." };

  const supabase = createServerClient() as any;
  const payload: Record<string, unknown> = {
    name: data.name.trim(),
    category: data.category.trim(),
    description: data.description.trim(),
    tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack : [],
    result: data.result?.trim() || "Live",
    result_label: data.result_label?.trim() || "production",
    accent: data.accent || "cyan",
    featured: !!data.featured,
    sort_order: Number.isFinite(data.sort_order) ? Number(data.sort_order) : 0,
    image_url: data.image_url || null,
    link_url: data.link_url?.trim() || null,
  };

  const { data: row, error } = await supabase
    .from("projects")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    // If link_url column does not exist yet in database, fall back to embedding in description metadata
    if (error.message?.includes("link_url") || error.code === "42703") {
      delete payload.link_url;
      payload.description = attachLinkToDescription(data.description, data.link_url);
      const retry = await supabase.from("projects").insert(payload).select("id").single();
      if (retry.error) return { error: retry.error.message };
      revalidateProjectPaths();
      return { id: retry.data?.id };
    }
    return { error: error.message };
  }
  revalidateProjectPaths();
  return { id: row?.id };
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<{ error?: string }> {
  if (!(await getSession())) return { error: "Unauthorized" };
  if (!id) return { error: "Missing project ID." };

  const supabase = createServerClient() as any;
  const updatePayload: Record<string, unknown> = {};
  if (data.name !== undefined) updatePayload.name = data.name.trim();
  if (data.category !== undefined) updatePayload.category = data.category.trim();
  if (data.description !== undefined) updatePayload.description = data.description.trim();
  if (data.tech_stack !== undefined) updatePayload.tech_stack = data.tech_stack;
  if (data.result !== undefined) updatePayload.result = data.result.trim();
  if (data.result_label !== undefined) updatePayload.result_label = data.result_label.trim();
  if (data.accent !== undefined) updatePayload.accent = data.accent;
  if (data.featured !== undefined) updatePayload.featured = !!data.featured;
  if (data.sort_order !== undefined) updatePayload.sort_order = Number(data.sort_order);
  if (data.image_url !== undefined) updatePayload.image_url = data.image_url || null;
  if (data.link_url !== undefined) updatePayload.link_url = data.link_url?.trim() || null;

  const { error } = await supabase.from("projects").update(updatePayload).eq("id", id);
  if (error) {
    // Fallback if column link_url doesn't exist yet
    if (error.message?.includes("link_url") || error.code === "42703") {
      delete updatePayload.link_url;
      if (data.description !== undefined || data.link_url !== undefined) {
        let baseDesc = data.description ?? "";
        if (data.description === undefined) {
          const { data: current } = await supabase.from("projects").select("description").eq("id", id).single();
          baseDesc = current?.description || "";
        }
        updatePayload.description = attachLinkToDescription(baseDesc, data.link_url);
      }
      const retry = await supabase.from("projects").update(updatePayload).eq("id", id);
      if (retry.error) return { error: retry.error.message };
      revalidateProjectPaths();
      return {};
    }
    return { error: error.message };
  }
  revalidateProjectPaths();
  return {};
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  if (!(await getSession())) return { error: "Unauthorized" };
  const supabase = createServerClient() as any;
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateProjectPaths();
  return {};
}

export async function toggleFeaturedProject(id: string, current: boolean): Promise<{ error?: string }> {
  if (!(await getSession())) return { error: "Unauthorized" };
  const supabase = createServerClient() as any;
  const { error } = await supabase
    .from("projects")
    .update({ featured: !current })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateProjectPaths();
  return {};
}
