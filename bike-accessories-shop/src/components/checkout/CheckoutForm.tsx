"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";
import { iconMap } from "@/lib/icons";
import { checkoutSchema } from "@/lib/validation";
import { useCart } from "@/store/cart";

type CheckoutFormValues = z.output<typeof checkoutSchema>;

type PaymentStatus = "idle" | "creating" | "ready" | "open";

type CreatedOrder = {
  orderId: string;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
};

function cartItemsKey(items: { id: string; quantity: number }[]) {
  return items.map((item) => `${item.id}:${item.quantity}`).join(",");
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const scriptUrl = "https://checkout.razorpay.com/v1/checkout.js";
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptUrl}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-carbon px-4 py-3 text-sm text-white placeholder:text-smoke focus:outline-none",
    hasError
      ? "border-rose-500/70 focus:border-rose-500"
      : "border-line focus:border-brand"
  );

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [createdOrder, setCreatedOrder] = useState<{
    order: CreatedOrder;
    itemsKey: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      orderNotes: "",
    },
  });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  const payDisabled =
    isSubmitting || paymentStatus === "creating" || paymentStatus === "open";

  const openCheckout = (created: CreatedOrder, customer: CheckoutFormValues) => {
    if (!window.Razorpay) {
      setPaymentStatus("idle");
      toast.error("Razorpay checkout failed to load. Please try again.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: created.keyId,
      amount: created.amount,
      currency: created.currency,
      name: "RideReady",
      description: `Order ${created.orderId}`,
      order_id: created.razorpayOrderId,
      prefill: {
        name: customer.fullName,
        email: customer.email,
        contact: customer.phone,
      },
      theme: { color: "#c8f031" },
      handler: (response) => {
        void handleSuccess(response);
      },
      modal: {
        ondismiss: () => {
          setPaymentStatus("idle");
          toast.info("Payment cancelled. Your order is still pending — you can retry when ready.");
        },
      },
    });

    setPaymentStatus("open");
    razorpay.open();
  };

  const handleSuccess = async (response: RazorpayCheckoutResponse) => {
    setPaymentStatus("idle");
    try {
      const verifyResponse = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        }),
      });
      const data = (await verifyResponse.json()) as {
        verified?: boolean;
        orderId?: string;
        error?: string;
      };

      if (verifyResponse.ok && data.verified) {
        toast.success("Payment successful. Your order is confirmed.");
        clearCart();
        router.push(
          `/order-success/${data.orderId ?? createdOrder?.order.orderId ?? ""}`
        );
      } else {
        toast.error(data.error ?? "Payment could not be verified.");
        router.push("/payment-failed?reason=unverified");
      }
    } catch {
      toast.error("Something went wrong while confirming your payment.");
      router.push("/payment-failed?reason=unverified");
    }
  };

  const handlePay = async (values: CheckoutFormValues) => {
    if (paymentStatus !== "idle") {
      return;
    }

    const currentItemsKey = cartItemsKey(items);

    let created =
      createdOrder?.itemsKey === currentItemsKey ? createdOrder.order : null;

    if (!created) {
      setPaymentStatus("creating");
      try {
        const response = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: values,
            items: items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          }),
        });
        const data = (await response.json()) as CreatedOrder & {
          error?: string;
        };

        if (!response.ok) {
          setPaymentStatus("idle");
          toast.error(data.error ?? "Unable to start payment. Please try again.");
          return;
        }

        created = {
          orderId: data.orderId,
          razorpayOrderId: data.razorpayOrderId,
          keyId: data.keyId,
          amount: data.amount,
          currency: data.currency,
        };
        setCreatedOrder({ order: created, itemsKey: currentItemsKey });
      } catch {
        setPaymentStatus("idle");
        toast.error("Network error while starting payment. Please try again.");
        return;
      }
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPaymentStatus("idle");
      toast.error("Razorpay checkout failed to load. Check your connection and try again.");
      return;
    }

    setPaymentStatus("ready");
    openCheckout(created, values);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand/10 text-brand">
          <ShoppingCart aria-hidden="true" className="h-10 w-10" />
        </span>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-md text-smoke">
          Add some gear to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Browse products
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handlePay)}
      noValidate
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-deep"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-smoke">
        {itemCount} item{itemCount === 1 ? "" : "s"} · Free shipping on orders
        over ₹999
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <fieldset className="space-y-5">
          <legend className="text-lg font-bold text-white">
            Delivery details
          </legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="checkout-name"
                className="mb-2 block text-sm font-medium text-white"
              >
                Full name
              </label>
              <input
                id="checkout-name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                aria-invalid={errors.fullName ? "true" : "false"}
                className={inputClass(Boolean(errors.fullName))}
                {...register("fullName")}
              />
              {errors.fullName ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.fullName.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="checkout-email"
                className="mb-2 block text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                id="checkout-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                className={inputClass(Boolean(errors.email))}
                {...register("email")}
              />
              {errors.email ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="checkout-phone"
                className="mb-2 block text-sm font-medium text-white"
              >
                Phone number
              </label>
              <input
                id="checkout-phone"
                type="tel"
                autoComplete="tel-national"
                placeholder="+91 98765 43210"
                aria-invalid={errors.phone ? "true" : "false"}
                className={inputClass(Boolean(errors.phone))}
                {...register("phone")}
              />
              {errors.phone ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="checkout-address"
                className="mb-2 block text-sm font-medium text-white"
              >
                Shipping address
              </label>
              <textarea
                id="checkout-address"
                rows={3}
                autoComplete="street-address"
                placeholder="House number, street, area, landmark"
                aria-invalid={errors.address ? "true" : "false"}
                className={`${inputClass(Boolean(errors.address))} resize-y`}
                {...register("address")}
              />
              {errors.address ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.address.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="checkout-city"
                className="mb-2 block text-sm font-medium text-white"
              >
                City
              </label>
              <input
                id="checkout-city"
                type="text"
                autoComplete="address-level2"
                placeholder="Bengaluru"
                aria-invalid={errors.city ? "true" : "false"}
                className={inputClass(Boolean(errors.city))}
                {...register("city")}
              />
              {errors.city ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.city.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="checkout-state"
                className="mb-2 block text-sm font-medium text-white"
              >
                State
              </label>
              <input
                id="checkout-state"
                type="text"
                autoComplete="address-level1"
                placeholder="Karnataka"
                aria-invalid={errors.state ? "true" : "false"}
                className={inputClass(Boolean(errors.state))}
                {...register("state")}
              />
              {errors.state ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.state.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="checkout-pin"
                className="mb-2 block text-sm font-medium text-white"
              >
                Postal code
              </label>
              <input
                id="checkout-pin"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="560034"
                aria-invalid={errors.postalCode ? "true" : "false"}
                className={inputClass(Boolean(errors.postalCode))}
                {...register("postalCode")}
              />
              {errors.postalCode ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.postalCode.message}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="checkout-notes"
                className="mb-2 block text-sm font-medium text-white"
              >
                Order notes{" "}
                <span className="font-normal text-smoke">(optional)</span>
              </label>
              <textarea
                id="checkout-notes"
                rows={3}
                placeholder="Gate code, delivery instructions, gift message…"
                aria-invalid={errors.orderNotes ? "true" : "false"}
                className={`${inputClass(Boolean(errors.orderNotes))} resize-y`}
                {...register("orderNotes")}
              />
              {errors.orderNotes ? (
                <p role="alert" className="mt-1.5 text-sm text-rose-400">
                  {errors.orderNotes.message}
                </p>
              ) : null}
            </div>
          </div>
        </fieldset>

        <aside
          aria-label="Checkout summary"
          className="h-fit space-y-4 lg:sticky lg:top-24"
        >
          <div className="rounded-2xl border border-line bg-carbon p-6">
            <h2 className="text-lg font-bold text-white">Order summary</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {items.map((item) => {
                const Icon = iconMap[item.icon] ?? ShoppingCart;
                return (
                  <li key={item.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                        item.accent
                      )}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5 text-brand" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-smoke">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd className="font-semibold text-white">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-smoke">Shipping</dt>
                <dd
                  className={cn(
                    "font-semibold",
                    shipping === 0 ? "text-brand" : "text-white"
                  )}
                >
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-semibold text-white">Total</dt>
                <dd className="font-bold text-brand">{formatPrice(total)}</dd>
              </div>
            </dl>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-carbon p-4">
            <Truck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-semibold text-white">
                Delivery estimate: 3–5 business days
              </p>
              <p className="mt-0.5 text-xs text-smoke">
                Orders placed before 2 PM ship the same day.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-line bg-carbon p-4">
            <Lock
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-brand"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Secure payment
              </p>
              <p className="mt-0.5 text-xs text-smoke">
                Checkout is encrypted and processed securely by Razorpay. We
                never store your card details.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={payDisabled}
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-deep hover:shadow-[0_0_24px_rgb(225_6_0/0.35)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paymentStatus === "creating" ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Securing payment…
              </>
            ) : (
              <>
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Pay securely
              </>
            )}
          </button>
        </aside>
      </div>
    </form>
  );
}
