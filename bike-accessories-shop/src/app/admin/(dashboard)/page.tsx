import type { Metadata } from "next";
import { getCategoryNames } from "@/lib/db";
import { InventoryDashboard } from "@/components/admin/InventoryDashboard";

export const metadata: Metadata = {
  title: "Inventory dashboard | Admin console",
  description: "Manage products by category for Rossis Biker Spot.",
};

export default async function AdminDashboardPage() {
  const categories = await getCategoryNames();

  return <InventoryDashboard categories={categories} />;
}
