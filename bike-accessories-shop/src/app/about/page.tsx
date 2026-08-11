import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CheckCircle2, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { team } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "The RideReady story — built by riders for riders. Learn about our mission, our quality promise and the team behind the gear.",
};

const values = [
  {
    icon: Target,
    title: "Ride more, worry less",
    description:
      "Every decision we make starts with one question: does this make the next ride better? If it doesn't, it doesn't ship.",
  },
  {
    icon: BadgeCheck,
    title: "Tested, not just listed",
    description:
      "Products don't go on the shelf until our own team has ridden them through heat, rain and rough roads.",
  },
  {
    icon: CheckCircle2,
    title: "Honesty over hype",
    description:
      "We publish real ratings, honest specs and transparent pricing. If a product has limits, we say so.",
  },
];

const promiseItems = [
  "In-mold construction and impact liners on every helmet we sell",
  "Hardened steel cores and independently rated locks",
  "Waterproofing verified against a 40km rain simulation",
  "USB-C charging on every light for universal compatibility",
  "2-year replacement warranty on helmets, locks and bags",
];

export default function AboutPage() {
  return (
    <>
      <section
        aria-labelledby="about-hero"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6">
            <p className="eyebrow">About RideReady</p>
            <h1
              id="about-hero"
              className="display-heading max-w-xl text-5xl text-foreground sm:text-6xl lg:text-7xl"
            >
              Built by riders, for riders
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-smoke">
              RideReady started in a Bengaluru garage with a broken helmet
              strap, a borrowed wrench and a simple frustration: riders were
              being sold gear that hadn&apos;t earned the road. We decided to
              change that.
            </p>
          </div>
          <figure className="relative aspect-[4/3] overflow-hidden bg-night">
            <Image
              src="/images/hero-bike.svg"
              alt="RideReady bicycle being built and tested"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="img-zoom object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute right-0 bottom-0 h-1.5 w-1/3 bg-brand"
            />
          </figure>
        </div>
      </section>

      <section
        aria-labelledby="story-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Our story"
            title="From garage project to gear you can trust"
            description=""
          />
          <div className="flex flex-col gap-5 leading-relaxed text-smoke">
            <p>
              In 2019, our founder Vikram was preparing for a national track
              cycling championship when a low-cost helmet failed him in training.
              The strap broke at speed. He walked away, but too many riders
              wouldn&apos;t have. That close call became the founding question of
              RideReady:{" "}
              <strong className="text-foreground">why is most bike gear so poorly made?</strong>
            </p>
            <p>
              So we started testing. We bought gear from around the world, broke
              it apart on benches, and rode thousands of kilometres with what
              survived. We partnered with manufacturers willing to build to our
              spec — not just to a price tag — and put the RideReady name only on
              products that passed our own crash, rain and long-distance tests.
            </p>
            <p>
              Today, more than 5,000 riders across India depend on our helmets,
              lights, locks and bags. Every order still ships from our
              Bengaluru warehouse, and every product still earns its place the
              same way it did on day one: on the road.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="mission-heading"
        className="border-y border-line bg-carbon-soft py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our mission"
            title="Why we exist"
            align="center"
            description="Three principles guide everything we build, test and sell."
          />
          <ul className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
            {values.map((value) => (
              <li key={value.title} className="bg-white">
                <div className="flex h-full flex-col p-7 transition-colors duration-300 hover:bg-night hover:text-white">
                  <span className="flex h-12 w-12 items-center justify-center border border-line text-brand">
                    <value.icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-wide uppercase">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">
                    {value.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="quality-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Quality promise"
              title="If it fails on the road, it never reaches your bike"
              description="Our quality standard is simple: every product must survive a full season of hard riding. Here's what that means in practice."
            />
            <ul className="mt-8 flex flex-col gap-3">
              {promiseItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border border-line bg-white p-4"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line-dark bg-night p-10 text-white">
            <p className="border-l-4 border-brand pl-4 font-display text-6xl font-bold text-brand">
              9,600+
            </p>
            <p className="mt-4 font-display text-lg font-semibold tracking-wide uppercase">
              kilometres of combined test riding per product line
            </p>
            <p className="mt-4 text-sm leading-relaxed text-smoke">
              Each new product is ridden across highways, monsoons and pothole
              city streets before it earns the RideReady badge. This is how we
              keep our 2-year warranty honest.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="team-heading"
        className="border-t border-line bg-carbon-soft py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The team"
            title="The people behind the gear"
            align="center"
            description="Riders, engineers and support nerds who would rather be on two wheels than in meetings."
          />
          <ul className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <li key={member.name} className="bg-white">
                <div className="flex h-full flex-col p-6 transition-colors hover:bg-night hover:text-white">
                  <span className="flex h-16 w-16 items-center justify-center bg-night font-display text-xl font-bold text-white">
                    {member.initials}
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold tracking-wide uppercase">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-brand">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-smoke">
                    {member.bio}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="about-cta"
        className="border-t border-line-dark bg-night text-white"
      >
        <div className="bg-grid-dark relative overflow-hidden">
          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <p className="eyebrow">Ready to gear up?</p>
            <h2
              id="about-cta"
              className="display-heading mx-auto mt-5 max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl"
            >
              Join 5,000+ riders who trust the gear
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-smoke">
              RideReady gear keeps riders safe and fast on every ride. Find
              yours today.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/products" size="lg">
                Shop the collection
              </Button>
              <Button
                href="/contact"
                size="lg"
                className="border border-white bg-transparent text-white hover:bg-white hover:text-black"
              >
                Talk to the team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
