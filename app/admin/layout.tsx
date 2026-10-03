import { getSession } from "./actions";
import type { Metadata } from "next";
import AdminNav from "./AdminNav";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Shared by every page under /admin (including pages added later).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  return (
    <>
      <AdminNav email={user?.email} />
      {children}
    </>
  );
}
