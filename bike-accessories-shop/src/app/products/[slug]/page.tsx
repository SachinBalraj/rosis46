import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, ShieldCheck, Star, Wrench } from "lucide-react";
import { AddToCartForm } from "@/components/products/AddToCartForm";
import { ProductGrid } from "@/components/products/ProductGrid";
import { iconMap } from "@/lib/icons";
import { getProductBySlug, getRelatedProducts } from "@/lib/db";
import { getCategoryVisual } from "@/lib/category-visuals";
import type { Product } from "@/lib/data";
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
  installation?: boolean;
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
    installation: false,
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
    rating: view.rating,
    reviewCount: view.reviewCount,
    description: view.description,
    accent: view.accent,
    icon: view.icon,
    featured: false,
  };
}

async function resolveProduct(slug: string) {
  const databaseProduct = await getProductBySlug(slug);
  if (!databaseProduct) {
    return null;
  }

  return fromDatabase(databaseProduct);
}

async function resolveRelated(slug: string) {
  const databaseProduct = await getProductBySlug(slug);
  if (!databaseProduct) {
    return [];
  }

  const related = await getRelatedProducts(
    databaseProduct.categoryId,
    databaseProduct.id
  );
  return related.map(fromDatabase);
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

  const related = await resolveRelated(slug);
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
      icon: Wrench,
      title: "On-site installation",
      description: "Fitted and installed at our Salem store while you wait.",
    },
    {
      icon: ShieldCheck,
      title: "Genuine & tested",
      description: "ISI/E-marked gear and quality parts for real roads.",
    },
    {
      icon: Clock,
      title: "Open daily till 9 PM",
      description: "Seven days a week, opposite KPN Petrol Bunk, Salem.",
    },
  ];

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="border-b border-line bg-white"
      >
        <ol className="mx-auto flex w-full max-w-7xl items-center gap-1.5 px-4 py-3 text-sm text-smoke sm:px-6 lg:px-8">
          <li>
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/products" className="hover:text-brand">
              Products
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <section
        aria-labelledby="product-title"
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            className={cn(
              "group relative flex aspect-square items-center justify-center overflow-hidden border border-line bg-gradient-to-br",
              product.accent
            )}
          >
            {product.badge ? (
              <span
                className={cn(
                  "absolute top-0 left-0 z-10 px-3 py-1.5 text-xs font-bold tracking-wider uppercase",
                  product.badge === "Sale"
                    ? "bg-brand text-white"
                    : "bg-night text-white"
                )}
              >
                {product.badge}
              </span>
            ) : null}
            <div className="flex h-44 w-44 items-center justify-center border border-line bg-white/70 text-brand backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
              <Icon
                aria-hidden="true"
                className="h-24 w-24 text-brand"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="eyebrow">
                <Link
                  href={`/products?category=${product.categorySlug}`}
                  className="hover:text-brand-deep"
                >
                  {product.categoryName}
                </Link>
              </p>
              <h1
                id="product-title"
                className="display-heading mt-3 text-4xl text-foreground sm:text-5xl"
              >
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {product.rating !== null ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="flex items-center gap-0.5"
                      aria-label={`${product.rating} out of 5 stars`}
                    >
                      <Star aria-hidden="true" className="h-4 w-4 fill-brand text-brand" />
                      <span className="font-semibold text-foreground">
                        {product.rating.toFixed(1)}
                      </span>
                    </span>
                    <span className="text-sm text-smoke">
                      ({product.reviewCount} reviews)
                    </span>
                  </span>
                ) : (
                  <span className="border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                    Rossis Biker Spot — genuine &amp; tested
                  </span>
                )}
                {product.stock !== null ? (
                  <span
                    className={cn(
                      "border px-3 py-1 text-xs font-semibold",
                      product.stock > 0
                        ? "border-emerald-600/30 bg-emerald-50 text-emerald-700"
                        : "border-rose-400/40 bg-rose-50 text-rose-600"
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
              <span className="font-display text-4xl font-bold text-brand">
                {formatPaise(product.priceInPaise)}
              </span>
              {product.originalPriceInPaise ? (
                <>
                  <span className="text-xl text-smoke line-through">
                    {formatPaise(product.originalPriceInPaise)}
                  </span>
                  <span className="bg-brand px-3 py-1 text-sm font-bold text-white">
                    {discount}% off
                  </span>
                </>
              ) : null}
            </div>

            <p className="leading-relaxed text-smoke">{product.description}</p>

            {product.installation ? (
              <div className="flex items-start gap-3 border border-brand/30 bg-brand/5 p-4">
                <Wrench
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                />
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-semibold text-brand uppercase">
                    On-site installation available
                  </span>{" "}
                  — bring your bike to Rossis Biker Spot and we&apos;ll fit
                  it for you while you wait.
                </p>
              </div>
            ) : null}

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

            <ul className="mt-2 grid gap-px border border-line bg-line sm:grid-cols-3">
              {trustPoints.map((point) => (
                <li key={point.title} className="bg-white p-5">
                  <point.icon aria-hidden="true" className="h-5 w-5 text-brand" />
                  <p className="mt-2 font-display text-sm font-semibold tracking-wide uppercase">
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
          className="border-t border-line bg-carbon-soft py-16"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2
                id="related-heading"
                className="display-heading text-3xl text-foreground sm:text-4xl"
              >
                You might also like
              </h2>
              <span aria-hidden="true" className="mb-2 h-1 w-12 bg-brand" />
            </div>
            <ProductGrid products={related.map(toCatalogShape)} />
          </div>
        </section>
      ) : null}
    </>
  );
}
