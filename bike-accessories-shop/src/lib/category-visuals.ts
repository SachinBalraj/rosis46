export type CategoryVisual = {
  icon: string;
  accent: string;
};

const visuals: Record<string, CategoryVisual> = {
  helmets: {
    icon: "HardHat",
    accent: "from-brand/40 via-brand/20 to-transparent",
  },
  lights: {
    icon: "Flashlight",
    accent: "from-brand/40 via-white/15 to-transparent",
  },
  locks: {
    icon: "Lock",
    accent: "from-white/15 via-white/5 to-transparent",
  },
  pumps: {
    icon: "Wrench",
    accent: "from-brand/30 via-brand/15 to-transparent",
  },
  gloves: {
    icon: "Hand",
    accent: "from-brand/40 via-brand/15 to-transparent",
  },
  "bottle-cages": {
    icon: "Droplets",
    accent: "from-brand/30 via-white/10 to-transparent",
  },
  saddlebags: {
    icon: "Backpack",
    accent: "from-brand/45 via-brand/20 to-transparent",
  },
  "repair-kits": {
    icon: "Package",
    accent: "from-brand/35 via-white/10 to-transparent",
  },
};

export function getCategoryVisual(categorySlug: string): CategoryVisual {
  return (
    visuals[categorySlug] ?? {
      icon: "Package",
      accent: "from-brand/40 via-brand/20 to-transparent",
    }
  );
}
