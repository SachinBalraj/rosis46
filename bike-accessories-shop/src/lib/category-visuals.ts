export type CategoryVisual = {
  icon: string;
  accent: string;
};

const visuals: Record<string, CategoryVisual> = {
  helmets: {
    icon: "HardHat",
    accent: "from-lime-400/40 via-lime-300/10 to-transparent",
  },
  lights: {
    icon: "Flashlight",
    accent: "from-yellow-300/50 via-yellow-200/15 to-transparent",
  },
  locks: {
    icon: "Lock",
    accent: "from-zinc-300/40 via-zinc-200/10 to-transparent",
  },
  pumps: {
    icon: "Wrench",
    accent: "from-sky-400/40 via-sky-300/10 to-transparent",
  },
  gloves: {
    icon: "Hand",
    accent: "from-amber-400/40 via-amber-300/10 to-transparent",
  },
  "bottle-cages": {
    icon: "Droplets",
    accent: "from-teal-400/40 via-teal-300/10 to-transparent",
  },
  saddlebags: {
    icon: "Backpack",
    accent: "from-violet-400/40 via-violet-300/10 to-transparent",
  },
  "repair-kits": {
    icon: "Package",
    accent: "from-rose-400/40 via-rose-300/10 to-transparent",
  },
};

export function getCategoryVisual(categorySlug: string): CategoryVisual {
  return (
    visuals[categorySlug] ?? {
      icon: "Package",
      accent: "from-lime-400/40 via-lime-300/10 to-transparent",
    }
  );
}
