"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { Search, SlidersHorizontal, PackageSearch, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./ProductGrid";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { type Product } from "@/lib/data";
import { parentCategories } from "@/lib/navigation";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
];

type ProductCatalogProps = {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
};

export function ProductCatalog({
  products,
  initialCategory = "all",
  initialQuery = "",
}: ProductCatalogProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(() => {
    if (initialCategory === "all" || initialCategory === "") return "all";
    const parent = parentCategories.find((item) =>
      item.filters.includes(initialCategory as Product["category"])
    );
    return parent ? parent.label : initialCategory;
  });
  const [sort, setSort] = useState<SortOption>("featured");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const update = (updater: () => void) => {
    startTransition(updater);
  };

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    const result = products.filter((product) => {
      const parent = parentCategories.find((item) => item.label === category);
      const matchesCategory =
        category === "all" ||
        (parent
          ? parent.filters.includes(product.category)
          : product.category === category);
      const matchesQuery =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.categoryLabel.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);
      return matchesCategory && matchesQuery;
    });

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return sorted;
  }, [products, category, deferredQuery, sort]);

  const hasFilters = query.trim() !== "" || category !== "all";

  const resetFilters = () => {
    startTransition(() => {
      setQuery("");
      setCategory("all");
      setSort("featured");
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-smoke"
            />
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search helmets, grips, decals…"
              className="h-12 w-full border border-line bg-white pl-12 pr-4 text-sm text-foreground placeholder:text-smoke focus:border-brand focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal
              aria-hidden="true"
              className="hidden h-5 w-5 text-smoke sm:block"
            />
            <label htmlFor="sort-select" className="sr-only">
              Sort products
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(event) =>
                update(() => setSort(event.target.value as SortOption))
              }
              className="h-12 border border-line bg-white px-4 text-sm text-foreground focus:border-brand focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-3"
        >
          <button
            type="button"
            onClick={() => update(() => setCategory("all"))}
            aria-pressed={category === "all"}
            className={cn(
              "border px-4 py-2 text-sm font-semibold tracking-widest uppercase transition-colors",
              category === "all"
                ? "border-brand text-brand"
                : "border-line text-smoke hover:border-brand hover:text-brand"
            )}
          >
            All
          </button>
          {parentCategories.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => update(() => setCategory(item.label))}
              aria-pressed={category === item.label}
              className={cn(
                "border px-4 py-2 text-sm font-semibold tracking-widest uppercase transition-colors",
                category === item.label
                  ? "border-brand text-brand"
                  : "border-line text-smoke hover:border-brand hover:text-brand"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10" aria-live="polite" aria-busy={isPending}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-smoke" role="status">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {isPending ? "…" : filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {filtered.length === 0 || hasFilters ? " matching your filters" : ""}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-deep"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              Clear filters
            </button>
          ) : null}
        </div>

        {isPending ? (
          <ProductGridSkeleton count={8} />
        ) : filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="flex flex-col items-center border border-dashed border-line bg-carbon-soft/60 px-6 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center border border-line bg-white text-brand">
              <PackageSearch aria-hidden="true" className="h-8 w-8" />
            </span>
            <h2 className="mt-6 font-display text-xl font-bold tracking-wide text-foreground uppercase">
              No products available yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-smoke">
              New riding gear and accessories will be added soon.
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex h-11 items-center justify-center border border-brand px-6 text-sm font-semibold tracking-widest text-brand uppercase transition-colors hover:bg-brand hover:text-white"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
