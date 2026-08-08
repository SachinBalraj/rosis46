import type { Metadata } from "next";
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
        className="relative overflow-hidden border-b border-line"
      >
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand/15 blur-[120px]"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
            About RideReady
          </p>
          <h1
            id="about-hero"
            className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Built by riders,{" "}
            <span className="text-brand">for riders.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-smoke">
            RideReady started in a Bengaluru garage with a broken helmet strap,
            a borrowed wrench and a simple frustration: riders were being sold
            gear that hadn&apos;t earned the road. We decided to change that.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="story-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
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
              RideReady: <strong className="text-white">why is most bike gear so poorly made?</strong>
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
        className="border-y border-line bg-carbon/50 py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our mission"
            title="Why we exist"
            align="center"
            description="Three principles guide everything we build, test and sell."
          />
          <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {values.map((value) => (
              <li
                key={value.title}
                className="rounded-2xl border border-line bg-carbon p-6 transition-colors hover:border-brand/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <value.icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">
                  {value.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="quality-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
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
                  className="flex items-start gap-3 rounded-xl border border-line bg-carbon p-4"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                  />
                  <span className="text-sm leading-relaxed text-white">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-brand/30 bg-gradient-to-br from-carbon to-brand/10 p-8">
            <p className="text-6xl font-extrabold text-brand">9,600+</p>
            <p className="mt-2 font-semibold text-white">
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
        className="border-t border-line bg-carbon/50 py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The team"
            title="The people behind the gear"
            align="center"
            description="Riders, engineers and support nerds who would rather be on two wheels than in meetings."
          />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <li
                key={member.name}
                className="rounded-2xl border border-line bg-carbon p-6 transition-colors hover:border-brand/40"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-xl font-extrabold text-white">
                  {member.initials}
                </span>
                <h3 className="mt-5 font-bold text-white">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-brand">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-smoke">
                  {member.bio}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="about-cta"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-brand/30 bg-gradient-to-br from-carbon via-carbon-soft to-brand/10 px-6 py-14 text-center sm:px-12">
          <h2
            id="about-cta"
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Ready to gear up?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-smoke">
            Join 5,000+ riders who trust RideReady for the gear that keeps them
            safe and fast on every ride.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/products" size="lg">
              Shop the collection
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Talk to the team
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
