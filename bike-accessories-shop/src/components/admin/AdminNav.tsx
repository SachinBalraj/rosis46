"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Inventory", icon: LayoutGrid },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/contact-messages", label: "Contact messages", icon: Inbox },
  ];

  return (
    <nav
      aria-label="Admin sections"
      className="mt-6 flex flex-wrap items-center gap-2 border-b border-line pb-3"
    >
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold tracking-widest uppercase transition-colors",
              active
                ? "bg-black text-white"
                : "text-smoke hover:bg-carbon-soft hover:text-foreground"
            )}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {label}
            {href === "/admin/contact-messages" && unreadCount > 0 ? (
              <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">
                {unreadCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}