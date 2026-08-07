import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata: Metadata = {
  title: "Categories | Admin console",
  description: "Manage RideReady product categories.",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight text-white">
        Categories
      </h2>
      <p className="mt-1 text-sm text-smoke">
        {categories.length} categor{categories.length === 1 ? "y" : "ies"}{" "}
        powering the storefront navigation.
      </p>

      <div className="mt-6">
        <CategoryManager
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            image: category.image,
            productCount: category._count.products,
          }))}
        />
      </div>
    </div>
  );
}
