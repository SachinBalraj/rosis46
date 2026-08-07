import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, HelpCircle, RefreshCcw } from "lucide-react";

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
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-400">
        <Ban aria-hidden="true" className="h-10 w-10" />
      </span>
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-4 text-smoke">{copy.message}</p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/cart"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-lime px-7 text-sm font-semibold text-night transition-colors hover:bg-lime-deep"
        >
          <RefreshCcw aria-hidden="true" className="h-4 w-4" />
          Try payment again
        </Link>
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line px-7 text-sm font-semibold text-white transition-colors hover:border-lime/50 hover:text-lime"
        >
          Continue shopping
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-10 flex items-center justify-center gap-2 text-sm text-smoke">
        <HelpCircle aria-hidden="true" className="h-4 w-4 text-lime" />
        Need help? Email{" "}
        <a
          href="mailto:support@rideready.example"
          className="font-medium text-lime hover:text-lime-deep"
        >
          support@rideready.example
        </a>
      </p>
    </main>
  );
}
