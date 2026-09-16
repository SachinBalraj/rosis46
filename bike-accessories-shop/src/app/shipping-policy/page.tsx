import type { Metadata } from "next";
import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "How ROSSIS BIKER SPOT processes, dispatches and delivers your orders within India — timelines, dispatch, shipping charges and lost or damaged packages.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage id="shipping" title="Shipping Policy">
      <p>
        At ROSSIS BIKER SPOT, we aim to process and deliver your orders safely
        and on time.
      </p>
      <p>
        Orders are usually processed within business days after payment
        confirmation. Orders placed on Sundays or public holidays will be
        processed on the next working day.
      </p>
      <p>
        Delivery timelines may vary depending on location, courier partners,
        product availability, and other factors. Estimated delivery time within
        India is generally business days after dispatch.
      </p>
      <p>
        Shipping charges, if applicable, will be shown at checkout before you
        confirm.
      </p>
      <p>
        If your package is delayed, lost, or arrives damaged, please contact us
        as soon as possible with your order details and photos of the package
        or product.
      </p>
      <p>
        We&apos;ll coordinate with the courier partner where applicable, though
        delays can sometimes be outside our control.
      </p>
      <p>Thank you for shopping with ROSSIS BIKER SPOT.</p>
    </PolicyPage>
  );
}