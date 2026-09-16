import type { Metadata } from "next";
import { PolicyPage } from "@/components/ui/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ROSSIS BIKER SPOT collects, uses and protects your personal information — including payments, data sharing and cookies.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage id="privacy" title="Privacy Policy">
      <p>At ROSSIS BIKER SPOT, we respect your privacy.</p>
      <p>
        We collect basic information such as name, phone number, email,
        address, order details, and payment transaction information.
      </p>
      <p>
        We use this information to process orders, provide updates, provide
        customer support, process refunds, and improve our services.
      </p>
      <p>
        Payments may be handled through secure third-party payment gateways. We
        do not intentionally store complete card or banking credentials.
      </p>
      <p>
        We may share necessary information with trusted service providers such
        as courier partners or payment gateways where required to provide our
        services.
      </p>
      <p>We do not sell personal information.</p>
      <p>Cookies may be used to improve website functionality.</p>
      <p>
        We take reasonable measures to protect your data, but no internet
        system is completely secure.
      </p>
      <p>For questions, contact us at Salem, Tamil Nadu, India.</p>
    </PolicyPage>
  );
}