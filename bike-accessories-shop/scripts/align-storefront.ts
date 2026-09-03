import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const storefrontCategories = [
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
  await prisma.paymentEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.category.deleteMany();
  for (const category of storefrontCategories) {
    await prisma.category.create({ data: category });
  }

  const categories = await prisma.category.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });
  console.log(`Deleted all products. Categories now powering the storefront (${categories.length}):`);
  for (const category of categories) {
    console.log(`  - ${category.name} (${category.slug})`);
  }
}

main()
  .catch((error) => {
    console.error("Align failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
