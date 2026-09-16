"use client";

import { Menu } from "lucide-react";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  return (
    <button
      type="button"
      onClick={() => onOpenChange(!open)}
      aria-expanded={open}
      aria-controls="mobile-drawer"
      aria-label="Open navigation menu"
      className="flex h-10 w-10 items-center justify-center border border-line text-foreground transition-colors hover:text-brand"
    >
      <Menu aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}