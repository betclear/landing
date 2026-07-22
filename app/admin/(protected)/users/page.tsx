import type { Metadata } from "next";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Users",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <main className="pb-10 sm:pb-14">
      <UsersAdmin />
    </main>
  );
}
