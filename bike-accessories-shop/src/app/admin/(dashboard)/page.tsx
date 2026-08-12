import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AddProductForm } from "@/components/admin/AddProductForm";

export const metadata: Metadata = {
  title: "Add product | Admin console",
  description: "Add a product to 46 Rossis Biker Spot.",
};

export default async function AdminDashboardPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  return <AddProductForm categories={categories} />;
}
