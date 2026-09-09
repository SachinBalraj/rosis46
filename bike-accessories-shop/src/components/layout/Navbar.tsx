"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { MobileMenu } from "./MobileMenu";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const itemCount = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="relative flex shrink-0 items-center">
          <div className="flex h-10 items-center justify-center">
            <MobileMenu open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
          </div>
        </div>

        <Link
          href="/"
          className="flex h-10 items-center justify-center"
          aria-label="Rossis Biker Spot home"
        >
          <Image
            src="/images/rossislogo.png"
            alt="Rossis Biker Spot"
            width={120}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center">
          <Link
            href={pathname === "/cart" ? "/" : "/cart"}
            aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center border border-line text-foreground transition-all hover:border-brand hover:text-brand"
          >
            <ShoppingCart aria-hidden="true" className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>

      <nav
        id="primary-navigation"
        aria-label="Main navigation"
        className={cn(
          "flex w-full flex-wrap items-center gap-7 bg-white px-4 py-3 md:absolute md:top-full md:left-4 md:z-50 md:w-44 md:flex-col md:items-stretch md:gap-0 md:border md:border-line md:border-t md:border-r md:border-b md:border-l-[3px] md:border-l-brand md:px-0 md:py-0 md:shadow-lg lg:left-8",
          isDrawerOpen ? "md:flex" : "md:hidden"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsDrawerOpen(false)}
            className="text-base font-bold tracking-wider text-[#1f2933] uppercase whitespace-nowrap transition-colors duration-300 hover:text-brand md:px-4 md:py-2 md:text-xs md:hover:text-red-600"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}