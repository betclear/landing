import type { Metadata } from "next";
import { DomainsAdmin } from "@/components/admin/DomainsAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Domains",
  robots: { index: false, follow: false },
};

export default function AdminDomainsPage() {
  return (
    <main className="min-h-[100dvh] py-10 sm:py-14">
      <DomainsAdmin />
    </main>
  );
}
