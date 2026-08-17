import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Phone, ChevronRight } from "lucide-react";
import { categories, storePhones } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-dark bg-night text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-sm font-bold tracking-widest whitespace-nowrap uppercase sm:text-base lg:text-lg"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-white">
                <Image
                  src="/images/rossis-46-logo.jpg"
                  alt=""
                  width={36}
                  height={28}
                  className="h-full w-full object-contain"
                />
              </span>
              Rossis Biker Spot
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-smoke">
              Built for riders. Ready for every road. Sports helmets, riding
              gear, spare parts, custom decals and on-site installation at our
              store in Salem.
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-smoke">
              <li className="flex items-start gap-2">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Opposite KPN Petrol Bunk, Buddhar Street /
                Suramangalam Main Road, Thiruvakavundanur, Salem – 636005
              </li>
              <li className="flex items-center gap-2">
                <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                Open daily until 9:00 PM
              </li>
              <li>
                <a
                  href={storePhones[0].href}
                  className="flex items-center gap-2 text-sm text-smoke transition-colors hover:text-white"
                >
                  <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                  {storePhones[0].display}
                </a>
              </li>
              <li>
                <a
                  href={storePhones[1].href}
                  className="flex items-center gap-2 text-sm text-smoke transition-colors hover:text-white"
                >
                  <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                  {storePhones[1].display}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Shop categories">
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase">
              Shop
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {categories.slice(0, 5).map((category) => (
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

          <nav aria-label="More categories">
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase">
              More
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {categories.slice(5).map((category) => (
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
                  Contact & directions
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
            <p className="mt-6 text-sm leading-relaxed text-smoke">
              On-site installation available — bring your bike in and leave
              upgraded.
            </p>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line-dark pt-8 text-sm text-smoke sm:flex-row">
          <p>© {year} Rossis Biker Spot. All rights reserved.</p>
          <p className="uppercase tracking-widest">
            Built for riders, ready for every road.
          </p>
        </div>
      </div>
    </footer>
  );
}
