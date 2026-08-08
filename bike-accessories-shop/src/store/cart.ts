"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
  accent: string;
  stock: number | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

function clampQuantity(quantity: number, stock: number | null) {
  if (stock !== null && quantity > stock) {
    return stock;
  }
  return Math.max(1, quantity);
}

function normalizeItem(
  item: Partial<CartItem> & Pick<CartItem, "id" | "name" | "price">
): CartItem {
  return {
    ...item,
    category: item.category ?? "",
    icon: item.icon ?? "Package",
    accent: item.accent ?? "from-brand/35 via-white/10 to-transparent",
    stock: item.stock ?? null,
    quantity: Math.max(1, item.quantity ?? 1),
  };
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const safeQuantity = Math.max(1, quantity);
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: clampQuantity(
                        i.quantity + safeQuantity,
                        item.stock ?? i.stock
                      ),
                    }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              normalizeItem({
                ...item,
                quantity: clampQuantity(safeQuantity, item.stock ?? null),
              }),
            ],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id
                    ? { ...i, quantity: clampQuantity(quantity, i.stock) }
                    : i
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "rideready-cart",
      merge: (persisted, current) => {
        const stored = persisted as { items?: unknown } | undefined;
        if (!stored || !Array.isArray(stored.items)) {
          return current;
        }
        return {
          ...current,
          items: stored.items.map((item) =>
            normalizeItem(
              item as Partial<CartItem> &
                Pick<CartItem, "id" | "name" | "price">
            )
          ),
        };
      },
    }
  )
);
