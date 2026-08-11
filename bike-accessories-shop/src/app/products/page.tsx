import type { Metadata } from "next";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { getActiveProducts, toCatalogProduct } from "@/lib/db";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the 46 Rossis Biker Spot catalogue — sports helmets, riding gloves, bike grips, mobile holders, LED lights, custom decals, mirrors, exhaust accessories, spare parts and chain care.",
};

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const query = typeof params.query === "string" ? params.query : "";

  const catalogProducts = (await getActiveProducts()).map(toCatalogProduct);

  return (
    <>
      <section
        aria-labelledby="products-hero"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="eyebrow">46 · The catalogue</p>
          <h1
            id="products-hero"
            className="display-heading mt-6 max-w-3xl text-5xl text-foreground sm:text-6xl"
          >
            Gear up at 46 Rossis
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-smoke">
            Sports helmets, riding gear, grips, LED lights, custom decals,
            spare parts and more—with on-site installation available at our
            Salem store.
          </p>
        </div>
      </section>

      <ProductCatalog products={catalogProducts} initialCategory={category} initialQuery={query} />
    </>
  );
}
