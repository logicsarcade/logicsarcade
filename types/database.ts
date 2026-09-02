// ─── Row Types ───────────────────────────────────────────────

export interface Project {
  id: string;
  created_at: string;
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
}

export interface Testimonial {
  id: string;
  created_at: string;
  author_name: string;
  author_role: string;
  initials: string;
  avatar_grad: string;
  review_text: string;
  rating: number;
  is_visible: boolean;
  sort_order: number;
}

export interface Booking {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  budget: string;
  timeline: string;
  project_desc: string;
  preferred_date: string;
  preferred_time: string;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  admin_notes: string | null;
}

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

export type BookingInsert = Omit<Booking, "id" | "created_at" | "status" | "admin_notes">;

// ─── Full Database shape (Relationships required by supabase-js) ──

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at">;
        Update: Partial<Omit<Project, "id" | "created_at">>;
        Relationships: [];
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, "id" | "created_at">;
        Update: Partial<Omit<Testimonial, "id" | "created_at">>;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at">;
        Update: Partial<Omit<Booking, "id" | "created_at">>;
        Relationships: [];
      };
      blocked_dates: {
        Row: BlockedDate;
        Insert: Omit<BlockedDate, "id">;
        Update: Partial<Omit<BlockedDate, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
