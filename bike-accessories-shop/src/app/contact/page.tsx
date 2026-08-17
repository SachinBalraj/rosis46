import type { Metadata } from "next";
import Image from "next/image";
import { ChevronDown, Clock, MapPin, Navigation, Phone, Wrench } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs, mapsDirectionsUrl, mapsEmbedUrl, storeAddress, storePhones } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Visit Rossis Biker Spot opposite KPN Petrol Bunk, Suramangalam Main Road, Thiruvakavundanur, Salem – 636005. Open daily until 9:00 PM.",
};

export default function ContactPage() {
  return (
    <>
      <section
        aria-labelledby="contact-hero"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto grid w-full max-w-7xl items-stretch gap-0 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center gap-6 py-14 lg:py-24 lg:pr-16">
            <p className="eyebrow">Get in touch</p>
            <h1
              id="contact-hero"
              className="display-heading max-w-xl text-5xl text-foreground sm:text-6xl"
            >
              Ride in. We&apos;re here till 9 PM.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-smoke">
              Questions about gear, spares or an upgrade for your bike? Send a
              message below or drop by our store in Salem.
            </p>
          </div>

          <figure className="relative -mx-4 flex aspect-[5/4] items-center justify-center overflow-hidden bg-night sm:-mx-6 lg:mx-0">
            <Image
              src="/images/rosiscontact.png"
              alt="Rossis Biker Spot contact and store information"
              width={1007}
              height={1562}
              priority
              className="relative h-full w-full object-contain object-center"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 ring-1 ring-brand/50 ring-inset"
            />
            <span
              aria-hidden="true"
              className="absolute right-0 bottom-0 h-1.5 w-1/3 bg-brand"
            />
          </figure>
        </div>
      </section>

      <section
        aria-labelledby="store-heading"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Visit the store"
                title={storeAddress.line1}
                description="A local destination for motorcycle enthusiasts in Salem."
              />
              <div className="mt-6 flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-brand">
                    <MapPin aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <address className="text-sm leading-relaxed text-smoke not-italic">
                    {storeAddress.line2}
                    <br />
                    {storeAddress.line3}
                    <br />
                    {storeAddress.line4}
                  </address>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-brand">
                    <Clock aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold tracking-widest text-foreground uppercase">
                    Open Daily · Until 9:00 PM
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-brand">
                    <Phone aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    {storePhones.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="text-sm font-semibold tracking-widest text-foreground uppercase transition-colors hover:text-brand"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 bg-brand px-7 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-brand-deep"
                  >
                    <Navigation aria-hidden="true" className="h-4 w-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            <div
              aria-label="Map showing the Rossis Biker Spot store location"
              className="relative min-h-72 overflow-hidden border border-line bg-night"
            >
              <iframe
                title="Rossis Biker Spot location on Google Maps"
                src={mapsEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
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
              description="Fill in the form with your bike or product question and we'll get back to you."
            />
            <div className="mt-8 border border-line bg-white p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Good to know"
              title="Visiting us"
              description=""
            />
            <ul className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
              <li className="bg-white">
                <div className="flex h-full flex-col p-5 transition-colors hover:bg-carbon-soft">
                  <span className="flex h-11 w-11 items-center justify-center border border-line text-brand">
                    <Clock aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-semibold tracking-wide uppercase">
                    Store hours
                  </h3>
                  <ul className="mt-1.5 space-y-0.5">
                    <li className="text-sm text-smoke">Open daily until 9:00 PM</li>
                    <li className="text-sm text-smoke">Seven days a week</li>
                  </ul>
                </div>
              </li>
              <li className="bg-white">
                <div className="flex h-full flex-col p-5 transition-colors hover:bg-carbon-soft">
                  <span className="flex h-11 w-11 items-center justify-center border border-line text-brand">
                    <Wrench aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-semibold tracking-wide uppercase">
                    On-site installation
                  </h3>
                  <ul className="mt-1.5 space-y-0.5">
                    <li className="text-sm text-smoke">Bring your bike in</li>
                    <li className="text-sm text-smoke">Fitted while you wait</li>
                  </ul>
                </div>
              </li>
              <li className="bg-white">
                <div className="flex h-full flex-col p-5 transition-colors hover:bg-carbon-soft">
                  <span className="flex h-11 w-11 items-center justify-center border border-line text-brand">
                    <MapPin aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-semibold tracking-wide uppercase">
                    Finding us
                  </h3>
                  <ul className="mt-1.5 space-y-0.5">
                    <li className="text-sm text-smoke">
                      Opposite KPN Petrol Bunk
                    </li>
                    <li className="text-sm text-smoke">
                      Suramangalam Main Road, Salem
                    </li>
                  </ul>
                </div>
              </li>
              <li className="bg-white">
                <div className="flex h-full flex-col p-5 transition-colors hover:bg-carbon-soft">
                  <span className="flex h-11 w-11 items-center justify-center border border-line text-brand">
                    <Navigation aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-semibold tracking-wide uppercase">
                    Getting directions
                  </h3>
                  <ul className="mt-1.5 space-y-0.5">
                    <li className="text-sm text-smoke">Search Rossis Biker Spot</li>
                    <li className="text-sm text-smoke">Thiruvakavundanur, Salem 636005</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="faq-heading"
        id="faq"
        className="border-t border-line bg-carbon-soft py-20"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            align="center"
            description="Quick answers to the questions riders ask us most. Can't find yours? Send us a message above."
          />
          <div className="mt-10 flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-line bg-white transition-colors open:border-brand"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display font-semibold tracking-wide text-foreground uppercase marker:hidden [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-brand transition-transform group-open:rotate-180"
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
