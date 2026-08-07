"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, PackageX } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";

export type AddToCartProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
  accent: string;
};

type AddToCartFormProps = {
  product: AddToCartProduct;
  stock: number | null;
};

export function AddToCartForm({ product, stock }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);

  const outOfStock = stock !== null && stock <= 0;
  const max = stock ?? 10;

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        icon: product.icon,
        accent: product.accent,
        stock,
      },
      quantity
    );
    toast.success(`${product.name} added to your cart`);
  };

  if (outOfStock) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-4">
        <PackageX aria-hidden="true" className="h-5 w-5 text-rose-400" />
        <p className="text-sm font-medium text-rose-300">
          Currently out of stock. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1 rounded-xl border border-line bg-carbon p-1">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-smoke transition-colors hover:text-lime"
        >
          <Minus aria-hidden="true" className="h-4 w-4" />
        </button>
        <span
          aria-live="polite"
          className="w-10 text-center font-semibold text-white"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(max, q + 1))}
          aria-label="Increase quantity"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-smoke transition-colors hover:text-lime"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-lime px-7 text-sm font-semibold text-night transition-all hover:bg-lime-deep hover:shadow-[0_0_24px_rgb(200_240_49/0.35)] sm:flex-none"
      >
        <ShoppingCart aria-hidden="true" className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  );
}
