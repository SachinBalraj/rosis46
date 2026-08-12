import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, HelpCircle, RefreshCcw } from "lucide-react";
import { storePhone } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment failed",
  description: "Your payment could not be completed.",
};

type PaymentFailedPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentFailedPage({
  searchParams,
}: PaymentFailedPageProps) {
  const params = await searchParams;
  const reason =
    typeof params.reason === "string" ? params.reason : "declined";

  const content = {
    unverified: {
      title: "Payment not verified",
      message:
        "Your payment went through on our side but could not be confirmed. If money was deducted, it will be refunded automatically within 5–7 business days.",
    },
    cancelled: {
      title: "Payment cancelled",
      message:
        "You closed the payment window before completing the payment. No money was charged.",
    },
    declined: {
      title: "Payment failed",
      message:
        "Your bank declined the payment. Double-check your card details, or try another payment method.",
    },
  } as const;

  const copy = content[reason as keyof typeof content] ?? content.declined;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <span className="mx-auto flex h-20 w-20 items-center justify-center bg-rose-500/10 text-rose-500">
        <Ban aria-hidden="true" className="h-10 w-10" />
      </span>
      <p className="eyebrow mt-8">46 Rossis Biker Spot</p>
      <h1 className="display-heading mt-4 text-4xl text-foreground sm:text-5xl">
        {copy.title}
      </h1>
      <p className="mt-4 text-smoke">{copy.message}</p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/cart"
          className="inline-flex h-12 items-center justify-center gap-2 bg-brand px-7 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
        >
          <RefreshCcw aria-hidden="true" className="h-4 w-4" />
          Try payment again
        </Link>
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center gap-2 border border-line px-7 text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:border-brand hover:text-brand"
        >
          Continue shopping
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-10 flex items-center justify-center gap-2 text-sm text-smoke">
        <HelpCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
        Need help? Call us on{" "}
        <a
          href={storePhone.href}
          className="font-medium text-brand hover:text-brand-deep"
        >
          {storePhone.display}
        </a>
      </p>
    </main>
  );
}
