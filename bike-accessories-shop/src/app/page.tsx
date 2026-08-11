import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, Quote, Star, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { iconMap } from "@/lib/icons";
import { getActiveProducts, toCatalogProduct } from "@/lib/db";
import { benefits, homeCategories, testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "46 Rossis Biker Spot — Salem's Rider HQ",
  description:
    "Premium riding gear, helmets, accessories, spare parts, and custom bike upgrades—all in one place at 46 Rossis Biker Spot, Salem.",
};

const marqueeItems = [
  "Sports helmets",
  "Riding gear",
  "Custom decals",
  "Spare parts",
  "On-site installation",
  "Open daily till 9 PM",
];

const installationServices = [
  "Helmet fitting and visor swaps",
  "Grip and lever installation",
  "LED light and mobile holder fitment",
  "Custom decal design and application",
  "Exhaust accessories and spare part replacement",
];

export default async function Home() {
  const featuredProducts = (await getActiveProducts({ featured: true })).map(
    toCatalogProduct
  );

  return (
    <>
      <section
        aria-label="Introduction"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto grid w-full max-w-7xl items-stretch gap-0 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
            <figure className="relative flex aspect-[5/4] items-center justify-center overflow-hidden bg-night">
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(225_6_0/0.22),transparent_65%)]"
              />
              <Image
                src="/images/rossis-46-logo.jpg"
                alt="46 Rossis Biker Spot logo"
                width={1600}
                height={1257}
                priority
                className="relative h-full w-full object-contain"
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
            <div className="mt-4 flex items-center gap-3">
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-brand" />
              <p className="text-xs font-semibold tracking-[0.25em] text-smoke uppercase">
                Built for riders. Ready for every road.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col justify-center gap-8 py-14 lg:py-24 lg:pl-16">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 right-0 hidden font-display text-[10rem] leading-none font-bold text-brand/5 select-none lg:block"
            >
              46
            </span>
            <p className="eyebrow">Salem&apos;s Rider HQ</p>
            <h1 className="display-heading max-w-xl text-5xl text-foreground sm:text-6xl lg:text-7xl">
              Gear up.
              <br />
              Ride bold.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-smoke">
              Premium riding gear, helmets, accessories, spare parts, and custom
              bike upgrades—all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <span
                aria-hidden="true"
                className="hidden h-12 w-1 shrink-0 bg-brand sm:block"
              />
              <Button href="/products" size="lg" variant="brand-outline">
                Shop accessories
              </Button>
              <Button
                href="/contact"
                size="lg"
                variant="secondary"
                className="bg-white"
              >
                <MapPin aria-hidden="true" className="h-4 w-4" />
                Visit our store
              </Button>
            </div>

            <dl className="mt-2 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                { value: "Gear", label: "Helmets & riding gear" },
                { value: "Spares", label: "Genuine spare parts" },
                { value: "Fit", label: "On-site installation" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-bold text-brand">
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
        aria-label="Brand statement"
        className="relative overflow-hidden border-y border-line-dark bg-night text-white"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-night bg-[url('/images/rosisbg.png')] bg-cover bg-[center_35%] sm:bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/65 sm:bg-black/70"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
          <p className="text-xs font-semibold tracking-[0.35em] text-brand uppercase">
            46 Rossis Biker Spot
          </p>
          <h2 className="display-heading mx-auto mt-5 max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl">
            Built for riders. Ready for every road.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80">
            Sports helmets, riding gear, custom decals, spare parts and
            modifications—with on-site installation at our store in Salem.
          </p>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <Button href="/products" size="lg">
              Shop accessories
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button
              href="/contact"
              size="lg"
              className="border border-white bg-transparent text-white hover:bg-white hover:text-black"
            >
              Visit our store
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
              eyebrow="46 · What we stock"
              title="Everything your bike needs"
              description="From your first helmet to custom decals and genuine spares—fit and installed for you in Salem."
            />
            <Button href="/products" variant="secondary">
              Browse all products
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 xl:grid-cols-6">
            {homeCategories.map((category) => {
              const Icon = iconMap[category.icon];
              return (
                <li key={category.slug} className="bg-white">
                  <Link
                    href={category.href}
                    className="group flex h-full flex-col gap-4 bg-white p-6 transition-colors duration-300 hover:bg-night"
                  >
                    <span className="flex h-12 w-12 items-center justify-center border border-line text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="flex flex-1 flex-col justify-center">
                      <span className="block font-display text-lg font-semibold tracking-wide text-foreground uppercase transition-colors group-hover:text-white">
                        {category.label}
                      </span>
                      <span className="mt-1 block text-sm text-smoke transition-colors group-hover:text-white/70">
                        {category.blurb}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="installation-heading"
        id="installation"
        className="relative overflow-hidden border-y border-line-dark bg-night text-white"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgb(225_6_0/0.2),transparent_55%)]"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-6">
            <p className="eyebrow">On-site installation</p>
            <h2
              id="installation-heading"
              className="display-heading max-w-xl text-4xl text-white sm:text-5xl lg:text-6xl"
            >
              Bring your bike. Leave upgraded.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/75">
              We don&apos;t just sell—we fit. Roll in with your bike and our
              team handles the rest: fitting, wiring, decals and part
              replacement, all on-site at our Salem store.
            </p>
            <ul className="flex flex-col gap-3">
              {installationServices.map((service) => (
                <li key={service} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 bg-brand" />
                  <span className="text-sm leading-relaxed text-white/80">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg">
                Plan your visit
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button
                href="/products"
                size="lg"
                className="border border-white bg-transparent text-white hover:bg-white hover:text-black"
              >
                Shop the gear
              </Button>
            </div>
          </div>

          <div className="relative border border-line-dark bg-charcoal p-10 text-white">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 right-4 font-display text-8xl leading-none font-bold text-brand/15 select-none"
            >
              46
            </span>
            <span className="flex h-14 w-14 items-center justify-center bg-brand text-white">
              <Wrench aria-hidden="true" className="h-7 w-7" />
            </span>
            <p className="mt-6 font-display text-2xl font-bold tracking-wide uppercase">
              Open daily until 9:00 PM
            </p>
            <p className="mt-3 text-sm leading-relaxed text-smoke">
              Opposite KPN Petrol Bunk, Buddhar Street / Suramangalam Main Road,
              Thiruvakavundanur, Salem – 636005.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold tracking-widest text-brand uppercase transition-colors hover:text-white"
            >
              Get directions
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section
          aria-labelledby="featured-heading"
          className="bg-white"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Rider favorites"
                title="Featured gear"
                description="The products our Salem riders reach for most—handpicked for quality and everyday use."
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
      ) : null}

      <section
        aria-labelledby="benefits-heading"
        className="border-t border-line bg-carbon-soft"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why 46 Rossis Biker Spot"
            title="Built for riders. Ready for every road."
            align="center"
            description="A local destination for motorcycle enthusiasts in Salem—gear, spares and hands-on service."
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
            title="Trusted by riders across Salem"
            align="center"
            description="Real words from riders who gear up and get upgraded at our store."
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
              New arrivals, ride tips & store offers
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-smoke">
              Be the first to know about fresh gear and custom builds at 46
              Rossis Biker Spot.
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
