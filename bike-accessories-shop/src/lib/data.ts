export const categories = [
  {
    slug: "sports-helmets",
    label: "Sports Helmets",
    icon: "HardHat",
    blurb: "ISI/E-marked sports helmets fitted to your head for every ride.",
    count: 3,
  },
  {
    slug: "riding-gloves",
    label: "Riding Gloves",
    icon: "Hand",
    blurb: "Grip, comfort and knuckle protection in every season.",
    count: 2,
  },
  {
    slug: "bike-grips",
    label: "Bike Grips",
    icon: "Grip",
    blurb: "Ergonomic grips for comfort, control and all-day riding.",
    count: 2,
  },
  {
    slug: "mobile-holders",
    label: "Mobile Holders",
    icon: "Smartphone",
    blurb: "Secure phone mounts for navigation and calls on the go.",
    count: 2,
  },
  {
    slug: "led-lights",
    label: "LED Lights",
    icon: "Flashlight",
    blurb: "Bright, road-legal lighting for safe night rides.",
    count: 2,
  },
  {
    slug: "custom-decals",
    label: "Custom Decals",
    icon: "Sticker",
    blurb: "Personalised graphics, number boards and racing decals.",
    count: 2,
  },
  {
    slug: "mirrors",
    label: "Mirrors",
    icon: "Disc",
    blurb: "Wide-angle mirrors for safer lane changes and city riding.",
    count: 1,
  },
  {
    slug: "exhaust-accessories",
    label: "Exhaust Accessories",
    icon: "Zap",
    blurb: "Muffler tips, heat shields and exhaust add-ons.",
    count: 1,
  },
  {
    slug: "spare-parts",
    label: "Spare Parts",
    icon: "Settings",
    blurb: "Practical, hard-to-find spares for repairs and upgrades.",
    count: 2,
  },
  {
    slug: "chain-care",
    label: "Chain Care & Cleaning",
    icon: "Droplets",
    blurb: "Cleaners, lubes and kits that keep your chain running smooth.",
    count: 2,
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const homeCategories = [
  {
    slug: "sports-helmets",
    label: "Helmets",
    icon: "HardHat",
    blurb: "ISI/E-marked sports helmets, fitted to your head.",
    href: "/products?category=sports-helmets",
  },
  {
    slug: "riding-gloves",
    label: "Riding Gear",
    icon: "Hand",
    blurb: "Gloves and gear for comfort and protection.",
    href: "/products?category=riding-gloves",
  },
  {
    slug: "bike-grips",
    label: "Grips",
    icon: "Grip",
    blurb: "Ergonomic grips fitted and installed on-site.",
    href: "/products?category=bike-grips",
  },
  {
    slug: "custom-decals",
    label: "Custom Decals",
    icon: "Sticker",
    blurb: "Custom graphics and decals applied to your bike.",
    href: "/products?category=custom-decals",
  },
  {
    slug: "spare-parts",
    label: "Spare Parts",
    icon: "Settings",
    blurb: "Genuine spares for every make and model.",
    href: "/products?category=spare-parts",
  },
  {
    slug: "bike-modifications",
    label: "Bike Modifications",
    icon: "Wrench",
    blurb: "Custom builds and upgrades with on-site installation.",
    href: "/#installation",
  },
];

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  categoryLabel: string;
  price: number;
  mrp: number;
  rating: number | null;
  reviewCount: number | null;
  badge?: "Bestseller" | "New" | "Sale" | "Limited";
  description: string;
  accent: string;
  icon: string;
  featured?: boolean;
  installation?: boolean;
};

export const team = [
  {
    name: "Suresh Kumar",
    role: "Owner & Store Manager",
    bio: "Runs 46 Rossis Biker Spot with a rider-first attitude—helping every customer find the right gear, part or upgrade for their bike.",
    initials: "SK",
  },
  {
    name: "Mohammed Farhan",
    role: "Installation Specialist",
    bio: "Fits helmets, grips, lights, decals and spares on-site. If it bolts on, wires up or sticks to your bike, he's the one doing it right.",
    initials: "MF",
  },
  {
    name: "Priya S",
    role: "Riding Gear Specialist",
    bio: "Knows helmets, gloves and riding gear inside out. She sizes and fits gear so it protects properly—not just looks good.",
    initials: "PS",
  },
];

export const testimonials = [
  {
    name: "Karthik R",
    role: "Daily commuter · Salem",
    quote:
      "Got a full-face helmet fitted and LED bulbs installed in one visit. The team is patient and genuinely knows their stuff.",
  },
  {
    name: "Mohammed Farhan",
    role: "Enthusiast · Suramangalam",
    quote:
      "Custom decals came out cleaner than I imagined. Brought my bike in the morning, left upgraded by afternoon.",
  },
  {
    name: "Priya S",
    role: "Weekend tourer · Salem",
    quote:
      "Found the spare part no other shop could get. They fitted it on-site and even sorted my chain at the same time.",
  },
];

export const benefits = [
  {
    icon: "ShieldCheck",
    title: "Rider safety first",
    description:
      "ISI/E-marked helmets and certified riding gear for every kind of road and rider.",
  },
  {
    icon: "Wrench",
    title: "On-site installation",
    description:
      "Bring your bike in. We fit, install and test everything before you ride out.",
  },
  {
    icon: "Clock",
    title: "Open daily till 9 PM",
    description:
      "Seven days a week, opposite KPN Petrol Bunk on Suramangalam Main Road, Salem.",
  },
  {
    icon: "Settings",
    title: "Genuine spare parts",
    description:
      "Practical, hard-to-find spares for everyday repairs, maintenance and upgrades.",
  },
];

export const faqs = [
  {
    question: "How do I choose the right helmet size?",
    answer:
      "Bring your bike and drop by the store — we measure your head and fit the helmet properly before you buy. Every sports helmet is ISI/E-marked and comes with a secure quick-release strap.",
  },
  {
    question: "Do you install products on-site?",
    answer:
      "Yes. Grips, mobile holders, LED lights, mirrors, decals, exhaust accessories and most spare parts are installed while you wait. Bring your bike and leave upgraded.",
  },
  {
    question: "Can I get custom decals for my bike?",
    answer:
      "Absolutely. Pick a design and colour scheme, and we'll cut, print and apply custom racing stripes, number boards and graphics — right at our store in Salem.",
  },
  {
    question: "Do you stock spare parts for my bike?",
    answer:
      "We keep a practical range of spares for popular commuter and sports models. If we don't have a part in stock, tell us what you need and we'll source it for you.",
  },
  {
    question: "What are your store hours?",
    answer:
      "We're open daily until 9:00 PM, opposite KPN Petrol Bunk, Buddhar Street / Suramangalam Main Road, Thiruvakavundanur, Salem – 636005.",
  },
  {
    question: "Can I request a bike modification?",
    answer:
      "Yes. Whether it's an accessory upgrade, a custom build or a comfort tweak, talk to us in store or send a message and we'll plan the work with you.",
  },
];

export const storeAddress = {
  line1: "46 Rossis Biker Spot",
  line2: "Opposite KPN Petrol Bunk, Buddhar Street",
  line3: "Suramangalam Main Road, Thiruvakavundanur",
  line4: "Salem – 636005",
};

export const mapsQuery =
  "46 Rossis Biker Spot, Opposite KPN Petrol Bunk, Thiruvakavundanur, Salem 636005";

export const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  mapsQuery
)}`;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  mapsQuery
)}&output=embed`;
