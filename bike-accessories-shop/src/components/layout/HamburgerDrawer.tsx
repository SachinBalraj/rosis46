"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { parentCategories } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type HamburgerDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function HamburgerDrawer({
  open,
  onOpenChange,
}: HamburgerDrawerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const close = () => onOpenChange(false);

  const toggle = (label: string) => {
    setExpanded((current) => (current === label ? null : label));
  };

  const categoryUrl = (label: string) =>
    `/products?category=${encodeURIComponent(label)}`;

  const subCategoryUrl = (label: string, sub: string) =>
    `/products?category=${encodeURIComponent(label)}&subcategory=${encodeURIComponent(sub)}`;

  return createPortal(
    <>
      <div
        aria-hidden={!open}
        onClick={close}
        className={cn(
          "fixed top-0 right-0 bottom-0 left-0 z-[60] h-full min-h-screen w-full bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-[70] flex h-[100dvh] w-[min(360px,90vw)] max-w-[90vw] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-bold tracking-[0.25em] text-foreground uppercase">
            Menu
          </p>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center border border-line text-foreground transition-colors hover:text-brand"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          <nav aria-label="Menu links">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-line/60">
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex items-center px-4 py-3 text-sm font-bold tracking-wider text-[#1f2933] uppercase transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-b border-line/60 px-4 pt-4 pb-2">
            <p className="text-xs font-semibold tracking-[0.25em] text-smoke uppercase">
              Shop by category
            </p>
          </div>

          <Link
            href="/products"
            onClick={close}
            className="flex items-center justify-between border-b border-line/60 px-4 py-3 text-sm font-bold tracking-wider text-brand uppercase transition-colors hover:text-brand-deep"
          >
            All Products
            <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>

          <ul>
            {parentCategories.map((item) => {
              const isExpanded = expanded === item.label;
              const hasSubCategories = item.items.length > 0;
              return (
                <li key={item.label} className="border-b border-line/60">
                  <div className="flex items-stretch">
                    <Link
                      href={categoryUrl(item.label)}
                      onClick={close}
                      className="flex flex-1 items-center px-4 py-3 text-sm font-semibold tracking-widest text-[#1f2933] uppercase transition-colors hover:text-brand"
                    >
                      {item.label}
                    </Link>
                    {hasSubCategories ? (
                      <button
                        type="button"
                        onClick={() => toggle(item.label)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                        className="flex w-12 shrink-0 items-center justify-center text-smoke transition-colors hover:text-brand"
                      >
                        {isExpanded ? (
                          <ChevronDown aria-hidden="true" className="h-4 w-4" />
                        ) : (
                          <ChevronRight aria-hidden="true" className="h-4 w-4" />
                        )}
                      </button>
                    ) : null}
                  </div>

                  {isExpanded && hasSubCategories ? (
                    <ul className="border-t border-line/60 bg-carbon-soft/40 px-4 py-2">
                      {item.items.map((sub) => (
                        <li key={sub}>
                          <Link
                            href={subCategoryUrl(item.label, sub)}
                            onClick={close}
                            className="flex items-center gap-2 py-2 text-[13px] font-medium tracking-wider text-[#1f2933] uppercase transition-colors hover:text-brand"
                          >
                            <ChevronRight
                              aria-hidden="true"
                              className="h-3 w-3 shrink-0 text-smoke"
                            />
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>,
    document.body
  );
}