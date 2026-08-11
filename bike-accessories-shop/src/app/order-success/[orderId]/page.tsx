import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPaise } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your 46 Rossis Biker Spot order is confirmed.",
};

type OrderSuccessPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, imageUrl: true } },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const paid = order.paymentStatus === "PAID";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <span
          className={
            paid
              ? "flex h-20 w-20 items-center justify-center bg-brand text-white"
              : "flex h-20 w-20 items-center justify-center bg-brand/15 text-brand"
          }
        >
          <CheckCircle2 aria-hidden="true" className="h-10 w-10" />
        </span>
        <p className="eyebrow mt-8">46 Rossis Biker Spot</p>
        <h1 className="display-heading mt-4 text-4xl text-foreground sm:text-5xl">
          {paid ? "Order confirmed!" : "Payment not completed"}
        </h1>
        <p className="mt-3 max-w-md text-smoke">
          {paid
            ? "Thanks for riding with 46 Rossis Biker Spot. We've received your payment and your gear is being prepared."
            : "Your order was created but the payment was not completed. You can retry from your cart."}
        </p>
      </div>

      <div className="mt-10 border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-carbon-soft p-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-smoke uppercase">
              Order ID
            </p>
            <p className="mt-1 font-mono text-sm text-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          {order.razorpayPaymentId ? (
            <div>
              <p className="text-xs font-semibold tracking-widest text-smoke uppercase">
                Payment ID
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">
                {order.razorpayPaymentId}
              </p>
            </div>
          ) : null}
        </div>

        <ul className="flex flex-col divide-y divide-line">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 p-6"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {item.product.name}
                </p>
                <p className="mt-0.5 text-sm text-smoke">
                  {item.quantity} × {formatPaise(item.unitPriceInPaise)}
                </p>
              </div>
              <p className="font-display font-bold text-foreground">
                {formatPaise(item.unitPriceInPaise * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="space-y-3 border-t border-line bg-carbon-soft p-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-smoke">Subtotal</dt>
            <dd className="font-semibold text-foreground">
              {formatPaise(order.subtotalInPaise)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-smoke">Shipping</dt>
            <dd className="font-semibold text-foreground">
              {order.shippingInPaise === 0
                ? "Free"
                : formatPaise(order.shippingInPaise)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-semibold text-foreground">Total</dt>
            <dd className="font-display text-lg font-bold text-brand">
              {formatPaise(order.totalInPaise)}
            </dd>
          </div>
        </dl>

        <div className="flex items-start gap-3 border-t border-line p-6">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-brand"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Shipping to {order.customerName}
            </p>
            <p className="mt-0.5 text-sm text-smoke">{order.customerAddress}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-line p-6">
          <Truck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <p className="text-sm text-smoke">
            Estimated delivery in 3–5 business days.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center gap-2 bg-brand px-7 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
        >
          Continue shopping
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        {!paid ? (
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
          >
            <PackageCheck aria-hidden="true" className="h-4 w-4" />
            Retry payment from your cart
          </Link>
        ) : null}
      </div>
    </main>
  );
}
