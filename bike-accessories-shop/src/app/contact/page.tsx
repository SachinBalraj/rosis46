import type { Metadata } from "next";
import { ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the RideReady team — product help, sizing advice, order support and partnerships. Visit our Bengaluru store or drop us a line.",
};

const shopDetails = [
  {
    icon: MapPin,
    label: "Visit the store",
    lines: ["42 Gear Street, Koramangala", "Bengaluru, Karnataka 560034"],
  },
  {
    icon: Phone,
    label: "Call or WhatsApp",
    lines: ["+91 98765 43210", "Mon–Sat, 9 AM to 7 PM"],
  },
  {
    icon: Mail,
    label: "Email us",
    lines: ["support@rideready.in", "We reply within 24 hours"],
  },
  {
    icon: Clock,
    label: "Store hours",
    lines: ["Mon–Sat: 9 AM – 9 PM", "Sunday: 10 AM – 6 PM"],
  },
];

export default function ContactPage() {
  return (
    <>
      <section
        aria-labelledby="contact-hero"
        className="relative overflow-hidden border-b border-line"
      >
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-lime/15 blur-[120px]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-lime uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
            Get in touch
          </p>
          <h1
            id="contact-hero"
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            We&apos;d love to <span className="text-lime">hear from you.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-smoke">
            Order help, sizing advice, partnership ideas — our rider team reads
            every message and replies within a day.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="contact-form-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Send a message"
              title="How can we help?"
              description="Fill in the form and our team will get back to you within 24 hours on business days."
            />
            <div className="mt-8 rounded-3xl border border-line bg-carbon p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Shop details"
              title="Visit or reach us"
              description=""
            />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shopDetails.map((detail) => (
                <li
                  key={detail.label}
                  className="rounded-2xl border border-line bg-carbon p-5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/10 text-lime">
                    <detail.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">
                    {detail.label}
                  </h3>
                  <ul className="mt-1.5 space-y-0.5">
                    {detail.lines.map((line) => (
                      <li key={line} className="text-sm text-smoke">
                        {line}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <div
              aria-label="Map showing the RideReady store location"
              role="img"
              className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-3xl border border-line bg-carbon"
            >
              <div
                aria-hidden="true"
                className="bg-grid absolute inset-0 opacity-70"
              />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-night">
                  <MapPin aria-hidden="true" className="h-7 w-7" />
                </span>
                <p className="font-semibold text-white">
                  RideReady Flagship Store
                </p>
                <p className="max-w-xs text-sm text-smoke">
                  42 Gear Street, Koramangala, Bengaluru 560034
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="faq-heading"
        id="faq"
        className="border-t border-line bg-carbon/50 py-20"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            align="center"
            description="Quick answers to the questions we get most. Can't find yours? Send us a message above."
          />
          <div className="mt-10 flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-line bg-carbon transition-colors open:border-lime/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white marker:hidden [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-lime transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-smoke">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
