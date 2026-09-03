import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

type SeedCategory = {
  name: string;
  slug: string;
  image: string | null;
};

const categories: SeedCategory[] = [
  { name: "Sports Helmets", slug: "sports-helmets", image: null },
  { name: "Riding Gloves", slug: "riding-gloves", image: null },
  { name: "Bike Grips", slug: "bike-grips", image: null },
  { name: "Mobile Holders", slug: "mobile-holders", image: null },
  { name: "LED Lights", slug: "led-lights", image: null },
  { name: "Custom Decals", slug: "custom-decals", image: null },
  { name: "Mirrors", slug: "mirrors", image: null },
  { name: "Exhaust Accessories", slug: "exhaust-accessories", image: null },
  { name: "Spare Parts", slug: "spare-parts", image: null },
  { name: "Chain Care & Cleaning", slug: "chain-care", image: null },
];

async function main() {
  console.log("Seeding database…");

  await prisma.paymentEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }
  console.log(`Created ${categories.length} categories`);

  console.log(
    "Products are created through the admin panel only — the storefront catalogue starts empty."
  );
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
