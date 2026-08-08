"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { iconMap } from "@/lib/icons";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

export function CartView() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand/10 text-brand">
          <ShoppingCart aria-hidden="true" className="h-10 w-10" />
        </span>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-md text-smoke">
          Looks like you haven&apos;t added any gear yet. Head to the catalogue
          and find something for your next ride.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Browse products
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Your cart
          </h1>
          <p className="mt-2 text-sm text-smoke">
            {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col gap-4">
          {items.map((item) => {
            const Icon = iconMap[item.icon] ?? ShoppingCart;
            const atMax =
              item.stock !== null && item.quantity >= item.stock;
            return (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-carbon p-4 sm:flex-row sm:items-center"
              >
                <span
                  className={cn(
                    "flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                    item.accent
                  )}
                >
                  <Icon aria-hidden="true" className="h-9 w-9 text-brand" />
                </span>
                <div className="flex flex-1 flex-col">
                  <p className="text-xs font-semibold tracking-widest text-brand uppercase">
                    {item.category}
                  </p>
                  <h2 className="font-bold text-white">{item.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatPrice(item.price)}{" "}
                    <span className="font-normal text-smoke">each</span>
                  </p>
                  {item.stock !== null ? (
                    <p className="mt-0.5 text-xs text-smoke">
                      {item.stock} in stock
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-1 rounded-xl border border-line bg-night p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-smoke transition-colors hover:text-brand"
                    >
                      <Minus aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <span
                      aria-live="polite"
                      className="w-8 text-center text-sm font-semibold text-white"
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={atMax}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-smoke transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="w-24 text-right font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.id);
                      toast.success(`${item.name} removed from cart`);
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-smoke transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <Trash2 aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside
          aria-label="Order summary"
          className="h-fit rounded-2xl border border-line bg-carbon p-6"
        >
          <h2 className="text-lg font-bold text-white">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-smoke">Subtotal</dt>
              <dd className="font-semibold text-white">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-smoke">Shipping</dt>
              <dd
                className={cn(
                  "font-semibold",
                  shipping === 0 ? "text-brand" : "text-white"
                )}
              >
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-semibold text-white">Total</dt>
              <dd className="font-bold text-brand">
                {formatPrice(subtotal + shipping)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-smoke">
            {shipping === 0
              ? "You've unlocked free shipping. Nice."
              : `Add ${formatPrice(999 - subtotal)} more for free shipping.`}
          </p>
          <Link
            href="/checkout"
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
          >
            Proceed to checkout
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-smoke">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-brand" />
            Secure checkout via Razorpay
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="mt-3 w-full text-center text-sm text-smoke transition-colors hover:text-rose-400"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}
