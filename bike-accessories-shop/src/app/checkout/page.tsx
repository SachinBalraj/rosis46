import type { Metadata } from "next";
import Link from "next/link";
import { PackageX } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCategoryVisual } from "@/lib/category-visuals";
import { getProductBySlug } from "@/lib/db";
import type { CheckoutDirectItem } from "@/types/checkout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Enter your delivery details and securely check out your Rossis Biker Spot order.",
};

const MAX_DIRECT_QTY = 100;

function parseQuantity(raw: string | undefined): number | null {
  if (!raw) return 1;
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value < 1 || value > MAX_DIRECT_QTY) {
    return null;
  }
  return value;
}

function DirectUnavailable({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <span className="flex h-20 w-20 items-center justify-center border border-line bg-white text-brand">
        <PackageX aria-hidden="true" className="h-10 w-10" />
      </span>
      <h1 className="display-heading text-rainbow mt-8 text-4xl text-foreground">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-smoke">{message}</p>
      <Link
        href="/products"
        className="mt-8 inline-flex h-12 items-center justify-center gap-2 bg-brand px-7 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
      >
        Browse products
      </Link>
    </div>
  );
}

type PageProps = {
  searchParams: Promise<{ product?: string; qty?: string }>;
};

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const productSlug = params.product?.trim();

  if (!productSlug) {
    return <CheckoutForm directItem={null} />;
  }

  const quantity = parseQuantity(params.qty);
  const databaseProduct = await getProductBySlug(productSlug);

  if (!databaseProduct || quantity === null) {
    return (
      <DirectUnavailable
        title="This product is no longer available"
        message="The item you tried to buy couldn't be found or the requested quantity was invalid. Explore our latest gear instead."
      />
    );
  }

  const stock = databaseProduct.stock;
  if (stock !== null && stock <= 0) {
    return (
      <DirectUnavailable
        title="Out of stock"
        message={`${databaseProduct.name} is currently out of stock. Check back soon.`}
      />
    );
  }

  if (stock !== null && quantity > stock) {
    return (
      <DirectUnavailable
        title={`Only ${stock} unit${stock === 1 ? "" : "s"} available`}
        message={`${databaseProduct.name} only has ${stock} unit${stock === 1 ? "" : "s"} left in stock. Reduce the quantity in your cart and try again.`}
      />
    );
  }

  const visual = getCategoryVisual(databaseProduct.category.slug);
  const hasSale =
    databaseProduct.salePriceInPaise !== null &&
    databaseProduct.salePriceInPaise < databaseProduct.priceInPaise;
  const unitPriceInPaise = hasSale
    ? databaseProduct.salePriceInPaise!
    : databaseProduct.priceInPaise;

  const directItem: CheckoutDirectItem = {
    id: databaseProduct.id,
    slug: productSlug,
    name: databaseProduct.name,
    unitPriceInPaise,
    quantity,
    stock,
    imageUrl: databaseProduct.imageUrl,
    icon: visual.icon,
    accent: visual.accent,
    categoryName: databaseProduct.category.name,
    subCategory: databaseProduct.subCategory ?? null,
  };

  return <CheckoutForm directItem={directItem} />;
}