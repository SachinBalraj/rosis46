import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { iconMap } from "@/lib/icons";
import { benefits, categories, products, testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "RideReady — Premium Bike Accessories Shop",
  description:
    "Helmets, gloves, lights, locks and bags tested by riders. Free shipping over ₹999 and a 2-year warranty on all RideReady gear.",
};

const featuredProducts = products.filter((product) => product.featured);

const marqueeItems = [
  "Free shipping over ₹999",
  "2-year warranty on all gear",
  "Tested by riders",
  "Same-day dispatch",
  "Certified fit guidance",
];

export default function Home() {
  return (
    <>
      <section
        aria-label="Introduction"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto grid w-full max-w-7xl items-stretch gap-0 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
            <figure className="relative aspect-[4/5] overflow-hidden bg-night sm:aspect-[16/12] lg:aspect-[4/5]">
              <Image
                src="/images/hero-bike.svg"
                alt="RideReady sport bicycle with red-accented wheels"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="img-zoom object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-0 h-1.5 w-1/3 bg-brand"
              />
            </figure>
            <div className="mt-4 flex items-center gap-3">
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-brand" />
              <p className="text-xs font-semibold tracking-[0.25em] text-smoke uppercase">
                RideReady gear — ridden, rained on, crash-tested
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8 py-14 lg:py-24 lg:pl-16">
            <p className="eyebrow">
              Premium cycling accessories · Est. 2019
            </p>
            <h1 className="display-heading max-w-xl text-5xl text-foreground sm:text-6xl lg:text-7xl">
              Built for
              <br />
              every ride
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-smoke">
              Helmets, gloves, lights, locks and bags — every product ridden,
              rained on and crash-tested by our own team before it earns a
              spot on the shelf. Gear that keeps you safe, seen and fast.
            </p>

            <div className="flex items-center gap-5">
              <span
                aria-hidden="true"
                className="hidden h-12 w-1 shrink-0 bg-brand sm:block"
              />
              <Button href="/products" size="lg" variant="brand-outline">
                + Explore products
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>

            <dl className="mt-2 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                { value: "5,000+", label: "Riders geared up" },
                { value: "4.8/5", label: "Average rating" },
                { value: "2-yr", label: "Warranty on gear" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-bold text-foreground">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs tracking-widest text-smoke uppercase">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-hidden="true" className="overflow-hidden bg-night">
        <div className="flex w-max animate-marquee items-center gap-12 py-4">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-12 whitespace-nowrap font-display text-sm font-semibold tracking-[0.3em] text-white uppercase"
            >
              {item}
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-brand" />
            </span>
          ))}
        </div>
      </section>

      <section
        aria-label="Season campaign"
        className="relative overflow-hidden border-y border-line-dark bg-night text-white"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/images/hero-bike.svg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
          <p className="text-xs font-semibold tracking-[0.35em] text-white uppercase">
            The winter gear drop
          </p>
          <h2 className="display-heading mx-auto mt-5 max-w-3xl text-5xl text-brand sm:text-6xl lg:text-7xl">
            Ride into the dark, lit
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80">
            High-beam lights, thermal gloves and storm-proof bags — up to 30%
            off for a limited time. Built for the riders who don&apos;t stop
            when the sun does.
          </p>
          <div className="mt-10">
            <Button
              href="/products"
              size="lg"
              className="border border-white bg-transparent text-white hover:bg-white hover:text-black"
            >
              Shop the drop
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="categories-heading"
        className="bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Popular categories"
              title="Everything your bike needs"
              description="From your first commute to your longest tour, we've got the gear to keep you safe and comfortable."
            />
            <Button href="/products" variant="secondary">
              Browse all products
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = iconMap[category.icon];
              return (
                <li key={category.slug} className="bg-white">
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group flex h-full flex-col gap-4 bg-white p-6 transition-colors duration-300 hover:bg-night"
                  >
                    <span className="flex h-12 w-12 items-center justify-center border border-line text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span>
                      <span className="block font-display text-lg font-semibold tracking-wide text-foreground uppercase transition-colors group-hover:text-white">
                        {category.label}
                      </span>
                      <span className="mt-1 block text-sm text-smoke transition-colors group-hover:text-white/70">
                        {category.count} products
                      </span>
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold tracking-widest text-brand uppercase">
                      Shop now
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="featured-heading"
        className="border-t border-line bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Rider favorites"
              title="Featured products"
              description="The gear our riders reach for every single day. Handpicked for quality, tested for real roads."
            />
            <Button href="/products" variant="secondary">
              View all products
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-12">
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="benefits-heading"
        className="border-t border-line bg-carbon-soft"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why RideReady"
            title="Built for the way you ride"
            align="center"
            description="We obsess over the details so you can focus on the road ahead."
          />
          <ul className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = iconMap[benefit.icon];
              return (
                <li key={benefit.title} className="bg-white">
                  <div className="flex h-full flex-col p-6 transition-colors duration-300 hover:bg-night hover:text-white">
                    <span className="flex h-12 w-12 items-center justify-center border border-line text-brand">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-base font-semibold tracking-wide uppercase">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-smoke">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="testimonials-heading"
        className="border-t border-line bg-white"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Rider reviews"
            title="Trusted by riders across India"
            align="center"
            description="Real reviews from people who actually ride what we sell."
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.name}
                className="flex flex-col border border-line bg-white p-8"
              >
                <Quote aria-hidden="true" className="h-8 w-8 text-brand" />
                <p className="mt-4 flex-1 leading-relaxed text-foreground">
                  “{testimonial.quote}”
                </p>
                <div
                  className="mt-6 flex items-center gap-1"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className="h-4 w-4 fill-brand text-brand"
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-line pt-6">
                  <span className="flex h-11 w-11 items-center justify-center bg-night font-display text-sm font-bold text-white">
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="font-display font-semibold tracking-wide text-foreground uppercase">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-smoke">{testimonial.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="newsletter-heading"
        className="border-t border-line-dark bg-night text-white"
      >
        <div className="bg-grid-dark relative overflow-hidden">
          <div className="relative mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="eyebrow">Stay in the loop</p>
            <h2
              id="newsletter-heading"
              className="display-heading mx-auto mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl"
            >
              Gear drops, ride tips & exclusive deals
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-smoke">
              Join 12,000+ riders. One email a week, no spam, unsubscribe
              anytime.
            </p>
            <div className="mt-10">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
