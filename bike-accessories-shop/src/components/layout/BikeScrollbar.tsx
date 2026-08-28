"use client";

import { useEffect, useState } from "react";
import { Motorbike } from "lucide-react";

export function BikeScrollbar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 right-0 z-[100] h-screen w-8 border-l border-gray-200 bg-white/50 backdrop-blur-sm">
      <Motorbike
        aria-hidden="true"
        className="absolute right-0 h-6 w-6 rotate-90 text-brand transition-all duration-75"
        style={{ top: `calc(${scrollProgress}% - 12px)` }}
      />
    </div>
  );
}