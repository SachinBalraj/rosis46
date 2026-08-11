"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatPaise } from "@/lib/utils";
import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge";

export type AccountDashboardUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AccountOrder = {
  id: string;
  createdAt: string;
  totalInPaise: number;
  status: string;
  paymentStatus: string;
  itemCount: number;
};

export function AccountDashboard({
  user,
  orders,
}: {
  user: AccountDashboardUser;
  orders: AccountOrder[];
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const onSignOut = async () => {
    setSigningOut(true);
    await signOut({ redirect: false });
    toast.success("Signed out. See you on the next ride.");
    router.push("/account");
    router.refresh();
  };

  const isAdmin = user.role === "ADMIN";
  const initial = (user.name.trim()[0] ?? "R").toUpperCase();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border border-line-dark bg-night p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center bg-brand font-display text-2xl font-bold text-white">
              {initial}
            </span>
            <div>
              <p className="font-display text-xl font-semibold tracking-wide uppercase">
                {user.name}
              </p>
              <p className="mt-0.5 text-sm text-smoke">{user.email}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand uppercase">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
                {isAdmin ? "Administrator" : "Member"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex h-11 items-center justify-center gap-2 border border-brand bg-brand px-5 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
              >
                <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
                Admin console
              </Link>
            ) : null}
            <button
              type="button"
              onClick={onSignOut}
              disabled={signingOut}
              className="inline-flex h-11 items-center justify-center gap-2 border border-line-dark px-5 text-sm font-semibold tracking-widest text-smoke uppercase transition-colors hover:border-rose-400 hover:text-rose-400 disabled:opacity-60"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">History</p>
            <h2 className="display-heading mt-3 text-3xl text-foreground sm:text-4xl">
              Order history
            </h2>
            <p className="mt-1 text-sm text-smoke">
              {orders.length === 0
                ? "Orders you place will show up here."
                : `${orders.length} order${orders.length === 1 ? "" : "s"} placed.`}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
          >
            Shop the catalogue
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center border border-dashed border-line bg-white px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center border border-line bg-white text-brand">
              <Package aria-hidden="true" className="h-8 w-8" />
            </span>
            <h3 className="mt-6 font-display text-lg font-semibold tracking-wide uppercase">
              No orders yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-smoke">
              When you check out, your gear and its delivery status will appear
              here.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 bg-brand px-6 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
            >
              Browse products
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-px border border-line bg-line">
            {orders.map((order) => (
              <li key={order.id} className="bg-white">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="group flex flex-col gap-4 p-5 transition-colors hover:bg-carbon-soft sm:flex-row sm:items-center"
                >
                  <div className="flex flex-1 flex-col">
                    <p className="font-mono text-sm text-smoke">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-xs text-smoke">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <PaymentStatusBadge status={order.paymentStatus} />
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <p className="font-display font-bold text-foreground">
                      {formatPaise(order.totalInPaise)}
                    </p>
                    <ChevronRight
                      aria-hidden="true"
                      className="h-4 w-4 text-smoke transition-colors group-hover:text-brand"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
