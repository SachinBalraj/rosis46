import type { ReactNode } from "react";
import Link from "next/link";
import { storePhones } from "@/lib/data";

type PolicyPageProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function PolicyPage({ id, title, children }: PolicyPageProps) {
  return (
    <>
      <section
        aria-labelledby={`${id}-title`}
        className="border-b border-line bg-white"
      >
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="eyebrow">Policies</p>
          <h1
            id={`${id}-title`}
            className="display-heading text-solid-black mt-5 max-w-2xl text-4xl sm:text-5xl"
          >
            {title}
          </h1>
        </div>
      </section>

      <section
        aria-label={`${title} content`}
        className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div className="flex flex-col gap-5 text-base leading-relaxed text-smoke">
          {children}
        </div>
      </section>

      <section
        aria-labelledby={`${id}-help`}
        className="border-t border-line bg-carbon-soft py-8"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2
            id={`${id}-help`}
            className="font-display text-xl font-semibold tracking-wide text-foreground uppercase sm:text-2xl"
          >
            Need help?
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-smoke">
            Contact{" "}
            <span className="font-semibold text-foreground">
              Rossis Biker Spot
            </span>{" "}
            — Salem, Tamil Nadu, India. We&apos;re happy to answer questions
            about your orders, returns or anything else.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {storePhones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className="flex w-fit items-center gap-2 text-[15px] font-semibold text-foreground transition-colors hover:text-brand"
              >
                {phone.display}
              </a>
            ))}
          </div>
          <Link
            href="/contact"
            className="link-underline mt-5 inline-flex w-fit items-center text-sm font-semibold tracking-widest text-brand uppercase transition-colors hover:text-brand-deep"
          >
            Contact &amp; directions
          </Link>
        </div>
      </section>
    </>
  );
}