import { AdminSidebar, AdminTabBar } from "@/components/admin/AdminNav";

export const metadata = { title: "Admin | Import with Goody", robots: { index: false } };

// TODO (backend phase): protect /admin with Supabase Auth (middleware + server check).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</div>
      <AdminTabBar />
    </div>
  );
}
