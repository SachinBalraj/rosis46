import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL or DIRECT_URL. Add it to .env before seeding."
  );
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedCategory = {
  name: string;
  slug: string;
  image: string | null;
};

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  priceInPaise: number;
  salePriceInPaise: number | null;
  stock: number;
  categorySlug: string;
  featured?: boolean;
};

const categories: SeedCategory[] = [
  { name: "Helmets", slug: "helmets", image: "/images/categories/helmets.svg" },
  { name: "Lights", slug: "lights", image: "/images/categories/lights.svg" },
  { name: "Locks", slug: "locks", image: "/images/categories/locks.svg" },
  { name: "Pumps", slug: "pumps", image: "/images/categories/pumps.svg" },
  { name: "Gloves", slug: "gloves", image: "/images/categories/gloves.svg" },
  {
    name: "Bottle Cages",
    slug: "bottle-cages",
    image: "/images/categories/bottle-cages.svg",
  },
  {
    name: "Saddlebags",
    slug: "saddlebags",
    image: "/images/categories/saddlebags.svg",
  },
  {
    name: "Repair Kits",
    slug: "repair-kits",
    image: "/images/categories/repair-kits.svg",
  },
];

const products: SeedProduct[] = [
  {
    name: "Aero Road Helmet",
    slug: "aero-road-helmet",
    description:
      "Wind-tunnel tested in-mold road helmet with 18 vents, a magnetic Fidlock strap and a dial-fit retention system. Weighs just 240g.",
    priceInPaise: 349900,
    salePriceInPaise: 299900,
    stock: 25,
    categorySlug: "helmets",
    featured: true,
  },
  {
    name: "Urban Commuter Helmet",
    slug: "urban-commuter-helmet",
    description:
      "Everyday city lid with a flip-up magnetic visor, built-in rear taillight, sweat-guard brow pad and extended shell coverage.",
    priceInPaise: 219900,
    salePriceInPaise: null,
    stock: 30,
    categorySlug: "helmets",
  },
  {
    name: "1200 Lumen Headlight",
    slug: "1200-lumen-headlight",
    description:
      "USB-C rechargeable 1200-lumen headlight with a daytime-visible flash mode, beam cutoff and a 4-hour high-beam runtime.",
    priceInPaise: 249900,
    salePriceInPaise: 219900,
    stock: 40,
    categorySlug: "lights",
    featured: true,
  },
  {
    name: "USB Rechargeable Taillight",
    slug: "usb-rechargeable-taillight",
    description:
      "Auto-brightness taillight with a 30-hour battery, three flash patterns and an auto-on motion sensor that wakes the light when you ride.",
    priceInPaise: 99900,
    salePriceInPaise: null,
    stock: 55,
    categorySlug: "lights",
  },
  {
    name: "Hardened Steel U-Lock",
    slug: "hardened-steel-u-lock",
    description:
      "16mm hardened-steel shackle with a double-bolt locking mechanism, keyed cylinder and a silicone anti-scratch sleeve.",
    priceInPaise: 219900,
    salePriceInPaise: null,
    stock: 35,
    categorySlug: "locks",
    featured: true,
  },
  {
    name: "Folding Chain Lock",
    slug: "folding-chain-lock",
    description:
      "Pocket-sized folding lock that expands to 85cm with a hardened steel core, keyed cylinder and a weatherproof sleeve.",
    priceInPaise: 179900,
    salePriceInPaise: null,
    stock: 20,
    categorySlug: "locks",
  },
  {
    name: "Pro Floor Pump with Gauge",
    slug: "pro-floor-pump-with-gauge",
    description:
      "Aluminium barrel floor pump with a large dual PSI/BAR gauge, reversible Presta/Schrader head and an extra-long flex hose.",
    priceInPaise: 159900,
    salePriceInPaise: null,
    stock: 18,
    categorySlug: "pumps",
    featured: true,
  },
  {
    name: "Gel Padded Cycling Gloves",
    slug: "gel-padded-cycling-gloves",
    description:
      "Ventilated half-finger gloves with silicone grip print, gel padding on the heel of the palm and a pull-on tab for easy removal.",
    priceInPaise: 129900,
    salePriceInPaise: null,
    stock: 50,
    categorySlug: "gloves",
  },
  {
    name: "Aluminum Bottle Cage",
    slug: "aluminum-bottle-cage",
    description:
      "Lightweight aircraft-grade aluminium cage with a secure grip that still releases your bottle one-handed at speed.",
    priceInPaise: 39900,
    salePriceInPaise: null,
    stock: 100,
    categorySlug: "bottle-cages",
  },
  {
    name: "Waterproof Roll-Top Saddlebag",
    slug: "waterproof-roll-top-saddlebag",
    description:
      "Fully welded waterproof saddlebag with a roll-top closure, reflective piping and a tool pouch. Holds 4.5 litres.",
    priceInPaise: 329900,
    salePriceInPaise: 289900,
    stock: 22,
    categorySlug: "saddlebags",
    featured: true,
  },
  {
    name: "Commuter Tool Saddlebag",
    slug: "commuter-tool-saddlebag",
    description:
      "Compact under-saddle wedge with a quick-release buckle, waterproof liner and internal pockets for keys, cards and tools.",
    priceInPaise: 149900,
    salePriceInPaise: null,
    stock: 28,
    categorySlug: "saddlebags",
  },
  {
    name: "Under-Saddle Repair Kit",
    slug: "under-saddle-repair-kit",
    description:
      "Everything for a roadside fix: tire levers, puncture patches, a spare tube, a chain tool and a compact multi-tool in one wedge.",
    priceInPaise: 149900,
    salePriceInPaise: 119900,
    stock: 33,
    categorySlug: "repair-kits",
  },
];

async function main() {
  console.log("Seeding database…");

  await prisma.paymentEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const createdCategories = await prisma.category.createMany({
    data: categories,
  });
  console.log(`Created ${createdCategories.count} categories`);

  const categoryBySlug = new Map(
    (
      await prisma.category.findMany({
        select: { id: true, slug: true },
      })
    ).map((category) => [category.slug, category.id])
  );

  const productRows = products.map((product) => ({
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceInPaise: product.priceInPaise,
    salePriceInPaise: product.salePriceInPaise,
    stock: product.stock,
    featured: product.featured ?? false,
    active: true,
    categoryId: categoryBySlug.get(product.categorySlug)!,
  }));

  const createdProducts = await prisma.product.createMany({
    data: productRows,
  });
  console.log(`Created ${createdProducts.count} products`);
  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
