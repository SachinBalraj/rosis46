import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Star, Truck, Zap } from "lucide-react";
import { AddToCartForm } from "@/components/products/AddToCartForm";
import { ProductGrid } from "@/components/products/ProductGrid";
import { iconMap } from "@/lib/icons";
import { getProductBySlug, getRelatedProducts } from "@/lib/db";
import { getCategoryVisual } from "@/lib/category-visuals";
import { products as staticProducts, type Product } from "@/lib/data";
import { cn, formatPaise } from "@/lib/utils";

type ProductView = {
  id: string;
  name: string;
  description: string;
  priceInPaise: number;
  originalPriceInPaise: number | null;
  stock: number | null;
  categoryName: string;
  categorySlug: string;
  rating: number | null;
  reviewCount: number | null;
  badge: string | null;
  icon: string;
  accent: string;
};

function fromDatabase(product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>): ProductView {
  const visual = getCategoryVisual(product.category.slug);
  const hasSale =
    product.salePriceInPaise !== null &&
    product.salePriceInPaise < product.priceInPaise;
  return {
    id: product.slug,
    name: product.name,
    description: product.description,
    priceInPaise: hasSale ? product.salePriceInPaise! : product.priceInPaise,
    originalPriceInPaise: hasSale ? product.priceInPaise : null,
    stock: product.stock,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    rating: null,
    reviewCount: null,
    badge: hasSale ? "Sale" : product.featured ? "Featured" : null,
    icon: visual.icon,
    accent: visual.accent,
  };
}

function fromStatic(product: Product): ProductView {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceInPaise: product.price * 100,
    originalPriceInPaise: product.mrp > product.price ? product.mrp * 100 : null,
    stock: null,
    categoryName: product.categoryLabel,
    categorySlug: product.category,
    rating: product.rating,
    reviewCount: product.reviewCount,
    badge: product.badge ?? null,
    icon: product.icon,
    accent: product.accent,
  };
}

function toCatalogShape(view: ProductView): Product {
  const price = Math.round(view.priceInPaise / 100);
  const mrp = view.originalPriceInPaise
    ? Math.round(view.originalPriceInPaise / 100)
    : price;
  return {
    id: view.id,
    name: view.name,
    category: view.categorySlug as Product["category"],
    categoryLabel: view.categoryName,
    price,
    mrp,
    rating: view.rating ?? 4.5,
    reviewCount: view.reviewCount ?? 0,
    description: view.description,
    accent: view.accent,
    icon: view.icon,
    featured: false,
  };
}

async function resolveProduct(slug: string) {
  const databaseProduct = await getProductBySlug(slug);
  if (databaseProduct) {
    return fromDatabase(databaseProduct);
  }

  const staticProduct = staticProducts.find(
    (product) => product.id === slug || product.name === slug
  );
  if (staticProduct) {
    return fromStatic(staticProduct);
  }

  return null;
}

async function resolveRelated(view: ProductView, slug: string) {
  const databaseProduct = await getProductBySlug(slug);
  if (databaseProduct) {
    const related = await getRelatedProducts(
      databaseProduct.categoryId,
      databaseProduct.id
    );
    if (related.length > 0) {
      return related.map(fromDatabase);
    }
  }

  return staticProducts
    .filter(
      (product) =>
        product.categoryLabel === view.categoryName && product.id !== view.id
    )
    .slice(0, 4)
    .map(fromStatic);
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    notFound();
  }

  const related = await resolveRelated(product, slug);
  const Icon = iconMap[product.icon];
  const discount = product.originalPriceInPaise
    ? Math.round(
        ((product.originalPriceInPaise - product.priceInPaise) /
          product.originalPriceInPaise) *
          100
      )
    : 0;

  const trustPoints = [
    {
      icon: Truck,
      title: "Free shipping",
      description: "On orders over ₹999, delivered in 3–5 days.",
    },
    {
      icon: ShieldCheck,
      title: "2-year warranty",
      description: "No-questions-asked replacement on all gear.",
    },
    {
      icon: Zap,
      title: "Same-day dispatch",
      description: "Order before 2 PM and it ships today.",
    },
  ];

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="border-b border-line bg-carbon/50"
      >
        <ol className="mx-auto flex w-full max-w-7xl items-center gap-1.5 px-4 py-3 text-sm text-smoke sm:px-6 lg:px-8">
          <li>
            <Link href="/" className="hover:text-lime">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/products" className="hover:text-lime">
              Products
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li aria-current="page" className="font-medium text-white">
            {product.name}
          </li>
        </ol>
      </nav>

      <section
        aria-labelledby="product-title"
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div
            className={cn(
              "relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-line bg-gradient-to-br",
              product.accent
            )}
          >
            {product.badge ? (
              <span
                className={cn(
                  "absolute top-4 left-4 z-10 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase",
                  product.badge === "Sale"
                    ? "bg-rose-500 text-white"
                    : "bg-lime text-night"
                )}
              >
                {product.badge}
              </span>
            ) : null}
            <div className="flex h-44 w-44 items-center justify-center rounded-3xl bg-night/40 text-white backdrop-blur-sm">
              <Icon aria-hidden="true" className="h-24 w-24 text-lime" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold tracking-widest text-lime uppercase">
                <Link
                  href={`/products?category=${product.categorySlug}`}
                  className="hover:text-lime-deep"
                >
                  {product.categoryName}
                </Link>
              </p>
              <h1
                id="product-title"
                className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {product.rating !== null ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5" aria-label={`${product.rating} out of 5 stars`}>
                      <Star aria-hidden="true" className="h-4 w-4 fill-lime text-lime" />
                      <span className="font-semibold text-white">
                        {product.rating.toFixed(1)}
                      </span>
                    </span>
                    <span className="text-sm text-smoke">
                      ({product.reviewCount} reviews)
                    </span>
                  </span>
                ) : (
                  <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
                    RideReady tested &amp; approved
                  </span>
                )}
                {product.stock !== null ? (
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      product.stock > 0
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                    )}
                  >
                    {product.stock > 0
                      ? product.stock <= 5
                        ? `Only ${product.stock} left in stock`
                        : "In stock"
                      : "Out of stock"}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-baseline gap-3 border-y border-line py-5">
              <span className="text-4xl font-extrabold text-white">
                {formatPaise(product.priceInPaise)}
              </span>
              {product.originalPriceInPaise ? (
                <>
                  <span className="text-xl text-smoke line-through">
                    {formatPaise(product.originalPriceInPaise)}
                  </span>
                  <span className="rounded-full bg-rose-500/15 px-3 py-1 text-sm font-bold text-rose-400">
                    {discount}% off
                  </span>
                </>
              ) : null}
            </div>

            <p className="leading-relaxed text-smoke">{product.description}</p>

            <AddToCartForm
              product={{
                id: product.id,
                name: product.name,
                price: Math.round(product.priceInPaise / 100),
                category: product.categoryName,
                icon: product.icon,
                accent: product.accent,
              }}
              stock={product.stock}
            />

            <ul className="mt-2 grid gap-3 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <li
                  key={point.title}
                  className="rounded-2xl border border-line bg-carbon p-4"
                >
                  <point.icon aria-hidden="true" className="h-5 w-5 text-lime" />
                  <p className="mt-2 text-sm font-semibold text-white">
                    {point.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-smoke">
                    {point.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="border-t border-line bg-carbon/50 py-16"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="related-heading"
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              You might also like
            </h2>
            <div className="mt-8">
              <ProductGrid products={related.map(toCatalogShape)} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
