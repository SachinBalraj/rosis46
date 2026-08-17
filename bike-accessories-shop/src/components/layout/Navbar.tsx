"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { useCart } from "@/store/cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-sm font-bold tracking-widest whitespace-nowrap text-foreground uppercase sm:text-base lg:text-lg"
          aria-label="Rossis Biker Spot home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-white">
            <Image
              src="/images/rossis-46-logo.jpg"
              alt=""
              width={36}
              height={28}
              priority
              className="h-full w-full object-contain"
            />
          </span>
          Rossis Biker Spot
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "link-underline px-4 py-2 text-sm font-semibold tracking-widest uppercase transition-colors",
                  isActive(link.href)
                    ? "text-brand"
                    : "text-foreground hover:text-brand"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            aria-label="Account"
            className={cn(
              "hidden h-10 w-10 items-center justify-center border border-line text-foreground transition-all hover:border-brand hover:text-brand sm:flex"
            )}
          >
            <User aria-hidden="true" className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center border border-line text-foreground transition-all hover:border-brand hover:text-brand",
              pathname === "/cart" && "border-brand text-brand"
            )}
          >
            <ShoppingCart aria-hidden="true" className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center bg-brand px-1 text-[11px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>

          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </nav>
    </header>
  );
}
