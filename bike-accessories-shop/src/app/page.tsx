import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Quote,
  Star,
} from "lucide-react";
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

export default function Home() {
  return (
    <>
      <section
        aria-label="Hero"
        className="relative overflow-hidden border-b border-line"
      >
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-lime/20 blur-[120px]"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28">
          <div className="flex flex-col items-start gap-6 animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-lime uppercase">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
              Gear up for the ride
            </p>
            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ride harder.{" "}
              <span className="text-lime">Look sharper.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-smoke">
              Premium helmets, gloves, lights, locks and bags — every product
              ridden, rained on and crash-tested by our own team before it
              earns a spot on the shelf.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/products" size="lg">
                Shop the collection
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button href="/about" size="lg" variant="secondary">
                Our story
              </Button>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                { value: "5,000+", label: "Riders geared up" },
                { value: "4.8/5", label: "Average rating" },
                { value: "2-yr", label: "Warranty on gear" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-lime">{stat.value}</dd>
                  <dd className="mt-1 text-xs text-smoke">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-fade-in">
            <div
              aria-hidden="true"
              className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-lime/10 blur-[100px]"
            />
            <Image
              src="/images/hero-bike.svg"
              alt="Sport bicycle with lime accented wheels, the RideReady hero"
              width={640}
              height={480}
              priority
              className="relative w-full max-w-2xl drop-shadow-2xl animate-float"
            />
            <div className="absolute top-8 left-4 rounded-2xl border border-line bg-night/80 px-4 py-3 backdrop-blur sm:left-0">
              <p className="text-xs text-smoke">Free shipping over</p>
              <p className="text-lg font-bold text-lime">₹999</p>
            </div>
            <div className="absolute right-4 bottom-10 rounded-2xl border border-line bg-night/80 px-4 py-3 backdrop-blur sm:right-0">
              <p className="text-xs text-smoke">Every product backed by</p>
              <p className="text-lg font-bold text-white">2-year warranty</p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Popular categories"
            title="Everything your bike needs"
            description="From your first commute to your longest tour, we've got the gear to keep you safe and comfortable."
          />
          <Button href="/products" variant="ghost">
            Browse all products
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <li key={category.slug}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-line bg-carbon p-5 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 hover:shadow-[0_16px_40px_-20px_rgb(200_240_49/0.3)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-night">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-bold text-white">
                      {category.label}
                    </span>
                    <span className="mt-1 block text-sm text-smoke">
                      {category.count} products
                    </span>
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-lime">
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
      </section>

      <section
        aria-labelledby="featured-heading"
        className="border-y border-line bg-carbon/50 py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <div className="mt-10">
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="benefits-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="Why RideReady"
          title="Built for the way you ride"
          align="center"
          description="We obsess over the details so you can focus on the road ahead."
        />
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <li
                key={benefit.title}
                className="rounded-2xl border border-line bg-carbon p-6 transition-colors hover:border-lime/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/10 text-lime">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-bold text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">
                  {benefit.description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="testimonials-heading"
        className="border-y border-line bg-carbon/50 py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Rider reviews"
            title="Trusted by riders across India"
            align="center"
            description="Real reviews from people who actually ride what we sell."
          />
          <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.name}
                className="flex flex-col rounded-2xl border border-line bg-carbon p-6"
              >
                <Quote aria-hidden="true" className="h-8 w-8 text-lime/60" />
                <p className="mt-4 flex-1 leading-relaxed text-white">
                  “{testimonial.quote}”
                </p>
                <div className="mt-6 flex items-center gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className="h-4 w-4 fill-lime text-lime"
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-sm font-bold text-night">
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="font-semibold text-white">
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
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-carbon via-carbon-soft to-lime/10 px-6 py-16 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="bg-grid absolute inset-0 opacity-60"
          />
          <div className="relative">
            <SectionHeading
              eyebrow="Stay in the loop"
              title="Gear drops, ride tips & exclusive deals"
              description="Join 12,000+ riders. One email a week, no spam, unsubscribe anytime."
              align="center"
            />
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
