import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin login | 46 Rossis Biker Spot",
  description: "Sign in to the 46 Rossis Biker Spot admin console.",
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
