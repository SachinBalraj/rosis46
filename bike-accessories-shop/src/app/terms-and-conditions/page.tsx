import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you shop at ROSSIS BIKER SPOT — orders, payments, delivery, returns, refunds and cancellations.",
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage id="terms" title="Terms & Conditions">
      <p>By using our website, you agree to these terms.</p>
      <p>
        We aim to provide accurate product information, but minor variations may
        occur.
      </p>
      <p>
        All orders depend on product availability and successful payment.
      </p>
      <p>
        ROSSIS BIKER SPOT reserves the right to cancel orders in cases of
        product unavailability, pricing errors, or other valid reasons.
      </p>
      <p>
        Payments may include online methods or cash on delivery where
        available.
      </p>
      <p>
        Delivery timelines are estimates and may vary. Please check our{" "}
        <Link
          href="/shipping-policy"
          className="link-underline w-fit font-semibold text-brand transition-colors hover:text-brand-deep"
        >
          Shipping Policy
        </Link>
        .
      </p>
      <p>
        Returns and refunds follow our{" "}
        <Link
          href="/return-refund-policy"
          className="link-underline w-fit font-semibold text-brand transition-colors hover:text-brand-deep"
        >
          Return &amp; Refund Policy
        </Link>
        .
      </p>
      <p>
        Customers may request order cancellation before dispatch.
      </p>
      <p>
        After dispatch, cancellation may not be possible, and return procedures
        may apply.
      </p>
      <p>Customized products may have different conditions.</p>
      <p>
        For questions, contact ROSSIS BIKER SPOT in Salem with your order
        number.
      </p>
    </PolicyPage>
  );
}