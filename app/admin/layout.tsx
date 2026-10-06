import { redirect } from "next/navigation";
import { AdminSidebar, AdminTabBar } from "@/components/admin/AdminNav";
import { getStaff } from "@/lib/auth";
import { getToPackCount } from "@/lib/orders";
   import { getNewSourcingCount } from "@/lib/sourcing";

export const metadata = { title: "Admin | Import with Goody", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The middleware already sends signed-out visitors to /login.
  // This also blocks signed-in accounts that aren't staff.
  const staff = await getStaff();
  if (!staff) redirect("/login?error=not-staff");
     const [toPack, newSourcing] = await Promise.all([getToPackCount(), getNewSourcingCount()]);

  return (
    <div className="flex min-h-screen overflow-x-clip bg-cream">
      <AdminSidebar staffName={staff.fullName} toPack={toPack} newSourcing={newSourcing} />
      {/* On phones, leave room under the content for the floating tab bar */}
      <div className="min-w-0 flex-1 pb-28 lg:pb-0">{children}</div>
      <AdminTabBar toPack={toPack} newSourcing={newSourcing} />
    </div>
  );
}