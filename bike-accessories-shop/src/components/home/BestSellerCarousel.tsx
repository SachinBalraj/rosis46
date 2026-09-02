"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

  useEffect(() => {
    const delay = 3000 + Math.random() * 2000;
    const timer = setTimeout(next, delay);
    return () => clearTimeout(timer);
  }, [current, next]);

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl overflow-hidden rounded-lg border border-line bg-night">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9]">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={i === 0}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
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
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
