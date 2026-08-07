import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Boxes,
  Eye,
  PackageCheck,
  PackageX,
  ShoppingBag,
  Tags,
  TriangleAlert,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPaise } from "@/lib/utils";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/account/StatusBadge";

export const metadata: Metadata = {
  title: "Dashboard | Admin console",
  description: "RideReady admin overview.",
};

export default async function AdminDashboardPage() {
  const [ordersCount, revenue, openFulfilment, productsCount, activeProducts, lowStock, categoriesCount, recentOrders, lowStockProducts] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalInPaise: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.order.count({
        where: { status: { notIn: ["DELIVERED", "CANCELLED"] } },
      }),
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: true, stock: { lte: 5 } } }),
      prisma.category.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          customerName: true,
          totalInPaise: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      prisma.product.findMany({
        take: 5,
        where: { active: true, stock: { lte: 5 } },
        orderBy: { stock: "asc" },
        select: { id: true, name: true, stock: true },
      }),
    ]);

  const stats = [
    {
      label: "Total orders",
      value: ordersCount.toLocaleString("en-IN"),
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      label: "Paid revenue",
      value: formatPaise(revenue._sum.totalInPaise ?? 0),
      icon: BadgeIndianRupee,
      href: "/admin/orders?payment=PAID",
    },
    {
      label: "Open fulfilments",
      value: openFulfilment.toLocaleString("en-IN"),
      icon: PackageCheck,
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: productsCount.toLocaleString("en-IN"),
      icon: Boxes,
      href: "/admin/products",
    },
    {
      label: "Active products",
      value: activeProducts.toLocaleString("en-IN"),
      icon: Eye,
      href: "/admin/products?status=active",
    },
    {
      label: "Low stock",
      value: lowStock.toLocaleString("en-IN"),
      icon: TriangleAlert,
      href: "/admin/products?status=low-stock",
    },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-line bg-carbon p-5 transition-colors hover:border-lime/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/10 text-lime">
                <stat.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-smoke transition-transform group-hover:translate-x-0.5 group-hover:text-lime"
              />
            </div>
            <p className="mt-4 text-2xl font-extrabold tracking-tight text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-sm text-smoke">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-line bg-carbon">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-bold text-white">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-lime transition-colors hover:text-lime-deep"
            >
              View all
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-smoke">
              No orders yet. They&rsquo;ll appear here as customers check out.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders?q=${order.id.slice(0, 8).toUpperCase()}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-carbon-soft/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-sm text-smoke">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="truncate text-sm font-semibold text-white">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      <PaymentStatusBadge status={order.paymentStatus} />
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="font-bold text-white">
                      {formatPaise(order.totalInPaise)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl border border-line bg-carbon">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="flex items-center gap-2 font-bold text-white">
                <TriangleAlert aria-hidden="true" className="h-4 w-4 text-amber-400" />
                Low stock
              </h2>
              <Link
                href="/admin/products?status=low-stock"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-lime transition-colors hover:text-lime-deep"
              >
                All
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            {lowStockProducts.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-smoke">
                Everything&rsquo;s well stocked.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="px-6 py-3.5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="truncate text-sm font-semibold text-white">
                        {product.name}
                      </p>
                      <span
                        className={
                          product.stock === 0
                            ? "shrink-0 rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-0.5 text-xs font-bold text-rose-400"
                            : "shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-400"
                        }
                      >
                        {product.stock} left
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-carbon p-6">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <Tags aria-hidden="true" className="h-4 w-4 text-lime" />
              Categories
            </h2>
            <p className="mt-1 text-sm text-smoke">
              {categoriesCount} categor{categoriesCount === 1 ? "y" : "ies"}{" "}
              organising the catalogue.
            </p>
            <Link
              href="/admin/categories"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-lime transition-colors hover:text-lime-deep"
            >
              Manage categories
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-carbon p-6">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <PackageX aria-hidden="true" className="h-4 w-4 text-lime" />
              Products
            </h2>
            <p className="mt-1 text-sm text-smoke">
              {activeProducts} of {productsCount} products are live.
            </p>
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-lime transition-colors hover:text-lime-deep"
            >
              Add a product
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
