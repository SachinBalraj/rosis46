"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const mainMenuItems = [
  { label: "Home", href: "/", hasSubmenu: false },
  { label: "Helmets", href: "/products?category=sports-helmets", hasSubmenu: true },
  { label: "GEARS", href: "/products?category=riding-gloves", hasSubmenu: true },
  { label: "Essentials & Luggage", href: "/products", hasSubmenu: true },
  { label: "Ride Care", href: "/products?category=chain-care", hasSubmenu: true },
  { label: "NEW ARRIVALS", href: "/products", hasSubmenu: false, isLast: true },
];

const categoryMenuItems = [
  { label: "ESSENTIALS", href: "/products", hasSubmenu: true },
  { label: "WHEEL ACCESSORIES", href: "/products", hasSubmenu: true },
  { label: "LIGHT & LIGHT ACCESSORIES", href: "/products?category=led-lights", hasSubmenu: true },
  { label: "HANDLEBAR ACCESSORIES", href: "/products?category=bike-grips", hasSubmenu: true },
  { label: "PROTECTION PARTS", href: "/products?category=spare-parts", hasSubmenu: true },
  { label: "LUGGAGE", href: "/products", hasSubmenu: true },
  { label: "PERFORMANCE PARTS", href: "/products?category=exhaust-accessories", hasSubmenu: true, isLast: true },
];

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
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
        className="flex h-10 w-10 items-center justify-center border border-line text-foreground transition-colors hover:text-brand"
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
          "fixed top-0 left-0 z-[9999] flex h-[100dvh] w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <Link href="/" onClick={() => onOpenChange(false)}>
            <Image
              src="/images/rossislogo.png"
              alt="Rossis"
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
            className="rounded-md bg-gray-100 p-2"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-4 pb-8">
          <p className="mt-6 mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
            Main Menu
          </p>
          <ul>
            {mainMenuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center justify-between border-b border-gray-100 px-0 py-4 text-[15px] font-bold text-gray-900",
                    item.isLast && "border-b-0"
                  )}
                >
                  {item.label}
                  {item.hasSubmenu && (
                    <ChevronDown
                      aria-hidden="true"
                      className="h-4 w-4 text-gray-400"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
            Category Menu
          </p>
          <ul>
            {categoryMenuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center justify-between border-b border-gray-100 px-0 py-4 text-[15px] font-bold text-gray-900",
                    item.isLast && "border-b-0"
                  )}
                >
                  {item.label}
                  {item.hasSubmenu && (
                    <ChevronDown
                      aria-hidden="true"
                      className="h-4 w-4 text-gray-400"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[9998] bg-black/50"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}