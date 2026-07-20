import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import AdminLoginPage from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginRoute() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/domains");
  }

  return <AdminLoginPage />;
}
