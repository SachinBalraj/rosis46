import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { storePhones, team } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rossis Biker Spot is a local destination for motorcycle enthusiasts in Salem—riding gear, spare parts, custom decals and on-site installation.",
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "Rider safety first",
    description:
      "We only stock ISI/E-marked helmets and certified riding gear, and we fit them properly before you ride.",
  },
  {
    icon: BadgeCheck,
    title: "Quality you can trust",
    description:
      "Every accessory and part we sell is picked to survive real Salem roads—no short-cuts, no fading quickly.",
  },
  {
    icon: CheckCircle2,
    title: "Practical spare parts",
    description:
      "Hard-to-find spares for everyday repairs and maintenance, sourced and stocked so you're never stuck.",
  },
  {
    icon: Wrench,
    title: "Personalised modifications",
    description:
      "Custom decals, lighting, grips and upgrades built around how you actually ride your bike.",
  },
];

const installationServices = [
  "Helmet fitting and visor swaps",
  "Grip and lever installation",
  "LED light and mobile holder fitment",
  "Custom decal design and application",
  "Exhaust accessories and spare part replacement",
];

export default function AboutPage() {
  return (
    <>
      <section
        aria-labelledby="about-hero"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto grid w-full max-w-7xl items-stretch gap-0 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center gap-6 py-14 lg:py-24 lg:pr-16">
            <p className="eyebrow">About Rossis Biker Spot</p>
            <h1
              id="about-hero"
              className="display-heading max-w-xl text-5xl text-foreground sm:text-6xl lg:text-7xl"
            >
              Salem&apos;s local destination for riders
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-smoke">
              From daily commuters to weekend enthusiasts, riders across Salem
              come to us for quality gear, genuine spare parts and hands-on
              service—all under one roof.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/products" size="lg" variant="brand-outline">
                Shop accessories
              </Button>
              <Button href="/contact" size="lg" variant="secondary">
                Visit the store
              </Button>
            </div>
          </div>

          <figure className="relative -mx-4 flex aspect-[1672/941] items-center justify-center self-center overflow-hidden bg-night sm:-mx-6 lg:mx-0">
            <Image
              src="/images/rosisabout.png"
              alt="Rossis Biker Spot storefront"
              width={1672}
              height={941}
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
        aria-labelledby="story-heading"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Our story"
            title="Built for riders. Ready for every road."
            description=""
          />
          <div className="flex flex-col gap-5 leading-relaxed text-smoke">
            <p>
              Rossis Biker Spot is a local destination for motorcycle
              enthusiasts in Salem. We&apos;re the shop you ride into when you
              need a new helmet, a missing spare part, or a bike that feels
              like yours again.
            </p>
            <p>
              What started as a neighbourhood accessories store has grown into
              a full biker spot: sports helmets fitted to your head, riding
              gear for every season, practical spare parts that are hard to
              find elsewhere, and custom decals and modifications done
              in-house.
            </p>
            <p>
              Located opposite KPN Petrol Bunk on Suramangalam Main Road, we
              stay open daily until 9:00 PM—so even after work, your bike can
              get what it needs. Bring it in, tell us the plan, and leave
              upgraded.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="pillars-heading"
        className="border-y border-line bg-carbon-soft py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What we stand for"
            title="Why riders trust us"
            align="center"
            description="Four promises we keep on every visit, every fitting and every install."
          />
          <ul className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="bg-white">
                <div className="flex h-full flex-col p-7 transition-colors duration-300 hover:bg-night hover:text-white">
                  <span className="flex h-12 w-12 items-center justify-center border border-line text-brand">
                    <pillar.icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-wide uppercase">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">
                    {pillar.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="installation-heading"
        id="installation"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="On-site installation"
              title="Bring your bike. Leave upgraded."
              description="We fit, wire and apply everything ourselves—so you ride out confident, not curious."
            />
            <ul className="mt-8 flex flex-col gap-3">
              {installationServices.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3 border border-line bg-white p-4"
                >
                  <Wrench
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
            <Button href="/contact" size="lg" variant="brand-outline" className="mt-8">
              Plan your visit
            </Button>
          </div>
          <div className="relative overflow-hidden border border-line-dark bg-night p-10 text-white">
            <p className="flex items-center gap-3 border-l-4 border-brand pl-4 font-display text-4xl font-bold text-white sm:text-5xl">
              Open daily
            </p>
            <p className="mt-2 pl-8 font-display text-lg font-semibold tracking-wide text-brand uppercase">
              Until 9:00 PM
            </p>
            <ul className="mt-8 flex flex-col gap-4 text-sm leading-relaxed text-smoke">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>
                  Opposite KPN Petrol Bunk, Buddhar Street / Suramangalam Main
                  Road, Thiruvakavundanur, Salem – 636005
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>Open all seven days until 9:00 PM.</span>
              </li>
            </ul>
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
            title="The people behind the spot"
            align="center"
            description="Riders and mechanics who'd rather be at the workbench than anywhere else."
          />
          <ul className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
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
              Built for riders. Ready for every road.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-smoke">
              Ride in today and leave with better gear—fitted, installed and
              ready for the road ahead.
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
                Visit our store
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {storePhones.map((phone) => (
                <a
                  key={phone.href}
                  href={phone.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-brand uppercase transition-colors hover:text-white"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  {phone.display}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
