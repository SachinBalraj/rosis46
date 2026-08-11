import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Edit product | Admin console",
  description: "Update a 46 Rossis Biker Spot product.",
};

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({
  params,
}: AdminEditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        priceInPaise: true,
        salePriceInPaise: true,
        stock: true,
        imageUrl: true,
        categoryId: true,
        featured: true,
        active: true,
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm categories={categories} product={product} />;
}
