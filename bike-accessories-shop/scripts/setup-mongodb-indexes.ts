import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { COLLECTIONS } from "../src/lib/collections";

config({ path: ".env.local" });

type IndexSpec = {
  keys: Record<string, 1 | -1>;
  name: string;
  unique?: boolean;
  partial?: Record<string, unknown>;
};

const INDEXES: Record<keyof typeof COLLECTIONS, IndexSpec[]> = {
  users: [{ keys: { email: 1 }, name: "email_unique", unique: true }],
  categories: [{ keys: { slug: 1 }, name: "slug_unique", unique: true }],
  products: [{ keys: { slug: 1 }, name: "slug_unique", unique: true }],
  orders: [
    {
      keys: { razorpayOrderId: 1 },
      name: "razorpayOrderId_unique",
      unique: true,
      partial: { razorpayOrderId: { $type: "string" } },
    },
  ],
  orderItems: [
    {
      keys: { orderId: 1, productId: 1 },
      name: "orderId_productId_unique",
      unique: true,
    },
  ],
  paymentEvents: [
    {
      keys: { providerEventId: 1 },
      name: "providerEventId_unique",
      unique: true,
    },
  ],
  contactMessages: [
    {
      keys: { status: 1, createdAt: -1 },
      name: "status_createdAt",
      unique: false,
    },
  ],
};

function sameKeys(a: Record<string, 1 | -1>, b: Record<string, 1 | -1>): boolean {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

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

    for (const [key, specs] of Object.entries(INDEXES)) {
      const collectionName = COLLECTIONS[key as keyof typeof COLLECTIONS];
      const existing = await db
        .collection(collectionName)
        .listIndexes()
        .toArray();

      for (const spec of specs) {
        const exists = existing.some((index) =>
          sameKeys(
            index.key as Record<string, 1 | -1>,
            spec.keys as Record<string, 1 | -1>
          )
        );

        if (exists) {
          console.log(
            `[skip] ${collectionName}.${spec.name} (equivalent index already exists)`
          );
          continue;
        }

        await db.collection(collectionName).createIndex(spec.keys, {
          name: spec.name,
          unique: spec.unique ?? false,
          ...(spec.partial ? { partialFilterExpression: spec.partial } : {}),
        });
        console.log(
          `[created] ${collectionName}.${spec.name} on {${Object.keys(spec.keys)
            .map((key) => `${key}:${spec.keys[key]}`)
            .join(", ")}} ${spec.unique ? "UNIQUE" : ""}`
        );
      }
    }

    console.log("Index setup complete.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Index setup failed:", error);
  process.exit(1);
});