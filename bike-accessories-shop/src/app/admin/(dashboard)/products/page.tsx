import type { Metadata } from "next";
import { listAdminProducts, listAdminCategories } from "@/lib/db";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";
import type { AdminProductItem } from "@/components/admin/AdminProductsManager";

export const metadata: Metadata = {
  title: "Products | Admin console",
  description: "View, search, filter, edit and delete products.",
};

function toItem(product: Awaited<ReturnType<typeof listAdminProducts>>[number]) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceInPaise: product.priceInPaise,
    salePriceInPaise: product.salePriceInPaise,
    stock: product.stock,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    subCategory: product.subCategory,
    featured: product.featured,
    active: product.active,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: product.category ?? null,
    orderItemsCount: product._count.orderItems,
  } satisfies AdminProductItem;
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    listAdminProducts(),
    listAdminCategories(),
  ]);

  return (
    <AdminProductsManager
      initialProducts={products.map(toItem)}
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      }))}
    />
  );
}