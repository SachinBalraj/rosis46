import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin console",
  description: "Manage RideReady products, categories and orders.",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/account");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Admin console
          </p>
          <h1 className="display-heading mt-4 text-4xl text-foreground">
            RideReady admin
          </h1>
        </div>
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to account
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <AdminNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
