"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  {
    src: "/images/rossisbestseller1.png",
    alt: "Rossis Best Seller 1",
  },
  {
    src: "/images/rossisbestseller2.png",
    alt: "Rossis Best Seller 2",
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
    <div className="mt-4 overflow-hidden border border-line bg-night">
      <div className="relative h-[300px] w-full md:h-[500px]">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={i === 0}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 py-3">
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
