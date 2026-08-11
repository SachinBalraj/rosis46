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
    <article className="group flex h-full flex-col border border-line bg-white transition-all duration-300 hover:border-foreground hover:shadow-[0_24px_60px_-28px_rgb(11_11_11/0.35)]">
      <Link
        href={`/products/${product.id}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div
          className={cn(
            "relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-line bg-gradient-to-br",
            product.accent
          )}
        >
          {product.badge ? (
            <span
              className={cn(
                "absolute top-0 left-0 z-10 px-2.5 py-1.5 text-[11px] font-bold tracking-wider uppercase",
                product.badge === "Sale"
                  ? "bg-brand text-white"
                  : "bg-night text-white"
              )}
            >
              {product.badge}
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="absolute top-0 right-0 z-10 border-b border-l border-line bg-white px-2.5 py-1.5 text-[11px] font-semibold text-brand">
              {discount}% off
            </span>
          ) : null}
          <div className="flex h-24 w-24 items-center justify-center border border-line bg-white/70 text-brand backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
            <Icon
              aria-hidden="true"
              className="h-12 w-12 text-brand"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] font-semibold tracking-[0.25em] text-brand uppercase">
          {product.categoryLabel}
        </p>
        <h3 className="font-display text-lg font-semibold tracking-wide uppercase">
          <Link
            href={`/products/${product.id}`}
            className="link-underline text-foreground transition-colors hover:text-brand"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-smoke">
          {product.description}
        </p>

        <div className="mt-auto flex items-center gap-1 pt-3">
          <Star aria-hidden="true" className="h-4 w-4 fill-brand text-brand" />
          <span className="text-sm font-semibold text-foreground">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-smoke">
            ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-baseline gap-2 border-t border-line pt-3">
          <span className="font-display text-xl font-bold text-brand">
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
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 bg-brand text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
        >
          <ShoppingCart aria-hidden="true" className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
