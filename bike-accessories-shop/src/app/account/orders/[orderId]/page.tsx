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
  description: "Review your RideReady order.",
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
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={isAdmin ? "/admin" : "/account"}
        className="inline-flex items-center gap-2 text-sm font-medium text-lime transition-colors hover:text-lime-deep"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        {isAdmin ? "Back to admin console" : "Back to account"}
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-smoke">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Order details
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-smoke">
            <Calendar aria-hidden="true" className="h-4 w-4" />
            Placed{" "}
            {order.createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-line bg-carbon">
          <div className="border-b border-line px-6 py-4">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <PackageCheck aria-hidden="true" className="h-5 w-5 text-lime" />
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
                  <p className="font-semibold text-white">
                    {item.product.name}
                  </p>
                  <p className="mt-0.5 text-sm text-smoke">
                    {item.quantity} × {formatPaise(item.unitPriceInPaise)}
                  </p>
                </div>
                <p className="font-semibold text-white">
                  {formatPaise(item.unitPriceInPaise * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="space-y-3 border-t border-line px-6 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-smoke">Subtotal</dt>
              <dd className="font-semibold text-white">
                {formatPaise(order.subtotalInPaise)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-smoke">Shipping</dt>
              <dd className="font-semibold text-white">
                {order.shippingInPaise === 0
                  ? "Free"
                  : formatPaise(order.shippingInPaise)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-semibold text-white">Total</dt>
              <dd className="font-bold text-lime">
                {formatPaise(order.totalInPaise)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-line bg-carbon p-6">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <MapPin aria-hidden="true" className="h-5 w-5 text-lime" />
              Shipping address
            </h2>
            <p className="mt-3 text-sm font-semibold text-white">
              {order.customerName}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-smoke">
              {order.customerAddress}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-carbon p-6">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <CreditCard aria-hidden="true" className="h-5 w-5 text-lime" />
              Payment
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-smoke">Status</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              {order.razorpayPaymentId ? (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-smoke">Reference</span>
                  <span className="truncate font-mono text-xs text-white">
                    {order.razorpayPaymentId}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-carbon p-6">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <Truck aria-hidden="true" className="h-5 w-5 text-lime" />
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
