"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { MobileMenu } from "./MobileMenu";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex h-10 w-10 items-center justify-center">
          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
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

        <div className="flex h-10 w-10 items-center justify-center">
          <Link
            href="/cart"
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
    </header>
  );
}
