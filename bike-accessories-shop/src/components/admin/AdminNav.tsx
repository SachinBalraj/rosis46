"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Admin navigation"
      className="flex gap-px overflow-x-auto border border-line bg-line lg:flex-col lg:overflow-visible"
    >
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={cn(
            "inline-flex shrink-0 items-center gap-2.5 px-4 py-3 text-sm font-semibold tracking-wide transition-colors",
            isActive(link.href)
              ? "border-brand bg-brand text-white"
              : "bg-white text-smoke hover:text-foreground"
          )}
        >
          <link.icon aria-hidden="true" className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
