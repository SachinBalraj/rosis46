import "server-only";

import { prisma } from "@/lib/prisma";

export type ProductListFilters = {
  category?: string;
  featured?: boolean;
  query?: string;
  limit?: number;
};

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
