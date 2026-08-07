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
        className="relative overflow-hidden border-b border-line"
      >
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-lime/15 blur-[120px]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-lime uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
            The catalogue
          </p>
          <h1
            id="products-hero"
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Find your next{" "}
            <span className="text-lime">piece of kit.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-smoke">
            Every product below has been ridden, rained on and tested by our
            own team. Search, filter and sort to find the gear for your ride.
          </p>
        </div>
      </section>

      <ProductCatalog products={products} initialCategory={category} initialQuery={query} />
    </>
  );
}
