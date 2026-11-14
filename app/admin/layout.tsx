import { getSession } from "./actions";
import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Shared by every page under /admin (including pages added later).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  return (
    <AdminSidebar email={user?.email}>
      {children}
    </AdminSidebar>
  );
}
