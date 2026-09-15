"use client";

import { useEffect, useRef } from "react";
import { Motorbike } from "lucide-react";

const BIKE_SIZE = 24;
const EDGE_PADDING = 12;

export function BikeScrollbar() {
  const bikeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentY = 0;
    let targetY = 0;
    let rafId = 0;

    const getMaxTravel = () =>
      Math.max(0, window.innerHeight - BIKE_SIZE - EDGE_PADDING);

    const updateTarget = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;
      targetY = progress * getMaxTravel();
    };

    const tick = () => {
      currentY += (targetY - currentY) * 0.18;
      if (Math.abs(targetY - currentY) < 0.5) {
        currentY = targetY;
      }
      if (bikeRef.current) {
        bikeRef.current.style.transform = `translate3d(0, ${currentY}px, 0)`;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const onScroll = () => updateTarget();
    const onResize = () => updateTarget();

    updateTarget();
    rafId = window.requestAnimationFrame(tick);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 right-0 z-[100] h-screen w-8">
      <div
        ref={bikeRef}
        className="absolute top-0 right-0 h-6 w-6"
        style={{ willChange: "transform" }}
      >
        <Motorbike
          aria-hidden="true"
          className="h-6 w-6 rotate-90 text-brand"
        />
      </div>
    </div>
  );
}