import type { Metadata } from "next";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the RideReady catalogue — helmets, gloves, lights, locks and bags. Filter by category, search and sort by price or rating.",
};

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const query = typeof params.query === "string" ? params.query : "";

  return (
    <>
      <section
        aria-labelledby="products-hero"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="eyebrow">The catalogue</p>
          <h1
            id="products-hero"
            className="display-heading mt-6 max-w-3xl text-5xl text-foreground sm:text-6xl"
          >
            Find your next piece of kit
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-smoke">
            Every product below has been ridden, rained on and tested by our
            own team. Search, filter and sort to find the gear for your ride.
          </p>
        </div>
      </section>

      <ProductCatalog products={products} initialCategory={category} initialQuery={query} />
    </>
  );
}
