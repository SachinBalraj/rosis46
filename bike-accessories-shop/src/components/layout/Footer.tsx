import Link from "next/link";
import { MapPin, Mail, Phone, ChevronRight } from "lucide-react";
import { categories } from "@/lib/data";

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "https://www.x.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
        <path d="M18.9 1.2h3.7l-8.1 9.3 9.6 12.7h-7.5l-5.9-7.7L5 23.2H1.3l8.7-10L.8 1.2h7.7l5.3 7 6.1-7zm-1.3 20h2L6.5 3.2h-2.1l13.2 18z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-dark bg-night text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-lg font-bold tracking-widest uppercase"
            >
              <span className="flex h-9 w-9 items-center justify-center bg-brand text-white">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
                </svg>
              </span>
              RideReady
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-smoke">
              Premium bike accessories, tested by riders and backed by a
              2-year warranty. Gear that keeps you safe, seen and fast on
              every ride.
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-smoke">
              <li className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="h-4 w-4 text-brand" />
                42 Gear Street, Koramangala, Bengaluru 560034
              </li>
              <li className="flex items-center gap-2">
                <Phone aria-hidden="true" className="h-4 w-4 text-brand" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail aria-hidden="true" className="h-4 w-4 text-brand" />
                support@rideready.in
              </li>
            </ul>
          </div>

          <nav aria-label="Shop categories">
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase">
              Shop
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="link-underline flex w-fit items-center gap-1 text-sm text-smoke transition-colors hover:text-white"
                  >
                    {category.label}
                    <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/about" className="link-underline text-sm text-smoke transition-colors hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-underline text-sm text-smoke transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="link-underline text-sm text-smoke transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/account" className="link-underline text-sm text-smoke transition-colors hover:text-white">
                  Your account
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase">
              Follow the ride
            </h3>
            <div className="mt-4 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center border border-line-dark text-smoke transition-all hover:border-brand hover:text-brand"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-smoke">
              Secure payments via Razorpay. Cash on delivery available in most
              cities.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line-dark pt-8 text-sm text-smoke sm:flex-row">
          <p>© {year} RideReady. All rights reserved.</p>
          <p className="uppercase tracking-widest">
            Made for riders, in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
