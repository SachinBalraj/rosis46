import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPaise } from "@/lib/utils";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/account/StatusBadge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order details",
  description: "Review your 46 Rossis Biker Spot order.",
};

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/account");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
  });

  const isAdmin = session.user.role === "ADMIN";
  if (!order || (order.userId !== session.user.id && !isAdmin)) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={isAdmin ? "/admin" : "/account"}
        className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        {isAdmin ? "Back to admin console" : "Back to account"}
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Order record</p>
          <h1 className="display-heading mt-4 text-4xl text-foreground sm:text-5xl">
            Order details
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-smoke">
            <Calendar aria-hidden="true" className="h-4 w-4 text-brand" />
            Placed{" "}
            {order.createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            <span className="font-mono text-xs">
              · #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line px-6 py-4">
            <PackageCheck aria-hidden="true" className="h-5 w-5 text-brand" />
            <h2 className="font-display text-sm font-semibold tracking-widest uppercase">
              Items
            </h2>
          </div>
          <ul className="flex flex-col divide-y divide-line">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
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

          <dl className="space-y-3 border-t border-line bg-carbon-soft px-6 py-5 text-sm">
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
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold tracking-widest uppercase">
              <MapPin aria-hidden="true" className="h-5 w-5 text-brand" />
              Shipping address
            </h2>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {order.customerName}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-smoke">
              {order.customerAddress}
            </p>
          </div>

          <div className="border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold tracking-widest uppercase">
              <CreditCard aria-hidden="true" className="h-5 w-5 text-brand" />
              Payment
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-smoke">Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              {order.razorpayPaymentId ? (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-smoke">Reference</span>
                  <span className="truncate font-mono text-xs text-foreground">
                    {order.razorpayPaymentId}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold tracking-widest uppercase">
              <Truck aria-hidden="true" className="h-5 w-5 text-brand" />
              Shipment
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-smoke">Status</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-smoke">
                Estimated delivery in 3–5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
