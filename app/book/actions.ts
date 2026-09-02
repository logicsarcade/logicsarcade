"use server";
import { createBrowserClient } from "@/lib/supabase-browser";
import type { BookingInsert, Booking } from "@/types/database";

export type BookingFormState =
  | { status: "idle" }
  | { status: "success"; bookingId: string }
  | { status: "error"; message: string };

export async function createBooking(
  formData: BookingInsert,
): Promise<BookingFormState> {
  const supabase = createBrowserClient();

  if (!formData.full_name?.trim())
    return { status: "error", message: "Full name is required." };
  if (!formData.email?.trim())
    return { status: "error", message: "Email is required." };
  if (!formData.project_desc?.trim())
    return { status: "error", message: "Project description is required." };
  if (!formData.preferred_date)
    return { status: "error", message: "Please choose a date." };
  if (!formData.preferred_time)
    return { status: "error", message: "Please choose a time slot." };

  // Check blocked dates
  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("blocked_date")
    .eq("blocked_date", formData.preferred_date)
    .maybeSingle();

  if (blocked)
    return {
      status: "error",
      message: "That date is unavailable. Please choose another.",
    };

  // Check duplicate slot
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("preferred_date", formData.preferred_date)
    .eq("preferred_time", formData.preferred_time)
    .neq("status", "cancelled")
    .maybeSingle();

  if (existing)
    return {
      status: "error",
      message: "That time slot is already booked. Please choose another.",
    };

  const payload = {
    full_name: formData.full_name,
    email: formData.email,
    phone: formData.phone ?? null,
    company: formData.company ?? null,
    service: formData.service,
    budget: formData.budget,
    timeline: formData.timeline,
    project_desc: formData.project_desc,
    preferred_date: formData.preferred_date,
    preferred_time: formData.preferred_time,
    timezone: formData.timezone,
    status: "pending" as const,
    admin_notes: null,
  };
  console.log("[createBooking] payload", payload);
  const { data, error } = await supabase
    .from("bookings")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("[createBooking]", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success", bookingId: data.id };
}

export async function getBlockedDates(): Promise<string[]> {
  const supabase = createBrowserClient();
  const { data } = await supabase.from("blocked_dates").select("blocked_date");
  return (data ?? []).map((d: { blocked_date: string }) => d.blocked_date);
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from("bookings")
    .select("preferred_time")
    .eq("preferred_date", date)
    .neq("status", "cancelled");
  return (data ?? []).map((d: { preferred_time: string }) => d.preferred_time);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getAllBookings(): Promise<Booking[]> {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .order("preferred_date", { ascending: true })
    .order("preferred_time", { ascending: true });
  return data ?? [];
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  admin_notes?: string,
): Promise<{ error?: string }> {
  const supabase = createBrowserClient();
  const update: Record<string, string> = { status };
  if (admin_notes !== undefined) update.admin_notes = admin_notes;

  const { error } = await supabase.from("bookings").update(update).eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function addBlockedDate(
  date: string,
  reason: string,
): Promise<{ error?: string }> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("blocked_dates")
    .insert({ blocked_date: date, reason });
  if (error) return { error: error.message };
  return {};
}

export async function removeBlockedDate(
  id: string,
): Promise<{ error?: string }> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export async function getAllBlockedDates() {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from("blocked_dates")
    .select("*")
    .order("blocked_date", { ascending: true });
  return data ?? [];
}
