import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the gear in your RideReady cart and proceed to checkout.",
};

export default function CartPage() {
  return <CartView />;
}
