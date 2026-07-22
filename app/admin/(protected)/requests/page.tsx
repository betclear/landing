import type { Metadata } from "next";
import { RequestsAdmin } from "@/components/admin/RequestsAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Requests",
  robots: { index: false, follow: false },
};

export default function AdminRequestsPage() {
  return (
    <main className="pb-10 sm:pb-14">
      <RequestsAdmin />
    </main>
  );
}
