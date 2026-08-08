import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPaise, cn } from "@/lib/utils";
import {
  ORDER_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
} from "@/lib/admin-validation";
import {
  PaymentStatusBadge,
} from "@/components/account/StatusBadge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = {
  title: "Orders | Admin console",
  description: "Manage RideReady orders and fulfilment.",
};

type AdminOrdersPageProps = {
  searchParams: Promise<{
    status?: string;
    payment?: string;
    q?: string;
  }>;
};

const fulfilmentFilters = [
  { value: "", label: "All" },
  ...ORDER_STATUS_VALUES.map((value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
  })),
];

const paymentFilters = [
  { value: "", label: "All" },
  ...PAYMENT_STATUS_VALUES.map((value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
  })),
];

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;
  const status = ORDER_STATUS_VALUES.includes(params.status as never)
    ? (params.status as (typeof ORDER_STATUS_VALUES)[number])
    : undefined;
  const payment = PAYMENT_STATUS_VALUES.includes(params.payment as never)
    ? (params.payment as (typeof PAYMENT_STATUS_VALUES)[number])
    : undefined;
  const query = params.q?.trim();

  const where = {
    ...(status ? { status } : {}),
    ...(payment ? { paymentStatus: payment } : {}),
    ...(query
      ? {
          OR: [
            { customerName: { contains: query, mode: "insensitive" as const } },
            { id: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    include: { items: { select: { quantity: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const pillHref = (key: "status" | "payment", value: string) => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (key === "status") {
      if (value) next.set("status", value);
      if (payment) next.set("payment", payment);
    } else {
      if (status) next.set("status", status);
      if (value) next.set("payment", value);
    }
    const qs = next.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Orders
          </h2>
          <p className="mt-1 text-sm text-smoke">
            {orders.length} order{orders.length === 1 ? "" : "s"}
            {query ? ` matching “${query}”` : ""}
            {status ? ` · fulfilment: ${status.toLowerCase()}` : ""}
            {payment ? ` · payment: ${payment.toLowerCase()}` : ""}
          </p>
        </div>
      </div>

      <form
        action="/admin/orders"
        method="get"
        className="mt-6 flex max-w-md items-center gap-2"
        role="search"
      >
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke"
          />
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search customer or order #…"
            className="w-full rounded-xl border border-line bg-carbon py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-smoke focus:border-brand focus:outline-none"
          />
        </div>
        {status ? <input type="hidden" name="status" value={status} /> : null}
        {payment ? <input type="hidden" name="payment" value={payment} /> : null}
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold tracking-widest text-smoke uppercase">
            Fulfilment
          </span>
          {fulfilmentFilters.map((filter) => (
            <Link
              key={filter.value}
              href={pillHref("status", filter.value)}
              aria-current={status === filter.value ? "page" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                status === filter.value
                  ? "border-brand bg-brand text-white"
                  : "border-line text-smoke hover:border-brand/40 hover:text-brand"
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold tracking-widest text-smoke uppercase">
            Payment
          </span>
          {paymentFilters.map((filter) => (
            <Link
              key={filter.value}
              href={pillHref("payment", filter.value)}
              aria-current={payment === filter.value ? "page" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                payment === filter.value
                  ? "border-brand bg-brand text-white"
                  : "border-line text-smoke hover:border-brand/40 hover:text-brand"
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-line bg-carbon/60 px-6 py-16 text-center">
          <p className="text-lg font-bold text-white">No orders found</p>
          <p className="mt-2 max-w-sm text-sm text-smoke">
            Try a different filter, or check back after the next checkout.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-carbon">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold tracking-widest text-smoke uppercase">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Fulfilment</th>
                <th className="px-6 py-4">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-carbon-soft/60">
                  <td className="px-6 py-4 font-mono text-xs text-smoke">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-smoke">
                    {order.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center text-smoke">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    {formatPaise(order.totalInPaise)}
                  </td>
                  <td className="px-6 py-4">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/account/orders/${order.id}`}
                      aria-label={`View order ${order.id.slice(0, 8)}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-smoke transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      <Eye aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
