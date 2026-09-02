"use server";
import { createAuthServerClient } from "@/lib/supabase-auth";
import { redirect } from "next/navigation";

export type AuthState =
  | { status: "idle" }
  | { status: "error"; message: string };

export async function loginWithEmail(
  email: string,
  password: string,
  redirectTo: string = "/admin"
): Promise<AuthState> {
  const supabase = await createAuthServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Don't expose internal Supabase errors to client
    if (error.message.toLowerCase().includes("invalid")) {
      return { status: "error", message: "Invalid email or password." };
    }
    return { status: "error", message: "Login failed. Please try again." };
  }

  redirect(redirectTo);
}

export async function logout() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getSession() {
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
