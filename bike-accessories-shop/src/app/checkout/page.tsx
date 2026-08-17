import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Enter your delivery details and securely check out your Rossis Biker Spot order.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
