import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { COLLECTIONS } from "../src/lib/collections";

config({ path: ".env.local" });

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
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!uri || !dbName) {
    console.error("MONGODB_URI and MONGODB_DB_NAME must be set in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    await db.collection(COLLECTIONS.paymentEvents).deleteMany({});
    await db.collection(COLLECTIONS.orderItems).deleteMany({});
    await db.collection(COLLECTIONS.orders).deleteMany({});
    await db.collection(COLLECTIONS.products).deleteMany({});

    await db.collection(COLLECTIONS.categories).deleteMany({});
    const now = new Date();
    for (const category of storefrontCategories) {
      await db.collection(COLLECTIONS.categories).insertOne({
        ...category,
        createdAt: now,
        updatedAt: now,
      });
    }

    const categories = await db
      .collection(COLLECTIONS.categories)
      .find({}, { projection: { name: 1, slug: 1, _id: 0 } })
      .sort({ name: 1 })
      .toArray();

    console.log(
      `Deleted all products. Categories now powering the storefront (${categories.length}):`
    );
    for (const category of categories) {
      console.log(`  - ${category.name} (${category.slug})`);
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Align failed:", error);
  process.exit(1);
});