"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/images/newbestseller1.PNG",
    alt: "Best Seller 1",
  },
  {
    src: "/images/newbestseller2.PNG",
    alt: "Best Seller 2",
  },
  {
    src: "/images/newbestseller3.PNG",
    alt: "Best Seller 3",
  },
  {
    src: "/images/newbestseller4.PNG",
    alt: "Best Seller 4",
  },
];

export function BestSellerCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const delay = 3000 + Math.random() * 2000;
    const timer = setTimeout(next, delay);
    return () => clearTimeout(timer);
  }, [current, next]);

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl overflow-hidden rounded-lg border border-line">
      <div className="relative w-full overflow-hidden bg-black aspect-[4/3] md:aspect-[16/9]">
        <div
          className="flex h-full w-full flex-col transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
              className="h-full w-full shrink-0 object-contain object-center"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-brand"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-brand"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-brand"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}