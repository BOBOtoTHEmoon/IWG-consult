import { redirect } from "next/navigation";
import { getStaff } from "@/lib/auth";
import SetPasswordForm from "./SetPasswordForm";

export const metadata = { title: "Set your password | Import with Goody", robots: { index: false } };

export default async function SetPasswordPage() {
  const staff = await getStaff();
  if (!staff) redirect("/login?error=link-expired");

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-12">
      <SetPasswordForm firstName={staff.firstName} />
    </main>
  );
}