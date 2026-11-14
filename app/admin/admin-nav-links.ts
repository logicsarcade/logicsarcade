export interface AdminNavLink {
  label: string;
  href: string;
  icon: "calendar" | "briefcase" | "file-text" | "globe" | "book-open";
  badge?: string;
  external?: boolean;
}

export const ADMIN_PRIMARY_LINKS: AdminNavLink[] = [
  { label: "Bookings", href: "/admin", icon: "calendar" },
  { label: "Projects", href: "/admin/projects", icon: "briefcase" },
  { label: "Blog Manager", href: "/admin/blog", icon: "file-text" },
];

export const ADMIN_SECONDARY_LINKS: AdminNavLink[] = [
  { label: "Live Website", href: "/", icon: "globe", external: true },
  { label: "Public Blog", href: "/blog", icon: "book-open", external: true },
];

export const ADMIN_NAV_LINKS = [...ADMIN_PRIMARY_LINKS, ...ADMIN_SECONDARY_LINKS];
