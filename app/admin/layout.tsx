import { AdminSidebar, AdminTabBar } from "@/components/admin/AdminNav";

export const metadata = { title: "Admin | Import with Goody", robots: { index: false } };

// TODO (backend phase): protect /admin with Supabase Auth (middleware + server check).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen overflow-x-clip bg-cream">
      <AdminSidebar />
      {/* On phones, leave room under the content for the floating tab bar */}
      <div className="min-w-0 flex-1 pb-28 lg:pb-0">{children}</div>
      <AdminTabBar />
    </div>
  );
}