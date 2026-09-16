import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { getActiveProducts, toCatalogProduct } from "@/lib/db";
import type { Product } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the Rossis Biker Spot catalogue — sports helmets, riding gloves, bike grips, mobile holders, LED lights, custom decals, mirrors, exhaust accessories, spare parts and chain care.",
};

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function errorInfo(error: unknown) {
  return {
    name: error instanceof Error ? error.name : "UnknownError",
    message:
      error instanceof Error ? error.message : "Unknown database error",
  };
}

async function loadCatalogProducts(): Promise<{
  products: Product[];
  failed: boolean;
}> {
  const startedAt = Date.now();
  console.info("[PRODUCTS_FETCH_START]");

  try {
    const dbProducts = await getActiveProducts();
    const products = dbProducts.map(toCatalogProduct);
    console.info(
      `[PRODUCTS_FETCH_SUCCESS] count=${products.length} duration=${Date.now() - startedAt}ms`
    );
    return { products, failed: false };
  } catch (error) {
    const { name, message } = errorInfo(error);
    console.error(`[PRODUCTS_FETCH_ERROR] ${name}: ${message}`);
    return { products: [], failed: true };
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const subcategory =
    typeof params.subcategory === "string" ? params.subcategory : "";
  const query = typeof params.query === "string" ? params.query : "";

  const { products: catalogProducts, failed: fetchFailed } =
    await loadCatalogProducts();

  return (
    <>
      <section
        aria-labelledby="products-hero"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <p className="eyebrow">The catalogue</p>
          <h1
            id="products-hero"
            className="display-heading text-solid-black mt-2.5 max-w-3xl text-5xl sm:text-6xl"
          >
            Gear up at Rossis
          </h1>
          <p className="mt-2.5 max-w-2xl text-lg leading-relaxed text-smoke">
            Sports helmets, riding gear, grips, LED lights, custom decals,
            spare parts and more—with on-site installation available at our
            Salem store.
          </p>
        </div>
      </section>

      {fetchFailed ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center border border-dashed border-brand/40 bg-brand/5 px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center border border-brand/30 bg-white text-brand">
              <RefreshCw aria-hidden="true" className="h-8 w-8" />
            </span>
            <h2 className="mt-6 font-display text-xl font-bold tracking-wide text-foreground uppercase sm:text-2xl">
              Couldn&apos;t load products right now
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-smoke">
              There was a temporary problem reaching our catalogue. The store
              hasn&apos;t disappeared — please try again.
            </p>
            <Link
              href="/products"
              prefetch={false}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 border border-brand px-6 text-sm font-semibold tracking-widest text-brand uppercase transition-colors hover:bg-brand hover:text-white"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Retry
            </Link>
          </div>
        </section>
      ) : (
        <ProductCatalog
          key={`${category}|${subcategory}|${query}`}
          products={catalogProducts}
          initialCategory={category}
          initialSubCategory={subcategory}
          initialQuery={query}
        />
      )}
    </>
  );
}