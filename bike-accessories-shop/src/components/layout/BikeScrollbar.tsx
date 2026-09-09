"use client";

import { useEffect, useRef } from "react";
import { Motorbike } from "lucide-react";

const BIKE_HEIGHT = 24;
const MOVE_FACTOR = 0.25;

export function BikeScrollbar() {
  const bikeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let bikeY = 0;
    let ticking = false;

    const applyTransform = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      bikeY += delta * MOVE_FACTOR;

      const minY = 0;
      const maxY = Math.max(0, window.innerHeight - BIKE_HEIGHT);
      bikeY = Math.max(minY, Math.min(maxY, bikeY));

      if (bikeRef.current) {
        bikeRef.current.style.transform = `translate3d(0, ${bikeY}px, 0)`;
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const scheduleTransform = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyTransform);
      }
    };

    const onResize = () => {
      lastScrollY = window.scrollY;
      bikeY = Math.max(0, Math.min(bikeY, window.innerHeight - BIKE_HEIGHT));
      if (bikeRef.current) {
        bikeRef.current.style.transform = `translate3d(0, ${bikeY}px, 0)`;
      }
    };

    scheduleTransform();
    window.addEventListener("scroll", scheduleTransform, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", scheduleTransform);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 right-0 z-[100] h-screen w-8">
      <Motorbike
        ref={bikeRef}
        aria-hidden="true"
        className="absolute right-0 h-6 w-6 rotate-90 text-brand transition-transform duration-75"
      />
    </div>
  );
}