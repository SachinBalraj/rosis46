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
      <div className="flex items-center gap-3 border border-rose-400/40 bg-rose-500/10 px-5 py-4">
        <PackageX aria-hidden="true" className="h-5 w-5 text-rose-500" />
        <p className="text-sm font-medium text-rose-600">
          Currently out of stock. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border border-line bg-white">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="flex h-12 w-12 items-center justify-center border-r border-line text-smoke transition-colors hover:text-brand"
        >
          <Minus aria-hidden="true" className="h-4 w-4" />
        </button>
        <span
          aria-live="polite"
          className="w-12 text-center font-display text-lg font-semibold text-foreground"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(max, q + 1))}
          aria-label="Increase quantity"
          className="flex h-12 w-12 items-center justify-center border-l border-line text-smoke transition-colors hover:text-brand"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-brand px-7 text-sm font-semibold tracking-widest text-white uppercase transition-all hover:bg-brand-deep sm:flex-none sm:min-w-56"
      >
        <ShoppingCart aria-hidden="true" className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  );
}
