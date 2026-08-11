"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "Account" },
];

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center border border-line text-foreground transition-colors hover:text-brand lg:hidden"
      >
        {open ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Menu aria-hidden="true" className="h-5 w-5" />
        )}
      </button>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-white px-6 pt-8 transition-all duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <ul className="flex flex-col gap-1">
          {links.map((link, index) => (
            <li
              key={link.href}
              style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
              className={cn(
                "transition-all duration-300",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              )}
            >
              <Link
                href={link.href}
                onClick={() => onOpenChange(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "block border-b border-line px-4 py-4 font-display text-2xl font-bold uppercase tracking-wide transition-colors",
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

        <div className="mt-auto mb-8">
          <p className="border-l-2 border-brand pl-4 text-sm text-smoke">
            Free shipping on orders over ₹999 · 2-year warranty on all gear
          </p>
        </div>
      </div>
    </>
  );
}
