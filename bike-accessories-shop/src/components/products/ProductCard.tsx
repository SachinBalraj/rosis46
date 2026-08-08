"use client";

import Link from "next/link";
import { Package, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, cn } from "@/lib/utils";
import { iconMap } from "@/lib/icons";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const Icon = iconMap[product.icon] ?? Package;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.categoryLabel,
      icon: product.icon,
      accent: product.accent,
      stock: null,
    });
    toast.success(`${product.name} added to your cart`);
  };

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <article className="card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_20px_60px_-20px_rgb(225_6_0/0.35)]">
      <Link
        href={`/products/${product.id}`}
        className="group block"
        aria-label={`View ${product.name}`}
      >
        <div
          className={cn(
            "relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br",
            product.accent
          )}
        >
          {product.badge ? (
            <span
              className={cn(
                "absolute top-3 left-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
                product.badge === "Sale"
                  ? "bg-brand text-white"
                  : product.badge === "New"
                    ? "bg-white text-black"
                    : "bg-white text-black"
              )}
            >
              {product.badge}
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="absolute top-3 right-3 z-10 rounded-full border border-line bg-night/70 px-2.5 py-1 text-[11px] font-semibold text-brand backdrop-blur">
              {discount}% off
            </span>
          ) : null}
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-night/40 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Icon
              aria-hidden="true"
              className="h-12 w-12 text-brand"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-semibold tracking-widest text-brand uppercase">
          {product.categoryLabel}
        </p>
        <h3 className="font-bold text-white">
          <Link
            href={`/products/${product.id}`}
            className="transition-colors hover:text-brand"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-smoke">
          {product.description}
        </p>

        <div className="mt-auto flex items-center gap-1 pt-3">
          <Star
            aria-hidden="true"
            className="h-4 w-4 fill-brand text-brand"
          />
          <span className="text-sm font-semibold text-white">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-smoke">
            ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price ? (
            <span className="text-sm text-smoke line-through">
              {formatPrice(product.mrp)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          <ShoppingCart aria-hidden="true" className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
