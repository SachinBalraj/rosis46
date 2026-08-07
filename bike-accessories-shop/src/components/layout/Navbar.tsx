"use client";

import Link from "next/link";
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
    <header className="sticky top-0 z-50 border-b border-line bg-night/85 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
          aria-label="RideReady home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime text-night">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
            </svg>
          </span>
          RideReady
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-lime"
                    : "text-smoke hover:text-white"
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
              "hidden h-10 w-10 items-center justify-center rounded-xl border border-line bg-carbon text-smoke transition-colors hover:text-lime sm:flex"
            )}
          >
            <User aria-hidden="true" className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-carbon text-smoke transition-colors hover:text-lime",
              pathname === "/cart" && "text-lime"
            )}
          >
            <ShoppingCart aria-hidden="true" className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-[11px] font-bold text-night">
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
