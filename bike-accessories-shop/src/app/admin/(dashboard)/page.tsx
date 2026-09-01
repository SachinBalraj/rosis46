import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { InventoryDashboard } from "@/components/admin/InventoryDashboard";

export const metadata: Metadata = {
  title: "Inventory dashboard | Admin console",
  description: "Manage products by category for Rossis Biker Spot.",
};

export default async function AdminDashboardPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  return <InventoryDashboard categories={categories} />;
}
