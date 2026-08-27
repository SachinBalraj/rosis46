"use client";

import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const mainMenuItems = [
  { label: "Home", hasSubmenu: false },
  { label: "Helmets", hasSubmenu: true },
  { label: "Gears", hasSubmenu: true },
  { label: "Essentials & Luggage", hasSubmenu: true },
  { label: "Ride Care", hasSubmenu: true },
  { label: "New Arrivals", hasSubmenu: false },
];

const categoryMenuItems = [
  "Essentials",
  "Wheel Accessories",
  "Light & Light Accessories",
  "Handlebar Accessories",
  "Protection Parts",
  "Luggage",
  "Performance Parts",
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
          "fixed inset-y-0 left-0 z-40 flex w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <Image
            src="/images/rossislogo.png"
            alt="Rossis Biker Spot"
            width={100}
            height={32}
            className="h-auto w-auto object-contain"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-brand"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Main Menu
          </p>
          <ul className="flex flex-col">
            {mainMenuItems.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between border-b border-line px-2 py-3.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
                >
                  {item.label}
                  {item.hasSubmenu && (
                    <ChevronDown aria-hidden="true" className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <p className="mb-3 mt-8 text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Category Menu
          </p>
          <ul className="flex flex-col">
            {categoryMenuItems.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between border-b border-line px-2 py-3.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
                >
                  {item}
                  <ChevronDown aria-hidden="true" className="h-4 w-4 text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line px-6 py-4">
          <p className="text-xs text-gray-500">
            Rossis Biker Spot &copy; 2026. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Powered by YesBe Technologies
          </p>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
