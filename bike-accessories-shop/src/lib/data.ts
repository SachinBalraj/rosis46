export const categories = [
  {
    slug: "helmets",
    label: "Helmets",
    icon: "HardHat",
    blurb: "Aero shells with impact-absorbing liners for every ride.",
    count: 3,
  },
  {
    slug: "gloves",
    label: "Gloves",
    icon: "Hand",
    blurb: "Grip, comfort and knuckle protection in all weather.",
    count: 2,
  },
  {
    slug: "lights",
    label: "Lights",
    icon: "Flashlight",
    blurb: "USB-chargeable beams that keep you seen after dark.",
    count: 2,
  },
  {
    slug: "locks",
    label: "Locks",
    icon: "Lock",
    blurb: "Hardened steel security for city stops and overnights.",
    count: 2,
  },
  {
    slug: "bags",
    label: "Bags",
    icon: "Backpack",
    blurb: "Waterproof packs and panniers built for the daily commute.",
    count: 3,
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  categoryLabel: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  badge?: "Bestseller" | "New" | "Sale" | "Limited";
  description: string;
  accent: string;
  icon: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "aero-vanguard-helmet",
    name: "Aero Vanguard Helmet",
    category: "helmets",
    categoryLabel: "Helmets",
    price: 3499,
    mrp: 4299,
    rating: 4.8,
    reviewCount: 214,
    badge: "Bestseller",
    description:
      "In-mold polycarbonate shell with 18 vents, magnetic Fidlock strap and a dial-fit retention system.",
    accent: "from-lime-400/40 via-lime-300/10 to-transparent",
    icon: "HardHat",
    featured: true,
  },
  {
    id: "carbon-aero-helmet",
    name: "Carbon Aero Helmet",
    category: "helmets",
    categoryLabel: "Helmets",
    price: 7499,
    mrp: 8999,
    rating: 4.9,
    reviewCount: 96,
    badge: "New",
    description:
      "Full-carbon road helmet at 220g with an integrated MIPS liner and wide-field visor mount.",
    accent: "from-emerald-400/40 via-emerald-300/10 to-transparent",
    icon: "HardHat",
    featured: true,
  },
  {
    id: "city-commuter-helmet",
    name: "City Commuter Helmet",
    category: "helmets",
    categoryLabel: "Helmets",
    price: 1999,
    mrp: 2499,
    rating: 4.6,
    reviewCount: 158,
    description:
      "Urban lid with a flip-up magnetic visor, built-in tail light and a sweat-guard brow pad.",
    accent: "from-sky-400/40 via-sky-300/10 to-transparent",
    icon: "HardHat",
  },
  {
    id: "gripline-padded-gloves",
    name: "Gripline Padded Gloves",
    category: "gloves",
    categoryLabel: "Gloves",
    price: 1299,
    mrp: 1699,
    rating: 4.7,
    reviewCount: 187,
    badge: "Bestseller",
    description:
      "Ventilated half-finger gloves with silicone grip print and gel padding on the heel of the palm.",
    accent: "from-amber-400/40 via-amber-300/10 to-transparent",
    icon: "Hand",
    featured: true,
  },
  {
    id: "winter-thermal-gloves",
    name: "Winter Thermal Gloves",
    category: "gloves",
    categoryLabel: "Gloves",
    price: 1899,
    mrp: 2399,
    rating: 4.5,
    reviewCount: 64,
    badge: "Sale",
    description:
      "Windproof, water-resistant full-finger gloves with fleece lining and touchscreen fingertips.",
    accent: "from-cyan-400/40 via-cyan-300/10 to-transparent",
    icon: "Hand",
  },
  {
    id: "lumos-1200-headlight",
    name: "Lumos 1200 Headlight",
    category: "lights",
    categoryLabel: "Lights",
    price: 2499,
    mrp: 2999,
    rating: 4.8,
    reviewCount: 143,
    badge: "New",
    description:
      "1200-lumen USB-C headlight with a daytime-visible flash mode and 4-hour high-beam runtime.",
    accent: "from-yellow-300/50 via-yellow-200/15 to-transparent",
    icon: "Flashlight",
    featured: true,
  },
  {
    id: "beampod-rear-taillight",
    name: "BeamPOD Rear Taillight",
    category: "lights",
    categoryLabel: "Lights",
    price: 999,
    mrp: 1299,
    rating: 4.6,
    reviewCount: 121,
    description:
      "Crank-mounted auto-brightness taillight with a 30-hour battery and an auto-on motion sensor.",
    accent: "from-rose-400/40 via-rose-300/10 to-transparent",
    icon: "Zap",
  },
  {
    id: "steelcore-u-lock",
    name: "Steelcore U-Lock",
    category: "locks",
    categoryLabel: "Locks",
    price: 2199,
    mrp: 2699,
    rating: 4.7,
    reviewCount: 98,
    badge: "Bestseller",
    description:
      "16mm hardened-steel shackle with a double-bolt locking mechanism and a silicone anti-scratch sleeve.",
    accent: "from-zinc-300/40 via-zinc-200/10 to-transparent",
    icon: "Lock",
    featured: true,
  },
  {
    id: "foldlock-compact-chain",
    name: "FoldLock Compact Chain",
    category: "locks",
    categoryLabel: "Locks",
    price: 2799,
    mrp: 3399,
    rating: 4.5,
    reviewCount: 77,
    description:
      "Pocket-sized folding lock that expands to 85cm, with a hardened steel core and keyed cylinder.",
    accent: "from-orange-400/40 via-orange-300/10 to-transparent",
    icon: "Lock",
  },
  {
    id: "urban-rolltop-backpack",
    name: "Urban Roll-Top Backpack",
    category: "bags",
    categoryLabel: "Bags",
    price: 3299,
    mrp: 3999,
    rating: 4.9,
    reviewCount: 231,
    badge: "Bestseller",
    description:
      "26L fully waterproof roll-top with a 15\" laptop sleeve, reflective piping and a helmet carry strap.",
    accent: "from-violet-400/40 via-violet-300/10 to-transparent",
    icon: "Backpack",
    featured: true,
  },
  {
    id: "pannier-commuter-25l",
    name: "Commuter Pannier 25L",
    category: "bags",
    categoryLabel: "Bags",
    price: 3899,
    mrp: 4599,
    rating: 4.6,
    reviewCount: 89,
    badge: "New",
    description:
      "Quick-release pannier with a welded waterproof liner, expandable roll-top and a padded laptop dock.",
    accent: "from-teal-400/40 via-teal-300/10 to-transparent",
    icon: "Package",
  },
  {
    id: "saddlebag-toolkit",
    name: "Under-Saddle Tool Kit",
    category: "bags",
    categoryLabel: "Bags",
    price: 1499,
    mrp: 1899,
    rating: 4.4,
    reviewCount: 52,
    badge: "Sale",
    description:
      "Compact wedge pack with tire levers, a multi-tool, a spare tube and a frame-mount CO2 holder.",
    accent: "from-lime-400/40 via-lime-300/10 to-transparent",
    icon: "Wrench",
  },
];

export const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Daily commuter · Bengaluru",
    quote:
      "The Vanguard helmet is feather-light and the vents actually work. I've worn it through two monsoon seasons and it still looks brand new.",
  },
  {
    name: "Nisha Iyer",
    role: "Endurance rider · Pune",
    quote:
      "Ordered the roll-top backpack on a Tuesday, it reached by Thursday. The waterproofing is no joke — my laptop survived a full thunderstorm.",
  },
  {
    name: "Rahul Deshpande",
    role: "Weekend tourer · Goa",
    quote:
      "The Lumos headlight turned my night rides from sketchy to confident. Battery genuinely lasts my whole 3-hour loop on high beam.",
  },
];

export const team = [
  {
    name: "Vikram Singh",
    role: "Founder & Chief Rider",
    bio: "Former national-level track cyclist who spent a decade fitting helmets on other people before launching RideReady.",
    initials: "VS",
  },
  {
    name: "Ananya Rao",
    role: "Head of Product",
    bio: "Ex-product designer at a major mobility brand. She tests every bag against a 40km rain simulation before it ships.",
    initials: "AR",
  },
  {
    name: "Kabir Menon",
    role: "Head of Quality",
    bio: "Mechanical engineer with a background in automotive safety testing. He signs off on every batch of locks and helmets.",
    initials: "KM",
  },
  {
    name: "Meera Krishnan",
    role: "Head of Rider Experience",
    bio: "Runs our support team and community rides. She answers more product questions than anyone in the company.",
    initials: "MK",
  },
];

export const benefits = [
  {
    icon: "Truck",
    title: "Free shipping over ₹999",
    description:
      "Tracked, insured delivery across India in 3–5 business days. Faster in metro cities.",
  },
  {
    icon: "ShieldCheck",
    title: "2-year warranty",
    description:
      "Every helmet, lock and bag carries a no-questions-asked replacement warranty.",
  },
  {
    icon: "Zap",
    title: "Same-day dispatch",
    description:
      "Order before 2 PM and your gear leaves our warehouse the same afternoon.",
  },
  {
    icon: "Wrench",
    title: "Certified fit guidance",
    description:
      "Not sure about sizing? Our rider team gives free one-on-one fit advice before you buy.",
  },
];

export const faqs = [
  {
    question: "How do I choose the right helmet size?",
    answer:
      "Measure the circumference of your head just above your eyebrows. Compare it to our sizing chart — S (52–55cm), M (55–58cm), L (58–61cm), XL (61–64cm). When in doubt, order a size up; our retention dials tighten down securely.",
  },
  {
    question: "Are your locks really sold secure?",
    answer:
      "Yes. Every lock we sell is independently tested and rated by an accredited security lab. Ratings are printed on each listing so you can match the lock to your bike value and parking situation.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You have 30 days to return any unused product in its original packaging for a full refund. Helmets and other safety gear must be returned unworn. We issue refunds within 5 business days of receiving the return.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders dispatched from our Bengaluru warehouse typically arrive in 3–5 business days. Remote areas may take a day or two longer, and you'll receive a tracking link the moment your order ships.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently ship across India. International shipping is on our roadmap — join the newsletter and we'll let you know the moment it launches.",
  },
  {
    question: "Can I get help fitting my gear?",
    answer:
      "Absolutely. Book a free video call with our rider team using the contact form, or message us on WhatsApp. We'll walk you through sizing, helmet dial adjustments and bag mounting.",
  },
];
