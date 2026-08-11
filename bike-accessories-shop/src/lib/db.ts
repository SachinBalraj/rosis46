import "server-only";

import { prisma } from "@/lib/prisma";
import { getCategoryVisual } from "@/lib/category-visuals";
import type { Product } from "@/lib/data";

export type ProductListFilters = {
  category?: string;
  featured?: boolean;
  query?: string;
  limit?: number;
};

type DbProductWithCategory = {
  slug: string;
  name: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number | null;
  featured: boolean;
  category: { name: string; slug: string };
};

export function toCatalogProduct(
  product: DbProductWithCategory
): Product {
  const visual = getCategoryVisual(product.category.slug);
  const hasSale =
    product.salePriceInPaise !== null &&
    product.salePriceInPaise < product.priceInPaise;
  const price = Math.round(
    (hasSale ? product.salePriceInPaise! : product.priceInPaise) / 100
  );
  const mrp = hasSale ? Math.round(product.priceInPaise / 100) : price;
  return {
    id: product.slug,
    name: product.name,
    category: product.category.slug as Product["category"],
    categoryLabel: product.category.name,
    price,
    mrp,
    rating: null,
    reviewCount: null,
    description: product.description,
    accent: visual.accent,
    icon: visual.icon,
    featured: product.featured,
    badge: hasSale ? "Sale" : undefined,
  };
}

export async function getCategoriesWithCounts() {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      _count: { select: { products: { where: { active: true } } } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getActiveProducts({
  category,
  featured,
  query,
  limit,
}: ProductListFilters = {}) {
  return prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(featured !== undefined ? { featured } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    ...(limit ? { take: limit } : {}),
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, active: true },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4
) {
  return prisma.product.findMany({
    where: { active: true, categoryId, id: { not: excludeProductId } },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
