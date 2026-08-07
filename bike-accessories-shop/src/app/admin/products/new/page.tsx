import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "New product | Admin console",
  description: "Add a product to RideReady.",
};

export default async function AdminNewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <ProductForm categories={categories} />;
}
