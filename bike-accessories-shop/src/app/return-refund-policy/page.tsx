import type { Metadata } from "next";
import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "How to request a return or refund at ROSSIS BIKER SPOT — for damaged products, incorrect items, defective products or orders that do not match.",
};

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyPage id="return-refund" title="Return & Refund Policy">
      <p>
        At ROSSIS BIKER SPOT, we want our customers to receive products in good
        condition as described.
      </p>
      <p>
        Return requests can be accepted for damaged products, incorrect items
        delivered, manufacturing defects where applicable, or products that do
        not match the confirmed order.
      </p>
      <p>Return requests should be made within days of delivery.</p>
      <p>
        Products must be unused and in their original condition, with packaging
        and included items.
      </p>
      <p>
        Some products may not be eligible for return due to their nature or
        installation status.
      </p>
      <p>
        Once the returned product is received and inspected, we will notify you
        regarding approval or rejection of the refund.
      </p>
      <p>
        Approved refunds will typically be processed to the original payment
        method.
      </p>
      <p>Exchange may be offered subject to product availability.</p>
      <p>
        For cancellations, please contact us as soon as possible with your
        order details.
      </p>
      <p>
        If the order has already been dispatched, cancellation may not be
        possible, and return procedures may apply.
      </p>
      <p>
        Customized or specially ordered products may have different conditions.
      </p>
      <p>
        For questions, contact ROSSIS BIKER SPOT in Salem with your order
        number.
      </p>
    </PolicyPage>
  );
}