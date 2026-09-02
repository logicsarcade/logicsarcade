import { createBrowserClient } from "./supabase-browser";
import type { Project, Testimonial } from "@/types/database";

/**
 * Fetch all projects ordered by sort_order.
 * Called from Server Components — runs at request time (or build time if static).
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getProjects] Supabase error:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Fetch all visible testimonials ordered by sort_order.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getTestimonials] Supabase error:", error.message);
    return [];
  }

  return data ?? [];
}
