import type { Metadata } from "next";
import Link from "next/link";
import { PackagePlus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPaise, cn } from "@/lib/utils";
import { ProductActions } from "@/components/admin/ProductActions";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Products | Admin console",
  description: "Manage RideReady products.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
  }>;
};

const statusFilters = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Hidden" },
  { value: "low-stock", label: "Low stock" },
];

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { q, status, category } = await searchParams;

  const query = q?.trim();
  const where = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { slug: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status === "active" ? { active: true } : {}),
    ...(status === "inactive" ? { active: false } : {}),
    ...(status === "low-stock"
      ? { active: true, stock: { lte: 5 } }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
  };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const activeStatus = statusFilters.some((f) => f.value === status)
    ? status ?? ""
    : "";

  const pillHref = (key: "status" | "category", value: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    const nextStatus = key === "status" ? value : status ?? "";
    const nextCategory = key === "category" ? value : category ?? "";
    if (nextStatus) params.set("status", nextStatus);
    if (nextCategory) params.set("category", nextCategory);
    const qs = params.toString();
    return `/admin/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Products
          </h2>
          <p className="mt-1 text-sm text-smoke">
            {products.length} product{products.length === 1 ? "" : "s"}
            {query ? ` matching “${query}”` : ""}
          </p>
        </div>
        <Button href="/admin/products/new" size="md">
          <PackagePlus aria-hidden="true" className="h-4 w-4" />
          New product
        </Button>
      </div>

      <form
        action="/admin/products"
        method="get"
        className="mt-6 flex max-w-md items-center gap-2"
        role="search"
      >
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke"
          />
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search products…"
            className="w-full rounded-xl border border-line bg-carbon py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-smoke focus:border-brand focus:outline-none"
          />
        </div>
        {category ? (
          <input type="hidden" name="category" value={category} />
        ) : null}
        {activeStatus ? (
          <input type="hidden" name="status" value={activeStatus} />
        ) : null}
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold tracking-widest text-smoke uppercase">
          Status
        </span>
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={pillHref("status", filter.value)}
            aria-current={activeStatus === filter.value ? "page" : undefined}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              activeStatus === filter.value
                ? "border-brand bg-brand text-white"
                : "border-line text-smoke hover:border-brand/40 hover:text-brand"
            )}
          >
            {filter.label}
          </Link>
        ))}
        <span className="mx-2 hidden h-5 w-px bg-line sm:block" />
        <span className="mr-1 text-xs font-semibold tracking-widest text-smoke uppercase">
          Category
        </span>
        <Link
          href={pillHref("category", "")}
          aria-current={!category ? "page" : undefined}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            !category
              ? "border-brand bg-brand text-white"
              : "border-line text-smoke hover:border-brand/40 hover:text-brand"
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={pillHref("category", cat.slug)}
            aria-current={category === cat.slug ? "page" : undefined}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              category === cat.slug
                ? "border-brand bg-brand text-white"
                : "border-line text-smoke hover:border-brand/40 hover:text-brand"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-line bg-carbon/60 px-6 py-16 text-center">
          <p className="text-lg font-bold text-white">No products found</p>
          <p className="mt-2 max-w-sm text-sm text-smoke">
            Try adjusting your filters or add a new product to the catalogue.
          </p>
          <Button href="/admin/products/new" className="mt-6">
            <PackagePlus aria-hidden="true" className="h-4 w-4" />
            New product
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-carbon">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold tracking-widest text-smoke uppercase">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => {
                const price = product.salePriceInPaise ?? product.priceInPaise;
                const onSale = product.salePriceInPaise !== null;
                return (
                  <tr key={product.id} className="transition-colors hover:bg-carbon-soft/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-xl border border-line bg-night object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-xs font-bold text-brand">
                            {product.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {product.name}
                          </p>
                          <p className="truncate font-mono text-xs text-smoke">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={pillHref("category", product.category.slug)}
                        className="rounded-full border border-line bg-night px-3 py-1 text-xs font-semibold text-smoke transition-colors hover:border-brand/40 hover:text-brand"
                      >
                        {product.category.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">
                        {formatPaise(price)}
                      </p>
                      {onSale ? (
                        <p className="text-xs text-smoke line-through">
                          {formatPaise(product.priceInPaise)}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          product.stock === 0
                            ? "font-semibold text-rose-400"
                            : product.stock <= 5
                              ? "font-semibold text-amber-400"
                              : "font-semibold text-white"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={
                            product.active
                              ? "inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400"
                              : "inline-flex items-center rounded-full border border-line bg-carbon-soft px-3 py-1 text-xs font-semibold text-smoke"
                          }
                        >
                          {product.active ? "Active" : "Hidden"}
                        </span>
                        {product.active && product.stock === 0 ? (
                          <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-400">
                            Out of stock
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ProductActions
                        id={product.id}
                        name={product.name}
                        active={product.active}
                        orderItemCount={product._count.orderItems}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
