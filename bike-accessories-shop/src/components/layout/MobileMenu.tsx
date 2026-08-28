"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  categoryMenuCategories,
  mainMenuCategories,
} from "@/lib/navigation";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type MenuItem = {
  label: string;
  href: string;
};

type MenuEntry = {
  label: string;
  href?: string;
  items?: MenuItem[];
};

type MenuListProps = {
  entries: MenuEntry[];
  openSections: string[];
  onToggle: (label: string) => void;
  onNavigate: () => void;
};

const slugify = (label: string) =>
  label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildItems = (labels: string[]) =>
  [...new Set(labels)].map((label) => ({
    label,
    href: `/products/${slugify(label)}`,
  }));

const mainMenuEntries: MenuEntry[] = [
  { label: "Home", href: "/" },
  ...mainMenuCategories.map((category) => ({
    label: category.label,
    items: buildItems(category.items),
  })),
  { label: "NEW ARRIVALS", href: "/products" },
];

const categoryMenuEntries: MenuEntry[] = categoryMenuCategories.map(
  (category) => ({
    label: category.label,
    items: buildItems(category.items),
  })
);

function MenuList({ entries, openSections, onToggle, onNavigate }: MenuListProps) {
  return (
    <ul>
      {entries.map((entry) =>
        entry.href ? (
          <li key={entry.label}>
            <Link
              href={entry.href}
              onClick={onNavigate}
              className="flex items-center justify-between border-b border-gray-100 px-0 py-4 text-[15px] font-bold text-gray-900"
            >
              {entry.label}
            </Link>
          </li>
        ) : (
          <li key={entry.label}>
            <button
              type="button"
              onClick={() => onToggle(entry.label)}
              aria-expanded={openSections.includes(entry.label)}
              className="flex w-full items-center justify-between border-b border-gray-100 px-0 py-4 text-left text-[15px] font-bold text-gray-900"
            >
              {entry.label}
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform duration-300",
                  openSections.includes(entry.label) && "rotate-180"
                )}
              />
            </button>
            {openSections.includes(entry.label) && entry.items ? (
              <ul className="border-b border-gray-100">
                {entry.items.map((sub) => (
                  <li key={sub.href}>
                    <Link
                      href={sub.href}
                      onClick={onNavigate}
                      className="flex items-center gap-2 py-3 pr-2 pl-2 text-sm font-semibold text-gray-700 uppercase transition-colors hover:text-brand"
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-gray-300"
                      />
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        )
      )}
    </ul>
  );
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

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

  const toggleSection = (label: string) =>
    setOpenSections((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );

  const closeMenu = () => onOpenChange(false);

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
          <Link href="/" onClick={closeMenu}>
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
            onClick={closeMenu}
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
          <MenuList
            entries={mainMenuEntries}
            openSections={openSections}
            onToggle={toggleSection}
            onNavigate={closeMenu}
          />

          <p className="mt-8 mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
            Category Menu
          </p>
          <MenuList
            entries={categoryMenuEntries}
            openSections={openSections}
            onToggle={toggleSection}
            onNavigate={closeMenu}
          />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[9998] bg-black/50"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}